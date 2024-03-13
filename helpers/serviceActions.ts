export const generatePermissionsForService = (service: string): any => {
    switch (service) {
        case "autoscaling":
            return autoscalingPermissions;
        case "cloudformation":
            return cloudFormationPermissions;
        case "cloudwatch":
            return cloudWatchPermissions;
        case "codedeploy":
            return codeDeployPermissions;
        case "codestar-notifications":
            return codeStarNotificationsPermissions;
        case "connect":
            return connectPermissions;
        case "dax":
            return daxPermissions;
        case "dynamodb":
            return dynamoDBPermissions;
        case "ec2":
            return ec2Permissions;
        case "ecr":
            return ecrPermissions;
        case "ecs":
            return ecsPermissions;
        case "elasticbeanstalk":
            return elasticBeanstalkPermissions;
        case "elasticache":
            return elastiCachePermissions;
        case "elasticloadbalancing":
            return elasticLoadBalancingPermissions;
        case "es":
            return elasticSearchServicePermissions;
        case "events":
            return eventsPermissions;
        case "firehose":
            return firehosePermissions;
        case "glue":
            return gluePermissions;
        case "kms":
            return kmsPermissions;
        case "lambda":
            return lambdaPermissions;
        case "logs":
            return logsPermissions;
        case "pi":
            return piPermissions;
        case "rds":
            return rdsPermissions;
        case "redshift":
            return redshiftPermissions;
        case "redshift-serverless":
            return redshiftServerlessPermissions;
        case "s3":
            return s3Permissions;
        case "s3-object-lambda":
            return s3ObjectLambdaPermissions;
        case "secretsmanager":
            return secretsManagerPermissions;
        case "sns":
            return snsPermissions;
        case "sqs":
            return sqsPermissions;
        case "ssm":
            return ssmPermissions;
        default:
            console.log(`Unsupported AWS service: ${service}. Please include this in ./helpers/serviceActions.ts`);
            return;
    }
}

const autoscalingPermissions: string[] = [
    "autoscaling:Attach*",
    "autoscaling:BatchDeleteScheduledAction",
    "autoscaling:BatchPutScheduledUpdateGroupAction",
    "autoscaling:CancelInstanceRefresh",
    "autoscaling:CompleteLifecycleAction",
    "autoscaling:Create*",
    "autoscaling:Delete*",
    "autoscaling:Describe*",
    "autoscaling:Detach*",
    "autoscaling:DisableMetricsCollection",
    "autoscaling:EnableMetricsCollection",
    "autoscaling:EnterStandby",
    "autoscaling:ExecutePolicy",
    "autoscaling:ExitStandby",
    "autoscaling:GetPredictiveScalingForecast",
    "autoscaling:Put*",
    "autoscaling:RecordLifecycleActionHeartbeat",
    "autoscaling:ResumeProcesses",
    "autoscaling:RollbackInstanceRefresh",
    "autoscaling:Set*",
    "autoscaling:StartInstanceRefresh",
    "autoscaling:SuspendProcesses",
    "autoscaling:TerminateInstanceInAutoScalingGroup",
    "autoscaling:UpdateAutoScalingGroup"
];

const cloudFormationPermissions: string[] = [
    "cloudformation:ActivateOrganizationsAccess",
    "cloudformation:ActivateType",
    "cloudformation:BatchDescribeTypeConfigurations",
    "cloudformation:CancelUpdateStack",
    "cloudformation:ContinueUpdateRollback",
    "cloudformation:Create*",
    "cloudformation:DeactivateOrganizationsAccess",
    "cloudformation:DeactivateType",
    "cloudformation:Delete*",
    "cloudformation:DeregisterType",
    "cloudformation:Describe*",
    "cloudformation:Detect*",
    "cloudformation:EstimateTemplateCost",
    "cloudformation:ExecuteChangeSet",
    "cloudformation:Get*",
    "cloudformation:ImportStacksToStackSet",
    "cloudformation:List*",
    "cloudformation:PublishType",
    "cloudformation:RecordHandlerProgress",
    "cloudformation:RegisterPublisher",
    "cloudformation:RegisterType",
    "cloudformation:RollbackStack",
    "cloudformation:Set*",
    "cloudformation:SignalResource",
    "cloudformation:StopStackSetOperation",
    "cloudformation:TagResource",
    "cloudformation:TestType",
    "cloudformation:UntagResource",
    "cloudformation:Update*",
    "cloudformation:ValidateTemplate"
];

