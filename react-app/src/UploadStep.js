import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

const Container = styled.div.attrs(props => ({
  isActive: props.isActive || false
}))`
  height: 48px;
  background: ${props => (props.isActive ? "#71858C" : "white")};
  border-radius: 24px;
  padding: 0 20px;
  color: ${props => (props.isActive ? "white" : "#272E31")};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  border: 1px solid #71858c;
  :hover {
    cursor: pointer;
  }
`;

const UploadStep = ({ children, index, stepIndex, setStep }) => (
  <Container isActive={index === stepIndex} onClick={() => setStep(index)}>
    {children}
  </Container>
);

const mapStateToProps = state => ({
  stepIndex: state.stepIndex
});

const mapDispatchToProps = dispatch => ({
  setStep: index => dispatch({ type: "SET_STEP", payload: { step: index } })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadStep);
