import fs from "fs";

export const buildRemediationCsv = (roleName: string, policy: string, status: boolean, csvFileName: string) => {
    const roleDirectory = `results/overPermissiveRoles`;
    const roleCsv = `${roleDirectory}/${csvFileName}`;
    const url = `https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/roles/details/${roleName}?section=permissions`;
  
    try {
        if (!fs.existsSync(roleCsv)) {
            fs.mkdirSync(roleDirectory,  { recursive: true });
            fs.writeFileSync(roleCsv, "RoleName,Policy,WasProcessed,URL\n");
        }
        else {
            fs.appendFileSync(roleCsv, `${roleName},${policy},${status},${url}\n`);
        }
    }
  
    catch (error) {
      console.log(`Error building IAM csv for role: ${roleName}: ${(error as Error).name} - ${(error as Error).message}`);
      return;
    }
}