const cloudWatchPermissions: string[] = [
    "cloudwatch:BatchGetServiceLevelIndicatorReport",
    "cloudwatch:BatchGetServiceLevelObjectiveBudgetReport",
    "cloudwatch:CreateServiceLevelObjective",
    "cloudwatch:Delete*",
    "cloudwatch:Describe*",
    "cloudwatch:DisableAlarmActions",
    "cloudwatch:DisableInsightRules",
    "cloudwatch:Enable*",
    "cloudwatch:GenerateQuery",
    "cloudwatch:Get*",
    "cloudwatch:Link",
    "cloudwatch:List*",
    "cloudwatch:Put*",
    "cloudwatch:SetAlarmState",
    "cloudwatch:StartMetricStreams",
    "cloudwatch:StopMetricStreams",
    "cloudwatch:TagResource",
    "cloudwatch:UntagResource",
    "cloudwatch:UpdateServiceLevelObjective"
];

const codeDeployPermissions: string[] = [
    "codedeploy:AddTagsToOnPremisesInstances",
    "codedeploy:Batch*",
    "codedeploy:ContinueDeployment",
    "codedeploy:Create*",
    "codedeploy:Delete*",
    "codedeploy:DeregisterOnPremisesInstance",
    "codedeploy:Get*",
    "codedeploy:List*",
    "codedeploy:PutLifecycleEventHookExecutionStatus",
    "codedeploy:RegisterApplicationRevision",
    "codedeploy:RegisterOnPremisesInstance",
    "codedeploy:RemoveTagsFromOnPremisesInstances",
    "codedeploy:SkipWaitTimeForInstanceTermination",
    "codedeploy:StopDeployment",
    "codedeploy:TagResource",
    "codedeploy:UntagResource",
    "codedeploy:UpdateApplication",
    "codedeploy:UpdateDeploymentGroup"
];

const codeStarNotificationsPermissions: string[] = [
    "codestar-notifications:CreateNotificationRule",
    "codestar-notifications:DeleteNotificationRule",
    "codestar-notifications:DeleteTarget",
    "codestar-notifications:DescribeNotificationRule",
    "codestar-notifications:ListEventTypes",
    "codestar-notifications:ListNotificationRules",
    "codestar-notifications:ListTagsForResource",
    "codestar-notifications:ListTargets",
    "codestar-notifications:Subscribe",
    "codestar-notifications:TagResource",
    "codestar-notifications:Unsubscribe",
    "codestar-notifications:UntagResource",
    "codestar-notifications:UpdateNotificationRule"
];

const connectPermissions: string[] = [
    "connect:ActivateEvaluationForm",
    "connect:Associate*",
    "connect:Batch*",
    "connect:ClaimPhoneNumber",
    "connect:Create*",
    "connect:DeactivateEvaluationForm",
    "connect:Delete*",
    "connect:Describe*",
    "connect:Disassociate*",
    "connect:DismissUserContact",
    "connect:Get*",
    "connect:ImportPhoneNumber",
    "connect:List*",
    "connect:MonitorContact",
    "connect:PauseContact",
    "connect:PutUserStatus",
    "connect:ReleasePhoneNumber",
    "connect:ReplicateInstance",
    "connect:ResumeContact",
    "connect:ResumeContactRecording",
    "connect:Search*",
    "connect:SendChatIntegrationEvent",
    "connect:Start*",
    "connect:Stop*",
    "connect:SubmitContactEvaluation",
    "connect:SuspendContactRecording",
    "connect:TagContact",
    "connect:TagResource",
    "connect:TransferContact",
    "connect:UntagContact",
    "connect:UntagResource",
    "connect:Update*"
];

