import { ResourceGroupsTaggingAPI } from "@aws-sdk/client-resource-groups-tagging-api";
import { TagResourcesCommand } from "@aws-sdk/client-resource-groups-tagging-api";

export const tagResources = async (resourceArns: string[], justification: string, resourceRegion: string) => {
    try {
        const tagResourcesCommandInput = {
            ResourceARNList: resourceArns,
            Tags: {
                "PUBLIC_JUSTIFICATION": justification
            }
        }

        const resourceGroupsTaggingApiClient = new ResourceGroupsTaggingAPI({
            region: resourceRegion
        });

        const command = new TagResourcesCommand(tagResourcesCommandInput);
        const response = await resourceGroupsTaggingApiClient.send(command);

        return response;
    }

    catch (error) {
        const errorMessage = `${(error as Error).name} - ${(error as Error).message}`;
        throw new Error(`Unable to tag the following resources ${resourceArns}: ${errorMessage}`);
    }
}