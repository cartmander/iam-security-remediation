import { 
    DetachRolePolicyCommand, 
    GetPolicyCommand, 
    GetPolicyCommandOutput, 
    GetPolicyVersionCommand,
    PutRolePolicyCommand, 
    PutRolePolicyCommandOutput
} from "@aws-sdk/client-iam";
import { client } from "../client.js";
import { parse } from "csv-parse";
import path from "path";
import fs from "fs";
import { getAWSManagedPoliciesByRoleName } from "../../helpers/policies.js";

const getPolicyVersion = async (policyArn: string) : Promise<GetPolicyCommandOutput> => {
    try {
        const getPolicyCommandInput = {
            PolicyArn: policyArn
        }

        const command = new GetPolicyCommand(getPolicyCommandInput);
        const response = await client.send(command);

        return response;
    }

    catch (error) {
        throw new Error(`Unable to get Policy Version of this Policy ARN: ${policyArn}`);
    }
}

const getPolicyDocument = async (policyVersion: string, policyArn: string): Promise<string> => {
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
        throw new Error(`Unable to get Policy Document of this Policy ARN: ${policyArn}`);
    }
}

const createPolicyDocumentInRoleAsInline = async (policyDocument: string, roleName: string, policyName: string, policyArn: string): Promise<PutRolePolicyCommandOutput> => {
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
        throw new Error(`Unable to convert Policy Document of this Policy ARN: ${policyArn} into an inline policy`);
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
        throw new Error(`Unable to delete the AWS Managed Policy Document of this Policy ARN: ${policyArn}`);
    }
}

const convertManagedPolicyToInline = async (roleName: string, policyArn: string): Promise<any> => {
    try {
        console.log(`Converting AWS managed policy: ${policyArn}`);

        const policyVersion = await getPolicyVersion(policyArn);

        const policyDefaultVersionId = policyVersion.Policy?.DefaultVersionId || "";
        const policyName = policyVersion.Policy?.PolicyName || "";

        const policyDocument = await getPolicyDocument(policyDefaultVersionId, policyArn);
        const convertedPolicyDocument = await createPolicyDocumentInRoleAsInline(policyDocument, roleName, policyName, policyArn);

        if (convertedPolicyDocument) {
            await deleteAWSManagedPolicyInRole(roleName, policyArn);
        }
    }

    catch (error) {
        console.error("Error: ", error);
    }
}

const processAWSManagedPolicyRemediation = async (roleName: string): Promise<void> => {
    try {
        const awsManagedPolicies = await getAWSManagedPoliciesByRoleName(roleName);

        console.log(`---------------------------------------------------------------------------------`);
        console.log(`Processing role: ${roleName}`);

        if (awsManagedPolicies.length != 0 ) {
            console.log(`AWS Managed Policies attached to Role ${roleName}`, awsManagedPolicies);
            awsManagedPolicies.forEach((policy) => (convertManagedPolicyToInline(roleName, policy!)));
        }

        else {
            console.log(`No AWS Managed Policies attached to Role ${roleName}`);
        }

        console.log(`Done processing role: ${roleName} and its policies`);
        console.log(`---------------------------------------------------------------------------------`);
    }

    catch (error) {
        console.error(`Error getting inline policies for role: ${roleName}`, error);
    }
}

const loopCsvRecords = async (error: any, csvRecords: any) => {
    for (let record in csvRecords) {
      const { RoleName, Arn } = csvRecords[record];
      await processAWSManagedPolicyRemediation(RoleName);
    }
}

const main = async (csvPath: string) => {
    const headers = ["RoleName", "Arn"];
    const csvFilePath = path.resolve(csvPath);
    const csvContent = fs.readFileSync(csvFilePath);
  
    const csvOptions = {
      delimiter: ",",
      columns: headers,
      from_line: 2
    };
  
    await parse(csvContent, csvOptions, loopCsvRecords);
}
  
main("csvs/iam_roles.csv");