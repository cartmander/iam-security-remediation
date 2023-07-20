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

const generateExplicitActionsStatement = (serviceName: string): Statement => {
  return {
      Effect: "Allow",
      Action: [
        `${serviceName}:Create*`,
        `${serviceName}:Read*`,
        `${serviceName}:Update*`,
        `${serviceName}:Delete*`,
        `${serviceName}:Get*`,
        `${serviceName}:List*`,
        `${serviceName}:Describe*`,
        `${serviceName}:Untag*`,
        `${serviceName}:Tag*`
      ],
      Resource: "*"
  }
}

const processIamCsv = async (error: any, csvRecords: any) => {

  let implicitActionsDictionary: { [serviceName: string]: string } = {}

  for (let record in csvRecords) {
    const { Service } = csvRecords[record];
    const service = Service as string;
    let servicePolicyDocument;

    if (service.includes(":")) {
      const serviceNamespace = service.split(":")[0];
      if(implicitActionsDictionary.hasOwnProperty(serviceNamespace)) {
        implicitActionsDictionary[serviceNamespace] += service;
      }
      else {
        implicitActionsDictionary[serviceNamespace] = service;
      }
    }
    
    else {
      servicePolicyDocument = generateEmptyBasePolicy();
      const explicitActionsStatement = generateExplicitActionsStatement(service);
      
      servicePolicyDocument.Statement.push(explicitActionsStatement);
    }

    console.log(JSON.stringify(servicePolicyDocument));
    console.log(JSON.stringify(implicitActionsDictionary));
  }
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