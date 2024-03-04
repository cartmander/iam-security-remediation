import { ListAttachedRolePoliciesCommand, ListRolePoliciesCommand } from "@aws-sdk/client-iam";
import { client } from "../services/client.js";

const isAWSManagedPolicy = (policyArn: string): boolean => {
    return policyArn.startsWith("arn:aws:iam::aws:policy/");
}

export const getAWSManagedPoliciesByRoleName = async (roleName: string): Promise<string[]> => {
    try {
        const listAttachedRolePoliciesCommandInput = {
            RoleName: roleName
        };

        const command = new ListAttachedRolePoliciesCommand(listAttachedRolePoliciesCommandInput);
        const response = await client.send(command);

        const attachedPolicies = response.AttachedPolicies!;
        const awsManagedPolicies = attachedPolicies.filter((policy) => isAWSManagedPolicy(policy.PolicyArn || "")).map(policy => policy.PolicyArn || "");

        return awsManagedPolicies;
    }
    
    catch {
        throw new Error(`Unable to get AWS Managed policies in this Role: ${roleName}`);
    }
}

export const getInlinePoliciesByRoleName = async (roleName: string): Promise<any> => {
    try {
        const listAttachedRolePoliciesCommandInput = {
            RoleName: roleName
        };

        const command = new ListRolePoliciesCommand(listAttachedRolePoliciesCommandInput);
        const response = await client.send(command);

        const inlinePolicies = response.PolicyNames;

        return inlinePolicies;
    }
    
    catch {
        throw new Error(`Unable to get inline policies in this Role: ${roleName}`);
    }
}