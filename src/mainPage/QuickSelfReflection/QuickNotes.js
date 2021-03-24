import React from "react";
import styled from "styled-components";
import ReactQuill from "react-quill";
import { db, firebase } from "../../firebase.prod";
import debounce from "../../helpers/helpers";

const Quill = styled.div`
  display: flex;
  padding-top: 50px;
  .react-quill-editor {
    width: 350px;
    height: 350px;
    background-color: #fff4ba !important;
    border-radius: 20px !important;

  }

  @media (min-width: 1500px) {
    .react-quill-editor {
      width: 450px !important;
    }
  }

  .ql-hidden,
  .ql-tooltip {
    display: none !important;
  }

.quill > .ql-container > .ql-editor.ql-blank::before{
  font-size: 13px;
  font-family:'nunito';
}

  .ql-editor {
    background-color: #fff4ba !important;
    border-radius: 20px !important;
    -webkit-box-shadow: 9px 3px 19px 1px rgba(0, 0, 0, 0.07);
    -moz-box-shadow: 9px 3px 19px 1px rgba(0, 0, 0, 0.07);
    box-shadow: 9px 3px 19px 1px rgba(0, 0, 0, 0.07);
  }

  .writing-prompt {
      
    flex: 1;
    background: white;
    border-radius: 20px;
    margin-left: 10px;
    padding: 10px;
    opacity:0.4;

  }


`;

class QuickNotes extends React.Component {
  constructor() {
    super();
    this.state = {
      notesquick: null,
      quicknotes: "",
      id: "",
    };
  }



  render() {
    return (
      <>
        <Quill>
          <ReactQuill
            className="react-quill-editor"
            theme={"bubble"}
            placeholder={"Self-Reflection Scratch Pad..."}
            onChange={this.UpdateQuickNotes}
            value={this.state.quicknotes}
          />
          <div className="writing-prompt">
              Writing prompts goes here
          </div>
        </Quill>
      </>
    );
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.collection("users")
          .doc(firebase.auth().currentUser.uid)
          .collection("quicknotes")
          .onSnapshot((serverUpdate) => {
            const quicknotes = serverUpdate.docs.map((_doc) => {
              const data = _doc.data();
              data["id"] = _doc.id;
              this.setState({quicknotes: data["quicknotes"]})
              const timestamp = data["timestamp"];
              this.setState({ id: _doc.id });
              return data;
            });
            this.setState({ notesquick: quicknotes });
          });
      }
    });
  };

  UpdateQuickNotes = async (val) => {
    await this.setState({ quicknotes: val });
    this.update();
  };

  update = debounce(() => {
    this.noteUpdate(this.state.id, {
      quicknotes: this.state.quicknotes,
    });
  }, 1500);

  noteUpdate = (id, noteObj) => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("quicknotes")
      .doc(id)
      .update({
        quicknotes: noteObj.quicknotes,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
  };
}

export default QuickNotes;
