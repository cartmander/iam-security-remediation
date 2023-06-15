param(
    [string] $account = "ubreakifix-nonprod.appadmins",
    [string] $roleArn = "arn:aws:iam::539383487878:role/qa-biffy-us-east-1-taskrole",
    [string] $roleName = "qa-biffy-us-east-1-taskrole"
)

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

function ListServiceNamespaces {
    param(
        [object] $serviceLastAccessedDetails
    )

    $services = $serviceLastAccessedDetails.ServicesLastAccessed

    $serviceNamespaceList = foreach ($service in $services) {
        if ($null -eq $service.LastAuthenticated) {
            $($service.ServiceNamespace)
        }
    }

    if ($null -ne $serviceNamespaceList) {
        if (($serviceNamespaceList.GetType()).basetype.name -ne "Object") {
            foreach ($serviceNamespace in $serviceNamespaceList) {
                $serviceNamespaceList.SetValue("$($serviceNamespace):", $serviceNamespaceList.IndexOf($serviceNamespace))
            }
        }
        
        else {
            $serviceNamespaceList += ':'
        }
    }

    return $serviceNamespaceList
}


try {

    $env:AWS_PROFILE = $account
    $statementlist = @()


    $serviceLastAccessedDetails = ListServicesLastAccessed
    $serviceNamespaceList = ListServiceNamespaces $serviceLastAccessedDetails

    $managedPolicies = aws iam list-attached-role-policies --role-name $roleName | ConvertFrom-Json

    foreach ($policies in $managedPolicies.AttachedPolicies) {

        if ($policies.PolicyArn -notmatch "539383487878") {
            Write-Host "AWS MANAGED SO SKIPPED"
            continue
        }
            
        $policy = aws iam get-policy --policy-arn $policies.PolicyArn | ConvertFrom-Json
        $policyVersion = aws iam get-policy-version --policy-arn $policy.Policy.Arn --version-id $policy.Policy.DefaultVersionId | ConvertFrom-Json

        $documentStatement = $policyVersion.PolicyVersion.Document.Statement

        foreach ($statement in $documentStatement) {
            $action = $statement.Action

            $newobject = New-Object -TypeName PSObject
            $listofaction = "T"
            $countset = 0 
                
            if ($null -ne $serviceNamespaceList) {

                if ($actions.Action | Select-String -List $serviceNamespaceList) {
                        
                    if (($actions.Action.GetType()).basetype.name -eq "Array") {
                        $listofaction = [System.Collections.ArrayList]$action
                        foreach ($var in $action) {
                        
                            if ($var | Select-String -List $serviceNamespaceList) {
                                $listofaction.RemoveAt($listofaction.IndexOf($var))
                            }
                        }
                    }

                    else {
                        $listofaction = $null
                    }

                    $newobject | Add-Member -MemberType NoteProperty -Name "Action" -Value $listofaction
                    foreach ($name in $statement.PSObject.Properties ) {
                        if ($name.name -notmatch "action" -and $name.name -notmatch "Sid" ) {
                            $newobject | Add-Member -MemberType NoteProperty -Name $name.name -Value $name.value
                        }
                    }
                }

                else {
                    foreach ($name in $statement.PSObject.Properties ) {                                
                        if ($name.name -notmatch "Sid" ) {
                            $newobject | Add-Member -MemberType NoteProperty -Name $name.name -Value $name.value
                        }
                    }
                }
            }

            else {
                foreach ($name in  $statement.PSObject.Properties ) {                                
                    if ($name.name -notmatch "Sid" ) {
                        $newobject | Add-Member -MemberType NoteProperty -Name $name.name -Value $name.value
                    }       
                }
            }
        
            if ($listofaction.Count) {
                foreach ($state in $statementlist) {
                    if ((convertto-json $state.Action) -eq (convertto-json $newobject.Action) -and (convertto-json $state.Effect) -eq (convertto-json $newobject.Effect) -and (convertto-json $state.Resource) -eq (convertto-json $newobject.Resource)) {
                        $countset++ 
                    }
                }

                if (!$countset) {
                    $statementlist += $newobject | ConvertTo-Json
                } 
            }
        }
    }

    $statementlist > permissions.json
}

catch {

}





# $inlinepolicies = aws iam list-role-policies --role-name $rolename --profile $profile | ConvertFrom-Json


# foreach ($inline in $inlinepolicies.PolicyNames) {

#     Write-Host "########################################" -ForegroundColor Green
#     Write-Host $inline   -ForegroundColor Yellow

#     $inlinedocument = aws iam get-role-policy --role-name $rolename --policy-name $inline --profile $profile | ConvertFrom-Json
#     #$inlinedocument

#     foreach ($actions in  $inlinedocument.PolicyDocument.Statement) {

#         $newobject = @{}
#         $newobject = New-Object -TypeName PSObject
#         $listofaction = "T"
#         $countset = 0
#         if ($list -ne $null) {
#             if ($actions.Action | Select-String -List $list) {


#                 if (($actions.Action.GetType()).basetype.name -eq "Array") {
#                     $listofaction = [System.Collections.ArrayList]$actions.Action
#                     foreach ($var in $actions.Action) {
                        
#                         if ($var | Select-String -List $list) {
#                             $listofaction.RemoveAt($listofaction.IndexOf($var))
                            
#                         }
#                     }
#                 }
#                 else {
#                     $listofaction = $null
#                 }

                        
#                 $newobject | Add-Member -MemberType NoteProperty -Name "Action" -Value $listofaction
#                 foreach ($name in  $actions.psobject.Properties ) {
                                
#                     if ($name.name -notmatch "action" -and $name.name -notmatch "Sid" ) {

#                         $newobject | Add-Member -MemberType NoteProperty -Name $name.name -Value $name.value
#                     }
                        
#                 }
                            
#             }
#             else {
                    
#                 foreach ($name in  $actions.psobject.Properties ) {                                

#                     if ($name.name -notmatch "Sid" ) {
#                         $newobject | Add-Member -MemberType NoteProperty -Name $name.name -Value $name.value
#                     }
                            
                        
#                 }
                    
#             }
#         }
#         else {
                    
#             foreach ($name in  $actions.psobject.Properties ) {                                

#                 if ($name.name -notmatch "Sid" ) {
#                     $newobject | Add-Member -MemberType NoteProperty -Name $name.name -Value $name.value
#                 }
                            
                        
#             }
                    
                    
#         }
#         if ($listofaction.Count) {


#             foreach ($state in $statementlist) {
                        
#                 if ((convertto-json $state.Action) -eq (convertto-json $newobject.Action) -and (convertto-json $state.Effect) -eq (convertto-json $newobject.Effect) -and (convertto-json $state.Resource) -eq (convertto-json $newobject.Resource)) {
                    
#                     $countset++ 
                    
#                 }
#             }
#             if (!$countset) {
#                 $statementlist += $newobject
#             } 
#         }
#         # break
#     }



# }


# $finalobject = New-Object -TypeName PSObject
# $finalobject | Add-Member -MemberType NoteProperty -Name "Statement" -Value $statementlist
# $finalobject | Add-Member -MemberType NoteProperty -Name "Version" -Value "2012-10-17"
# $filename = "C:\learning\inlinepolicies\" + "$rolename" + "-combined-inline-new.json"
# $finalobject | ConvertTo-Json -depth 100 | Out-File $filename


# break