import React, { useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import Button from "./Button";

const Container = styled.div`
  h2,
  p {
    font-size: 24px;
    margin: 0;
    padding: 0;
  }
  p {
    padding: 30px 0;
  }
  div {
    width: 312px;
  }
`;

const Done = ({ clearFiles }) => {
  useEffect(() => {
    clearFiles();
  }, []);
  return (
    <Container>
      <h2>Thanks for your valuable information</h2>
      <p>Our APprove community is becoming even better because of you</p>
      <Button>Upload more HERC documents</Button>
    </Container>
  );
};

const mapDispatchToProps = dispatch => ({
  clearFiles: () => dispatch({ type: "CLEAR_FILES" })
});

export default connect(
  null,
  mapDispatchToProps
)(Done);
