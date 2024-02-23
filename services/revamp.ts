import { AttachRolePolicyCommand, CreatePolicyCommand, GetPolicyCommand, GetPolicyCommandOutput, GetPolicyVersionCommand, ListAttachedRolePoliciesCommand, PutRolePolicyCommand } from "@aws-sdk/client-iam";
import { client } from "../client.js";
import { create } from "domain";

const isAWSManagedPolicy = (policyArn: string): boolean => {
    return policyArn.startsWith("arn:aws:iam::aws:policy/");
}

const getPolicyVersion = async (policyArn: string) : Promise<any> => {
    const getPolicyCommandInput = {
        PolicyArn: policyArn
    }

    const command = new GetPolicyCommand(getPolicyCommandInput);
    const response = await client.send(command);

    return response.Policy?.DefaultVersionId;
}

const getPolicyDocument = async (policyVersion: string, policyArn: string): Promise<any> => {
    const getPolicyVersionCommandInput = {
        PolicyArn: policyArn,
        VersionId: policyVersion
    }

    const command = new GetPolicyVersionCommand(getPolicyVersionCommandInput);
    const response = await client.send(command);

    const policyDocument = decodeURIComponent(response.PolicyVersion?.Document!);

    return policyDocument;
}

const putPolicyDocumentInRole = async (policyDocument: string, roleName: string): Promise<any> => {
    const putRolePolicyCommandInput = {
        PolicyDocument: policyDocument,
        PolicyName: "AWSSupportAccess",
        RoleName: roleName
    }

    const command = new PutRolePolicyCommand(putRolePolicyCommandInput);
    const response = await client.send(command);;

    return response;
}

const convertManagedPolicyToInline = async (roleName: string, policyArn: string): Promise<any> => {
    try {
        const policyVersion = await getPolicyVersion(policyArn);
        const policyDocument = await getPolicyDocument(policyVersion, policyArn);
        const convertedInlinePolicy = await putPolicyDocumentInRole(policyDocument, roleName);

        console.log(convertedInlinePolicy);
    }

    catch (error) {
        console.error("Error: ", error);
    }
}

const getAWSManagedPoliciesForRole = async (roleName: string): Promise<void> => {
    try {
        const listAttachedRolePoliciesCommandInput = {
            RoleName: roleName
        };

        const command = new ListAttachedRolePoliciesCommand(listAttachedRolePoliciesCommandInput);
        const response = await client.send(command);

        const attachedPolicies = response.AttachedPolicies || [];
        const AWSManagedPolicyArns = attachedPolicies.filter(policy => isAWSManagedPolicy(policy.PolicyArn || "")).map(policy => policy.PolicyArn);

        console.log("AWS Managed Policies attached to Role: ", AWSManagedPolicyArns);
    }

    catch (error) {
        console.error("Error getting AWS managed policies for role: ", error);
    }
}

// getAWSManagedPoliciesForRole("WAFUser");
convertManagedPolicyToInline("WAFUser", "arn:aws:iam::aws:policy/AWSSupportAccess");