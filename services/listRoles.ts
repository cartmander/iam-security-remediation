import { ListRolesCommand, IAMClient } from "@aws-sdk/client-iam";
import { client } from "../client.js";

export const listRoles = async () => {
  const roleList = [];

  const command = new ListRolesCommand({});
  const response = await client.send(command);

  while (response?.Roles?.length) {
    for (const role of response.Roles) {
        roleList.push(role);
    }
  }

  return roleList;
}