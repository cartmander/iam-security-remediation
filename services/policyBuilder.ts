import { CreatePolicyCommand } from "@aws-sdk/client-iam";
import { client } from "../client.js";
import { BaseIAMDocument, IAMStatement } from "../interfaces/PolicyDocument.js";
import { parse } from "csv-parse";
import path from "path";
import fs from "fs";

const rootDocument: BaseIAMDocument = {
  "Version": "2012-10-17",
  "Statement": []
}

const customStatements: IAMStatement = {
  "Effect": "Allow",
  "Action": [],
  "Resource": "*"
}

const buildExplicitActions = (serviceName: string) => {

  const actions: IAMStatement = {
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

const buildExplicitActionsStatement = (document: BaseIAMDocument, serviceNamespace: string) =>
{
  const explicitActionStatement = buildExplicitActions(serviceNamespace);
  document.Statement.push(explicitActionStatement);

  return document;
}

const createPolicy = async (policyName: string, policyDocument: any) => {
  const command = new CreatePolicyCommand({
    PolicyDocument: JSON.stringify(policyDocument),
    PolicyName: policyName
  });

  return await client.send(command);
};

const processIAMCsv = async (error: any, csvRecords: any) => {
  let policyDocument;

  for (let record in csvRecords) {
    const { ServiceNamespacesAndActions } = csvRecords[record];

    const serviceNamespaceOrAction = ServiceNamespacesAndActions as string;

    if(serviceNamespaceOrAction.includes(":")) {
      customStatements.Action.push(serviceNamespaceOrAction);
    }
    
    else {
      policyDocument = buildExplicitActionsStatement(rootDocument, serviceNamespaceOrAction);
    }
  }

  policyDocument?.Statement.push(customStatements);
  console.log(JSON.stringify(policyDocument));

  //await createPolicy("test-biffy-CodeBuild-Role-AutomationPolicy", policyDocument)
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