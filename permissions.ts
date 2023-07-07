import { BaseDocument, ActionDocument } from "interfaces.js";
  
export const Root: BaseDocument = {
    "Version": "2012-10-17",
    "Statement": []
}

export const ECR: ActionDocument = {
    "Effect": "Allow",
    "Action": [
        "ecr:Batch*",
        "ecr:CompleteLayerUpload",
        "ecr:CreatePullThroughCacheRule",
        "ecr:CreateRepository",
        "ecr:Delete*",
        "ecr:Describe*",
        "ecr:Get*",
        "ecr:InitiateLayerUpload",
        "ecr:ListImages",
        "ecr:ListTagsForResource",
        "ecr:Put*",
        "ecr:ReplicateImage",
        "ecr:Set*",
        "ecr:TagResource",
        "ecr:UntagResource",
        "ecr:UploadLayerPart"
    ],
    "Resource": "*"
}

export const KMS: ActionDocument  = {
    "Effect": "Allow",
    "Action": [
        "kms:CancelKeyDeletion",
        "kms:ConnectCustomKeyStore",
        "kms:CreateAlias",
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
        "kms:UpdateAlias",
        "kms:Update*",
        "kms:Verify",
        "kms:VerifyMac"
    ],
    "Resource": "*"
}

export const Logs: ActionDocument = {
    "Effect": "Allow",
    "Action": [
        "cloudwatch:Delete*",
        "cloudwatch:Describe*",
        "cloudwatch:DisableAlarmActions",
        "cloudwatch:DisableInsightRules",
        "cloudwatch:EnableAlarmActions",
        "cloudwatch:EnableInsightRules",
        "cloudwatch:Get*",
        "cloudwatch:Link",
        "cloudwatch:List*",
        "cloudwatch:Put*",
        "cloudwatch:SetAlarmState",
        "cloudwatch:StartMetricStreams",
        "cloudwatch:StopMetricStreams",
        "cloudwatch:TagResource",
        "cloudwatch:UntagResource"
    ],
    "Resource": "*"
}

export const SecretsManager: ActionDocument = {
    "Effect": "Allow",
    "Action": [
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
    ],
    "Resource": "*"
}

export const SQS: ActionDocument = {
    "Effect": "Allow",
    "Action": [
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
        "sqs:UntagQueue"
    ],
    "Resource": "*"
}

export const SSM: ActionDocument = {
    "Effect": "Allow",
    "Action": [
        "ssm:AddTagsToResource",
        "ssm:AssociateOpsItemRelatedItem",
        "ssm:CancelCommand",
        "ssm:CancelMaintenanceWindowExecution",
        "ssm:Create*",
        "ssm:Delete*",
        "ssm:Deregister*",
        "ssm:Describe*",
        "ssm:DisassociateOpsItemRelatedItem",
        "ssm:Get*",
        "ssm:LabelParameterVersion",
        "ssm:List*",
        "ssm:ModifyDocumentPermission",
        "ssm:PutCalendar",
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
        "ssm:Update*"
    ],
    "Resource": "*"
}