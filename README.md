# AWS IAM Least Privilege Automation

## Introduction
This automation will make use of AWS IAM Access Advisor to determine which services are only being used in a role. The output of this automation is to produce inline policies for roles specified in the csv file. 

## Scope
- **Resolving the Overly-permissive issue** - CloudGov produces audit issues that include IAM roles in an AWS account that are overly permissive. Since this automation makes use of AWS IAM Access Advisor, only services that are within the reported service activity (400 days) will be included in the inline policies.
- **Service-segregated inline policies** - It is also Asurion's best practice that we move away from using AWS Managed Policies because of its overly permissive nature. The automation produces only inline policies and are segregated based on its service type.

## Limitation
- **Determining the exact IAM actions in a service that are being used** - Though we're able to remove services that are not being used in an IAM role, it's still a challenge that we do not have a way yet to determine which specific IAM actions are being used in a role. For now, Access Advisor only reports activity for services and EC2, IAM, Lambda, and S3 management actions. For the other services, as a work around, the automation expounds the star wildcard (*) into common action verbs to avoid being tagged as overly-permissive. ```Example: Create*, Read*, Update*, Delete*, etc...``` 
- **Manual Intervention ahead** - The automation only produces results as files and it doesn't call another set of AWS APIs to directly update the roles in AWS Console. A use case for this is we are maintaining repositories that deploys IAM roles in ACDK. We can just use the produced inline policies to create a pull request on repositories where the IAM roles are residing.

## Future Capabilities
- **Implement a scheduled run** - Continuously run a GitHub workflow to reduce manual intervention.
- **Use CloudTrail logs to track back permitted actions** - In Asurion RepoMan, the CloudGov team collects CloudTrail logs, from which they can trace back the actual uses of the permitted actions in the listed policies and by what principals such as IAM Users and Roles. With that, we can take another step to suggest for the removal of the permitted actions not used.

## How To Use
- Branch out from ```main``` 
- Populate the ```csvs/iam_roles.csv``` with roles using the following fields: ```RoleName, Arn```
- Go to GitHub Action, then select **Generate Inline Policies for Roles** workflow.
- Select an **AWS Region** and an **IAM Role**. An **IAM Role** should have the right access to read the list of roles specified in the csv file.
- Wait for it the workflow to be completed.
- Look into the results containing the roles' inline policies.