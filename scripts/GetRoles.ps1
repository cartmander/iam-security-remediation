param(
    [string] $profile = "ubreakifix-nonprod.appadmins"
)

function ThrowAnyErrors
{
    if($LASTEXITCODE)
    {
        throw
    }
}

function ValidateJobState
{
    param(
        [object] $childJob
    )

    Write-Host "##[command]=================================================="
    Write-Host "##[command]Job output for $($childJob.Name)"
    Write-Host "##[command]=================================================="

    $childJob | Receive-Job -Keep
    Write-Host "##[section]$($childJob.Name) finished executing with `"$($childJob.State)`" state"
}

function JobLogging
{
    Write-Host "##[command]Waiting for jobs to finish executing..."

    $JobTable = Get-Job | Wait-Job | Where-Object {$_.Name -like "*AutomationJob"}
    $JobTable | ForEach-Object -Process {
        $_.ChildJobs[0].Name = $_.Name.Replace("AutomationJob", "ChildJob")
    }

    $ChildJobs = Get-Job -IncludeChildJob | Where-Object {$_.Name -like "*ChildJob"}
    $ChildJobs | ForEach-Object -Process {
        ValidateJobState $_
    }

    $ChildJobs | Select-Object -Property Id, Name, State, PSBeginTime, PSEndTime | Format-Table
}

function GetRoles
{
    #Get AWS Roles
    #Star Job to run it asynchronously

    ThrowAnyErrors
    JobLogging
}