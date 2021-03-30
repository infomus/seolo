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

import TextareaAutosize from "@material-ui/core/TextareaAutosize";

import MoreVertIcon from "@material-ui/icons/MoreVert";
import {Dropdown} from 'react-bootstrap'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import 'bootstrap/dist/css/bootstrap.min.css';

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
    min-height:190px !important;
    max-height: 190px !important;
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

  .promptButtons {
    display: flex;
  }

  .btn-primary {
    background-color:white !important;
    border:none !important;
    color:black !important;
  }

  .dropdown-toggle::after {
    display:none;
  }
`;

class Prompt extends React.Component {
  constructor() {
    super();

    this.state = {
      random: "😄 100+ writing prompt to give you some inspiration 😄",
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
              <div className="promptButtons">
                <button className="buttonPrompter" onClick={this.handleClick}>
                  <RefreshIcon />
                </button>
                <button
                  className="buttonPrompter"
                  
                >

                  <Dropdown>
          <Dropdown.Toggle>

                  <MoreVertIcon />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-2"><AddCircleOutlineIcon />New</Dropdown.Item>
            <Dropdown.Item onClick={() => this.setState({ expand: true })}><AspectRatioIcon />Expand</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
                </button>
              </div>
            </div>
          </div>
          <TextareaAutosize
            type="text"
            placeholder="Paste your prompt here & use the pad on the left to jot some ideas down!"
            value={this.state.title ? this.state.title : ""}
            onChange={(e) => this.updateTitle(e.target.value)}
            minRows={3}
            maxRows={20}
          />

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
            holder={"Paste prompt here"}
            value={this.state.title ? this.state.title : ""}
            funcUpdate={this.updatePrompt}
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
              this.setState({ title: data["title"] });
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
      title: txt,
    });

    console.log(this.state.title);
  };

  update = debounce(() => {
    this.noteUpdate(this.state.id, {
      writingPrompt: this.state.writingPrompt,
      title: this.state.title,
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
