# IAM Security Remediation

## Introduction

This automation remediates and resolves most audit issues related to overly-permissive roles. 

## Scope

* **Resolves concerns related to AWS managed policies** - AWS Managed policies have over permissive nature and are considered fixed and uneditable. This automation transforms AWS managed policies into Customer inline policies.
* **Resolves permissions with wildcards** - CloudGov reports issues related to IAM roles that contain policies that have over permissive nature such as containing wildcards `Example: s3:*, ec2:* etc...`. As the remediator, it is difficult to determine which specific permissions are only being used. This automation expounds the wildcard permission by explicitly defining the permissions of an AWS service found in the policy document of a given role. This automation only works with Customer managed and inline policies.

## Limitation

* **Explicitly defined permissions of services are hardcoded** - Though we're able to expound permissions with wildcard, it is only possible because we have explicitly defined the permissions of selected AWS services in this automation. Go to `helpers/serviceAction.ts`, see the list of AWS services that are being supported by this automation. If we encounter a wildcard permission that is not included in the list yet, it is not going to be processed by the automation. Contact the repo owner to include the AWS service in the list (or append the AWS service in `helpers/serviceAction.ts` and create a pull request).
* **Solely focused on Overly-permissive roles** - For now, the automation is focused on remediating audit issues related to overly-permissive roles. Future enhancements are being considered.

## How To Use

* Branch out from `main`.
* Populate the `csvs/iamRoles.csv` with roles (please see column): `RoleName`.
* Go to GitHub Actions and then select a workflow. Make sure to choose the branch that you created.
  * Deploy the workflow: `Deploy AWS Managed Policies Remediation` - this transforms detected AWS managed policies into Customer inline policies and proceeds with the deletion of the AWS managed policies.
  * Deploy the workflow: `Deploy Wildcard Permissions Remediation` - this expounds the detected wildcard permissions by explicitly defining the permissions of a service. This only works with Customer managed and inline policies.
* Results will be available to be downloaded after the workflow is finished running.


