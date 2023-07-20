import { generateBaseDocument, generateBaseStatement, buildExplicitActionsStatement } from "./documentBuilder.js";
import { parse } from "csv-parse";
import path from "path";
import fs from "fs";

const processIAMCsv = async (error: any, csvRecords: any) => {
  for (let record in csvRecords) {
    const { ServiceNamespacesAndActions } = csvRecords[record];
    const serviceNamespaceOrAction = ServiceNamespacesAndActions as string;

    let servicePolicyDocument = generateBaseDocument();
    let statement = generateBaseStatement();

    if(!serviceNamespaceOrAction.includes(":")) {
      servicePolicyDocument = buildExplicitActionsStatement(servicePolicyDocument, serviceNamespaceOrAction);
    }
    
    else {
      //customStatements.Action.push(serviceNamespaceOrAction);
    }

    console.log(JSON.stringify(servicePolicyDocument));
  }
  //console.log(JSON.stringify(policyDocument));
}

export const processPolicyBuilder = async (csvPath: string) => {
  const headers = ["RoleName", "ServiceNamespacesAndActions"];
  const csvFilePath = path.resolve(csvPath);
  const csvContent = fs.readFileSync(csvFilePath);

  const csvOptions = {
    delimiter: ",",
    columns: headers,
    from_line: 2
  };

  await parse(csvContent, csvOptions, processIAMCsv);
}