import { GetServiceLastAccessedDetailsCommand, GenerateServiceLastAccessedDetailsCommand, GenerateServiceLastAccessedDetailsCommandOutput, ServiceLastAccessed, TrackedActionLastAccessed } from "@aws-sdk/client-iam";
import { GenerateServiceLastAccessedDetailsCommandInput } from "interfaces/AccessAdvisor.js";
import { client } from "../client.js";
import path from "path";
import fs from "fs";

const makeIteration = (seconds: 10): void => {
    console.clear();
    if (seconds > 0) {
        console.log(seconds);
        setTimeout(makeIteration, 1000); // 1 second waiting
    }
    seconds -= 1;
};

const generateServiceLastAccessedDetails = async ({ arn, granularity }: GenerateServiceLastAccessedDetailsCommandInput): Promise<GenerateServiceLastAccessedDetailsCommandOutput> => { 
  const serviceDetailsCommandInput = {
    Arn: arn,
    Granularity: granularity,
  }; 

  const command = new GenerateServiceLastAccessedDetailsCommand(serviceDetailsCommandInput);
  const response = await client.send(command);

  return response;
}

const listActions = (listOfActions: string[], service: string, actions: TrackedActionLastAccessed[]): string[] => {
  actions.forEach((action) => {
    if (action.LastAccessedEntity != null && action.LastAccessedRegion != null && action.LastAccessedTime != null) {
      listOfActions.push(`${service}:${ action.ActionName }`);
    }
  });

  return listOfActions;
}

export const getServiceLastAccessedDetails = async ({ arn, granularity }: GenerateServiceLastAccessedDetailsCommandInput) => {
  const serviceDetailsResponse = generateServiceLastAccessedDetails({
    arn: arn,
    granularity: granularity 
  });

  const serviceDetailsInput = {
    JobId: (await serviceDetailsResponse).JobId
  }

  const command = new GetServiceLastAccessedDetailsCommand(serviceDetailsInput);
  let response = await client.send(command);

  while (response.JobStatus == "IN_PROGRESS") {
    setTimeout(makeIteration, 1000);
    response = await client.send(command);
  }

  return response;
}

export const listServices = (services: ServiceLastAccessed[]): string[] => {
  let listOfServiceNamespacesAndActions: string[] = [];
  let listofServiceNameSpaces: string[] = [];
  let listOfActions: string[] = [];
  let actions: string[] = [];

  services.forEach((service) => {
    if (service.TrackedActionsLastAccessed == null && service.LastAuthenticated != null && service.TotalAuthenticatedEntities != 0) {
      listofServiceNameSpaces.push(service.ServiceNamespace as string);
    }

    if (service.TrackedActionsLastAccessed != null && service.TrackedActionsLastAccessed.length > 0) {
      listOfServiceNamespacesAndActions = listOfActions.concat(listActions(actions, service.ServiceNamespace as string, service.TrackedActionsLastAccessed));
    }
  });

  listOfServiceNamespacesAndActions = listOfServiceNamespacesAndActions.concat(listofServiceNameSpaces);

  return listOfServiceNamespacesAndActions as string[];
}

export const buildIamCsv = (roleName: string, serviceNamespacesAndActions: string[]) => {
  const roleDirectory = `results/${roleName}`;
  const roleCsv = `${roleDirectory}/${roleName}.csv`;

  if (!fs.existsSync(roleDirectory)) {
    fs.mkdirSync(roleDirectory,  { recursive: true });
  }

  fs.writeFileSync(roleCsv, "RoleName,Service\n", {
    flag: 'w'
  });

  const csvFilePath = path.resolve(roleCsv);

  serviceNamespacesAndActions.forEach((serviceNamespaceAndAction) => {
    fs.appendFileSync(csvFilePath, `${roleName},${serviceNamespaceAndAction}\n`);
  });
}