import { GetPolicyCommand, GetPolicyVersionCommand, GetRolePolicyCommand, Policy } from "@aws-sdk/client-iam";
import { generatePermissionsForService } from "../../helpers/serviceActions.js";
import { client } from "../client.js";
import { parse } from "csv-parse";
import path from "path";
import fs from "fs";
import { getInlinePoliciesByRoleName } from "../../helpers/policies.js";

interface BasePolicy {
    Version: string;
    Statement: Statement[];
}

interface Statement {
    Effect: string;
    Action: string[];
    Resource: string;
}

const explicitlyDefineWildcardPermissions = async (policyDocument: BasePolicy, policyName: string): Promise<BasePolicy> => {
    try {
        const statements: Statement[] = policyDocument.Statement;

        statements.forEach((statement) => {
            const actions: string[] = statement.Action;
            const wildcardExists: boolean = actions.filter(action => action.includes(":*")).length > 0;

            if (wildcardExists) {
                actions.forEach((action, index) => {
                    if (action.includes(":*")) {
                        const service: string = action.split(":")[0];
                        const servicePermissions: string[] | undefined = generatePermissionsForService(service);
    
                        servicePermissions ? actions.splice(index, 1, ...servicePermissions) : console.error(`Unsupported service: ${service}`);
                    }
                });
            }
        });
        
        return policyDocument;
    }

    catch (error) {
        throw new Error(`Unable to explicitly define wildcard permissions of this Policy Name: ${policyName}`);
    }    
}

const getPolicyDocument = async (roleName: string, policyName: string): Promise<BasePolicy> => {
    try {
        const getRolePolicyCommandInput = {
            RoleName: roleName,
            PolicyName: policyName
        }

        const command = new GetRolePolicyCommand(getRolePolicyCommandInput);
        const response = await client.send(command);

        const policyDocument = JSON.parse(decodeURIComponent(response.PolicyDocument!));

        return policyDocument;
    }

    catch (error) {
        throw new Error(`Unable to get Policy Document of this Policy Name: ${policyName}`);
    }
}

const convertWildcardPermissionsToSpecificActions = async (roleName: string, policyName: string): Promise<any> => {
    try {
        const policyDocument = await getPolicyDocument(roleName, policyName);

        if (policyDocument) {
            const convertedDocument = await explicitlyDefineWildcardPermissions(policyDocument, policyName);
            console.log(`${policyName} =========== ${JSON.stringify(convertedDocument)}`);
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
      const { RoleName, Arn } = csvRecords[record];
      await processWildcardPermissionsRemediation(RoleName);
    }
}

const getRolesFromIamCsv = async (csvPath: string) => {
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
  
getRolesFromIamCsv("csvs/iam_roles.csv");