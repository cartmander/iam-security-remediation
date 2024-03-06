import { getAWSManagedPoliciesByRoleName, getPolicyVersionDocument, getPolicyVersion, createPolicyDocumentInRoleAsInline, deleteAWSManagedPolicyInRole } from "../../helpers/policies.js";
import { buildRemediationCsv } from "../../helpers/misc.js";
import { parse } from "csv-parse";
import path from "path";
import fs from "fs";

const convertManagedPolicyToInline = async (roleName: string, policyArn: string, policyPlacement: number, totalPolicies: number): Promise<any> => {
    try {
        console.log(`\n[${policyPlacement} out of ${totalPolicies}] Converting AWS Managed Policy: ${policyArn}`);

        const policyVersion = await getPolicyVersion(policyArn);
        const policyDocument = await getPolicyVersionDocument(policyArn);
        
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
                buildRemediationCsv(roleName, policy, processedPolicies, "awsManagedPolicy.csv");
            }

            console.log(`\nSummary for Role: ${roleName}`);
            console.log(`\tSuccessfully processed AWS Managed Policies [${convertedPolicies.length} out of ${awsManagedPoliciesLength}]: `, convertedPolicies);
            console.log(`\tFailed to process AWS Managed Policies [${notConvertedPolicies.length} out of ${awsManagedPoliciesLength}]: `, notConvertedPolicies);
        }

        else {
            console.log(`No AWS Managed Policies attached to Role ${roleName}`);
            buildRemediationCsv(roleName, "<No AWS Managed Policies attached>", false, "awsManagedPolicy.csv");
        }
    }

    catch (error) {
        console.error(`Error getting inline policies for role: ${roleName}: ${(error as Error).name} - ${(error as Error).message}`);
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