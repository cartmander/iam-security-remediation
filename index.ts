import { CreatePolicyCommand, IAMClient } from "@aws-sdk/client-iam";
import { base, ecr } from "./permissions.js";

const client = new IAMClient({
  region: "us-east-1"
});

export const createPolicy = (policyName: string) => {

  base.Statement.push(ecr);

  const command = new CreatePolicyCommand({
    PolicyDocument: JSON.stringify(base),
    PolicyName: policyName,
  });

  return client.send(command);
};

createPolicy("test-policy");