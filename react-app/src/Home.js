import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import Dropzone from "./Dropzone";
import APS from "./APS";
import Verify from "./Verify";
import Done from "./Done";
import UploadStep from "./UploadStep";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  div.logo {
    position: absolute;
    left: 0;
    top: 20px;
    color: white;
    font-size: 18px;
    line-height: 18px;
    span {
      padding: 0 2px;
      border-radius: 4px;
      background-color: #38ca7b;
    }
  }
  div.menu {
    position: absolute;
    top: 10px;
    right: 0;
    display: flex;
    div {
      color: white;
      padding: 10px 20px;
      height: 18px;
    }
    .login {
      border: 1px solid #71858c;
      border-radius: 20px;
      top: 20px;
    }
    .about {
    }
  }
  div.top {
    height: 15%;
    background-color: #272e31;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
    header {
      height: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
      color: white;
      width: 1100px;
      margin: 0 auto;
      position: relative;
      h2 {
        margin: 0 20px 0 0;
        border-bottom: 4px solid transparent;
        padding: 0 0 11px;
        :hover {
          cursor: pointer;
        }
      }
      h2.active {
        border-bottom: 4px solid white;
      }
    }
  }
  section.bottom {
    display: flex;
    flex-direction: column;
    padding: 50px 0;
    justify-content: center;
    width: 1100px;
    margin: 0 auto;
    div.uploadStepsContainer {
      position: relative;
      width: 700px;
      div.divider {
        position: absolute;
        top: 25px;
        left: 0;
        right: 0px;
        border: 1px dashed #71858c;
        z-index: -1;
      }
      display: flex;
      justify-content: space-between;
      padding-bottom: 50px;
    }
  }
`;

const uploadSteps = ["Upload", "Verify Redaction", "Upload APS Doc", "Done"];

const Home = ({ stepIndex, files }) => {
  return (
    <Container>
      <div className="top">
        <header>
          <div className="logo">
            <span>AP</span>PROVE ME
          </div>
          <div className="menu">
            <div className="about">About Us</div>
            <div className="login">Login</div>
          </div>
          <h2 className="active">I want to contribute to the database</h2>
          <h2>I want to explore the database</h2>
        </header>
      </div>
      <section className="bottom">
        <div className="uploadStepsContainer">
          <div className="divider" />
          {uploadSteps.map((step, index) => (
            <UploadStep key={step} index={index}>
              {step}
            </UploadStep>
          ))}
        </div>
        {stepIndex === 0 && <Dropzone />}
        {stepIndex === 1 && <Verify />}
        {stepIndex === 2 && <APS />}
        {stepIndex === 3 && <Done />}
      </section>
    </Container>
  );
};

const mapStateToProps = state => ({
  stepIndex: state.stepIndex,
  files: state.files
});

export default connect(mapStateToProps)(Home);
