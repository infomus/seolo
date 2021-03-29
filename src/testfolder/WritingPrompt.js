import React from "react";
import Profile from "../mainPage/profile/Profile";
import Prompt from "../mainPage/writing_prompt/Prompt";
import styled from "styled-components/macro";
import "./styles/Prompt.css";
import QuickNotes from "../mainPage/QuickSelfReflection/QuickNotes";
const promptContainer = styled.div`
  .writingPrompts {
    display: flex !important;
  }
`;

class WritingPrompt extends React.Component {
  render() {
    return (
      <promptContainer>
        <div className="writingPrompts">
          <Profile />
          <div className="Writing">
            <QuickNotes />
            <Prompt className="promptwriting" />
          </div>
        </div>
      </promptContainer>
    );
  }
}

export default WritingPrompt;
