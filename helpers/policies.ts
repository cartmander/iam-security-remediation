import { DetachRolePolicyCommand, GetPolicyCommand, GetPolicyVersionCommand, GetRolePolicyCommand, ListAttachedRolePoliciesCommand, ListRolePoliciesCommand, PutRolePolicyCommand } from "@aws-sdk/client-iam";
import { client } from "../services/client.js";

const isAWSManagedPolicy = (policyArn: string): boolean => {
    return policyArn.startsWith("arn:aws:iam::aws:policy/");
}

export const getPolicyVersion = async (policyArn: string) : Promise<any> => {
    try {
        const getPolicyCommandInput = {
            PolicyArn: policyArn
        }

        const command = new GetPolicyCommand(getPolicyCommandInput);
        const response = await client.send(command);

        return response;
    }

    catch (error) {
        console.error(`Unable to get policy version of this policy ARN ${policyArn}: ${(error as Error).name} - ${(error as Error).message}`);
    }
}

export const getPolicyVersionDocument = async (policyArn: string): Promise<any> => {
    try {
        const policyVersion = await getPolicyVersion(policyArn);
        const policyDefaultVersionId = policyVersion.Policy?.DefaultVersionId || "";

        const getPolicyVersionCommandInput = {
            PolicyArn: policyArn,
            VersionId: policyDefaultVersionId
        }

        const command = new GetPolicyVersionCommand(getPolicyVersionCommandInput);
        const response = await client.send(command);
        
        const policyDocument = decodeURIComponent(response.PolicyVersion?.Document!);
        return policyDocument;
    }

    catch (error) {
        console.error(`Unable to get policy document of this policy ARN ${policyArn}: ${(error as Error).name} - ${(error as Error).message}`);
    }
}

export const getRolePolicyDocument = async (roleName: string, policyName: string): Promise<any> => {
    try {
        const getRolePolicyCommandInput = {
            RoleName: roleName,
            PolicyName: policyName
        }

        const command = new GetRolePolicyCommand(getRolePolicyCommandInput);
        const response = await client.send(command);

        const policyDocument = JSON.parse(decodeURIComponent(response.PolicyDocument!));

        return policyDocument;
    }

    catch (error) {
        console.error(`Unable to get policy document of this policy name ${policyName}: ${(error as Error).name} - ${(error as Error).message}`);
    }
}

export const createPolicyDocumentInRoleAsInline = async (policyDocument: string, roleName: string, policyName: string): Promise<any> => {
    try {
        const putRolePolicyCommandInput = {
            PolicyDocument: policyDocument,
            PolicyName: policyName,
            RoleName: roleName
        }

        const command = new PutRolePolicyCommand(putRolePolicyCommandInput);
        const response = await client.send(command);
        
        return response;
    }

    catch (error) {
        console.error(`Unable to create policy ${policyName} as inline: ${(error as Error).name} - ${(error as Error).message}`);
    }    
}

export const deleteAWSManagedPolicyInRole = async (roleName: string, policyName: string, policyArn: string) => {
    try {
        const deleteRolePolicyCommandinput = {
            RoleName: roleName,
            PolicyArn: policyArn
        }

        const command = new DetachRolePolicyCommand(deleteRolePolicyCommandinput);
        await client.send(command);
    }

    catch (error) {
        console.error(`Unable to delete policy ${policyName} as AWS managed: ${(error as Error).name} - ${(error as Error).message}`);
    }
}

export const getAWSManagedPoliciesByRoleName = async (roleName: string): Promise<any> => {
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
    
    catch (error) {
        console.error(`Unable to get AWS managed policies in this role ${roleName}: ${(error as Error).name} - ${(error as Error).message}`);
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
    
    catch (error) {
        throw new Error(`Unable to get inline policies in this role ${roleName}: ${(error as Error).name} - ${(error as Error).message}`);
    }
}