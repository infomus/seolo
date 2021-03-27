import React from "react";
import ReactQuill from "react-quill";
import styled from "styled-components";

import HTMLFlipBook from "react-pageflip";
import JumboData from "../../fixtures/jumbo.json";
import RefreshIcon from "@material-ui/icons/Refresh";
import '../styles/UniversalDashboard.css'
import AspectRatioIcon from '@material-ui/icons/AspectRatio';

const Prompter = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 10px;

  .ql-editor {
    background-color: white !important;
    border-radius:20px;
  }

  .react-quill-prompter {
    background-color: white !important;
    height: 100% !important;
    border-radius: 20px !important;
  }

  .ql-hidden,
  .ql-tooltip {
    display: none !important;
  }
`;

class Prompt extends React.Component {
  constructor() {
    super();

    this.state = {
      random: "😄 Writing prompt to give you some inspiration 😄",
    };
  }

  handleClick = () => {
    const values = Object.values(JumboData);
    const randomValue = values[parseInt(Math.random() * values.length)];

    this.setState({ random: randomValue });
  };

  render() {
    return (
      <>
        <Prompter>
          <div className="generator">
            <div className="innerGeneratorContent">
              {this.state.random}
              <button className="buttonPrompter" onClick={this.handleClick}>
                <RefreshIcon />
              </button>
            </div>
          </div>
          <ReactQuill
            className="react-quill-prompter"
            theme={"bubble"}
            placeholder={"Inspire me!"}
          />
        </Prompter>
      </>
    );
  }
}

export default Prompt;
