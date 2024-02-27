import { Statement } from "interfaces/Policy";

export const autoscaling: Statement = {
    Effect: "Allow",
    Action: [
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
    ],
    Resource: "*"
}

export const cloudformation: Statement = {
    Effect: "Allow",
    Action: [
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
    ],
    Resource: "*"
}

export const cloudwatch: Statement = {
    Effect: "Allow",
    Action: [
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
    ],
    Resource: "*"
}