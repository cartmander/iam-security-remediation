import { 
    DetachRolePolicyCommand, 
    GetPolicyCommand, 
    GetPolicyVersionCommand, 
    ListAttachedRolePoliciesCommand, 
    PutRolePolicyCommand 
} from "@aws-sdk/client-iam";
import { client } from "../../client.js";
import { parse } from "csv-parse";
import path from "path";
import fs from "fs";


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

const createPolicyDocumentInRoleAsInline = async (policyDocument: string, roleName: string, policyName: string, policyArn: string): Promise<any> => {
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
        console.error(`Unable to convert Policy Document of this Policy ARN: ${policyArn} into an inline policy`);
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
        console.log(`Attempting to convert AWS managed policy: ${policyArn}`);

        const policyVersion = await getPolicyVersion(policyArn);

        const policyDefaultVersionId = policyVersion.Policy?.DefaultVersionId;
        const policyName = policyVersion.Policy?.PolicyName;

        const policyDocument = await getPolicyDocument(policyDefaultVersionId, policyArn);
        const convertedPolicyDocument = await createPolicyDocumentInRoleAsInline(policyDocument, roleName, policyName, policyArn);

        if (convertedPolicyDocument) {
            await deleteAWSManagedPolicyInRole(roleName, policyArn);
        }

        console.log(`Done attempting to convert AWS managed policy: ${policyArn}`);
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

        console.log(`Attempting to process role: ${roleName}`);

        if (AWSManagedPolicyArns.length != 0 ) {
            console.log(`AWS Managed Policies attached to Role ${roleName}`, AWSManagedPolicyArns);
            AWSManagedPolicyArns.forEach((policy) => (convertManagedPolicyToInline(roleName, policy!)));
        }

        else {
            console.log(`No AWS Managed Policies attached to Role ${roleName}`);
        }

        console.log(`Done attempting to process role: ${roleName} and its policies`);
    }

    catch (error) {
        console.error("Error getting AWS managed policies for role: ", error);
    }
}

const processAWSManagedPolicyRemediation = async (error: any, csvRecords: any) => {
    for (let record in csvRecords) {
      const { RoleName, Arn } = csvRecords[record];
      await getAWSManagedPoliciesForRole(RoleName);
    }
}

const getRolesFromIamCsv = (csvPath: string) => {
    const headers = ["RoleName", "Arn"];
    const csvFilePath = path.resolve(csvPath);
    const csvContent = fs.readFileSync(csvFilePath);
  
    const csvOptions = {
      delimiter: ",",
      columns: headers,
      from_line: 2
    };
  
    parse(csvContent, csvOptions, processAWSManagedPolicyRemediation);
  }
  
  getRolesFromIamCsv("csvs/iam_roles.csv");