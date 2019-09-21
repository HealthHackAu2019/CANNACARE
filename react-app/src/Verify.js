import React, { useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import Button from "./Button";

const Container = styled.div`
  p {
    padding: 24px 35px;
    span {
      color: #1ebf68;
    }
  }
`;

const Select = styled.select`
  display: block;
  font-size: 16px;
  font-family: sans-serif;
  font-weight: 700;
  color: #444;
  line-height: 1.3;
  padding: 0.6em 4.4em 0.5em 0.8em;
  width: 100%;
  max-width: 470px;
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
  ::-ms-expand {
    display: none;
  }
  :hover {
    border-color: #888;
  }
  :focus {
    border-color: #aaa;
    box-shadow: 0 0 1px 3px rgba(59, 153, 252, 0.7);
    box-shadow: 0 0 0 3px -moz-mac-focusring;
    color: #222;
    outline: none;
  }
  option {
    font-weight: normal;
  }
`;

const FileSelector = styled.div`
  display: flex;
  position: relative;
  padding-bottom: 37px;
  align-items: center;
`;
const FileRedactor = styled.div`
  border: 1px solid #e7edf1;
  box-sizing: border-box;
  border-radius: 8px;
  div.header {
    padding: 30px 25px;
    p,
    h2 {
      margin: 0;
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
	left: 420px;
`;

const redactedWords = [
  "Matthew",
  "Burfield",
  "Pharmacy",
  "Griffith University"
];

const fileText = `Will there be any follow-up?
Community pharmacists at participating pharmacies will be asked to complete the pharmacist post-consultation record form for
50 consecutive minor. ailment consultations. They will be asked to document information about the patient (seld or proxy,
approximate age, and gender), if they referred the patient (immediately, conditionally, or not at all), where they referred them
to
(GP, ED, other), and reason for referral (Patient likely needs ANTIBIOTICS or Patient likely needs further medical evaluation
and/or other prescription but NOT antibiotics).
Additional information collected about the pharmacy and data collection period include information about the data collection
period (start and finish date, if data collection occurred outside of office hours, how busy the pharmacy was), and information
about the pharmacy (postcode, state, region: urban rural etc, and location: co-located with GP, medical center, street, etc).
General practitioners will be asked to complete the GP post-consultation record form for 20 consecutive consultations. They will
also be asked to document information about the patient (age, gender), presenting problem (infection, medication related,
other), and who referred the patient (self, family friend, CP or other). As this last piece is not part of usual practice, GPs will`;

const Verify = ({ files }) => {
  const [selectedFileIndex, useSelectedFileIndex] = useState(0);
  const [selectedRedactedWord, useSelectedRedactedWord] = useState(0);
  return (
    <Container>
      <FileSelector>
        <Select>
          {files.map(file => (
            <option key={file.name} value={file.name}>
              {file.name}
            </option>
          ))}
        </Select>
        <SelectIndicator>
          {selectedFileIndex + 1}/{files.length}
        </SelectIndicator>
      </FileSelector>
      <FileRedactor>
        <div className="header">
          <p>
            We’ve redacted <span className="bold">24</span> spots which could be
            potentially sensitive
          </p>
          <h2>Verify Redaction</h2>
          <FileSelector>
            <Select onChange={e => console.log(e)}>
              {redactedWords.map(word => (
                <option key={word} value={word}>
                  {word}
                </option>
              ))}
            </Select>
            <SelectIndicator>
              {selectedRedactedWord + 1}/{redactedWords.length}
            </SelectIndicator>
            <Button sideGutter={16}>Redact</Button>
            <Button secondary>Cancel Redact</Button>
          </FileSelector>
        </div>
        <DividerLine />
        <FileText>{fileText}</FileText>
      </FileRedactor>
      <p>
        I agree to the <span>consent form</span>
      </p>
      <Button width={270}>Yes, they’re all ready to go</Button>
    </Container>
  );
};

const mapStateToProps = state => ({
  files: state.files
});

export default connect(mapStateToProps)(Verify);
