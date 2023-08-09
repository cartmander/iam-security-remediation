import { BasePolicy, Statement, ServiceDictionary } from "interfaces/Policy.js";
import { parse } from "csv-parse";
import path from "path";
import fs from "fs";

const generateEmptyBasePolicy = (): BasePolicy =>  {
  return {
      Version: "2012-10-17",
      Statement: []
  }
}

const generateEmptyStatement = (): Statement => {
  return {
      Effect: "Allow",
      Action: [],
      Resource: "*"
  }
}

const generateExplicitActions = (serviceName: string): string[] => {
  return [
    `${serviceName}:Create*`,
    `${serviceName}:Read*`,
    `${serviceName}:Update*`,
    `${serviceName}:Delete*`,
    `${serviceName}:Get*`,
    `${serviceName}:List*`,
    `${serviceName}:Describe*`,
    `${serviceName}:Untag*`,
    `${serviceName}:Tag*`
  ]
}

const buildInlinePolicies = (serviceDictionary: ServiceDictionary, roleName: string) => {
  for (let key in serviceDictionary) {
    let value = serviceDictionary[key];

    let basePolicy = generateEmptyBasePolicy();
    let statement = generateEmptyStatement();

    const policyName = `${roleName}/${key}-inline-policy.json`;

    statement.Action = statement.Action.concat(value);
    basePolicy.Statement.push(statement);

    try {
      fs.writeFileSync(`results/${policyName}`, JSON.stringify(basePolicy), {
        flag: 'w'
      });
    }
    
    catch (error: any) {
      console.log(error.message);
      return;
    }
    
    console.log(`Created ${policyName} for ${roleName}.`);
  }
}

const populateServiceDictionary = (serviceDictionary: ServiceDictionary, serviceNamespace: string, serviceOrAction: string) => {
  if (serviceDictionary.hasOwnProperty(serviceNamespace)) {
    serviceDictionary[serviceNamespace].push(serviceOrAction);
  }

  else {
    serviceDictionary[serviceNamespace] = [serviceOrAction];
  }
}

const processBuildingInlinePolicy = (error: any, csvRecords: any) => {
  let serviceDictionary: ServiceDictionary = {};
  let roleName = null;

  for (let record in csvRecords) {
    const { RoleName, Service } = csvRecords[record];
    const service = Service as string;
    
    if (roleName == null) {
      roleName = RoleName;
    }

    if (service.includes(":")) {
      const serviceNamespace = service.split(":")[0];
      populateServiceDictionary(serviceDictionary, serviceNamespace, service);
    }
    
    else {
      const actions = generateExplicitActions(service);

      actions.forEach((action) => {
        populateServiceDictionary(serviceDictionary, service, action);
      });
    }
  }

  try {
    buildInlinePolicies(serviceDictionary, roleName);
  }

  catch (error: any) {
    console.log(`Error building inline policies for role: ${roleName}`);
    console.log(error.message);
    return;
  }
}

export const buildPoliciesFromIamCsv = (csvPath: string) => {
  const headers = ["RoleName", "Service"];
  const csvFilePath = path.resolve(csvPath);
  const csvContent = fs.readFileSync(csvFilePath);

  const csvOptions = {
    delimiter: ",",
    columns: headers,
    from_line: 2
  };

  parse(csvContent, csvOptions, processBuildingInlinePolicy);
}