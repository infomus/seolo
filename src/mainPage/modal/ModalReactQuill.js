import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import ReactQuill from "react-quill";

import styled from "styled-components";
import QuickNotes from "../QuickSelfReflection/QuickNotes";
// import Prompt from "../writing_prompt/Prompt";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';


const ReactQuillStyles = styled.div`

  height:100%;
  width:100%;
  margin-left:10px;


  .quill, .ql-container {
    height: 85% !important;
  }

  .modalPrompt {
    width:100% !important;
    height:100%;
  }

  textarea {
    width:100%;
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

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: "90%",
    height: "90%",
    display:'flex',
    borderRadius:'20px',
    outline:'none'
  },
}));

export default function TransitionsModal({bool, handleClose, reactQuillValue, holder,value, funcUpdate}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [promptText, setPromptText] = React.useState("")

  const handleOpen = () => {
    setOpen(true);
  };

 const updatePrompt = async (val) => {
    await setPromptText({reactQuillValue})
    console.log('promptmodal',promptText)
 }

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={bool}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 2000,
        }}
      >
        <Fade in={bool}>
          <div className={classes.paper}>
          <QuickNotes />
            {/* <Prompt /> */}

            <ReactQuillStyles>
          <div className="modalPrompt">
            <TextareaAutosize
            placeholder = {holder}
            value = {value}
            
            />
              <ReactQuill
              theme = {"snow"}
              value = {reactQuillValue}
              onChange = {funcUpdate}
              />
          </div>
            </ReactQuillStyles>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
