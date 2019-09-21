import React, { useCallback } from "react";
import styled from "styled-components";
import { useDropzone } from "react-dropzone";

const DropzoneStyled = styled.div`
  width: 480px;
  height: 300px;
  border: 1px dashed #71858c;
  border-radius: 8px;
`;

const Dropzone = () => {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <div>
          <p>Drop Your HERC PDF Here</p>
          <div>
            <span>Or</span> Choose your file to upload
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropzone;
