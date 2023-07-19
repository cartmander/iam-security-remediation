import { CreatePolicyCommand } from "@aws-sdk/client-iam";
import { client } from "../client.js";
import { BaseIAMDocument, IAMStatement } from "../interfaces/PolicyDocument.js";
import { parse } from "csv-parse";
import path from "path";
import fs from "fs";
import { buildExplicitActions } from "./explicitActionsBuilder.js";

const rootDocument: BaseIAMDocument = {
  "Version": "2012-10-17",
  "Statement": []
}

const customStatements: IAMStatement = {
  "Effect": "Allow",
  "Action": [],
  "Resource": "*"
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