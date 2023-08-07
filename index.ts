import { ServiceLastAccessed } from "@aws-sdk/client-iam";
import { getServiceLastAccessedDetails, listServices, buildIamCsv } from "./services/accessAdvisor.js";
import { buildPoliciesFromIamCsv } from "./services/policyBuilder.js";
import { parse } from "csv-parse";
import path from "path";
import fs from "fs";

const main = async (roleName: string, arn: string) => {
  const response = getServiceLastAccessedDetails({ 
    arn: arn, 
    granularity: "ACTION_LEVEL"
  });

  setTimeout(async () => {
    const services = (await response).ServicesLastAccessed;
    const listOfServiceNamespacesAndActions = listServices(services as ServiceLastAccessed[]);

    buildIamCsv(roleName, listOfServiceNamespacesAndActions);
    buildPoliciesFromIamCsv(`results/${roleName}/${roleName}.csv`);
}, 10000);
}

const processRoleRemediation = (error: any, csvRecords: any) => {
  for (let record in csvRecords) {
    const { RoleName, Arn } = csvRecords[record];
    main(RoleName, Arn);
  }
}

const getRolesFromIamCsv = (csvPath: string) => {
  const headers = ["RoleName", "Arn"];
  const csvFilePath = path.resolve(csvPath);
  const csvContent = fs.readFileSync(csvFilePath);

  const csvOptions = {
    delimiter: ",",
    columns: headers,
    from_line: 2
  };

  parse(csvContent, csvOptions, processRoleRemediation);
}

getRolesFromIamCsv("csvs/iam_roles.csv");
