import { generatePermissionsForService } from "../../helpers/serviceActions.js";
import { getInlinePoliciesByRoleName, getRolePolicyDocument } from "../../helpers/policies.js";
import { parse } from "csv-parse";
import path from "path";
import fs from "fs";

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
        throw new Error(`Unable to explicitly define wildcard permissions of this Policy Name: ${policyName}`);
    }  
}

const convertWildcardPermissionsToSpecificActions = async (roleName: string, policyName: string): Promise<any> => {
    try {
        const policyDocument = await getRolePolicyDocument(roleName, policyName);

        if (policyDocument) {
            const convertedDocument = await explicitlyDefineWildcardPermissions(policyDocument, policyName);
            const stringifyDocument = JSON.stringify(convertedDocument);
            const documentLength = stringifyDocument.length;

            console.log(`---------------------------------------------------------------------------------`);
            console.log(`${policyName}:\n${stringifyDocument}`);
            console.log(documentLength);
            console.log(`---------------------------------------------------------------------------------`);

        }
    }

    catch (error) {
        console.error("Error: ", error);
    }
}

const processWildcardPermissionsRemediation = async (roleName: string): Promise<void> => {
    try {
        const inlinePolicies = await getInlinePoliciesByRoleName(roleName);

        console.log(`---------------------------------------------------------------------------------`);
        console.log(`Processing role: ${roleName}`);

        if (inlinePolicies.length != 0 ) {
            console.log(`Inline policies attached to Role ${roleName}`, inlinePolicies);
            inlinePolicies.forEach((policyName: string) =>  (convertWildcardPermissionsToSpecificActions(roleName, policyName)));
        }

        else {
            console.log(`No inline policies attached to Role ${roleName}`);
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
      const { RoleName } = csvRecords[record];
      await processWildcardPermissionsRemediation(RoleName);
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