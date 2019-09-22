import React, { useCallback, useState, useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { useDropzone } from "react-dropzone";
import { TiTick, TiTrash } from "react-icons/ti";

import UploadCloud from "./svg/UploadCloud";
import Button from "./Button";

const DropzoneStyled = styled.div`
  width: 1100px;
  height: 300px;
  border: 1px dashed #71858c;
  border-radius: 8px;
  align-self: center;
  div.display {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #272e31;
    div.files {
      padding: 0 0 20px;
      div.file {
        position: relative;
        font-weight: bold;
        font-size: 18px;
        margin: 0 0 8px;
        width: 320px;
        border-bottom: 1px solid #b8c2c5;
        padding: 0 20px;
        .tick {
          color: #20ce70;
          position: absolute;
          left: 0;
        }
        .trash {
          color: #f43535;
          position: absolute;
          right: 0;
          :hover {
            cursor: pointer;
          }
        }
      }
    }
  }
  div.active {
    opacity: 0.8;
  }
`;

const DropzoneContent = ({ active, files, onClick }) => {
  if (files.length > 0) {
    return (
      <div className={`display ${active ? "active" : ""}`}>
        <div className="files">
          {files.map(file => (
            <div key={file.name} className="file">
              <span className="tick">
                <TiTick />
              </span>
              <span>{file.name}</span>
              <span className="trash">
                <TiTrash />
              </span>
            </div>
          ))}
        </div>
        <Button
          onClick={e => {
            e.stopPropagation();
            onClick(true);
          }}
        >
          Upload
        </Button>
      </div>
    );
  }
  return (
    <div className={`display ${active ? "active" : ""}`}>
      <UploadCloud />
      <p>Drop Your APS PDF Here</p>
      <Button>Or choose your file to upload</Button>
    </div>
  );
};

const Loading = styled.div`
  width: 136px;
  height: 136px;
  clear: both;
  margin: 20px auto;
  /* Spinner Circle Rotation */
  border: 4px #bfcac4 solid;
  border-top: 4px #38ca7b solid;
  border-radius: 50%;
  -webkit-animation: spCircRot 0.6s infinite linear;
  animation: spCircRot 0.6s infinite linear;
  @-webkit-keyframes spCircRot {
    from {
      -webkit-transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(359deg);
    }
  }
  @keyframes spCircRot {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`;

const Dropzone = ({ setStep }) => {
  const [files, addFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (isSubmitting === true) {
      window.setTimeout(() => {
        setStep(3);
      }, 1000);
    }
  }, [isSubmitting]);
  const onDrop = useCallback(
    acceptedFiles => {
      // Do something with the files
      addFiles(acceptedFiles);
    },
    [addFiles]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  if (isSubmitting) {
    return (
      <DropzoneStyled>
        <Loading />
      </DropzoneStyled>
    );
  }
  return (
    <DropzoneStyled {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <DropzoneContent active files={files} onClick={setIsSubmitting} />
      ) : (
        <DropzoneContent files={files} onClick={setIsSubmitting} />
      )}
    </DropzoneStyled>
  );
};

const mapDispatchToProps = dispatch => ({
  setStep: index => dispatch({ type: "SET_STEP", payload: { step: index } })
});

export default connect(
  null,
  mapDispatchToProps
)(Dropzone);
