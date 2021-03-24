import React, {useState} from 'react'

import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import { useAuthListener } from "../../hooks";

import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";



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
    },
  }));

export default function ModalAuth({open, close}) {
    const { user } = useAuthListener();
    const history = useHistory();

    const classes = useStyles();
    const [email, setEmail] = useState("");


  const handleSignIn = (event) => {
    event.preventDefault();

    // ask them for a  4 digit number and then save it in a state and have them use that as a code to enter the journal application
    if (email == user.email) {
      history.push("/DASHBOARD");
    } else {
      alert("Please use same credentials");
    }
  };


    return(

        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={close}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="email"
              name="email"
              type="email"
              autoFocus
              onChange={({ target }) => setEmail(target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSignIn}
            >
              Proceed
            </Button>
          </div>
        </Fade>
      </Modal>
    )
}