import { getInlinePoliciesByRoleName, getRolePolicyDocument, createPolicyDocumentInRoleAsInline, getManagedPoliciesByRoleName, getPolicyVersion, getPolicyVersionDocument, createPolicyVersionInRoleAsCustomerManaged } from "../../helpers/policies.js";
import { generatePermissionsForService } from "../../helpers/serviceActions.js";
import { buildRemediationCsv } from "../../helpers/misc.js";
import { ManagedPolicyType } from "../../enums/enumTypes.js";
import { parse } from "csv-parse";
import path from "path";
import fs, { stat } from "fs";

interface BasePolicy {
    Version: string;
    Statement: Statement[];
}

interface Statement {
    Effect: string;
    Action: string[] | string;
    Resource: string;
}

const explicitlyDefineWildcardPermissions = async (policyDocument: BasePolicy, policyName: string): Promise<any> => {
    try {
        const statements: Statement[] = policyDocument.Statement;

        statements.forEach(statement => {
            let actions: string[] | string = statement.Action;
            let explicitlyDefinedActions: string[] = [];

            if (Array.isArray(actions)) {
                const wildcardExists: boolean = actions.some(action => action.includes(":*"));
    
                if (wildcardExists) {
                    actions.forEach(action => {
                        if (action.includes(":*")) {
                            const service: string = action.split(":")[0];
                            const servicePermissions: any = generatePermissionsForService(service);
                            servicePermissions ? explicitlyDefinedActions = explicitlyDefinedActions.concat(servicePermissions) : console.error(`Unsupported service: ${service}`);
                        }
    
                        else {
                            explicitlyDefinedActions = explicitlyDefinedActions.concat(action);
                        }
                    });
    
                    statement.Action = explicitlyDefinedActions;
                }
            }

            else {
                const wildcardExists: boolean = actions.includes(":*");

                if (wildcardExists) {
                    const service: string = actions.split(":")[0];
                    const servicePermissions: any = generatePermissionsForService(service);
                    servicePermissions ? explicitlyDefinedActions = explicitlyDefinedActions.concat(servicePermissions) : console.error(`Unsupported service: ${service}`);
                }

                else {
                    explicitlyDefinedActions = explicitlyDefinedActions.concat(actions);
                }

                statement.Action = explicitlyDefinedActions;
            }
        });
        
        return policyDocument;
    }

    catch (error) {
        console.error(`Unable to explicitly define wildcard permissions of this policy name ${policyName}: ${(error as Error).name} - ${(error as Error).message}`);
    }  
}

const convertInlinePermissionsToSpecificActions = async (roleName: string, policyName: string, policyPlacement: number, totalPolicies: number): Promise<any> => {
    try {
        console.log(`\n[${policyPlacement} out of ${totalPolicies}] Converting Inline Policy: ${policyName}`);

        const policyDocument = await getRolePolicyDocument(roleName, policyName);
        const explicitlyDefinedDocument = await explicitlyDefineWildcardPermissions(policyDocument, policyName);
        const convertedPolicyDocument = await createPolicyDocumentInRoleAsInline(JSON.stringify(explicitlyDefinedDocument), roleName, policyName);

        if (convertedPolicyDocument) {
            console.log(`\n[${policyPlacement} out of ${totalPolicies}] Successfully converted Inline Policy: ${policyName}`);

            return true;
        }

        return false;
    }

    catch (error) {
        console.error("Error: ", error);
    }
}

const convertCustomerManagedPermissionsToSpecificActions = async (roleName: string, policyArn: string, policyPlacement: number, totalPolicies: number): Promise<any> => {
    try {
        console.log(`\n[${policyPlacement} out of ${totalPolicies}] Converting Customer Managed Policy: ${policyArn}`);

        const policyVersion = await getPolicyVersion(policyArn);
        const policyDocument = await getPolicyVersionDocument(policyArn);
        
        const policyName = policyVersion.Policy.PolicyName;
        const explicitlyDefinedDocument = await explicitlyDefineWildcardPermissions(policyDocument, policyName);
        const convertedPolicyDocument = await createPolicyVersionInRoleAsCustomerManaged(JSON.stringify(explicitlyDefinedDocument), policyArn, policyName);
        
        if (convertedPolicyDocument) {
            console.log(`\n[${policyPlacement} out of ${totalPolicies}] Successfully converted Customer Managed Policy: ${policyName}`);

            return true;
        }

        return false;
    }

    catch (error) {
        console.error("Error: ", error);
    }
}

