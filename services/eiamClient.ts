import { IAMClient } from "@aws-sdk/client-iam";

export const client = new IAMClient({
    region: "us-east-1"
});