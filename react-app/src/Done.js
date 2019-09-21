import React from "react";
import styled from "styled-components";

import Button from "./Button";

const Container = styled.div`
  h2,
  p {
    font-size: 28px;
    margin: 0;
    padding: 0;
  }
  p {
    padding: 40px 0;
  }
  div {
    width: 312px;
  }
`;

const Done = () => {
  return (
    <Container>
      <h2>Thanks for your valuable information</h2>
      <p>Our APprove community is becoming even better because of you</p>
      <Button>Upload more HERC documents</Button>
    </Container>
  );
};

export default Done;
