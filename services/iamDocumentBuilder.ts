import { CreatePolicyCommand } from "@aws-sdk/client-iam";
import { client } from "./iamClient.js";
import { BaseIAMDocument, IAMStatement } from "../interfaces/PolicyDocument.js";
import { ecrStatements, kmsStatements, logsStatements, 
  secretsManagerStatements, sqsStatements, ssmStatements 
} from "../models/Permissions.js";
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

const buildPolicyDocument = (document: BaseIAMDocument, serviceNamespace: string) =>
{
  switch (serviceNamespace) {
    case "ecr":
      document.Statement.push(ecrStatements);
      break;
    case "kms":
      document.Statement.push(kmsStatements);
      break;
    case "logs":
      document.Statement.push(logsStatements);
      break;
    case "secretsmanager":
      document.Statement.push(secretsManagerStatements);
      break;
    case "sqs":
      document.Statement.push(sqsStatements);
      break;
    case "ssm":
      document.Statement.push(ssmStatements);
      break;
    default:
      console.log("error");
      break;
    }

    return document;
}

const createPolicy = async (policyName: string, policyDocument: any) => {
  const command = new CreatePolicyCommand({
    PolicyDocument: JSON.stringify(policyDocument),
    PolicyName: policyName
  });

  return await client.send(command);
};

const processCsv = async (error: any, csvRecords: any) => {
  let policyDocument;

  for (let record in csvRecords) {
    const { ServiceNamespacesAndActions } = csvRecords[record];

    const serviceNamespaceOrAction = ServiceNamespacesAndActions as string;

    if(serviceNamespaceOrAction.includes(":")) {
      customStatements.Action.push(serviceNamespaceOrAction);
    }
    
    else {
      policyDocument = buildPolicyDocument(rootDocument, serviceNamespaceOrAction);
    }
  }

  policyDocument?.Statement.push(customStatements);
  console.log(JSON.stringify(policyDocument));

  await createPolicy("test-biffy-CodeBuild-Role-AutomationPolicy", policyDocument)
};

export const processPolicyCreation = async (csvPath: string) => {
  const headers = ["RoleName", "ServiceNamespacesAndActions"];
  const csvFilePath = path.resolve(csvPath);
  const csvContent = fs.readFileSync(csvFilePath);

  const csvOptions = {
    delimiter: ",",
    columns: headers,
    from_line: 2
  };

  await parse(csvContent, csvOptions, processCsv);
}