const daxPermissions: string[] = [
    "dax:BatchGetItem",
    "dax:BatchWriteItem",
    "dax:ConditionCheckItem",
    "dax:Create*",
    "dax:DecreaseReplicationFactor",
    "dax:Delete*",
    "dax:Describe*",
    "dax:GetItem",
    "dax:IncreaseReplicationFactor",
    "dax:ListTags",
    "dax:PutItem",
    "dax:Query",
    "dax:RebootNode",
    "dax:Scan",
    "dax:TagResource",
    "dax:UntagResource",
    "dax:Update*"
];

const dynamoDBPermissions: string[] = [
    "dynamodb:BatchGetItem",
    "dynamodb:BatchWriteItem",
    "dynamodb:ConditionCheckItem",
    "dynamodb:Create*",
    "dynamodb:Delete*",
    "dynamodb:Describe*",
    "dynamodb:DisableKinesisStreamingDestination",
    "dynamodb:EnableKinesisStreamingDestination",
    "dynamodb:ExportTableToPointInTime",
    "dynamodb:Get*",
    "dynamodb:ImportTable",
    "dynamodb:List*",
    "dynamodb:PartiQL*",
    "dynamodb:PurchaseReservedCapacityOfferings",
    "dynamodb:PutItem",
    "dynamodb:Query",
    "dynamodb:RestoreTable*",
    "dynamodb:Scan",
    "dynamodb:StartAwsBackupJob",
    "dynamodb:TagResource",
    "dynamodb:UntagResource",
    "dynamodb:Update*"
];

const ec2Permissions: string[] = [

    "ec2:Accept*",
    "ec2:AdvertiseByoipCidr",
    "ec2:Allocate*",
    "ec2:ApplySecurityGroupsToClientVpnTargetNetwork",
    "ec2:Assign*",
    "ec2:Associate*",
    "ec2:Attach*",
    "ec2:Authorize*",
    "ec2:BundleInstance",
    "ec2:Cancel*",
    "ec2:ConfirmProductInstance",
    "ec2:Copy*",
    "ec2:Create*",
    "ec2:Delete*",
    "ec2:Deprovision*",
    "ec2:Deregister*",
    "ec2:Describe*",
    "ec2:Detach*",
    "ec2:Disable*",
    "ec2:Disassociate*",
    "ec2:Enable*",
    "ec2:Export*",
    "ec2:Get*",
    "ec2:Import*",
    "ec2:InjectApiError",
    "ec2:ListImagesInRecycleBin",
    "ec2:ListSnapshotsInRecycleBin",
    "ec2:LockSnapshot",
    "ec2:Modify*",
    "ec2:MonitorInstances",
    "ec2:MoveAddressToVpc",
    "ec2:MoveByoipCidrToIpam",
    "ec2:PauseVolumeIO",
    "ec2:Provision*",
    "ec2:Purchase*",
    "ec2:PutResourcePolicy",
    "ec2:RebootInstances",
    "ec2:Register*",
    "ec2:Reject*",
    "ec2:Release*",
    "ec2:Replace*",
    "ec2:ReportInstanceStatus",
    "ec2:RequestSpotFleet",
    "ec2:RequestSpotInstances",
    "ec2:Reset*",
    "ec2:Restore*",
    "ec2:Revoke*",
    "ec2:RunInstances",
    "ec2:RunScheduledInstances",
    "ec2:Search*",
    "ec2:SendDiagnosticInterrupt",
    "ec2:SendSpotInstanceInterruptions",
    "ec2:Start*",
    "ec2:StopInstances",
    "ec2:TerminateClientVpnConnections",
    "ec2:TerminateInstances",
    "ec2:Unassign*",
    "ec2:UnlockSnapshot",
    "ec2:UnmonitorInstances",
    "ec2:UpdateSecurityGroupRuleDescriptionsEgress",
    "ec2:UpdateSecurityGroupRuleDescriptionsIngress",
    "ec2:WithdrawByoipCidr"
];

