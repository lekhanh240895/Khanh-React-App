import styled from "styled-components";

const StyledMessage = styled.p`
  text-transform: capitalize;
  font-size: 20px;
  font-weight: 600;
  font-style: italic;
  margin-top: 1.5rem;
`;

const StyledLabel = styled.label`
  text-transform: capitalize;
  font-size: 20px;
  font-weight: 600;
  padding: 0.5rem 0;
`;

const StyledForm = styled.form`
  margin: 0.5rem 0;
`;

const StyledNavbar = styled.nav`
  background: inherit;
  color: #067ded;
  fontweight: 600;
  fontsize: 18px;
`;

export { StyledMessage, StyledLabel, StyledForm, StyledNavbar };
