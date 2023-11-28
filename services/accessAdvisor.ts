import { GetServiceLastAccessedDetailsCommand, GenerateServiceLastAccessedDetailsCommand, GenerateServiceLastAccessedDetailsCommandOutput, ServiceLastAccessed, TrackedActionLastAccessed } from "@aws-sdk/client-iam";
import { GenerateServiceLastAccessedDetailsCommandInput } from "interfaces/AccessAdvisor.js";
import { client } from "../client.js";
import path from "path";
import fs from "fs";

// Stage
// No ticket kind of change
// DS-1111
// DS-1111

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

const waitGetServiceLastAccessedDetails = async (jobId: string) => {
  while (true) {
    const command = new GetServiceLastAccessedDetailsCommand({ JobId: jobId });

    const response = await client.send(command);
    const jobStatus = response.JobStatus;

    if (jobStatus === "COMPLETED") {
      console.log(`Job Id ${jobId} has completed.`);
      return response;
    }

    else if (jobStatus === "IN_PROGRESS") {
      console.log(`Job ${jobId} is still in progress. Waiting...`);
    }

    else {
      console.log(`Job ${jobId} has encountered an error.`);
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

export const getServiceLastAccessedDetails = async ({ arn, granularity }: GenerateServiceLastAccessedDetailsCommandInput, roleName: string) => {
  let jobId;
  
  console.log(`Generating job to get last accessed services details for role: ${roleName}.`);
  
  try {
    const serviceDetailsResponse = generateServiceLastAccessedDetails({
      arn: arn,
      granularity: granularity 
    });
  
    const serviceDetailsInput = {
      JobId: (await serviceDetailsResponse).JobId
    }

    jobId = serviceDetailsInput.JobId as string;
  }

  catch (error: any) {
    console.log(`Error generating a job for role: ${roleName}: `, error.message);
    return;
  }

  console.log(`Generated job id: ${jobId} for role: ${roleName}`);
  const response = waitGetServiceLastAccessedDetails(jobId);
  return response;
}

export const listServices = (services: ServiceLastAccessed[], roleName: string): string[] => {
  let listOfServiceNamespacesAndActions: string[] = [];
  let listofServiceNameSpaces: string[] = [];
  let listOfActions: string[] = [];
  let actions: string[] = [];

  try {
    services.forEach((service) => {
      if (service.TrackedActionsLastAccessed == null && service.LastAuthenticated != null && service.TotalAuthenticatedEntities != 0) {
        listofServiceNameSpaces.push(service.ServiceNamespace as string);
      }
  
      if (service.TrackedActionsLastAccessed != null && service.TrackedActionsLastAccessed.length > 0) {
        listOfServiceNamespacesAndActions = listOfActions.concat(listActions(actions, service.ServiceNamespace as string, service.TrackedActionsLastAccessed));
      }
    });
  
    listOfServiceNamespacesAndActions = listOfServiceNamespacesAndActions.concat(listofServiceNameSpaces);
  }

  catch (error: any) {
    console.log(`Error listing IAM services for role: ${roleName}: `, error.message);
  }

  return listOfServiceNamespacesAndActions as string[];
}

export const buildIamCsv = (roleName: string, serviceNamespacesAndActions: string[]) => {
  const roleDirectory = `results/${roleName}`;
  const roleCsv = `${roleDirectory}/${roleName}.csv`;
  const csvFilePath = path.resolve(roleCsv);

  try {
    if (!fs.existsSync(roleDirectory)) {
      fs.mkdirSync(roleDirectory,  { recursive: true });
    }
  
    fs.writeFileSync(roleCsv, "RoleName,Service\n", {
      flag: 'w'
    });

    serviceNamespacesAndActions.forEach((serviceNamespaceAndAction) => {
      fs.appendFileSync(csvFilePath, `${roleName},${serviceNamespaceAndAction}\n`);
    });
  }

  catch (error: any) {
    console.log(`Error building IAM csv for role: ${roleName}: `, error.message);
    return;
  }
}