import { ServiceLastAccessed } from "@aws-sdk/client-iam";
import { getServiceLastAccessedDetails, listServices, buildIamCsv } from "./services/accessAdvisor.js";
import { listRoles } from "./services/listRoles.js";
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

const roles = await listRoles();

roles.forEach(role => {
  if (role.RoleName != null && role.Arn != null) {
    main(role.RoleName, role.Arn);
  }
});