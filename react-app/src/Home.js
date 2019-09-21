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
    height: 20%;
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
    padding: 50px 0 0;
    justify-content: center;
  }
`;

const Home = () => (
  <Container>
    <section className="top">
      <h2 className="active">I want to contribute to the database</h2>
      <h2>I want to explore the database</h2>
    </section>
    <section className="bottom">
      <Dropzone />
    </section>
  </Container>
);

export default Home;
