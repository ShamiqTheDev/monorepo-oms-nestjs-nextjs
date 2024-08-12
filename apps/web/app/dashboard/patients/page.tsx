import { styled } from "@atdb/design-system";
import { Metadata } from "next";
import { fetchPatients } from "./utils";
import { PatientsDataTable } from "./table";

export const metadata: Metadata = {
  title: "Patients List",
};

export default async function Patients() {
  const patients = (await fetchPatients())!;

  return (
    <>
      <styled.h2 textStyle={"textStyles.headings.h2"} fontWeight={600} mb={"xl"}>
        Patients List
      </styled.h2>
      <styled.div fontSize={"14px"}>
        <PatientsDataTable data={patients} />
      </styled.div>
    </>
  );
}
