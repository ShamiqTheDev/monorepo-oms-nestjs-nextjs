"use client";

import { useToast } from "@atdb/client-providers";
import { css, styled } from "@atdb/design-system";
import { DB } from "@atdb/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@atdb/ui";
import { Insertable } from "kysely";
import { Loader2 } from "lucide-react";
import { useRef } from "react";
import { insertBulkPatients, flushPatients } from "../actions";
import Papa from "papaparse";

function parseCsv<T>(file: File) {
  return new Promise<T[]>((resolve, reject) => {
    Papa.parse<T>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export const PatientsSettings = () => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileUploaded = event.target.files?.[0];
    if (!fileUploaded) return;

    const loadingToast = toast({
      description: <Loader2 className={css({ animation: "spin" })} />,
      variant: "imperative",
      className: css({ w: "fit-content !important" }),
    });

    const patientsCsv = (await parseCsv<{ Code: string; Naam: string; "Geboorte datum": string }>(fileUploaded)).reduce<
      Insertable<DB.Patient>[]
    >((filtered, patient) => {
      if (patient.Code && patient.Naam && patient["Geboorte datum"].trim()) {
        const [day, month, year] = patient["Geboorte datum"]
          .trim()
          .split("-")
          .map((v) => parseInt(v));

        if (isNaN(day) || isNaN(month) || isNaN(year)) return filtered;

        const date = new Date();
        date.setFullYear(year, month, day);

        filtered.push({
          refId: patient.Code.trim(),
          name: patient.Naam.trim(),
          birthdate: date.toISOString(),
        });
      }

      return filtered;
    }, []);

    const insertSuccess = await insertBulkPatients(patientsCsv);
    loadingToast.dismiss();

    toast({
      title: insertSuccess ? "Patients Inserted" : "Failed to insert patients",
      description: insertSuccess ? "Patients have been inserted successfully " : "Patients insertion failed due to a system error",
      variant: insertSuccess ? "constructive" : "destructive",
    });
  };

  const handleFlushPatients = async () => {
    const loadingToast = toast({
      description: <Loader2 className={css({ animation: "spin" })} />,
      variant: "imperative",
      className: css({ w: "fit-content !important" }),
    });

    const flushSuccess = await flushPatients();
    loadingToast.dismiss();

    toast({
      title: flushSuccess ? "Patients Flushed" : "Failed to flush patients",
      description: flushSuccess ? "Patients have been flushed successfully " : "Patients flush failed due to a system error",
      variant: flushSuccess ? "constructive" : "destructive",
    });
  };

  return (
    <styled.div>
      <Button variant="outline" onClick={handleClick}>
        Insert patients (csv)
      </Button>
      <form onSubmit={(e) => e.preventDefault()}>
        <input type="file" accept="text/csv" onChange={handleChange} ref={hiddenFileInput} style={{ display: "none" }} />
      </form>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button variant="ghost" color="destructive">
            Flush all patients
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Flush Patients</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to flush all patients?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant={"destructive"} onClick={handleFlushPatients}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </styled.div>
  );
};
