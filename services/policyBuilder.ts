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

const processIamCsv = async (error: any, csvRecords: any) => {

  let actionsDictionary: { [serviceName: string]: string[] } = {}

  for (let record in csvRecords) {
    const { Service } = csvRecords[record];
    const service = Service as string;
    const serviceNamespace = service.split(":")[0];

    if (service.includes(":")) {

      if (actionsDictionary.hasOwnProperty(serviceNamespace)) {
        actionsDictionary[serviceNamespace].push(service);
      }
      
      else {
        actionsDictionary[serviceNamespace] = [service];
      }
    }
    
    else {
      const explicitActionsStatement = generateExplicitActions(service);
      
      if (actionsDictionary.hasOwnProperty(serviceNamespace)) {
        actionsDictionary[serviceNamespace] =  actionsDictionary[serviceNamespace].concat(explicitActionsStatement);
      }
      
      else {
        actionsDictionary[serviceNamespace] = explicitActionsStatement;
      }
    }
  }

  console.log(JSON.stringify(actionsDictionary));
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