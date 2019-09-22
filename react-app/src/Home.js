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
    left: 50px;
    top: 10px;
    color: white;
    font-size: 18px;
    line-height: 18px;
    span {
      padding: 0 2px;
      border-radius: 4px;
    }
    .approve {
      span {
        background-color: #38CA7B;
      }
    }
    .community {
      span {
        background-color: #75797B;
      }
    }
  }
  div.menu {
    position: absolute;
    top: 10px;
    right: 50px;
    display: flex;
    div {
      color: white;
      padding: 10px 20px;
      height: 18px;
    }
    .login {
      border: 1px solid #71858C;
      border-radius: 20px;
    }
    .about {

    }
  }
  header.top {
    height: 15%;
    background-color: #272e31;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    color: white;
    h2 {
      padding: 0 0 11px;
      margin: 0 20px;
      border-bottom: 4px solid transparent;
      :hover {
        cursor: pointer;
      }
    }
    h2.active {
      border-bottom: 4px solid white;
    }
  }
  section.bottom {
    display: flex;
    flex-direction: column;
    padding: 50px 100px
    justify-content: center;
    div.uploadStepsContainer {
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
      <div className="logo">
        <div className="approve">
          <span>AP</span>PROVE
        </div>
        <div className="community">
          COMMUNITY <span>QLD</span>
        </div>
      </div>
      <div className="menu">
        <div className="about">About Us</div>
        <div className="login">Login</div>
      </div>
      <header className="top">
        <h2 className="active">I want to contribute to the database</h2>
        <h2>I want to explore the database</h2>
      </header>
      <section className="bottom">
        <div className="uploadStepsContainer">
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
