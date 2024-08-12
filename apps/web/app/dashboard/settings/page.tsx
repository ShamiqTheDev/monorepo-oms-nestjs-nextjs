import { Tabs, TabsList, TabsTrigger, TabsContent } from "@atdb/ui";
import { UsersSettings } from "./users";
import { styled } from "@atdb/design-system";
import { CategoriesSettings } from "./categories";
import { getServerSession } from "next-auth";
import authOptions from "@atdb/auth-options";
import { DB } from "@atdb/types";
import { AdvancedSettings } from "./advanced";

export default async function Settings() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  // @ts-expect-error
  if (!DB.ADMINISTRATIVE_ROLES.includes(session.user.role))
    return (
      <>
        <h1>Access Denied</h1>
        <p>You cannot view this page because you don't have the required permissions.</p>
      </>
    );

  return (
    <>
      <styled.h2 textStyle={"textStyles.headings.h2"} fontWeight={600} mb={"xl"}>
        Settings
      </styled.h2>
      <Tabs defaultValue="users" w="100%">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          {Object.values(DB.Role).indexOf(session.user.role) <= Object.values(DB.Role).indexOf(DB.Role.Admin) && (
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          )}
        </TabsList>
        <TabsContent flex="1 1 0px" value="users">
          <UsersSettings />
        </TabsContent>
        <TabsContent flex="1 1 0px" value="categories">
          <CategoriesSettings />
        </TabsContent>
        {Object.values(DB.Role).indexOf(session.user.role) <= Object.values(DB.Role).indexOf(DB.Role.Admin) && (
          <TabsContent flex="1 1 0px" value="advanced">
            <AdvancedSettings />
          </TabsContent>
        )}
      </Tabs>
    </>
  );
}
