import { BaseDocument, Statement } from "interfaces/PolicyDocument";

const buildExplicitActions = (serviceName: string) => {
    const actions: Statement = {
        "Effect": "Allow",
        "Action": [
            `${serviceName}:Create*`,
            `${serviceName}:Read*`,
            `${serviceName}:Update*`,
            `${serviceName}:Delete*`,
            `${serviceName}:Get*`,
            `${serviceName}:List*`,
            `${serviceName}:Describe*`,
            `${serviceName}:Untag*`,
            `${serviceName}:Tag*`
        ],
        "Resource": "*"
    }

    return actions;
}

export const generateBaseDocument = (): BaseDocument =>  {
    return {
        Version: "2012-10-17",
        Statement: []
    }
  }
  
export const generateBaseStatement = (): Statement => {
    return {
        Effect: "Allow",
        Action: [],
        Resource: "*"
    }
}

export const buildExplicitActionsStatement = (baseDocument: BaseDocument, serviceNamespace: string) => {
    const explicitActionStatement = buildExplicitActions(serviceNamespace);
    baseDocument.Statement.push(explicitActionStatement);
  
    return baseDocument;
}