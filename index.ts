import { ServiceLastAccessed } from "@aws-sdk/client-iam";
import { getServiceLastAccessedDetails, listServices, populateIamCsv } from "./services/accessAdvisor.js";
import { processPolicyBuilder } from "./services/policyBuilder.js";

const main = async () => {
  const response = getServiceLastAccessedDetails({ 
    Arn: "arn:aws:iam::539383487878:role/test-biffy-CodeBuild-Role", 
    Granularity: "ACTION_LEVEL"
  });
  
  const services = (await response).ServicesLastAccessed;
  
  const listOfServiceNamespacesAndActions = listServices(services as ServiceLastAccessed[]);
  console.log(listOfServiceNamespacesAndActions);

  populateIamCsv("test-biffy-CodeBuild-Role", listOfServiceNamespacesAndActions);
  processPolicyBuilder("csvs/iam-services.csv");
}

main();