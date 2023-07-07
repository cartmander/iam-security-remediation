param(
    [string] $roleArn = "arn:aws:iam::539383487878:role/test-biffy-CodeBuild-Role",
    [string] $roleName = "test-biffy-CodeBuild-Role"
)

function ProcessData
{
    param(
        [string] $serviceNamespace
    )

    try
    {
        $record = "{0},{1}" -f $roleName, $serviceNamespace
        $record | Add-Content -Path "..\.\csvs\service-namespace.csv"
    }

    catch
    {
        Write-Host "##[error]Unable to update csv file"
        exit 1
    }
}

function ListServiceNamespaces {
    param(
        [object] $serviceLastAccessedDetails
    )

    $services = $serviceLastAccessedDetails.ServicesLastAccessed

    $serviceNamespaceList = foreach ($service in $services) {
        if ($null -ne $service.LastAuthenticated -and !$service.TrackedActionsLastAccessed) {
            ProcessData $service.ServiceNamespace
        }

        if ($service.TrackedActionsLastAccessed)
        {
            
        }
    }

    return $serviceNamespaceList
}

function ListServicesLastAccessed {
    $jobId = aws iam generate-service-last-accessed-details --arn $roleArn --granularity ACTION_LEVEL | ConvertFrom-Json
    $serviceLastAccessedDetails = aws iam get-service-last-accessed-details --job-id $jobId.JobId | ConvertFrom-Json

    while ($serviceLastAccessedDetails.JobStatus -eq "IN_PROGRESS") {
        Write-Host "Waiting for fetching data job to complete..." -ForegroundColor Red
        $serviceLastAccessedDetails = aws iam get-service-last-accessed-details --job-id $jobId.JobId | ConvertFrom-Json
        Start-Sleep -Seconds 1
    }

    return $serviceLastAccessedDetails
}

try {
    $servicesLastAccessed = ListServicesLastAccessed
    ListServiceNamespaces $servicesLastAccessed
}

catch {}