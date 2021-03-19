import React from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteIcon from "@material-ui/icons/Delete";
import { removeHTMLTags } from "../helpers/helpers";
import './sidebarItem.css'

import { firebase,db } from "../firebase.prod";




class sidebarItemComponent extends React.Component {
  constructor() {
    super();

  }

  render() {
    const { _index, _note, classes, selectedNoteIndex } = this.props;

    return (
      
      <>
      <div
      key={_index}
      onClick={() => this.selectNote(_note, _index)}
      >
        
        <ListItem
          className={classes.ListItem}
          selected={selectedNoteIndex === _index[0]}
          alignItems="flex-start"
          >
          <div className={classes.textSection}>
            <ListItemText
              primary={_note.title}
              secondary={removeHTMLTags(_note.body.substring(0, 30)) + "..."}
            >
              
            </ListItemText>
          </div>
          <DeleteIcon
            onClick={() => this.deleteNote(_note)}
            className={classes.deleteIcon}
          ></DeleteIcon>
        </ListItem>
      </div>
      </>
      
    );
  }



  selectNote = (n, i) => this.props.selectNote(n, i);

  deleteNote = (note) => {
    if (window.confirm(`Are you sure you want to delete: ${note.title}`)) {
      this.props.deleteNote(note);
    }
  };
}


export default withStyles(styles)(sidebarItemComponent);
