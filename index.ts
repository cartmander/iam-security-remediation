import { ServiceLastAccessed } from "@aws-sdk/client-iam";
import { getServiceLastAccessedDetails, listServiceNamespacesAndActions, populateIAMCsv } from "./services/accessAdvisor.js";
import { processPolicyBuilder } from "./services/policyBuilder.js";

const main = async () => {
  const response = getServiceLastAccessedDetails({ 
    arn: "arn:aws:iam::539383487878:role/test-biffy-CodeBuild-Role", 
    granularity: "ACTION_LEVEL"
  });
  
  const services = (await response).ServicesLastAccessed;
  
  const listOfServiceNamespacesAndActions = listServiceNamespacesAndActions(services as ServiceLastAccessed[]);
  console.log(listOfServiceNamespacesAndActions);

  populateIAMCsv("test-biffy-CodeBuild-Role", listOfServiceNamespacesAndActions);
  processPolicyBuilder("csvs/iam-service-namespaces-and-actions.csv");
}

main();