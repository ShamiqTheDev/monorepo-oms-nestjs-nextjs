import React from "react";
import { styled } from "@atdb/design-system";
import { OrderSettingsForm } from "./orders/form";
import { PatientsSettings } from "./patients";
import { fetchAppSettings } from "../../../../server-utils";

interface AdvancedSettingsProps {}

export async function AdvancedSettings(_: AdvancedSettingsProps) {
  const appSettings = await fetchAppSettings();

  return (
    <styled.div display="flex" flexDir={"column"} gap="4xl">
      <styled.div display="flex" flexDir={"column"} gap="md">
        <styled.h4 textStyle="textStyles.headings.h4" fontSize={"lg"} fontWeight="semibold" leading="none" tracking="tight">
          Patients
        </styled.h4>
        <PatientsSettings />
      </styled.div>
      <styled.div display="flex" flexDir={"column"} gap="md">
        <styled.h4 textStyle="textStyles.headings.h4" fontSize={"lg"} fontWeight="semibold" leading="none" tracking="tight">
          Orders
        </styled.h4>
        <styled.div>
          <OrderSettingsForm {...{ appSettings }} />
        </styled.div>
      </styled.div>
    </styled.div>
  );
}
