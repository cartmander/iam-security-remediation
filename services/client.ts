import { IAMClient } from "@aws-sdk/client-iam";
import { ResourceGroupsTaggingAPI } from "@aws-sdk/client-resource-groups-tagging-api";

export const iamClient = new IAMClient({
    region: "us-east-1"
});

export const resourceGroupsTaggingApiClient = new ResourceGroupsTaggingAPI({
    region: "us-east-1"
})