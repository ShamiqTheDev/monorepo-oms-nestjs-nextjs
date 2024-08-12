import { styled } from "@atdb/design-system";
import { UsersDataTable } from "./users.table";
import { fetchUsers } from "../../../../server-utils";

interface UsersSettingsProps {}

export async function UsersSettings(_: UsersSettingsProps) {
  const users = await fetchUsers();

  return (
    <>
      <styled.div fontSize={"14px"}>
        <UsersDataTable data={users.filter((user) => !user.deleted)} />
      </styled.div>
    </>
  );
}
