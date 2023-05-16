param(
    [string] $roleArn = "arn:aws:iam::539383487878:role/qa-biffy-us-east-1-taskrole",
    [string] $roleName = "qa-biffy-us-east-1-taskrole",
    [string] $account = "ubreakifix-nonprod.appadmins"
)

$GRANULARITY = "ACTION_LEVEL"

$jobId = aws iam generate-service-last-accessed-details `
    --arn $roleArn `
    --granularity $GRANULARITY `
    --profile $account | ConvertFrom-Json

$getServices = aws iam get-service-last-accessed-details `
    --job-id $jobId.JobId `
    --profile $account | ConvertFrom-Json

$services = $getServices.ServicesLastAccessed

if (![string]::IsNullOrEmpty($services) -or $null -ne $services) {
    foreach ($service in $services) {
        if ($service.TotalAuthenticatedEntities -eq 0 -and $null -eq $service.TrackedActionsLastAccessed) {
            $listPolicies = aws iam list-policies-granting-service-access `
                --arn $roleArn `
                --service-namespaces $service.ServiceNamespace `
                --profile $account | ConvertFrom-Json
            
            $policies = $listPolicies.PoliciesGrantingServiceAccess[0].Policies
            
            if (![string]::IsNullOrEmpty($policies) -or $null -ne $policies) {
                foreach ($policy in $policies) {
                    $policyCsv = "..\.\csv\Policies.csv"

                    $csvRow = New-Object PSObject -Property @{
                        RoleName                 = $roleName
                        PolicyName               = $policy.PolicyName
                        ServiceNamespaceToRemove = $service.ServiceNamespace
                    }

                    Export-Csv $policyCsv -InputObject $csvRow -Append -Force
                }
            }
        }
    }
}