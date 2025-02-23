"use client";
import { FileWithPath, useDropzone } from "react-dropzone";
import "./theme.css";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useCallback, useState } from "react";
import { sendRequest, sendRequestFile } from "@/utils/api";
import { useSession } from "next-auth/react"; // lấy session ở client
import axios from "axios";
import { useToast } from "@/utils/toast";
interface IProps {
  setValue: (v: number) => void;
  setTrackUpload: any;
  trackUpload: any;
}
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
function InputFileUpload() {
  return (
    <Button
      onClick={(e) => e.preventDefault()}
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload file
      <VisuallyHiddenInput type="file" />
    </Button>
  );
}
const Step1 = (props: IProps) => {
  const toast = useToast();
  const { trackUpload } = props;
  const { data: session } = useSession();
  // console.log("check session:", session);
  //useMemo => variable
  //useCallback=> function khi hàm render nhiều lần mà giá trị không thay đổi thì hàm này giúp render 1 lần
  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      // Do something with the files
      if (acceptedFiles && acceptedFiles[0]) {
        props.setValue(1);
        const audio = acceptedFiles[0]; //lấy ra file ,acceptedFiles trả về 1 mảng
        const formData = new FormData();
        formData.append("fileUpload", audio); // key ở backend sẽ dùng vì thế cần check api ,key là fileUpload
        console.log("check file:", audio);
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${session?.access_token}`,
                target_type: "tracks",
              },
              onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                  const percent = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                  );

                  // props.setTrackUpload({
                  //   ...trackUpload,
                  //   fileName: acceptedFiles[0].name,
                  //   percent: percent,
                  // });

                  //callback để đảm bảo luôn lấy giá trị mới nhất:
                  props.setTrackUpload((prev: any) => ({
                    ...prev,
                    fileName: acceptedFiles[0].name,
                    percent: percent,
                  }));
                }
              },
            }
          );
          props.setTrackUpload((prevState: any) => ({
            ...prevState,
            uploadedTrackName: res.data.data.fileName,
          }));

          console.log("check track upload step1:", trackUpload);
        } catch (error) {
          //@ts-ignore

          toast.error(error?.response?.data.message);
        }
      }
    },
    [session]
  );

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [], // Chấp nhận tất cả định dạng audio
    },
  });
  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <>
      <section className="container">
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <InputFileUpload />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside>
          <h4>Files</h4>
          <ul>{files}</ul>
        </aside>
      </section>
    </>
  );
};
export default Step1;
