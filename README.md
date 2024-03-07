# IAM Security Remediation

## Introduction
This automation remediates and resolves most audit issues related to overly-permissive roles.

## Scope
- **Resolves AWS managed role** - AWS Managed policies also has an over permissive nature and are considered fixed and uneditable. This automation transforms AWS managed policies into Customer inline policies. This allows the automation to remediate and resolve the policies once they become Customer inline policies.
- **Resolves permissions with wildcards** - CloudGov reports issues related to IAM roles that contain policies that have over permissive nature such as containing wildcards ```Example: s3:*, ec2:* ```. As the remediator, it is difficult to determine which specific actions are only being used. This automation expounds the wildcard permission by explicitly defining the permissions of a service found in the policy document of a given role. This automation only works with Customer managed and inline policies.

## Limitation
- **Determining the all the services being used in an AWS account** - Though we're able to expound permissions with wildcard, it is only possible because we have explicitly defined the permissions of most of the services in this automation. If we go to ```helpers/serviceAction.ts```, you will see the list of services that are being supported by this automation. If we encounter a wildcard permission that is not included in the list yet, it is not going to be processed by the automation. Contact the repo owner to include the service in the list (or append the service in ```helpers/serviceAction.ts``` and create a pull request).

## Future Capabilities
- **Implement a workflow** - TBA

## How To Use
- Branch out from ```main``` 
- Populate the ```csvs/iamRoles.csv``` with roles using the following fields: ```RoleName```
- ```export AWS_PROFILE=<AWS_ACCOUNT>.<ROLE> ``` - Set your AWS profile
- ```npm run aws-managed-policies``` - this transforms detected AWS managed policies into Customer inline policies and proceeds with the deletion of the AWS managed policies.
- ```npm run wildcard-permissions``` - this expounds the detected wildcard permissions by explicitly defining the permissions of a service. This only works with Customer managed and inline policies.
- Results are shown in CSV format located in ```results/overPermissiveRoles```