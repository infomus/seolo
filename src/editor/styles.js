const styles = theme => ({
    titleContainer : {
      display:'flex',
      justifyContent:'space-between',
      marginTop:'-16px'
    },
    root: {
      backgroundColor: theme.palette.background.paper,
      height: 'calc(100% - 35px)',
      position: 'absolute',
      left: '0',
      width: '300px',
      boxShadow: '0px 0px 2px black'
    },
    titleInput: {
      height: '50px',
      flex:'1',
      border: 'none',
      padding: '5px',
      fontSize: '24px',
      width: 'calc(100% - 300px)',
      backgroundColor: '#29487d',
      color: 'white',
      paddingLeft: '50px'
    },
    editIcon: {
      position: 'absolute',
      left: '310px',
      top: '12px',
      color: 'white',
      width: '10',
      height: '10'
    },
    editorContainer: {
      height: '100%',
      boxSizing: 'border-box',
      display:'flex'
    },
    quill: {
      width:'100%',
      minHeight:'100vh'
    }
  });
  
  export default styles;