const ecrPermissions: string[] = [
    "ecr:Batch*",
    "ecr:CompleteLayerUpload",
    "ecr:Create*",
    "ecr:Delete*",
    "ecr:Describe*",
    "ecr:Get*",
    "ecr:InitiateLayerUpload",
    "ecr:ListImages",
    "ecr:ListTagsForResource",
    "ecr:Put*",
    "ecr:ReplicateImage",
    "ecr:SetRepositoryPolicy",
    "ecr:StartImageScan",
    "ecr:StartLifecyclePolicyPreview",
    "ecr:TagResource",
    "ecr:UntagResource",
    "ecr:UpdatePullThroughCacheRule",
    "ecr:UploadLayerPart",
    "ecr:ValidatePullThroughCacheRule"
];

const ecsPermissions: string[] = [
    "ecs:Create*",
    "ecs:Delete*",
    "ecs:DeregisterContainerInstance",
    "ecs:DeregisterTaskDefinition",
    "ecs:Describe*",
    "ecs:DiscoverPollEndpoint",
    "ecs:ExecuteCommand",
    "ecs:GetTaskProtection",
    "ecs:List*",
    "ecs:Poll",
    "ecs:Put*",
    "ecs:RegisterContainerInstance",
    "ecs:RegisterTaskDefinition",
    "ecs:RunTask",
    "ecs:StartTask",
    "ecs:StartTelemetrySession",
    "ecs:StopTask",
    "ecs:Submit*",
    "ecs:TagResource",
    "ecs:UntagResource",
    "ecs:Update*"
];

const elasticBeanstalkPermissions: string[] = [
    "elasticbeanstalk:AbortEnvironmentUpdate",
    "elasticbeanstalk:AddTags",
    "elasticbeanstalk:ApplyEnvironmentManagedAction",
    "elasticbeanstalk:AssociateEnvironmentOperationsRole",
    "elasticbeanstalk:CheckDNSAvailability",
    "elasticbeanstalk:ComposeEnvironments",
    "elasticbeanstalk:Create*",
    "elasticbeanstalk:Delete*",
    "elasticbeanstalk:Describe*",
    "elasticbeanstalk:DisassociateEnvironmentOperationsRole",
    "elasticbeanstalk:List*",
    "elasticbeanstalk:PutInstanceStatistics",
    "elasticbeanstalk:RebuildEnvironment",
    "elasticbeanstalk:RemoveTags",
    "elasticbeanstalk:RequestEnvironmentInfo",
    "elasticbeanstalk:RestartAppServer",
    "elasticbeanstalk:RetrieveEnvironmentInfo",
    "elasticbeanstalk:SwapEnvironmentCNAMEs",
    "elasticbeanstalk:TerminateEnvironment",
    "elasticbeanstalk:Update*",
    "elasticbeanstalk:ValidateConfigurationSettings"
];

const elastiCachePermissions: string[] = [
    "elasticache:AddTagsToResource",
    "elasticache:AuthorizeCacheSecurityGroupIngress",
    "elasticache:BatchApplyUpdateAction",
    "elasticache:BatchStopUpdateAction",
    "elasticache:CompleteMigration",
    "elasticache:Connect",
    "elasticache:CopyServerlessCacheSnapshot",
    "elasticache:CopySnapshot",
    "elasticache:Create*",
    "elasticache:DecreaseNodeGroupsInGlobalReplicationGroup",
    "elasticache:DecreaseReplicaCount",
    "elasticache:Delete*",
    "elasticache:Describe*",
    "elasticache:DisassociateGlobalReplicationGroup",
    "elasticache:ExportServerlessCacheSnapshot",
    "elasticache:FailoverGlobalReplicationGroup",
    "elasticache:IncreaseNodeGroupsInGlobalReplicationGroup",
    "elasticache:IncreaseReplicaCount",
    "elasticache:InterruptClusterAzPower",
    "elasticache:ListAllowedNodeTypeModifications",
    "elasticache:ListTagsForResource",
    "elasticache:Modify*",
    "elasticache:PurchaseReservedCacheNodesOffering",
    "elasticache:RebalanceSlotsInGlobalReplicationGroup",
    "elasticache:RebootCacheCluster",
    "elasticache:RemoveTagsFromResource",
    "elasticache:ResetCacheParameterGroup",
    "elasticache:RevokeCacheSecurityGroupIngress",
    "elasticache:StartMigration",
    "elasticache:TestFailover",
    "elasticache:TestMigration"
];

