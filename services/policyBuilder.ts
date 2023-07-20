import { BasePolicy, Statement } from "interfaces/Policy";
import { parse } from "csv-parse";
import path from "path";
import fs from "fs";

const generateBasePolicy = (): BasePolicy =>  {
  return {
      Version: "2012-10-17",
      Statement: []
  }
}

const generateStatement = (): Statement => {
  return {
      Effect: "Allow",
      Action: [],
      Resource: "*"
  }
}

const generateExplicitActionsStatement = (serviceName: string) => {
  const actions: Statement = {
      "Effect": "Allow",
      "Action": [
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
      "Resource": "*"
  }

  return actions;
}

const processIamCsv = async (error: any, csvRecords: any) => {
  for (let record in csvRecords) {
    const { Service } = csvRecords[record];
    const service = Service as string;
    let servicePolicyDocument = generateBasePolicy();

    if(!service.includes(":")) {
      const explicitActionsStatement = generateExplicitActionsStatement(service);
      servicePolicyDocument.Statement.push(explicitActionsStatement);
    }
    
    else {
      //customStatements.Action.push(serviceNamespaceOrAction);
    }

    console.log(JSON.stringify(servicePolicyDocument));
  }
  //console.log(JSON.stringify(policyDocument));
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