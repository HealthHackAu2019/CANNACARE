import styled from "styled-components";

const Button = styled.div`
  line-height: 48px;
  margin: ${props => (props.sideGutter ? `0 ${props.sideGutter}px` : "0")}
  width: ${props => (props.width ? `${props.width}px` : "auto")}
  color: ${props => (props.secondary ? "black" : "white")};
  background-color: ${props => (props.secondary ? "white" : "black")};
  padding: 0 17px;
  border: 1px solid #0F0B08;
  box-sizing: border-box;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
  :hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

export default Button;