const elasticLoadBalancingPermissions: string[] = [
    "elasticloadbalancing:AddTags",
    "elasticloadbalancing:ApplySecurityGroupsToLoadBalancer",
    "elasticloadbalancing:AttachLoadBalancerToSubnets",
    "elasticloadbalancing:ConfigureHealthCheck",
    "elasticloadbalancing:Create*",
    "elasticloadbalancing:Delete*",
    "elasticloadbalancing:DeregisterInstancesFromLoadBalancer",
    "elasticloadbalancing:Describe*",
    "elasticloadbalancing:DetachLoadBalancerFromSubnets",
    "elasticloadbalancing:DisableAvailabilityZonesForLoadBalancer",
    "elasticloadbalancing:EnableAvailabilityZonesForLoadBalancer",
    "elasticloadbalancing:ModifyLoadBalancerAttributes",
    "elasticloadbalancing:RegisterInstancesWithLoadBalancer",
    "elasticloadbalancing:RemoveTags",
    "elasticloadbalancing:SetLoadBalancer*"
];

const elasticSearchServicePermissions: string[] = [
    "es:AcceptInboundConnection",
    "es:AcceptInboundCrossClusterSearchConnection",
    "es:AddDataSource",
    "es:AddTags",
    "es:AssociatePackage",
    "es:AuthorizeVpcEndpointAccess",
    "es:Cancel*",
    "es:Create*",
    "es:Delete*",
    "es:Describe*",
    "es:DissociatePackage",
    "es:ES*",
    "es:Get*",
    "es:List*",
    "es:PurchaseReservedElasticsearchInstanceOffering",
    "es:PurchaseReservedInstanceOffering",
    "es:RejectInboundConnection",
    "es:RejectInboundCrossClusterSearchConnection",
    "es:RemoveTags",
    "es:RevokeVpcEndpointAccess",
    "es:Start*",
    "es:Update*",
    "es:UpgradeDomain",
    "es:UpgradeElasticsearchDomain"
];

const eventsPermissions: string[] = [
    "events:ActivateEventSource",
    "events:CancelReplay",
    "events:Create*",
    "events:DeactivateEventSource",
    "events:DeauthorizeConnection",
    "events:Delete*",
    "events:Describe*",
    "events:DisableRule",
    "events:EnableRule",
    "events:InvokeApiDestination",
    "events:List*",
    "events:Put*",
    "events:RemovePermission",
    "events:RemoveTargets",
    "events:RetrieveConnectionCredentials",
    "events:StartReplay",
    "events:TagResource",
    "events:TestEventPattern",
    "events:UntagResource",
    "events:Update*"
];

const firehosePermissions: string[] = [
    "firehose:CreateDeliveryStream",
    "firehose:DeleteDeliveryStream",
    "firehose:DescribeDeliveryStream",
    "firehose:ListDeliveryStreams",
    "firehose:ListTagsForDeliveryStream",
    "firehose:PutRecord",
    "firehose:PutRecordBatch",
    "firehose:StartDeliveryStreamEncryption",
    "firehose:StopDeliveryStreamEncryption",
    "firehose:TagDeliveryStream",
    "firehose:UntagDeliveryStream",
    "firehose:UpdateDestination"
];

