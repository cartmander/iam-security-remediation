import { GetServiceLastAccessedDetailsCommand, GenerateServiceLastAccessedDetailsCommand, GenerateServiceLastAccessedDetailsCommandOutput, ServiceLastAccessed, TrackedActionLastAccessed, GenerateServiceLastAccessedDetailsCommandInput } from "@aws-sdk/client-iam";
import { client } from "../client.js";
import path from "path";
import fs from "fs";

const generateServiceLastAccessedDetails = async ({ Arn, Granularity }: GenerateServiceLastAccessedDetailsCommandInput): Promise<GenerateServiceLastAccessedDetailsCommandOutput> => { 
  const serviceDetailsCommandInput = {
    Arn: Arn,
    Granularity: Granularity,
  }; 

  const command = new GenerateServiceLastAccessedDetailsCommand(serviceDetailsCommandInput);
  const response = await client.send(command);

  return response;
}

const listActions = (listOfActions: string[], service: string, actions: TrackedActionLastAccessed[]): string[] => {
  for (let i = 0; i < actions.length; i ++)
  {
    const action = actions[i];

    if (action.LastAccessedEntity != null && action.LastAccessedRegion != null && action.LastAccessedTime != null) {
      listOfActions.push(`${service}:${ action.ActionName }`);
    }
  }

  return listOfActions;
}

export const getServiceLastAccessedDetails = async ({ Arn, Granularity }: GenerateServiceLastAccessedDetailsCommandInput) => {
  const serviceDetailsResponse = generateServiceLastAccessedDetails({
    Arn: Arn,
    Granularity: Granularity 
  });

  const serviceDetailsInput = {
    JobId: (await serviceDetailsResponse).JobId
  }

  const command = new GetServiceLastAccessedDetailsCommand(serviceDetailsInput);
  let response = await client.send(command);
  
  while (response.JobStatus == "IN_PROGRESS")
  {
    response = await client.send(command);
  }

  return response;
}

export const listServices = (services: ServiceLastAccessed[]): string[] => {
  let listOfServiceNamespacesAndActions: string[] = [];
  let listofServiceNameSpaces: string[] = [];
  let listOfActions: string[] = [];
  let actions: string[] = [];

  for (let i = 0; i < services.length; i ++)
  {
    const service = services[i];

    if (service.TrackedActionsLastAccessed == null && service.LastAuthenticated != null && service.TotalAuthenticatedEntities != 0) {
      listofServiceNameSpaces.push(service.ServiceNamespace as string);
    }

    if (service.TrackedActionsLastAccessed != null && service.TrackedActionsLastAccessed.length > 0) {
      listOfServiceNamespacesAndActions = listOfActions.concat(listActions(actions, service.ServiceNamespace as string, service.TrackedActionsLastAccessed));
    }
  }

  listOfServiceNamespacesAndActions = listOfServiceNamespacesAndActions.concat(listofServiceNameSpaces);

  return listOfServiceNamespacesAndActions as string[];
}

export const populateIamCsv = (roleName: string, serviceNamespacesAndActions: string[]) => {
  const csvFilePath = path.resolve('csvs/iam-service-namespaces-and-actions.csv')

  for (let i = 0; i < serviceNamespacesAndActions.length; i ++) {
    fs.appendFileSync(csvFilePath, `${roleName},${serviceNamespacesAndActions[i]}\r\n`);
  }
}