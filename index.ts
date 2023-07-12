import { ServiceLastAccessed } from "@aws-sdk/client-iam";
import { getServiceLastAccessedDetails, listServiceNamespacesAndActions } from "./services/eiamAccessAdvisor.js";

const response = getServiceLastAccessedDetails({ 
  arn: "arn:aws:iam::539383487878:role/test-biffy-CodeBuild-Role", 
  granularity: "ACTION_LEVEL"
});

const services = (await response).ServicesLastAccessed;

const listOfServiceNamespacesAndActions = listServiceNamespacesAndActions(services as ServiceLastAccessed[]);
console.log(listOfServiceNamespacesAndActions);
