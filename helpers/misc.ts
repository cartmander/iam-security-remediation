import fs from "fs";

export const buildRemediationCsv = (roleName: string, policy: string, policyType: string, wasProcessed: boolean, error: string, tag: string, csvFileName: string) => {
    const roleDirectory = `results/overPermissiveRoles`;
    const roleCsv = `${roleDirectory}/${csvFileName}`;
    const url = `https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/roles/details/${roleName}?section=permissions`;
  
    try {
        if (!fs.existsSync(roleCsv)) {
            fs.mkdirSync(roleDirectory,  { recursive: true });
            fs.writeFileSync(roleCsv, "RoleName,Policy,PolicyType,WasProcessed,Error,Tag,URL\n");
        }

        fs.appendFileSync(roleCsv, `${roleName},${policy},${policyType},${wasProcessed},${error},${tag},${url}\n`);
    }
  
    catch (error) {
        const errorMessage = `${(error as Error).name} - ${(error as Error).message}`;
        console.log(`Error building IAM csv for role: ${roleName}: ${errorMessage}`);
        return;
    }
}