const gluePermissions: string[] = [
    "glue:Batch*",
    "glue:Cancel*",
    "glue:CheckSchemaVersionValidity",
    "glue:Create*",
    "glue:Delete*",
    "glue:DeregisterDataPreview",
    "glue:Get*",
    "glue:GlueNotebookAuthorize",
    "glue:GlueNotebookRefreshCredentials",
    "glue:ImportCatalogToGlue",
    "glue:List*",
    "glue:NotifyEvent",
    "glue:PassConnection",
    "glue:PublishDataQuality",
    "glue:Put*",
    "glue:QuerySchemaVersionMetadata",
    "glue:RegisterSchemaVersion",
    "glue:RemoveSchemaVersionMetadata",
    "glue:ResetJobBookmark",
    "glue:ResumeWorkflowRun",
    "glue:RunDataPreviewStatement",
    "glue:RunStatement",
    "glue:SearchTables",
    "glue:SendFeedback",
    "glue:Start*",
    "glue:Stop*",
    "glue:TagResource",
    "glue:TerminateNotebook",
    "glue:TestConnection",
    "glue:UntagResource",
    "glue:Update*",
    "glue:UseGlueStudio",
    "glue:UseMLTransforms"
];

const kmsPermissions: string[] = [
    "kms:CancelKeyDeletion",
    "kms:ConnectCustomKeyStore",
    "kms:Create*",
    "kms:Decrypt",
    "kms:Delete*",
    "kms:DescribeCustomKeyStores",
    "kms:DescribeKey",
    "kms:DisableKey",
    "kms:DisableKeyRotation",
    "kms:DisconnectCustomKeyStore",
    "kms:EnableKey",
    "kms:EnableKeyRotation",
    "kms:Encrypt",
    "kms:Generate*",
    "kms:Get*",
    "kms:ImportKeyMaterial",
    "kms:List*",
    "kms:PutKeyPolicy",
    "kms:ReEncryptFrom",
    "kms:ReEncryptTo",
    "kms:ReplicateKey",
    "kms:RetireGrant",
    "kms:RevokeGrant",
    "kms:ScheduleKeyDeletion",
    "kms:Sign",
    "kms:SynchronizeMultiRegionKey",
    "kms:TagResource",
    "kms:UntagResource",
    "kms:Update*",
    "kms:Verify",
    "kms:VerifyMac"
];

const lambdaPermissions: string[] = [
    "lambda:AddLayerVersionPermission",
    "lambda:AddPermission",
    "lambda:Create*",
    "lambda:Delete*",
    "lambda:DisableReplication",
    "lambda:EnableReplication",
    "lambda:Get*",
    "lambda:Invoke*",
    "lambda:List*",
    "lambda:PublishLayerVersion",
    "lambda:PublishVersion",
    "lambda:Put*",
    "lambda:RemoveLayerVersionPermission",
    "lambda:RemovePermission",
    "lambda:TagResource",
    "lambda:UntagResource",
    "lambda:Update*"
];

const logsPermissions: string[] = [
    "logs:AssociateKmsKey",
    "logs:CancelExportTask",
    "logs:Create*",
    "logs:Delete*",
    "logs:Describe*",
    "logs:DisassociateKmsKey",
    "logs:FilterLogEvents",
    "logs:Get*",
    "logs:Link",
    "logs:List*",
    "logs:Put*",
    "logs:StartLiveTail",
    "logs:StartQuery",
    "logs:StopLiveTail",
    "logs:StopQuery",
    "logs:TagLogGroup",
    "logs:TagResource",
    "logs:TestMetricFilter",
    "logs:Unmask",
    "logs:UntagLogGroup",
    "logs:UntagResource",
    "logs:Update*"
];

const piPermissions: string[] = [
    "pi:CreatePerformanceAnalysisReport",
    "pi:DeletePerformanceAnalysisReport",
    "pi:DescribeDimensionKeys",
    "pi:Get*",
    "pi:List*",
    "pi:TagResource",
    "pi:UntagResource"
];

