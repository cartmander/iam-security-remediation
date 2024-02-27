import { DetachRolePolicyCommand, GetPolicyCommand, GetPolicyVersionCommand, ListAttachedRolePoliciesCommand, PutRolePolicyCommand } from "@aws-sdk/client-iam";
import { client } from "../client.js";

const isAWSManagedPolicy = (policyArn: string): boolean => {
    return policyArn.startsWith("arn:aws:iam::aws:policy/");
}

const getPolicyVersion = async (policyArn: string) : Promise<any> => {
    try {
        const getPolicyCommandInput = {
            PolicyArn: policyArn
        }

        const command = new GetPolicyCommand(getPolicyCommandInput);
        const response = await client.send(command);

        return response;
    }

    catch (error) {
        console.error(`Unable to get Policy Version of this Policy ARN: ${policyArn}`);
        return;
    }
}

const getPolicyDocument = async (policyVersion: string, policyArn: string): Promise<any> => {
    try {
        const getPolicyVersionCommandInput = {
            PolicyArn: policyArn,
            VersionId: policyVersion
        }

        const command = new GetPolicyVersionCommand(getPolicyVersionCommandInput);
        const response = await client.send(command);
        const policyDocument = decodeURIComponent(response.PolicyVersion?.Document!);

        return policyDocument;
    }

    catch (error) {
        console.error(`Unable to get Policy Document of this Policy ARN: ${policyArn}`);
        return;
    }
}

const createPolicyDocumentInRoleAsInline = async (policyDocument: string, roleName: string, policyName: string): Promise<any> => {
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
        console.error(`Unable to convert Policy Document of this Policy Name: ${policyName} into an inline policy`);
        return;
    }    
}

const deleteAWSManagedPolicyInRole = async (roleName: string, policyArn: string) => {
    try {
        const deleteRolePolicyCommandinput = {
            RoleName: roleName,
            PolicyArn: policyArn
        }

        const command = new DetachRolePolicyCommand(deleteRolePolicyCommandinput);
        const response = await client.send(command);
    }

    catch (error) {
        console.error(`Unable to delete the AWS Managed Policy Document of this Policy ARN: ${policyArn}`);
    }
}

const convertManagedPolicyToInline = async (roleName: string, policyArn: string): Promise<any> => {
    try {
        const policyVersion = await getPolicyVersion(policyArn);

        const policyDefaultVersionId = policyVersion.Policy?.DefaultVersionId;
        const policyName = policyVersion.Policy?.PolicyName;

        const policyDocument = await getPolicyDocument(policyDefaultVersionId, policyArn);

        const convertedPolicyDocument = await createPolicyDocumentInRoleAsInline(policyDocument, roleName, policyName);

        if (convertedPolicyDocument) {
            await deleteAWSManagedPolicyInRole(roleName, policyArn);
        }
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

//getAWSManagedPoliciesForRole("jabberwocky-test-ecs-task-Role");
convertManagedPolicyToInline("jabberwocky-test-ecs-task-Role", "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy");