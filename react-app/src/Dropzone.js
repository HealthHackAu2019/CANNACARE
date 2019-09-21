import React, { useCallback } from "react";
import styled from "styled-components";
import { useDropzone } from "react-dropzone";

import UploadCloud from "./svg/UploadCloud";

const DropzoneStyled = styled.div`
  width: 480px;
  height: 300px;
  border: 1px dashed #71858c;
  border-radius: 8px;
  div.display {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #272e31;
    div {
      line-height: 48px;
      color: white;
      background-color: black;
      padding: 0 17px;
      border-radius: 4px;
      :hover {
        cursor: pointer;
        opacity: 0.8;
      }
    }
  }
`;

const Dropzone = () => {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <DropzoneStyled {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <div className="display">
          <UploadCloud />
          <p>Drop Your HERC PDF Here</p>
          <div>
            <span>Or</span> Choose your file to upload
          </div>
        </div>
      )}
    </DropzoneStyled>
  );
};

export default Dropzone;
