import React from "react";
import styled from "styled-components";

import Dropzone from "./Dropzone";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  section.top {
    background-color: #71858c;
    height: 50%;
  }
  section.bottom: {
    background-color: red;
  }
`;

const Home = () => (
  <Container>
    <section className="top"></section>
    <section className="bottom">
      <Dropzone />
    </section>
  </Container>
);

export default Home;
