import { GetServiceLastAccessedDetailsCommand, GenerateServiceLastAccessedDetailsCommand, GenerateServiceLastAccessedDetailsCommandOutput } from "@aws-sdk/client-iam";
import { ServiceLastAccessedDetails } from "../interfaces/ServiceLastAccessed.js";
import { client } from "./IAMClient.js";

const generateServiceLastAccessedDetails = async ({ arn, granularity }: ServiceLastAccessedDetails): Promise<GenerateServiceLastAccessedDetailsCommandOutput> =>
{
  const serviceDetailsCommandInput = {
    Arn: arn,
    Granularity: granularity,
  }; 

  const command = new GenerateServiceLastAccessedDetailsCommand(serviceDetailsCommandInput);
  const response = await client.send(command);

  return response;
}

export const getServiceLastAccessedDetails = async ({ arn, granularity }:  ServiceLastAccessedDetails) =>
{
  const serviceDetailsResponse = generateServiceLastAccessedDetails({
    arn: arn,
    granularity: granularity 
  });

  const serviceDetailsInput = {
    JobId: (await serviceDetailsResponse).JobId
  }

  console.log(serviceDetailsInput.JobId);

  const command = new GetServiceLastAccessedDetailsCommand(serviceDetailsInput);
  let response = await client.send(command);
  
  while (response.JobStatus == "IN_PROGRESS")
  {
    response = await client.send(command);
  }
  
  return response;
}