import { 
    DetachRolePolicyCommand, 
    GetPolicyCommand, 
    GetPolicyCommandOutput, 
    GetPolicyVersionCommand,
    PutRolePolicyCommand, 
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
        const response = await client.send(command);
    }

    catch (error) {
        console.error(`Unable to delete policy ${policyName} as AWS managed: ${(error as Error).name} - ${(error as Error).message}`);
    }
}

const convertManagedPolicyToInline = async (roleName: string, policyArn: string, policyPlacement: number, totalPolicies: number): Promise<any> => {
    try {

        let convertedPoliciesList: string[] = [];
        let notConvertedPoliciesList: string[] = [];

        console.log(`\n[${policyPlacement} out of ${totalPolicies}] Converting AWS managed policy: ${policyArn}`);

        const policyVersion = await getPolicyVersion(policyArn);

        const policyDefaultVersionId = policyVersion.Policy?.DefaultVersionId || "";
        const policyName = policyVersion.Policy?.PolicyName || "";

        const policyDocument = await getPolicyDocument(policyDefaultVersionId, policyArn);
        const convertedPolicyDocument = await createPolicyDocumentInRoleAsInline(policyDocument, roleName, policyName);

        if (convertedPolicyDocument) {
            await deleteAWSManagedPolicyInRole(roleName, policyName, policyArn);
            convertedPoliciesList = convertedPoliciesList.concat(policyName);
        }

        else {
            
            notConvertedPoliciesList = notConvertedPoliciesList.concat(policyName);
        }

        return {
            ConvertedPolicies: convertedPoliciesList,
            NotConvertedPolicies: notConvertedPoliciesList
        }
    }

    catch (error) {
        console.error("Error: ", error);
    }
}

const processAWSManagedPolicyRemediation = async (roleName: string): Promise<void> => {
    try {
        const awsManagedPolicies = await getAWSManagedPoliciesByRoleName(roleName);
        const awsManagedPoliciesLength = awsManagedPolicies.length;

        if (awsManagedPoliciesLength != 0 ) {
            console.log(`AWS Managed Policies of Role ${roleName}:`, awsManagedPolicies);
            console.log(`Total AWS Managed Policies: ${awsManagedPoliciesLength}`);
            awsManagedPolicies.forEach(async (policy, index) => {
                const processedPolicies = await convertManagedPolicyToInline(roleName, policy!, index+1, awsManagedPoliciesLength);
                const convertedPolicies = processedPolicies.ConvertedPolicies;
                const notConvertedPolicies = processedPolicies.NotConvertedPolicies;
                const totalConvertedPolicies = convertedPolicies.length;
                const totalNotConvertedPolicies = notConvertedPolicies.length;

                console.log(`Summary for Role: ${roleName}`);
                console.log(`\tSuccessfully processed AWS Managed Policies [${totalConvertedPolicies} out of ${awsManagedPoliciesLength}]: ${JSON.stringify(convertedPolicies)}`);
                console.log(`\tUnsuccessfully processed AWS Managed Policies [${totalNotConvertedPolicies} out of ${awsManagedPoliciesLength}]: ${JSON.stringify(notConvertedPolicies)}`);
            });
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
      console.log(`---------------------------------------------------------------------------------`);
      console.log(`[${index+1}] Processing role: ${RoleName}`);

      await processAWSManagedPolicyRemediation(RoleName);
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