import { GetPolicyCommand, GetPolicyVersionCommand, GetRolePolicyCommand, Policy } from "@aws-sdk/client-iam";
import { generatePermissionsForService } from "../../helpers/serviceActions.js";
import { client } from "../../client.js";
import { parse } from "csv-parse";
import path from "path";
import fs from "fs";
import { BasePolicy, Statement } from "interfaces/Policy.js";

const getPolicyDocument = async (roleName: string, policyName: string): Promise<any> => {
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
        return;
    }
}

const explicitlyDefineWildcardPermissions = async (policyDocument: BasePolicy): Promise<any> => {
    try {
        const wildcard: string = ":*";
        const actions: string[] = policyDocument.Statement[0].Action;
        const wildcardExists: boolean = actions.filter(action => action.includes(wildcard)).length > 0;
        
        if (wildcardExists) {
            for (let i = 0; i < actions.length; i++) {
                if (actions[i].includes(":*")) {
                    const service = actions[i].split(":")[0];
                    const servicePermissions = generatePermissionsForService(service);

                    actions.splice(i, 1, ...servicePermissions);
                }
            }
        }
        
        return policyDocument;
    }

    catch (error) {

    }    
}

const convertWildcardPermissionsToSpecificActions = async (roleName: string, policyName: string): Promise<any> => {
    try {
        const policyDocument = await getPolicyDocument(roleName, policyName);

        if (policyDocument) {
            const convertedDocument = await explicitlyDefineWildcardPermissions(policyDocument);
            console.log(JSON.stringify(convertedDocument));
        }
    }

    catch (error) {
        console.error("Error: ", error);
    }
}

convertWildcardPermissionsToSpecificActions("biffy-test-ecs-task-Role", "test_s3_all");