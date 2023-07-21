import { BasePolicy, Statement } from "interfaces/Policy";
import { parse } from "csv-parse";
import path from "path";
import fs from "fs";

const generateEmptyBasePolicy = (): BasePolicy =>  {
  return {
      Version: "2012-10-17",
      Statement: []
  }
}

const generateEmptyStatement = (): Statement => {
  return {
      Effect: "Allow",
      Action: [],
      Resource: "*"
  }
}

const generateExplicitActions = (serviceName: string): string[] => {
  return [
    `${serviceName}:Create*`,
    `${serviceName}:Read*`,
    `${serviceName}:Update*`,
    `${serviceName}:Delete*`,
    `${serviceName}:Get*`,
    `${serviceName}:List*`,
    `${serviceName}:Describe*`,
    `${serviceName}:Untag*`,
    `${serviceName}:Tag*`
  ]
}

const populateServiceDictionary = (serviceDictionary: { [serviceName: string]: string[] }, serviceNamespace: string, serviceOrAction: string) => {
  if (serviceDictionary.hasOwnProperty(serviceNamespace)) {
    serviceDictionary[serviceNamespace].push(serviceOrAction);
  }

  else {
    serviceDictionary[serviceNamespace] = [serviceOrAction];
  }
}

const processIamCsv = async (error: any, csvRecords: any) => {
  let serviceDictionary: { [serviceName: string]: string[] } = {}

  for (let record in csvRecords) {
    const { Service } = csvRecords[record];
    const service = Service as string;
    
    if (service.includes(":")) {
      const serviceNamespace = service.split(":")[0];
      populateServiceDictionary(serviceDictionary, serviceNamespace, service);
    }
    
    else {
      const actions = generateExplicitActions(service);

      actions.forEach((action) => {
        populateServiceDictionary(serviceDictionary, service, action);
      });
    }
  }
  
  console.log(JSON.stringify(serviceDictionary));
}

export const processPolicyBuilder = async (csvPath: string) => {
  const headers = ["RoleName", "Service"];
  const csvFilePath = path.resolve(csvPath);
  const csvContent = fs.readFileSync(csvFilePath);

  const csvOptions = {
    delimiter: ",",
    columns: headers,
    from_line: 2
  };

  await parse(csvContent, csvOptions, processIamCsv);
}