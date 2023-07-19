import { CreatePolicyCommand, CreatePolicyVersionCommand, GetPolicyCommand } from "@aws-sdk/client-iam";
import { client } from "../client.js";
import { rootDocument, customStatements, buildExplicitActions } from "../document.js";
import { BaseIAMDocument } from "../interfaces/PolicyDocument.js";
import { parse } from "csv-parse";
import path from "path";
import fs from "fs";

const isPolicyExisting = async (policyName: string) =>
{
  let response;
  const getPolicyCommandInput = {
    PolicyArn: `arn:aws:iam::539383487878:policy/${policyName}`
  }

  try {
    const command = new GetPolicyCommand(getPolicyCommandInput);
    response = await client.send(command);
  }

  catch {
  }

  return response;
}

const createPolicyVersion = async (policyDocument: BaseIAMDocument, policyName: string) => {
  const createPolicyVersionInput = {
    PolicyArn: `arn:aws:iam::539383487878:policy/${policyName}`,
    PolicyDocument: JSON.stringify(policyDocument),
    SetAsDefault: true
  };

  const command = new CreatePolicyVersionCommand(createPolicyVersionInput);
  const response = await client.send(command);

  return response;
}

const createPolicy = async (policyDocument: BaseIAMDocument, policyName: string) => {
  const createPolicyCommandInput = {
    PolicyDocument: JSON.stringify(policyDocument),
    PolicyName: policyName,
    Tags: [
      {
        Key: "REPOSITORY",
        Value: "ubif-iam-role-cdk-access-advisor"
      }
    ]
  }
  
  const command = new CreatePolicyCommand(createPolicyCommandInput);
  const response = await client.send(command);
  
  return response;
}

const createPolicyOrPolicyVersion = async (policyDocument: BaseIAMDocument, policyName: string) => {
  const policyExistResponse = await isPolicyExisting(policyName);

  if (!policyExistResponse) {
    await createPolicy(policyDocument as BaseIAMDocument, policyName);
  }

  else {
    await createPolicyVersion(policyDocument as BaseIAMDocument, policyName);
  }
}

const buildExplicitActionsStatement = (policyDocument: BaseIAMDocument, serviceNamespace: string) => {
  const explicitActionStatement = buildExplicitActions(serviceNamespace);
  policyDocument.Statement.push(explicitActionStatement);

  return policyDocument;
}

const processIAMCsv = async (error: any, csvRecords: any) => {
  let policyDocument;
  let roleName;

  for (let record in csvRecords) {
    const { RoleName, ServiceNamespacesAndActions } = csvRecords[record];

    roleName = RoleName;
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

  createPolicyOrPolicyVersion(policyDocument as BaseIAMDocument, `${roleName}-AccessAdvisorAutomation`);
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