const rdsPermissions: string[] = [
    "rds:Add*",
    "rds:ApplyPendingMaintenanceAction",
    "rds:AuthorizeDBSecurityGroupIngress",
    "rds:BacktrackDBCluster",
    "rds:CancelExportTask",
    "rds:CopyDB*",
    "rds:CopyOptionGroup",
    "rds:Create*",
    "rds:CrossRegionCommunication",
    "rds:Delete*",
    "rds:DeregisterDBProxyTargets",
    "rds:Describe*",
    "rds:DisableHttpEndpoint",
    "rds:DownloadCompleteDBLogFile",
    "rds:DownloadDBLogFilePortion",
    "rds:EnableHttpEndpoint",
    "rds:FailoverDBCluster",
    "rds:FailoverGlobalCluster",
    "rds:ListTagsForResource",
    "rds:Modify*",
    "rds:PromoteReadReplica",
    "rds:PromoteReadReplicaDBCluster",
    "rds:PurchaseReservedDBInstancesOffering",
    "rds:RebootDBCluster",
    "rds:RebootDBInstance",
    "rds:RegisterDBProxyTargets",
    "rds:Remove*",
    "rds:ResetDBClusterParameterGroup",
    "rds:ResetDBParameterGroup",
    "rds:RestoreDB*",
    "rds:RevokeDBSecurityGroupIngress",
    "rds:Start*",
    "rds:Stop*",
    "rds:Switchover*"
];

const redshiftPermissions: string[] = [
    "redshift:AcceptReservedNodeExchange",
    "redshift:AddPartner",
    "redshift:AssociateDataShareConsumer",
    "redshift:Authorize*",
    "redshift:BatchDeleteClusterSnapshots",
    "redshift:BatchModifyClusterSnapshots",
    "redshift:CancelQuery",
    "redshift:CancelQuerySession",
    "redshift:CancelResize",
    "redshift:CopyClusterSnapshot",
    "redshift:Create*",
    "redshift:DeauthorizeDataShare",
    "redshift:Delete*",
    "redshift:Describe*",
    "redshift:DisableLogging",
    "redshift:DisableSnapshotCopy",
    "redshift:DisassociateDataShareConsumer",
    "redshift:EnableLogging",
    "redshift:EnableSnapshotCopy",
    "redshift:ExecuteQuery",
    "redshift:FailoverPrimaryCompute",
    "redshift:FetchResults",
    "redshift:Get*",
    "redshift:JoinGroup",
    "redshift:List*",
    "redshift:Modify*",
    "redshift:PauseCluster",
    "redshift:PurchaseReservedNodeOffering",
    "redshift:PutResourcePolicy",
    "redshift:RebootCluster",
    "redshift:RejectDataShare",
    "redshift:ResetClusterParameterGroup",
    "redshift:ResizeCluster",
    "redshift:RestoreFromClusterSnapshot",
    "redshift:RestoreTableFromClusterSnapshot",
    "redshift:ResumeCluster",
    "redshift:Revoke*",
    "redshift:RotateEncryptionKey",
    "redshift:UpdatePartnerStatus",
    "redshift:ViewQueriesFromConsole",
    "redshift:ViewQueriesInConsole"
];

const redshiftServerlessPermissions: string[] = [
    "redshift-serverless:ConvertRecoveryPointToSnapshot",
    "redshift-serverless:Create*",
    "redshift-serverless:Delete*",
    "redshift-serverless:DescribeOneTimeCredit",
    "redshift-serverless:Get*",
    "redshift-serverless:List*",
    "redshift-serverless:PutResourcePolicy",
    "redshift-serverless:Restore*",
    "redshift-serverless:TagResource",
    "redshift-serverless:UntagResource",
    "redshift-serverless:Update*"
];

const s3Permissions: string[] = [
    "s3:AbortMultipartUpload",
    "s3:AssociateAccessGrantsIdentityCenter",
    "s3:BypassGovernanceRetention",
    "s3:Create*",
    "s3:Delete*",
    "s3:DescribeJob",
    "s3:DescribeMultiRegionAccessPointOperation",
    "s3:DissociateAccessGrantsIdentityCenter",
    "s3:Get*",
    "s3:InitiateReplication",
    "s3:List*",
    "s3:ObjectOwnerOverrideToBucketOwner",
    "s3:Put*",
    "s3:Replicate*",
    "s3:RestoreObject",
    "s3:SubmitMultiRegionAccessPointRoutes",
    "s3:TagResource",
    "s3:UntagResource",
    "s3:Update*"
];

