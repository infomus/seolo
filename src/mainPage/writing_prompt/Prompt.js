import React from "react";
import ReactQuill from "react-quill";
import styled from "styled-components";

import HTMLFlipBook from "react-pageflip";
import JumboData from "../../fixtures/jumbo.json";
import RefreshIcon from "@material-ui/icons/Refresh";
import "../styles/UniversalDashboard.css";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import TransitionsModal from "../modal/ModalReactQuill";
import {
  Button,
  debounce,
  Divider,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { db, firebase } from "../../firebase.prod";

import Profile from "../profile/Profile";

import TextareaAutosize from "@material-ui/core/TextareaAutosize";

// import MoreVertIcon from "@material-ui/icons/MoreVert";

import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

import { Dropdown } from "react-bootstrap";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CheckIcon from "@material-ui/icons/Check";

import "bootstrap/dist/css/bootstrap.min.css";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import Drawer from "@material-ui/core/Drawer";
import { removeHTMLTags } from "../../helpers/helpers";
import DeleteIcon from "@material-ui/icons/Delete";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//-----------------------------------------------------------

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
    min-height: 160px !important;
    max-height: 160px !important;
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

  .btn-primary,
  .MuiButton-label {
    background-color: white !important;
    border: none !important;
    color: black !important;
  }

  .MuiButton-label:hover {
    background-color: #e9ecef !important;
    transform: none !important;
  }

  .buttonPrompter,
  .MuiButtonBase-root {
    margin: 0px;
    padding: 0px;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
  }

  .dropdown-toggle::after {
    display: none;
  }

  .dropdown-toggle {
    padding: 0;
  }
`;

class Prompt extends React.Component {
  constructor() {
    super();

    this.state = {
      random: "200+ writing prompts to give you some inspiration",
      expand: false,
      selectedPrompt: null,
      selectedPromptIndex: null,
      prompts: [],
      writingPrompt: "",
      title: "",
      id: "",
      idPrompt: "",
      open: false,
      writingDocs: [],
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

  toggleDrawerOpen = () => {
    this.setState({ open: true });
  };

  toggleDrawerClose = () => {
    this.setState({ open: false });
  };

  componentDidMount = async () => {
    await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.collection("users")
          .doc(firebase.auth().currentUser.uid)
          .collection("WritingPrompt")
          .orderBy("timestamp", "desc")
          .onSnapshot((serverUpdate) => {
            const prompts = serverUpdate.docs.map((_doc) => {
              const data = _doc.data();
              data["id"] = _doc.id;
              const timestamp = data["timestamp"];
              this.setState({
                id: _doc.id,
              });
              return data;
            });
            this.setState({
              prompts: prompts,
            });
            if(prompts) {
              this.setState({
                selectedPrompt:this.state.prompts[0]
              })
            }
          });
      }
    });
  };

  componentDidUpdate = async () => {
    if(this.state.prompts.length > 0) {

      if(this.state.selectedPrompt?.id !== this.state?.id) {
        await this.setState({
          writingPrompt: this.state.selectedPrompt?.writingPrompt,
          title: this.state.selectedPrompt?.title,
          id: this.state.selectedPrompt?.id,
        })
      }
    }
  }

  render() {
    const { classes, _prompt, _index } = this.props;

    return (
      <>
        <Prompter>
          <div className="generator">
            <div className="innerGeneratorContent">
              {this.state.random}
              <div className="Allbuttons">
                <button className="buttonPrompter" onClick={this.handleClick}>
                  <RefreshIcon />
                </button>
                {(this.state.prompts.length > 0) ? 
                <div
                  className="checkMarkForPrompt"
                  onClick={this.selectQuestion}
                >
                  <CheckIcon />
                </div>
                : null
              
            }
                <div className="promptButtons">
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

                        {
                          (this.state.prompts.length > 0) ?
                          <>
                        <Dropdown.Item
                          onClick={() => this.setState({ expand: true })}
                        >
                          <AspectRatioIcon />
                          Expand
                        </Dropdown.Item>
                        </>
                        : null

                        }

                        <Dropdown.Item onClick={this.toggleDrawerOpen}>
                          <FolderOpenIcon />
                          {this.state.prompts.length} - Folder
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {
            (this.state.prompts.length > 0) ?
<>
            <TextareaAutosize
              type="text"
              placeholder="Use the pad on the left to jot down some ideas!"
              value={this.state.title ? this.state.title : ""}
              onChange={(e) => this.updateTitle(e.target.value)}
            />
  
            <ReactQuill
              className="react-quill-prompter"
              theme={"bubble"}
              placeholder={"Your answer..."}
              onChange={this.updatePrompt}
              value={this.state.writingPrompt || ""}
            />
</>
            : <div>Create new prompts</div>

          }


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

        <div>
          <Drawer
            anchor={"left"}
            open={this.state.open}
            onClose={this.toggleDrawerClose}
          >
            {this.state.prompts.map((_prompt, _index) => {
              return (
                <div
                  key={_index}
                  onClick={() => this.selectPrompt(_prompt, _index)}
                >
                  <ListItem
                    button
                    selected={this.state.selectedPromptIndex === _index[0]}
                    alignItems="flex-start"
                    onClick={this.toggleDrawerClose}
                  >
                    <ListItemText
                      primary={_prompt.title?.substring(0, 20) + "..."}
                      secondary={
                        removeHTMLTags(
                          _prompt.writingPrompt?.substring(0, 40)
                        ) + "..."
                      }
                    ></ListItemText>
                    <DeleteIcon
                      className={classes.deleteIcon}
                      onClick={() => this.deletePrompt(_prompt)}
                    ></DeleteIcon>
                    <Divider />
                  </ListItem>
                </div>
              );
            })}
          </Drawer>
        </div>
      </>
    );
  }

  updatePrompt = async (val) => {

      this.setState({
        writingPrompt: val,
      });

    this.update();
  };

  updateTitle = async (txt) => {

      this.setState({
        title: txt,
      });

    this.update();
  };

  selectQuestion = async () => {
    this.setState({ title: this.state.random });
    this.update();
  };

  update = debounce(() => {
    this.noteUpdate(this.state.id, {
      writingPrompt: this.state.writingPrompt,
      title: this.state.title,
    });
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

  };

  selectPrompt = (prompt, index) => {
    this.setState({ selectedPromptIndex: index, selectedPrompt: prompt });
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
    await this.setState({ prompts: [...this.state.prompts, promptNote] });
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

  deletePrompt = async (prompt) => {
    if (window.confirm(`Are you sure you want to delete this prompt`)) {
      const promptIndex = this.state.prompts.indexOf(prompt);
      await this.setState({
        prompts: this.state.prompts.filter((_prompt) => _prompt !== prompt),
      });

      if (this.state.selectedPromptIndex === promptIndex) {
        this.setState({ selectedPromptIndex: null, selectedPrompt: null });
      } else {
        this.state.prompts.length > 1
          ? this.selectPrompt(
              this.state.prompts[this.state.selectedPromptIndex - 1],
              this.state.selectedPromptIndex - 1
            )
          : this.setState({ selectedPromptIndex: null, selectedPrompt: null });
      }

      db.collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("WritingPrompt")
        .doc(prompt.id)
        .delete();
    }
  };
}

export default withStyles(styles)(Prompt);
