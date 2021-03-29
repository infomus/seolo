import React from "react";
import ReactQuill from "react-quill";
import styled from "styled-components";

import HTMLFlipBook from "react-pageflip";
import JumboData from "../../fixtures/jumbo.json";
import RefreshIcon from "@material-ui/icons/Refresh";
import "../styles/UniversalDashboard.css";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import TransitionsModal from "../modal/ModalReactQuill";
import { debounce } from "@material-ui/core";
import { db, firebase } from "../../firebase.prod";

import styles from "../../editor/styles";
import Profile from "../profile/Profile";

const Prompter = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 10px;

  .ql-editor {
    background-color: white !important;
    border-bottom-left-radius: 20px !important;
    border-bottom-right-radius: 20px !important;
  }

  .react-quill-prompter {
    background-color: white !important;
    height: 100% !important;
    border-bottom-left-radius: 20px !important;
    border-bottom-right-radius: 20px !important;
  }

  .ql-hidden,
  .ql-tooltip {
    display: none !important;
  }

  textarea {
    border: none;
    outline: none;
    font-family: "Roboto";
    font-size: 16px;
    padding: 20px;
    font-weight: 600;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
`;

class Prompt extends React.Component {
  constructor() {
    super();

    this.state = {
      random: "😄 Writing prompt to give you some inspiration 😄",
      expand: false,
      prompts: "",
      writingPrompt: "",
      title: "",
      id: "",
    };
  }

  handleClick = () => {
    const values = Object.values(JumboData);
    const randomValue = values[parseInt(Math.random() * values.length)];

    this.setState({ random: randomValue });
  };

  handleModalClose = () => {
    this.setState({ expand: false });
  };

  render() {
    return (
      <>
        <Prompter>
          <div className="generator">
            <div className="innerGeneratorContent">
              {this.state.random}
              <div>
                <button className="buttonPrompter" onClick={this.handleClick}>
                  <RefreshIcon />
                </button>
                <button onClick={() => this.setState({ expand: true })}>
                  <AspectRatioIcon />
                </button>
              </div>
            </div>
          </div>
          <textarea
            type="text"
            placeholder="Title here"
            maxlength="70"
            value={this.state.random}
            onChange={(e) => this.updateTitle(e.target.value)}
          ></textarea>

          <ReactQuill
            className="react-quill-prompter"
            theme={"bubble"}
            placeholder={"Your answer..."}
            onChange={this.updatePrompt}
            value={this.state.writingPrompt}
          />
          {this.state.expand}
        </Prompter>

        {this.state.expand && (
          <TransitionsModal
            bool={this.state.expand}
            handleClose={this.handleModalClose}
            reactQuillValue={this.state.writingPrompt}
          />
        )}
      </>
    );
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.collection("users")
          .doc(firebase.auth().currentUser.uid)
          .collection("WritingPrompt")
          .onSnapshot((serverUpdate) => {
            const writingPrompt = serverUpdate.docs.map((_doc) => {
              const data = _doc.data();
              data["id"] = _doc.id;
              this.setState({ writingPrompt: data["writingPrompt"] });
              const timestamp = data["timestamp"];
              this.setState({ id: _doc.id });
              return data;
            });

            this.setState({ prompts: writingPrompt });
          });
      }
    });
  };

  updatePrompt = async (val) => {
    await this.setState({ writingPrompt: val });

    this.update();
  };

  updateTitle = async (txt) => {
    await this.setState({
      title: this.state.random,
    });

    console.log(this.state.title);
  };

  update = debounce(() => {
    this.noteUpdate(this.state.id, {
      writingPrompt: this.state.writingPrompt,
      title: this.state.random,
    });
    console.log("title", this.state.title);
  }, 1500);

  noteUpdate = (id, noteObj) => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("WritingPrompt")
      .doc(id)
      .update({
        title: noteObj.title,
        writingPrompt: noteObj.writingPrompt,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

    console.log(noteObj.writingPrompt);
  };
}

export default Prompt;
