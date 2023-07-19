import { BaseIAMDocument, IAMStatement } from "interfaces/PolicyDocument";

export const rootDocument: BaseIAMDocument = {
    "Version": "2012-10-17",
    "Statement": []
  }
  
export const customStatements: IAMStatement = {
    "Effect": "Allow",
    "Action": [],
    "Resource": "*"
}

export const buildExplicitActions = (serviceName: string) => {
    const actions: IAMStatement = {
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