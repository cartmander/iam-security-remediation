import { CreatePolicyCommand } from "@aws-sdk/client-iam";
import client from "./services/client.js";
import * as Permissions from "./permissions.js";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";
import { BaseDocument } from "interfaces.js";

export const createPolicy = (policyName: string, policyDocument: any) => {
  const command = new CreatePolicyCommand({
    PolicyDocument: JSON.stringify(policyDocument),
    PolicyName: policyName,
  });

  return client.send(command);
};

export const buildPolicyDocument = (baseDocument: BaseDocument, serviceNamespace: string) =>
{
  switch (serviceNamespace) {
    case "ecr":
      baseDocument.Statement.push(Permissions.ECR);
      break;
    case "kms":
      baseDocument.Statement.push(Permissions.KMS);
      break;
    case "logs":
      baseDocument.Statement.push(Permissions.Logs);
      break;
    case "secretsmanager":
      baseDocument.Statement.push(Permissions.SecretsManager);
      break;
    case "sqs":
      baseDocument.Statement.push(Permissions.SQS);
      break;
    case "ssm":
      baseDocument.Statement.push(Permissions.SSM);
      break;
    default:
      console.log("error");
      break;
    }

    return baseDocument;
}

export const main = () => {
  const headers = ["RoleName", "ServiceNamespace"];
  const csvFilePath = path.resolve("csvs/service-namespace.csv");
  const csvContent = fs.readFileSync(csvFilePath);

  const csvOptions = {
    delimiter: ",",
    columns: headers,
    from_line: 2
  };

  const processCsv = async (error: any, csvRecords: any) => {
    const baseDocument: BaseDocument = Permissions.Root;
    let policyDocument;

    for (let record in csvRecords) {
      const { ServiceNamespace } = csvRecords[record];
      policyDocument = buildPolicyDocument(baseDocument, ServiceNamespace);
    }

    createPolicy("test-biffy-CodeBuild-Role-AutomationPolicy", policyDocument)
  };

  parse(csvContent, csvOptions, processCsv);
}

main()