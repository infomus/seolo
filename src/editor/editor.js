import React, {useEffect} from "react";
import ReactQuill from "react-quill";
import debounce from "../helpers/helpers";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import DeleteIcon from "@material-ui/icons/Delete";
import './styles/editor.css'
import ButtonComponent from "./ButtonComponent";

import Button from '@material-ui/core/Button';


import { connect, useDispatch, useSelector } from "react-redux";
import { closedToggle, openToggle, selectToggleIsOpen } from "../features/toggleSlice";
import { bindActionCreators } from "redux";
import SimpleSnackbar from "../Popover/Snackbar";
import CustomizedSnackbars from "../Popover/SnackbarAlert/snackBarAlert";

import CryptoJS from 'crypto-js'
import CryptoAES from 'crypto-js/aes'


// var ciphertext = CryptoJS.AES.encrypt('this.state.text', 'secret key 123').toString();
// var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
// var originalText = bytes.toString(CryptoJS.enc.Utf8)
// console.log(originalText)


class EditorComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      text: "",
      title: "",
      id: "",
      saved:false
    };
  }

  decryptData = () => {


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
        </div>
        </div>
        {this.state.saving}
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
            focus
            
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
    this.update(); // this will run the update function
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
