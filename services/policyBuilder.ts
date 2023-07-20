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

const buildExplicitActions = (serviceName: string) => {
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

const buildExplicitActionsStatement = (basePolicy: BasePolicy, serviceNamespace: string) => {
  const explicitActionStatement = buildExplicitActions(serviceNamespace);
  basePolicy.Statement.push(explicitActionStatement);

  return basePolicy;
}

const processIAMCsv = async (error: any, csvRecords: any) => {
  for (let record in csvRecords) {
    const { ServiceNamespacesAndActions } = csvRecords[record];
    const serviceNamespaceOrAction = ServiceNamespacesAndActions as string;

    let servicePolicyDocument = generateBasePolicy();
    let statement = generateStatement();

    if(!serviceNamespaceOrAction.includes(":")) {
      servicePolicyDocument = buildExplicitActionsStatement(servicePolicyDocument, serviceNamespaceOrAction);
    }
    
    else {
      //customStatements.Action.push(serviceNamespaceOrAction);
    }

    console.log(JSON.stringify(servicePolicyDocument));
  }
  //console.log(JSON.stringify(policyDocument));
}

export const processPolicyBuilder = async (csvPath: string) => {
  const headers = ["RoleName", "ServiceNamespacesAndActions"];
  const csvFilePath = path.resolve(csvPath);
  const csvContent = fs.readFileSync(csvFilePath);

  const csvOptions = {
    delimiter: ",",
    columns: headers,
    from_line: 2
  };

  await parse(csvContent, csvOptions, processIAMCsv);
}