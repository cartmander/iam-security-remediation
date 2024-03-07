import { CreatePolicyVersionCommand, DetachRolePolicyCommand, GetPolicyCommand, GetPolicyVersionCommand, GetRolePolicyCommand, ListAttachedRolePoliciesCommand, ListRolePoliciesCommand, PutRolePolicyCommand } from "@aws-sdk/client-iam";
import { ManagedPolicyType } from "../enums/enumTypes.js";
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
        
        const policyDocument = JSON.parse(decodeURIComponent(response.PolicyVersion?.Document!));

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

export const createPolicyVersionInRoleAsCustomerManaged = async (policyDocument: string, policyArn: string, policyName: string): Promise<any> => {
    try {
        const createPolicyVersionCommand = {
            PolicyDocument: policyDocument,
            PolicyArn: policyArn,
            SetAsDefault: true
        }

        const command = new CreatePolicyVersionCommand(createPolicyVersionCommand);
        const response = await client.send(command);
        
        return response;
    }

    catch (error) {
        console.error(`Unable to create policy version ${policyName} as customer managed: ${(error as Error).name} - ${(error as Error).message}`);
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

export const getManagedPoliciesByRoleName = async (roleName: string, managedPolicyType: string): Promise<any> => {
    try {

        let managedPolicies;

        const listAttachedRolePoliciesCommandInput = {
            RoleName: roleName
        };

        const command = new ListAttachedRolePoliciesCommand(listAttachedRolePoliciesCommandInput);
        const response = await client.send(command);
        
        const attachedPolicies = response.AttachedPolicies!;

        switch (managedPolicyType) {
            case ManagedPolicyType.AWS_MANAGED:
                managedPolicies = attachedPolicies.filter((policy) => isAWSManagedPolicy(policy.PolicyArn!)).map(policy => policy.PolicyArn!);
                break;
            case ManagedPolicyType.CUSTOMER_MANAGED:
                managedPolicies = attachedPolicies.filter((policy) => !isAWSManagedPolicy(policy.PolicyArn!)).map(policy => policy.PolicyArn!);
                break;
            default:
                break;
        }

        return managedPolicies;
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
        console.error(`Unable to get inline policies in this role ${roleName}: ${(error as Error).name} - ${(error as Error).message}`);
    }
}