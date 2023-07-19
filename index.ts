import { ServiceLastAccessed } from "@aws-sdk/client-iam";
import { getServiceLastAccessedDetails, listServiceNamespacesAndActions, populateIamCsv } from "./services/accessAdvisor.js";
import { processPolicyCreation } from "./services/documentBuilder.js";


const main = async () => {
  const response = getServiceLastAccessedDetails({ 
    arn: "arn:aws:iam::539383487878:role/test-biffy-CodeBuild-Role", 
    granularity: "ACTION_LEVEL"
  });
  
  const services = (await response).ServicesLastAccessed;
  
  const listOfServiceNamespacesAndActions = listServiceNamespacesAndActions(services as ServiceLastAccessed[]);
  console.log(listOfServiceNamespacesAndActions);

  populateIamCsv("test-biffy-CodeBuild-Role", listOfServiceNamespacesAndActions);
  processPolicyCreation("csvs/iam-service-namespaces-and-actions.csv");
}

main();