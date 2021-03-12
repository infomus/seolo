import React from "react";
import ReactQuill from "react-quill";
import debounce from "../helpers/helpers";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import DeleteIcon from "@material-ui/icons/Delete";
import './styles/editor.css'
import ButtonComponent from "./ButtonComponent";
import { useDispatch } from "react-redux";
import { closedToggle, openToggle } from "../features/toggleSlice";


function ButtonDispatch() {

  const dispatch = useDispatch();


  return(
    <div>
      <button onClick = {() => dispatch(openToggle())}>Open me</button>
      <button onClick = {() => dispatch(closedToggle())}>Close me</button>
    </div>
  )
}

class EditorComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      text: "",
      title: "",
      id: "",
    };
  }

  // ComponentDidMount is called when we press the first document and have it rendered on react-quill.
  componentDidMount = () => {
    this.setState({
      text: this.props.selectedNote.body,
      title: this.props.selectedNote.title,
      id: this.props.selectedNote.id,
    });
  };

  // The componentDidUpdate is called when we select a note and the id of the selected note is not equal to the id of the react-quill paper. It then goes on to render the state with the proper notes
  componentDidUpdate = () => {
    if (this.props.selectedNote.id !== this.state.id) {
      this.setState({
        text: this.props.selectedNote.body,
        title: this.props.selectedNote.title,
        id: this.props.selectedNote.id,
      });
    }
  };

  modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      
    ],
  };

  formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
  ];

  render() {
    const { classes, _note } = this.props;
    return (
      <>
      
        <BorderColorIcon className={classes.editIcon}></BorderColorIcon>
        <div className={classes.titleContainer}>
          <input
            type="text"
            className={classes.titleInput}
            placeholder="Title here"
            maxlength="70"
            value={this.state.title ? this.state.title : ""}
            onChange={(e) => this.updateTitle(e.target.value)}
          ></input>
        <div className = 'toggleButton'>
          <ButtonDispatch />
        </div>
        </div>
        <div className={classes.editorContainer}>
          
          <ReactQuill
            theme={"snow"}
            value={this.state.text}
            onChange={this.updateBody} // the this.updateBody is a function that is asynchronous
            className={classes.quill}
            formats={this.formats}
            modules={this.modules}
            formats={this.formats}
            placeholder = {"Your entry here"}
            
          ></ReactQuill>
        </div>
      </>
    );
  }

  updateTitle = async (txt) => {
    await this.setState({
      title: txt,
    });
    this.update();
  };

  updateBody = async (val) => {
    await this.setState({ text: val }); // the updateBody will set the state of the text to the value
    this.update();
  };

  update = debounce(() => {
    // this function will update the database when the user stops typing for .5s. It is a debounce that is used sort of like auto-save
    this.props.noteUpdate(this.state.id, {
      title: this.state.title,
      body: this.state.text,
    });
  }, 500);

  deleteNote = (note) => {
    if (window.confirm(`Are you sure you want to delete: ${note.title}`)) {
      this.props.deleteNote(note);
    }
  };
}

export default withStyles(styles)(EditorComponent); // The withStyles takes an argument which is styles. withStyles returns another function and we invoke that function with our editor component
// We will be able to access those classes from the styles.js
