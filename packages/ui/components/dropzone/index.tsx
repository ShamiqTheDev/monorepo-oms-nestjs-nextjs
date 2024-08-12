"use client";

import { styled, VStack, css } from "@atdb/design-system";
import { DocumentUpload } from "@atdb/icons";
import { useRef, useState } from "react";
import { Button } from "../button";

interface DropzoneProps {
  onChange: (files: Blob[]) => void;
  value?: Blob[];
}

export function Dropzone({ onChange, value = [] }: DropzoneProps) {
  const inputRef = useRef<any>(null);
  const [files, setFiles] = useState<Blob[]>(value);
  const ua = window.navigator.userAgent;
  const accept = (".cam,.stl,.rar,.zip," + (/CriOS/i.test(ua) || (/Chrome/i.test(ua) && /Mobile/i.test(ua)) ? "image,camera/*" : "image/*"));
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files;
      setFiles(Array.from(files));
      onChange(Array.from(files));
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = e.dataTransfer.files;
      setFiles(Array.from(files));
      onChange(Array.from(files));
    }
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function openFileExplorer() {
    inputRef.current.value = "";
    inputRef.current.click();
  }

  return (
    <div
      className={css({ border: "input", rounded: "sm", py: "xl", px: "2xl" })}
      // onDragEnter={handleDragEnter}
      // onDrop={handleDrop}
      // onDragLeave={handleDragLeave}
      // onDragOver={handleDragOver}
    >
      <input
        placeholder="fileInput"
        className={css({ display: "none" })}
        hidden
        ref={inputRef}
        type="file"
        onChange={handleChange}
        multiple
        accept={accept}
      />
      <VStack gap={0}>
        <DocumentUpload className={css({ color: "primary.900" })} variant="Bold" />
        <p>
          {/* Drop your file here or{" "} */}
          <span onClick={openFileExplorer}>
            <Button type="button" variant="ghost" p={0} fontWeight={600} color={"primary.500"}>
              Select file
            </Button>
          </span>{" "}
          to upload
        </p>
        {/* <styled.p fontSize={"sm"} color="gray.500">
          Maximum file size of 50mb
        </styled.p> */}
      </VStack>

      <div>
        {files &&
          files.map((file) => (
            <div>
              <span>{(file as File)?.name}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
