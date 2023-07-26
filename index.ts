import { ServiceLastAccessed } from "@aws-sdk/client-iam";
import { getServiceLastAccessedDetails, listServices, buildIamCsv } from "./services/accessAdvisor.js";
import { buildPoliciesFromIamCsv } from "./services/policyBuilder.js";

const main = async (roleName: string, arn: string) => {
  const response = getServiceLastAccessedDetails({ 
    arn: arn, 
    granularity: "ACTION_LEVEL"
  });
  
  const services = (await response).ServicesLastAccessed;
  const listOfServiceNamespacesAndActions = listServices(services as ServiceLastAccessed[]);

  buildIamCsv(roleName, listOfServiceNamespacesAndActions);
  buildPoliciesFromIamCsv(`results/${roleName}/${roleName}.csv`);
}

main("test-biffy-CodeBuild-Role", "arn:aws:iam::539383487878:role/test-biffy-CodeBuild-Role");
main("qa-biffy-us-east-1-CodeBuild-Role", "arn:aws:iam::539383487878:role/qa-biffy-us-east-1-CodeBuild-Role");