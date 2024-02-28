import { GetPolicyCommand, GetPolicyVersionCommand, GetRolePolicyCommand, Policy } from "@aws-sdk/client-iam";
import { client } from "../../client.js";
import { parse } from "csv-parse";
import path from "path";
import fs from "fs";
import { BasePolicy } from "interfaces/Policy.js";

const getPolicyDocument = async (roleName: string, policyName: string): Promise<any> => {
    try {
        const getRolePolicyCommandInput = {
            RoleName: roleName,
            PolicyName: policyName
        }

        const command = new GetRolePolicyCommand(getRolePolicyCommandInput);
        const response = await client.send(command);

        const policyDocument = decodeURIComponent(response.PolicyDocument!);

        return policyDocument;
    }

    catch (error) {
        return;
    }
}

const explicitlyDefineWildcardPermissions = async (policyDocument: any): Promise<any> => {
    try {
        if (policyDocument) {
            for (const statement of policyDocument.Statement || []) {
                let x = 0;
                for (let action of statement.Action) {
                    
                    if (action.includes(":*")) {
                        statement.Action[x] = "GG";
                    }
                    x++;
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

        const convertedDocument = await explicitlyDefineWildcardPermissions(JSON.parse(policyDocument));

        console.log(JSON.stringify(convertedDocument));
    }

    catch (error) {
        console.error("Error: ", error);
    }
}

convertWildcardPermissionsToSpecificActions("biffy-test-ecs-task-Role", "test_s3_all");