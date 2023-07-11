import { CreatePolicyCommand } from "@aws-sdk/client-iam";
import { client } from "./IAMClient.js";
import path from "path";
import fs from "fs";
import { parse } from "csv-parse";
import { BaseIAMDocument, IAMStatement } from "interfaces/PolicyDocument.js";
import { ecrStatements, kmsStatements, logsStatements, 
  secretsManagerStatements, sqsStatements, ssmStatements 
} from "models/Permissions.js";

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
      rootDocument.Statement.push(ecrStatements);
      break;
    case "kms":
      rootDocument.Statement.push(kmsStatements);
      break;
    case "logs":
      rootDocument.Statement.push(logsStatements);
      break;
    case "secretsmanager":
      rootDocument.Statement.push(secretsManagerStatements);
      break;
    case "sqs":
      rootDocument.Statement.push(sqsStatements);
      break;
    case "ssm":
      rootDocument.Statement.push(ssmStatements);
      break;
    default:
      console.log("error");
      break;
    }

    return rootDocument;
}

const createPolicy = (policyName: string, policyDocument: any) => {
  const command = new CreatePolicyCommand({
    PolicyDocument: JSON.stringify(policyDocument),
    PolicyName: policyName
  });

  return client.send(command);
};

export const processPolicyCreation = () => {
  const headers = ["RoleName", "ServiceNamespace"];
  const csvFilePath = path.resolve("csvs/service-namespace.csv");
  const csvContent = fs.readFileSync(csvFilePath);

  const csvOptions = {
    delimiter: ",",
    columns: headers,
    from_line: 2
  };

  const processCsv = async (error: any, csvRecords: any) => {
    let policyDocument;

    for (let record in csvRecords) {
      const { ServiceNamespace } = csvRecords[record];
      policyDocument = buildPolicyDocument(rootDocument, ServiceNamespace);
    }

    createPolicy("test-biffy-CodeBuild-Role-AutomationPolicy", policyDocument)
  };

  parse(csvContent, csvOptions, processCsv);
}