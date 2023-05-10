param(
    [string] $roleArn = "arn:aws:iam::539383487878:role/qa-biffy-us-east-1-taskrole",
    [string] $profile = "ubreakifix-nonprod.appadmins"
)

$GRANULARITY = "ACTION_LEVEL"

$hashtable = @{}

$jobId = aws iam generate-service-last-accessed-details `
        --arn $roleArn `
        --granularity $GRANULARITY `
        --profile $profile | ConvertFrom-Json

$getServices = aws iam get-service-last-accessed-details `
        --job-id $jobId.JobId `
        --profile $profile | ConvertFrom-Json

$services = $getServices.ServicesLastAccessed

if (![string]::IsNullOrEmpty($services) -or $null -ne $services) 
{
    foreach ($service in $services)
    {
        if ($service.TotalAuthenticatedEntities -eq 0 -and $null -eq $service.TrackedActionsLastAccessed)
        {
            $listPolicies = aws iam list-policies-granting-service-access `
                --arn $roleArn `
                --service-namespaces $service.ServiceNamespace `
                --profile $profile | ConvertFrom-Json
            
            $policies = $listPolicies.PoliciesGrantingServiceAccess[0].Policies
            
            if (![string]::IsNullOrEmpty($policies) -or $null -ne $policies)
            {
                foreach ($policy in $policies)
                {
                    $policyCsv = "..\.\csv\Policies.csv"
                    $csv = Import-Csv $policyCsv

                    $csvRow = New-Object PSObject -Property @{
                        ServiceNamespace = $service.ServiceNamespace
                        RoleArn = $roleArn
                        PolicyArn = $policy.PolicyArn
                    }

                    Export-Csv $policyCsv -InputObject $csvRow -Append -Force
                }
            }
        }
    }
}