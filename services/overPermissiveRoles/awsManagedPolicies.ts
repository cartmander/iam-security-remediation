import { getManagedPoliciesByRoleName, getPolicyVersionDocument, getPolicyVersion, createPolicyDocumentInRoleAsInline, deleteAWSManagedPolicyInRole, getRoleTags } from "../../helpers/policies.js";
import { buildRemediationCsv } from "../../helpers/misc.js";
import { OverPermissiveRolesCsv, OverPermissiveRolesMessage, PolicyType } from "../../enums/enumTypes.js";
import { parse } from "csv-parse";
import path from "path";
import fs from "fs";

const convertManagedPolicyToInline = async (roleName: string, policyArn: string, policyPlacement: number, totalPolicies: number, tag: string): Promise<any> => {
    let policyName;
    
    try {
        console.log(`\n[${policyPlacement} out of ${totalPolicies}] Converting AWS Managed Policy: ${policyArn}`);

        const policyVersion = await getPolicyVersion(policyArn);
        const policyDocument = await getPolicyVersionDocument(policyArn);
        
        policyName = policyVersion.Policy.PolicyName;

        const convertedPolicyDocument = await createPolicyDocumentInRoleAsInline(JSON.stringify(policyDocument), roleName, policyName);

        if (convertedPolicyDocument) {
            await deleteAWSManagedPolicyInRole(roleName, policyName, policyArn);
            console.log(`\n[${policyPlacement} out of ${totalPolicies}] Successfully converted AWS Managed Policy: ${policyArn}`);

            buildRemediationCsv(roleName, policyName, PolicyType.AWS_MANAGED, true, OverPermissiveRolesMessage.NO_ERROR, tag, OverPermissiveRolesCsv.AWS_MANAGED_POLICIES_CSV);
            return true;
        }

        return false;
    }

    catch (error) {
        const errorMessage = `${(error as Error).name} - ${(error as Error).message}`;
        console.error(`Unable to convert AWS managed policy ${policyArn}: ${errorMessage}`);

        buildRemediationCsv(roleName, policyName, PolicyType.AWS_MANAGED, false, errorMessage, tag, OverPermissiveRolesCsv.AWS_MANAGED_POLICIES_CSV);
    }
}

const processAWSManagedPolicyRemediation = async (roleName: string): Promise<void> => {
    try {
        let convertedPolicies: string[] = [], notConvertedPolicies: string[] = [];

        const awsManagedPolicies = await getManagedPoliciesByRoleName(roleName, PolicyType.AWS_MANAGED);
        const awsManagedPoliciesLength = awsManagedPolicies.length;
        const platformTag = await getRoleTags(roleName);

        if (awsManagedPoliciesLength != 0) {
            console.log(`AWS Managed Policies of Role ${roleName}:`, awsManagedPolicies);
            console.log(`Total AWS Managed Policies: ${awsManagedPoliciesLength}`);

            for (let index = 0; index < awsManagedPoliciesLength; index++) {
                const policyArn = awsManagedPolicies[index];
                let processedPolicies = await convertManagedPolicyToInline(roleName, policyArn, index + 1, awsManagedPoliciesLength, platformTag);

                processedPolicies ? convertedPolicies = convertedPolicies.concat(policyArn) : notConvertedPolicies = notConvertedPolicies.concat(policyArn);
            }

            console.log(`\nSummary for Role: ${roleName}`);
            console.log(`\tSuccessfully processed AWS Managed Policies [${convertedPolicies.length} out of ${awsManagedPoliciesLength}]: `, convertedPolicies);
            console.log(`\tFailed to process AWS Managed Policies [${notConvertedPolicies.length} out of ${awsManagedPoliciesLength}]: `, notConvertedPolicies);
        }

        else {
            console.log(`No AWS Managed Policies attached to Role ${roleName}`);
        }
    }

    catch (error) {
        const errorMessage = `${(error as Error).name} - ${(error as Error).message}`;
        console.error(`Error getting AWS managed policies for role: ${roleName}: ${errorMessage}`);
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
  
main("csvs/iamRoles.csv");