const processCustomerManagedPermissionsRemediation = async (roleName: string): Promise<void> => {
    try {
        let convertedPolicies: string[] = [], notConvertedPolicies: string[] = [];

        const customerManagedPolicies = await getManagedPoliciesByRoleName(roleName, ManagedPolicyType.CUSTOMER_MANAGED);
        const customerManagedPoliciesLength = customerManagedPolicies.length;

        if (customerManagedPolicies.length != 0) {
            console.log(`Customer Managed Policies of Role ${roleName}:`, customerManagedPolicies);
            console.log(`Total Customer Managed Policies: ${customerManagedPoliciesLength}`);

            for (let index = 0; index < customerManagedPoliciesLength; index++) {
                const policy = customerManagedPolicies[index];
                let processedPolicies = await convertCustomerManagedPermissionsToSpecificActions(roleName, policy, index + 1, customerManagedPoliciesLength);

                processedPolicies ? convertedPolicies = convertedPolicies.concat(policy) : notConvertedPolicies = notConvertedPolicies.concat(policy);
                buildRemediationCsv(roleName, policy, processedPolicies, "wildcardPermissions.csv");
            }

            console.log(`\nSummary for Role: ${roleName}`);
            console.log(`\tSuccessfully processed Customer Managed Policies [${convertedPolicies.length} out of ${customerManagedPoliciesLength}]: `, convertedPolicies);
            console.log(`\tFailed to process Customer Managed Policies [${notConvertedPolicies.length} out of ${customerManagedPoliciesLength}]: `, notConvertedPolicies);
        }

        else {
            console.log(`No Customer Managed Policies attached to Role ${roleName}`);
            buildRemediationCsv(roleName, "<No Customer Managed Policies attached>", false, "wildcardPermissions.csv");
        }
    }

    catch (error) {
        console.error(`Error getting customer managed policies for role: ${roleName}: ${(error as Error).name} - ${(error as Error).message}`);
    }
}

const processInlinePermissionsRemediation = async (roleName: string): Promise<void> => {
    try {
        let convertedPolicies: string[] = [], notConvertedPolicies: string[] = [];

        const inlinePolicies = await getInlinePoliciesByRoleName(roleName);
        const inlinePoliciesLength = inlinePolicies.length;

        if (inlinePolicies.length != 0) {
            console.log(`Inline Policies of Role ${roleName}:`, inlinePolicies);
            console.log(`Total Inline Policies: ${inlinePoliciesLength}`);

            for (let index = 0; index < inlinePoliciesLength; index++) {
                const policy = inlinePolicies[index];
                let processedPolicies = await convertInlinePermissionsToSpecificActions(roleName, policy, index + 1, inlinePoliciesLength);

                processedPolicies ? convertedPolicies = convertedPolicies.concat(policy) : notConvertedPolicies = notConvertedPolicies.concat(policy);
                buildRemediationCsv(roleName, policy, processedPolicies, "wildcardPermissions.csv");
            }

            console.log(`\nSummary for Role: ${roleName}`);
            console.log(`\tSuccessfully processed Inline Policies [${convertedPolicies.length} out of ${inlinePoliciesLength}]: `, convertedPolicies);
            console.log(`\tFailed to process Inline Policies [${notConvertedPolicies.length} out of ${inlinePoliciesLength}]: `, notConvertedPolicies);
        }

        else {
            console.log(`No Inline Policies attached to Role ${roleName}`);
            buildRemediationCsv(roleName, "<No Inline Policies attached>", false, "wildcardPermissions.csv");
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
        
        await processInlinePermissionsRemediation(RoleName);

        console.log("\n");

        await processCustomerManagedPermissionsRemediation(RoleName);
        
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