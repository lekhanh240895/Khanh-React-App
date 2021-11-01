import styled from "styled-components";

//CSS

const StyledItem = styled.div`
  padding-bottom: 20px;
  display: flex;
  align-items: center;
`;

const StyledColumn = styled.span`
  padding-left: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  a {
    color: inherit;
  }

  width: ${(props) => props.width};
`;

const StyledButton = styled.button`
  padding: 5px;
  border: 1px solid #171212;
  cursor: pointer;
  background: transparent;
  transition: all 0.1s ease-in;

  &:hover {
    background: #171212;
    color: #ffff;
    svg {
      g {
        fill: #ffffff;
        stroke: #ffffff;
      }
    }
  }
`;

const StyledButtonSmall = styled(StyledButton)`
  padding: 5px;
`;

const StyledButtonLarge = styled(StyledButton)`
  padding: 10px;
`;

const StyledSearchForm = styled.form`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: stretch;
`;

const StyledLabel = styled.label`
  border: 1px solid #171212;
  border-right: none;
  font-size: 24px;
  padding-left: 5px;
`;

const StyledInput = styled.input`
  width: 100%;
  border: 1px solid #171212;
  border-right: none;
  background-color: transparent;
  font-size: 24px;
  margin-left: -5px;
  padding-left: 5px;
`;

const StyledNavbar = styled.nav`
  background: inherit;
  color: #067ded;
  fontweight: 600;
  fontsize: 18px;
`;

export {
  StyledInput,
  StyledLabel,
  StyledSearchForm,
  StyledItem,
  StyledColumn,
  StyledButton,
  StyledButtonSmall,
  StyledButtonLarge,
  StyledNavbar,
};
