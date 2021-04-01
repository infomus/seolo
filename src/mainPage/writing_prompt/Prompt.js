import React from "react";
import ReactQuill from "react-quill";
import styled from "styled-components";

import HTMLFlipBook from "react-pageflip";
import JumboData from "../../fixtures/jumbo.json";
import RefreshIcon from "@material-ui/icons/Refresh";
import "../styles/UniversalDashboard.css";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import TransitionsModal from "../modal/ModalReactQuill";
import { Button, debounce } from "@material-ui/core";
import { db, firebase } from "../../firebase.prod";

import styles from "../../editor/styles";
import Profile from "../profile/Profile";

import TextareaAutosize from "@material-ui/core/TextareaAutosize";

// import MoreVertIcon from "@material-ui/icons/MoreVert";

import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

import { Dropdown } from "react-bootstrap";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import "bootstrap/dist/css/bootstrap.min.css";
import SwipeableTemporaryDrawer from "./SideDrawer";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";

//-----------------------------------------------------------

import { connect, useDispatch, useSelector } from "react-redux";
import {
  closedToggle,
  openToggle,
  selectToggleIsOpen,
} from "../../features/toggleSlice";
import { bindActionCreators } from "redux";

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
    min-height: 168px !important;
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
    flex-direction: column;
  }

  .btn-primary {
    background-color: white !important;
    border: none !important;
    color: black !important;
  }

  .buttonPrompter {
    margin: 0px;
    padding: 0px;
  }

  .dropdown-item {
    display:flex;
    align-items:center;
  }

  .dropdown-toggle::after {
    display: none;
  }
`;

function ButtonDispatch() {
  const dispatch = useDispatch();

  const selectedToggle = useSelector(selectToggleIsOpen);

  const handlePopover = () => {
    dispatch(openToggle(true));
    console.log(selectedToggle)
  };

  return (
    <>
      <Dropdown.Item  onClick={handlePopover}>
        <FolderOpenIcon />
        < SwipeableTemporaryDrawer />

      </Dropdown.Item>
    </>
  );
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    { selectToggleIsOpen: selectToggleIsOpen },
    dispatch
  );
}

class Prompt extends React.Component {
  constructor() {
    super();

    this.state = {
      random: "😄 100+ writing prompts to give you some inspiration 😄",
      expand: false,
      selectedPrompt: null,
      selectedPromptIndex: null,
      prompts: null,
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
                <button className="buttonPrompter">
                  <Dropdown>
                    <Dropdown.Toggle>
                      <MoreHorizIcon />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={this.newPrompt}>
                        <AddCircleOutlineIcon />
                        New
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => this.setState({ expand: true })}
                      >
                        <AspectRatioIcon />
                        Expand
                      </Dropdown.Item>

                      <ButtonDispatch />
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
              const timestamp = data["timestamp"];
              this.setState({ id: _doc.id });
              return data;
            });
            this.setState({ prompts: writingPrompt });
            console.log("prompts", this.state.prompts);
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
  }, 2500);

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
  };

  newPrompt = async () => {
    const promptNote = {
      title: "",
      writingPrompt: "",
    };

    const newPromptFromDB = await db // we await the firebase call. When firebase is done it will set
      //newPromptFromDB to the firebase call
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("WritingPrompt")
      .add({
        title: promptNote.title,
        writingPrompt: promptNote.writingPrompt,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

    const newPromptID = newPromptFromDB.id;
    await this.setState({ prompts: [...this.state.writingPrompt, promptNote] });
    const newPromptIndex = this.state.prompts.indexOf(
      // the indexOf() method returns the first index at which a given element can be found
      // in the arrayconst beasts = ['ant', 'bison', 'camel', 'duck', 'bison'];
      //console.log(beasts.indexOf('bison'));  expected output: 1
      this.state.prompts.filter((_prompt) => _prompt.id === newPromptID)[0]
      // because the filter returns an array but in this case it returns one item so we immidiately set it to index 0
    );
    this.setState({
      selectedPrompt: this.state.writingPrompt[newPromptIndex],
      selectedPromptIndex: newPromptIndex,
    });
  };
}

connect(matchDispatchToProps)(Prompt);

export default Prompt;
