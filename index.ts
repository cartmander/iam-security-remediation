import { CreatePolicyCommand } from "@aws-sdk/client-iam";
import client from "services/client.js";
import * as Permissions from "./permissions.js";

export const createPolicy = (policyName: string) => {

  const policyDocument = Permissions.Root;
  policyDocument.Statement.push(Permissions.ECR);

  const command = new CreatePolicyCommand({
    PolicyDocument: JSON.stringify(policyDocument),
    PolicyName: policyName,
  });

  return client.send(command);
};

createPolicy("test-policy");