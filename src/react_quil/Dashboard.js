import React, { useContext, useEffect } from "react";

import { db, firebase } from "../firebase.prod";
import SidebarComponent from "../sidebar/sidebar";
import EditorComponent from "../editor/editor";
import { FirebaseContext } from "../context/firebase";

import "./styles/dashboard.css";

import CryptoJS from 'crypto-js'
import CryptoAES from 'crypto-js/aes'




class Dashboard extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedNoteIndex: null,
      selectedNote: null,
      notes: null,
      saving:''
    };
  }


  render() {
    return (
      <>
        <div>
          <SidebarComponent
            selectedNoteIndex={this.state.selectedNoteIndex}
            notes={this.state.notes}
            selectNote={this.selectNote}
            deleteNote={this.deleteNote}
            newNote={this.newNote}
          ></SidebarComponent>
          {this.state.selectedNote ? (
            <EditorComponent
              selectedNote={this.state.selectedNote}
              selectedNoteIndex={this.state.selectedNoteIndex}
              notes={this.state.notes}
              deleteNote={this.deleteNote}
              noteUpdate={this.noteUpdate}
            ></EditorComponent>
          ) : (
            <div className="noNote">
              <div className = "journal_image">
                <img src="https://cdn.dribbble.com/users/1361034/screenshots/14130497/media/816057f02de78cd5a738eeb929f82fb2.png?compress=1&resize=1200x900" alt=""/>
                <div className = "title">Click "New Note" to start journaling</div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.collection("users")
          .doc(firebase.auth().currentUser.uid)
          .collection("notes")
          .orderBy("timestamp", "desc")
          .onSnapshot((serverUpdate) => {
            // onSnapshot is a firestore function. Everytime the notes collection gets updated, then onSnapshot gets called. The function that we pass inside of onSnapshot will get called and we can see we call the serverUpdate
            const notes = serverUpdate.docs.map((_doc) => {
              // we created a constant called notes which is going to be our array. docs basically houses all the notes. For each _doc
              const data = _doc.data(); // we want to create a const called data and we return the data
              data["id"] = _doc.id;
              const timestamp = data["timestamp"]
              return data; // we return data
            });
            this.setState({ notes: notes }); // we set the state where we set notes to the array notes
            if (notes) {
              this.setState({
                selectedNote: this.state.notes[0],
              });
            }
          });
      } else {
        console.log("cant find user");
      }
    });
  };

  selectNote = (note, index) =>
    this.setState({ selectedNoteIndex: index, selectedNote: note });
    
  noteUpdate = (id, noteObj) => {

    // var cipherText = CryptoJS.AES.encrypt(this.state.notes[0].body, 'my secret key').toString()
    // console.log('encrypted body', cipherText)

    
    // var bytes = CryptoJS.AES.decrypt(cipherText, 'secret key 123');
    // var originalText = bytes.toString(CryptoJS.enc.Utf8)
    // console.log(originalText)

    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("notes")
      .doc(id)
      .update({
        title: noteObj.title,
        body: noteObj.body, // We have to encrypt this so the messages can't be read
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });


  };

  EncryptData = (body) => {

  }

  newNote = async (title) => {
    const note = {
      title: title,
      body: "",
    };
    const newFromDB = await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("notes")
      .add({
        title: note.title,
        body: note.body,
        timestamp: firebase.firestore.FieldValue.serverTimestamp() // This server time stamp is a problem to why the notes were not added.

      });
    const newID = newFromDB.id;
    await this.setState({ notes: [...this.state.notes, note] });
    const newNoteIndex = this.state.notes.indexOf(
      this.state.notes.filter((_note) => _note.id === newID)[0]
    );
    this.setState({
      selectedNote: this.state.notes[newNoteIndex],
      selectedNoteIndex: newNoteIndex,
    });

  };

  deleteNote = async (note) => {
    const noteIndex = this.state.notes.indexOf(note);
    await this.setState({
      notes: this.state.notes.filter((_note) => _note !== note),
    });
    if (this.state.selectedNoteIndex === noteIndex) {
      this.setState({ selectedNoteIndex: null, selectedNote: null });
    } else {
      this.state.notes.length > 1
        ? this.selectNote(
            this.state.notes[this.state.selectedNoteIndex - 1],
            this.state.selectedNoteIndex - 1
          )
        : this.setState({ selectedNoteIndex: null, selectedNote: null });
    }

    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("notes")
      .doc(note.id)
      .delete();
  };
}


export default (Dashboard)



