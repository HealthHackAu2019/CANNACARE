import React, { useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import fileText from "./fileText";
import analysedText from "./analysedText";
import Button from "./Button";

const Container = styled.div`
  p {
    padding: 24px 35px;
    span {
      color: #1ebf68;
    }
  }
`;

const Select = styled.div`
  position: relative;
  width: 470px;
  padding-bottom: ${props =>
      props.bottomGutter ? `${props.bottomGutter}px` : "0"}
    select {
    display: block;
    font-size: 16px;
    font-family: sans-serif;
    font-weight: 700;
    color: #444;
    line-height: 1.3;
    padding: 0.6em 4.4em 0.5em 0.8em;
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    border: 1px solid #aaa;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-color: #fff;
    height: 48px;
  }
  select::-ms-expand {
    display: none;
  }
  select:hover {
    border-color: #888;
  }
  select:focus {
    border-color: #aaa;
    box-shadow: 0 0 1px 3px rgba(59, 153, 252, 0.7);
    box-shadow: 0 0 0 3px -moz-mac-focusring;
    color: #222;
    outline: none;
  }
  selectoption {
    font-weight: normal;
  }
`;

const FileSelector = styled.div`
  display: flex;
  position: relative;
  align-items: center;
`;

const FileRedactor = styled.div`
  border: 1px solid #e7edf1;
  box-sizing: border-box;
  border-radius: 8px;
  div.header {
    padding: 30px 25px 30px;
    p,
    h2 {
      margin: 0;
      padding: 0;
    }
    h2 {
      padding: 14px 0 25px;
    }
    div.selectContainer {
      display: flex;
    }
  }
`;

const DividerLine = styled.div`
  height: 1px;
  width: 100%;
  border: 1px solid #e7edf1;
  box-sizing: border-box;
  border-radius: 8px;
`;

const FileText = styled.div`
  padding: 29px 38px 35px 82px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.02em;
  max-height: 500px;
  overflow-y: scroll;
`;

const Checkbox = styled.section`
  padding: 20px 0;
  .si {
    --color-default: #dee5f2;
    --color-active: #1ebf68;
    --rotate-default: 180deg;
    --rotate-active: 40deg;
    --border-size-checkmark: 2px;
    --border-size-box: 1px;
    --input-size: 20px;
    --guter: 15px;
  }

  .si,
  .si *,
  .si *::before,
  .si *::after {
    box-sizing: border-box;
  }

  .si {
    cursor: pointer;
    position: relative;
  }

  .si > input[type="checkbox"],
  .si > input[type="radio"] {
    -webkit-clip-path: polygon(0 0);
    clip-path: polygon(0 0);
  }

  .si .si-label {
    display: inline-block;
    padding-left: var(--guter);
    vertical-align: text-top;
    font-size: 14px;
    font-family: Roboto Slab;
  }

  .si .si-label::before,
  .si .si-label::after {
    transition: all 0.2s ease-in-out;
  }

  .si .si-label::before {
    content: "";
    display: block;
    width: var(--input-size);
    height: var(--input-size);
    border: var(--border-size-box) solid var(--color-default);
    position: absolute;
    top: -3px;
    left: 0;
    -webkit-transform: rotate(0deg) scale(1);
    transform: rotate(0deg) scale(1);
  }

  .si .si-label:hover::before {
    border-color: var(--color-active);
  }

  .si.si-checkbox .si-label::before {
    border-radius: var(--border-size-checkmark);
  }

  .si.si-checkbox .si-label::after {
    content: "";
    display: block;
    width: 8px;
    height: 18px;
    border-width: 0 var(--border-size-checkmark) var(--border-size-checkmark) 0;
    border-style: solid;
    border-color: transparent var(--color-active) var(--color-active)
      transparent;
    position: absolute;
    top: -3px;
    left: 0;
    -webkit-transform: rotate(var(--rotate-default)) scale(0);
    transform: rotate(var(--rotate-default)) scale(0);
  }

  .si.si-checkbox > input:checked + .si-label::after {
    left: 8px;
    -webkit-transform: rotate(var(--rotate-active)) scale(1);
    transform: rotate(var(--rotate-active)) scale(1);
  }

  .si.si-checkbox > input:checked + .si-label::before {
    -webkit-transform: rotate(var(--rotate-active)) scale(0);
    transform: rotate(var(--rotate-active)) scale(0);
  }
`;

const SelectIndicator = styled.div`
  background: #e5e5e5;
  border-radius: 24px;
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
	color: #272e31;
	padding: 0 10px;
	height: 36px
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	right: 10px;
	top: 6px;
`;

const replaceAt = (str, index, replacement) =>
  str.substr(0, index) + replacement + str.substr(index + replacement.length);

const Verify = ({ files, setStep }) => {
  const [selectedFileIndex, useSelectedFileIndex] = useState(0);
  const [selectedRedactedWord, useSelectedRedactedWord] = useState(0);
  const redactedWords = analysedText.Entities.filter(
    entity => entity.Category === "PROTECTED_HEALTH_INFORMATION"
  );
  let redactedFileText = fileText;
  redactedWords.forEach(
    word =>
      (redactedFileText = replaceAt(
        redactedFileText,
        word.BeginOffset - 1,
        "*".repeat(word.Text.length)
      ))
  );
  return (
    <Container>
      <FileSelector>
        <Select bottomGutter={37}>
          <select>
            {files.map(file => (
              <option key={file.name} value={file.name}>
                {file.name}
              </option>
            ))}
          </select>
          <SelectIndicator>
            {selectedFileIndex + 1}/{files.length}
          </SelectIndicator>
        </Select>
      </FileSelector>
      <FileRedactor>
        <div className="header">
          <p>
            We’ve redacted <span className="bold">24</span> spots which could be
            potentially sensitive
          </p>
          <h2>Verify Redaction</h2>
          <FileSelector>
            <Select>
              <select onChange={e => console.log(e)}>
                {redactedWords.map(word => (
                  <option key={word.Id} value={word.Text}>
                    {word.Text}
                  </option>
                ))}
              </select>
              <SelectIndicator>
                {selectedRedactedWord + 1}/{redactedWords.length}
              </SelectIndicator>
            </Select>
            <Button sideGutter={16}>Redact</Button>
            <Button secondary>Cancel Redact</Button>
          </FileSelector>
        </div>
        <DividerLine />
        <FileText dangerouslySetInnerHTML={{ __html: redactedFileText }} />
      </FileRedactor>
      {/* <p className="input">
        <input
          id="defaultCheckbox"
          type="checkbox"
          className="si si-checkbox"
        />{" "}
        <label class="si si-checkbox" for="defaultCheckbox">
          <input id="defaultCheckbox" type="checkbox" />
          <span class="si-label">Default checkbox state</span>
        </label>
        
      </p> */}
      <Checkbox>
        <label class="si si-checkbox" for="defaultCheckbox">
          <input id="defaultCheckbox" type="checkbox" />
          <span class="si-label">
            I agree to the <span>consent form</span>
          </span>
        </label>
      </Checkbox>
      <Button width={270} onClick={() => setStep(2)}>
        Yes, they’re all ready to go
      </Button>
    </Container>
  );
};

const mapStateToProps = state => ({
  files: state.files
});

const mapDispatchToProps = dispatch => ({
  setStep: index => dispatch({ type: "SET_STEP", payload: { step: index } })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Verify);
