import { DetachRolePolicyCommand, GetPolicyCommand, GetPolicyVersionCommand, PutRolePolicyCommand, } from "@aws-sdk/client-iam";
import { getAWSManagedPoliciesByRoleName } from "../../helpers/policies.js";
import { client } from "../client.js";
import { parse } from "csv-parse";
import path from "path";
import fs from "fs";

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
    }
}

const getPolicyDocument = async (policyArn: string): Promise<any> => {
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
        console.error(`Unable to get Policy Document of this Policy ARN: ${policyArn}`);
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
        console.error(`Unable to create policy ${policyName} as inline: ${(error as Error).name} - ${(error as Error).message}`);
    }    
}

const deleteAWSManagedPolicyInRole = async (roleName: string, policyName: string, policyArn: string) => {
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

const convertManagedPolicyToInline = async (roleName: string, policyArn: string, policyPlacement: number, totalPolicies: number): Promise<any> => {
    try {
        console.log(`\n[${policyPlacement} out of ${totalPolicies}] Converting AWS Managed Policy: ${policyArn}`);

        const policyVersion = await getPolicyVersion(policyArn);
        const policyDocument = await getPolicyDocument(policyArn);
        
        const policyName = policyVersion.Policy.PolicyName;
        const convertedPolicyDocument = await createPolicyDocumentInRoleAsInline(policyDocument, roleName, policyName);

        if (convertedPolicyDocument) {
            await deleteAWSManagedPolicyInRole(roleName, policyName, policyArn);
            console.log(`\n[${policyPlacement} out of ${totalPolicies}] Successfully converted AWS Managed Policy: ${policyArn}`);

            return true;
        }

        return false;
    }

    catch (error) {
        console.error("Error: ", error);
    }
}

const processAWSManagedPolicyRemediation = async (roleName: string): Promise<void> => {
    try {
        let convertedPolicies: string[] = [], notConvertedPolicies: string[] = [];

        const awsManagedPolicies = await getAWSManagedPoliciesByRoleName(roleName);
        const awsManagedPoliciesLength = awsManagedPolicies.length;

        if (awsManagedPoliciesLength != 0) {
            console.log(`AWS Managed Policies of Role ${roleName}:`, awsManagedPolicies);
            console.log(`Total AWS Managed Policies: ${awsManagedPoliciesLength}`);

            for (let index = 0; index < awsManagedPolicies.length; index++) {
                const policy = awsManagedPolicies[index];
                let processedPolicies = await convertManagedPolicyToInline(roleName, policy, index + 1, awsManagedPoliciesLength);

                processedPolicies ? convertedPolicies = convertedPolicies.concat(policy) : notConvertedPolicies = notConvertedPolicies.concat(policy);
            }

            console.log(`\nSummary for Role: ${roleName}`);
            console.log(`\tSuccessfully processed AWS Managed Policies [${convertedPolicies.length} out of ${awsManagedPoliciesLength}]: `, convertedPolicies);
            console.log(`\tUnsuccessfully processed AWS Managed Policies [${notConvertedPolicies.length} out of ${awsManagedPoliciesLength}]: `, notConvertedPolicies);
        }

        else {
            console.log(`No AWS Managed Policies attached to Role ${roleName}`);
        }
    }

    catch (error) {
        console.error(`Error getting inline policies for role: ${roleName}`, error);
    }
}

const loopCsvRecords = async (error: any, csvRecords: any) => {
    for (let index = 0; index < csvRecords.length; index++) {
        const { RoleName } = csvRecords[index];
        
        console.log("------------------------------------------------------------------------------------------");
        console.log(`\n[${index + 1}] Processing role: ${RoleName}\n`);
        
        await processAWSManagedPolicyRemediation(RoleName);
        
        console.log(`\nDone processing role: ${RoleName}\n`);
        console.log("------------------------------------------------------------------------------------------");
    }
}
// TODO: Add another summary for all roles with links or put it on a csv
const main = async (csvPath: string) => {
    const headers = ["RoleName"];
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