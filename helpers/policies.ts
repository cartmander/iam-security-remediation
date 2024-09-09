import { CreatePolicyVersionCommand, DeletePolicyVersionCommand, DetachRolePolicyCommand, GetPolicyCommand, GetPolicyVersionCommand, GetRolePolicyCommand, ListAttachedRolePoliciesCommand, ListPolicyVersionsCommand, ListRolePoliciesCommand, ListRoleTagsCommand, PutRolePolicyCommand } from "@aws-sdk/client-iam";
import { OverPermissiveRolesMessage, PolicyType } from "../enums/generic.js";
import { iamClient } from "./client.js";

const isAWSManagedPolicy = (policyArn: string): boolean => {
    return policyArn.startsWith("arn:aws:iam::aws:policy/");
}

const listPolicyVersions = async (policyArn: string): Promise<any> => {
    try {
        const listPolicyVersionsCommandInput = {
            PolicyArn: policyArn
        }

        const command = new ListPolicyVersionsCommand(listPolicyVersionsCommandInput);
        const response = await iamClient.send(command);

        return response.Versions;
    }

    catch (error) {
        const errorMessage = `${(error as Error).name} - ${(error as Error).message}`;
        throw new Error(`Unable to list policy versions of this policy ARN ${policyArn}: ${errorMessage}`);
    }
}

const deletePolicyVersion = async (policyArn: string, versionId: string): Promise<any> => {
    try {
        const deletePolicyVersionCommandInput = {
            PolicyArn: policyArn,
            VersionId: versionId
        }

        const command = new DeletePolicyVersionCommand(deletePolicyVersionCommandInput);
        const response = await iamClient.send(command);

        console.log(response);

        return response;
    }

    catch (error) {
        const errorMessage = `${(error as Error).name} - ${(error as Error).message}`;
        throw new Error(`Unable to delete policy version of this policy ARN ${policyArn}: ${errorMessage}`);
    }
}

export const getPolicyVersion = async (policyArn: string) : Promise<any> => {
    try {
        const getPolicyCommandInput = {
            PolicyArn: policyArn
        }

        const command = new GetPolicyCommand(getPolicyCommandInput);
        const response = await iamClient.send(command);

        return response;
    }

    catch (error) {
        const errorMessage = `${(error as Error).name} - ${(error as Error).message}`;
        throw new Error(`Unable to get policy version of this policy ARN ${policyArn}: ${errorMessage}`);
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
        const response = await iamClient.send(command);
        
        const policyDocument = JSON.parse(decodeURIComponent(response.PolicyVersion?.Document!));

        return policyDocument;
    }

    catch (error) {
        const errorMessage = `${(error as Error).name} - ${(error as Error).message}`;
        throw new Error(`Unable to get policy document of this policy ARN ${policyArn}: ${errorMessage}`);
    }
}

export const getRolePolicyDocument = async (roleName: string, policyName: string): Promise<any> => {
    try {
        const getRolePolicyCommandInput = {
            RoleName: roleName,
            PolicyName: policyName
        }

        const command = new GetRolePolicyCommand(getRolePolicyCommandInput);
        const response = await iamClient.send(command);

        const policyDocument = JSON.parse(decodeURIComponent(response.PolicyDocument!));

        return policyDocument;
    }

    catch (error) {
        const errorMessage = `${(error as Error).name} - ${(error as Error).message}`;
        throw new Error(`Unable to get policy document of this policy name ${policyName}: ${errorMessage}`);
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
        const response = await iamClient.send(command);
        
        return response;
    }

    catch (error) {
        const errorMessage = `${(error as Error).name} - ${(error as Error).message}`;
        throw new Error(`Unable to create policy ${policyName} as inline: ${errorMessage}`);
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
        const response = await iamClient.send(command);
        
        return response;
    }

    catch (error) {
        const errorMessage = `${(error as Error).name} - ${(error as Error).message}`;
        throw new Error(`Unable to create policy version ${policyName} as customer managed: ${errorMessage}`);
    }    
}

export const deleteAWSManagedPolicyInRole = async (roleName: string, policyName: string, policyArn: string) => {
    try {
        const deleteRolePolicyCommandinput = {
            RoleName: roleName,
            PolicyArn: policyArn
        }

        const command = new DetachRolePolicyCommand(deleteRolePolicyCommandinput);
        await iamClient.send(command);
    }

    catch (error) {
        const errorMessage = `${(error as Error).name} - ${(error as Error).message}`;
        throw new Error(`Unable to delete policy ${policyName} as AWS managed: ${errorMessage}`);
    }
}

export const getManagedPoliciesByRoleName = async (roleName: string, managedPolicyType: string): Promise<any> => {
    try {
        let managedPolicies;

        const listAttachedRolePoliciesCommandInput = {
            RoleName: roleName
        };

        const command = new ListAttachedRolePoliciesCommand(listAttachedRolePoliciesCommandInput);
        const response = await iamClient.send(command);
        
        const attachedPolicies = response.AttachedPolicies!;

        switch (managedPolicyType) {
            case PolicyType.AWS_MANAGED:
                managedPolicies = attachedPolicies.filter((policy) => isAWSManagedPolicy(policy.PolicyArn!)).map(policy => policy.PolicyArn!);
                break;
            case PolicyType.CUSTOMER_MANAGED:
                managedPolicies = attachedPolicies.filter((policy) => !isAWSManagedPolicy(policy.PolicyArn!)).map(policy => policy.PolicyArn!);
                break;
            default:
                break;
        }

        return managedPolicies;
    }
    
    catch (error) {
        const errorMessage = `${(error as Error).name} - ${(error as Error).message}`;
        throw new Error(`Unable to get AWS managed policies in this role ${roleName}: ${errorMessage}`);
    }
}

export const getInlinePoliciesByRoleName = async (roleName: string): Promise<any> => {
    try {
        const listAttachedRolePoliciesCommandInput = {
            RoleName: roleName
        };

        const command = new ListRolePoliciesCommand(listAttachedRolePoliciesCommandInput);
        const response = await iamClient.send(command);

        const inlinePolicies = response.PolicyNames;

        return inlinePolicies;
    }
    
    catch (error) {
        const errorMessage = `${(error as Error).name} - ${(error as Error).message}`;
        throw new Error(`Unable to get inline policies in this role ${roleName}: ${errorMessage}`);
    }
}

export const getRoleTags = async (roleName: string): Promise<any> => {
    try {
        const listRoleTagsCommandInput = {
            RoleName: roleName
        }

        const command = new ListRoleTagsCommand(listRoleTagsCommandInput);
        const response = await iamClient.send(command);
        
        let platformTag;
        const platformExists = response.Tags?.find(tag => tag.Key === "PLATFORM");

        if (!response.Tags || response.Tags.length === 0 || !platformExists) {
            platformTag = OverPermissiveRolesMessage.NO_TAG;
        }

        else {
            platformTag = platformExists.Value;
        }

        return platformTag;
    }

    catch (error) {
        const errorMessage = `${(error as Error).name} - ${(error as Error).message}`;
        throw new Error(`Unable to retrieve tag for this role ${roleName}: ${errorMessage}`);
    }
}