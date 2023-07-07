import { CreatePolicyCommand } from "@aws-sdk/client-iam";
import client from "./services/client.js";
import * as Permissions from "./permissions.js";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";
import { ActionDocument, BaseDocument } from "interfaces.js";

export const createPolicy = (policyName: string, policyDocument: any) => {
  //const policyDocument = Permissions.Root;
  //policyDocument.Statement.push(Permissions.ECR);

  const command = new CreatePolicyCommand({
    PolicyDocument: JSON.stringify(policyDocument),
    PolicyName: policyName,
  });

  return client.send(command);
};

export const buildPolicyDocument = (baseDocument: BaseDocument, serviceNamespace: ActionDocument) =>
{
  baseDocument.Statement.push(serviceNamespace);
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
    if (error) {
      console.error(error);
    }
    console.log("Result:", csvRecords);

    const baseDocument: BaseDocument = Permissions.Root;
    let document;

    for (let record in csvRecords) {
      const { ServiceNamespace } = csvRecords[record];

      document = buildPolicyDocument(baseDocument, Permissions.ECR);
      
    }

    console.log(JSON.stringify(document));
  };

  parse(csvContent, csvOptions, processCsv);
}

main()