const s3ObjectLambdaPermissions: string[] = [
    "s3-object-lambda:AbortMultipartUpload",
    "s3-object-lambda:Delete*",
    "s3-object-lambda:Get*",
    "s3-object-lambda:List*",
    "s3-object-lambda:Put*",
    "s3-object-lambda:RestoreObject",
    "s3-object-lambda:WriteGetObjectResponse"
];

const secretsManagerPermissions: string[] = [
    "secretsmanager:BatchGetSecretValue",
    "secretsmanager:CancelRotateSecret",
    "secretsmanager:CreateSecret",
    "secretsmanager:DeleteResourcePolicy",
    "secretsmanager:DeleteSecret",
    "secretsmanager:DescribeSecret",
    "secretsmanager:Get*",
    "secretsmanager:ListSecretVersionIds",
    "secretsmanager:ListSecrets",
    "secretsmanager:PutResourcePolicy",
    "secretsmanager:PutSecretValue",
    "secretsmanager:RemoveRegionsFromReplication",
    "secretsmanager:ReplicateSecretToRegions",
    "secretsmanager:RestoreSecret",
    "secretsmanager:RotateSecret",
    "secretsmanager:StopReplicationToReplica",
    "secretsmanager:TagResource",
    "secretsmanager:UntagResource",
    "secretsmanager:UpdateSecret",
    "secretsmanager:UpdateSecretVersionStage",
    "secretsmanager:ValidateResourcePolicy"
];

const snsPermissions: string[] = [
    "sns:AddPermission",
    "sns:CheckIfPhoneNumberIsOptedOut",
    "sns:ConfirmSubscription",
    "sns:Create*",
    "sns:Delete*",
    "sns:Get*",
    "sns:List*",
    "sns:OptInPhoneNumber",
    "sns:Publish",
    "sns:PutDataProtectionPolicy",
    "sns:RemovePermission",
    "sns:Set*",
    "sns:Subscribe",
    "sns:TagResource",
    "sns:Unsubscribe",
    "sns:VerifySMSSandboxPhoneNumber",
];

const sqsPermissions: string[] = [
    "sqs:AddPermission",
    "sqs:CancelMessageMoveTask",
    "sqs:ChangeMessageVisibility",
    "sqs:CreateQueue",
    "sqs:DeleteMessage",
    "sqs:DeleteQueue",
    "sqs:GetQueueAttributes",
    "sqs:GetQueueUrl",
    "sqs:List*",
    "sqs:PurgeQueue",
    "sqs:ReceiveMessage",
    "sqs:RemovePermission",
    "sqs:SendMessage",
    "sqs:SetQueueAttributes",
    "sqs:StartMessageMoveTask",
    "sqs:TagQueue",
    "sqs:UntagQueue",

];

const ssmPermissions: string[] = [
    "ssm:AddTagsToResource",
    "ssm:AssociateOpsItemRelatedItem",
    "ssm:Cancel*",
    "ssm:Create*",
    "ssm:Delete*",
    "ssm:Deregister*",
    "ssm:Describe*",
    "ssm:DisassociateOpsItemRelatedItem",
    "ssm:Get*",
    "ssm:LabelParameterVersion",
    "ssm:List*",
    "ssm:ModifyDocumentPermission",
    "ssm:Put*",
    "ssm:Register*",
    "ssm:RemoveTagsFromResource",
    "ssm:ResetServiceSetting",
    "ssm:ResumeSession",
    "ssm:SendAutomationSignal",
    "ssm:SendCommand",
    "ssm:Start*",
    "ssm:StopAutomationExecution",
    "ssm:TerminateSession",
    "ssm:UnlabelParameterVersion",
    "ssm:Update*",
];