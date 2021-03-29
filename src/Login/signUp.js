import React, { useState, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link, path, useHistory } from "react-router-dom";

import { db } from "../firebase.prod";

import { doesUsernameExist } from "../services/firebase";

import * as ROUTES from "../constants/routes";

import Login from "./Login";
import { FirebaseContext } from "../context/firebase";
import CustomizedSnackbars from "../Popover/SnackbarAlert/snackBarAlert";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" to="/">
        Journaly
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const UseStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    cursor: "pointer",
  },
  profileImage : {
    textAlign:'center',
    color:'red'
  }
}));

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState();
  const [errors, setErrors] = useState(false);

  const [notes, setNotes] = useState("");
  const [quicknotes, setQuickNotes] = useState('')
  const [writingPrompt, setWritingPrompt] = useState('')
  const [image, setImage] = useState(null)

  const { firebase } = useContext(FirebaseContext);
  const history = useHistory();

  const handelSignup = async (event) => {
    event.preventDefault();

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) =>
        result.user
          .updateProfile({
            displayName: name,
            photoUrl:image
          })
          .then(() => {
            const currentUser = firebase.auth().currentUser;

            db.collection("users")
              .doc(currentUser.uid)
              .collection("notes")
              .add({
                notes: notes,
              });

              db.collection('users')
              .doc(currentUser.uid)
              .collection('quicknotes')
              .add({
                quicknotes:quicknotes
              })

              db.collection('users')
              .doc(currentUser.uid)
              .collection('WritingPrompt')
              .add({
                writingPrompt:writingPrompt
              })
            history.push(ROUTES.MAIN_DASH);
          })
      )
      .catch((error) => {
        setName("");
        setEmail("");
        setPassword("");
        setErrors(true)
      });
  };

  const handleFileUpload = () => {
    console.log("youve added a file");
    // upload the image to firebase
  };

  const classes = UseStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar> */}
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>

{ errors && <CustomizedSnackbars value = {errors} severity = 'error' message = 'Check your email or password. Almost there!' handle = {() => setErrors(false)} />}

        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="firstName"
                type="name"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={({ target }) => setName(target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                type="email"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={({ target }) => setEmail(target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                type="password"
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid> */}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handelSignup}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link className={classes.link} to={ROUTES.LOGIN} variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
