import { ServiceLastAccessed } from "@aws-sdk/client-iam";
import { getServiceLastAccessedDetails, listServiceNamespaces } from "./services/ServiceLastAccessedDetails.js";
// export const createPolicy = (policyName: string, policyDocument: any) => {
//   const command = new CreatePolicyCommand({
//     PolicyDocument: JSON.stringify(policyDocument),
//     PolicyName: policyName
//   });

//   return client.send(command);
// };

// export const buildPolicyDocument = (baseDocument: BaseDocument, serviceNamespace: string) =>
// {
//   switch (serviceNamespace) {
//     case "ecr":
//       baseDocument.Statement.push(Permissions.ECRFullDocument);
//       break;
//     case "kms":
//       baseDocument.Statement.push(Permissions.KMSFullDocument);
//       break;
//     case "logs":
//       baseDocument.Statement.push(Permissions.LogsFullDocument);
//       break;
//     case "secretsmanager":
//       baseDocument.Statement.push(Permissions.SecretsManagerFullDocument);
//       break;
//     case "sqs":
//       baseDocument.Statement.push(Permissions.SQSFullDocument);
//       break;
//     case "ssm":
//       baseDocument.Statement.push(Permissions.SSMFullDocument);
//       break;
//     default:
//       console.log("error");
//       break;
//     }

//     return baseDocument;
// }

// export const main = () => {
//   const headers = ["RoleName", "ServiceNamespace"];
//   const csvFilePath = path.resolve("csvs/service-namespace.csv");
//   const csvContent = fs.readFileSync(csvFilePath);

//   const csvOptions = {
//     delimiter: ",",
//     columns: headers,
//     from_line: 2
//   };

//   const processCsv = async (error: any, csvRecords: any) => {
//     const baseDocument: BaseDocument = Permissions.Root;
//     let policyDocument;

//     for (let record in csvRecords) {
//       const { ServiceNamespace } = csvRecords[record];
//       policyDocument = buildPolicyDocument(baseDocument, ServiceNamespace);
//     }

//     createPolicy("test-biffy-CodeBuild-Role-AutomationPolicy", policyDocument)
//   };

//   parse(csvContent, csvOptions, processCsv);
// }

const response = getServiceLastAccessedDetails({ 
  arn: "arn:aws:iam::539383487878:role/test-biffy-CodeBuild-Role", 
  granularity: "ACTION_LEVEL"
});

const services = (await response).ServicesLastAccessed;

listServiceNamespaces(services as ServiceLastAccessed[])
