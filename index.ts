import { IAMClient, paginateListPolicies } from "@aws-sdk/client-iam";

const client = new IAMClient({
  region: "us-east-1"
});

export const listLocalPolicies = async () => {
  const paginator = paginateListPolicies(
    { client, pageSize: 10 },
    // List only customer managed policies.
    { Scope: "Local" }
  );

  console.log("IAM policies defined in your account:");
  let policyCount = 0;
  for await (const page of paginator) {
    if (page.Policies) {
      page.Policies.forEach((p) => {
        console.log(`${p.PolicyName}`);
        policyCount++;
      });
    }
  }
  console.log(`Found ${policyCount} policies.`);
  console.log(JSON.stringify(paginator))
};

await listLocalPolicies()