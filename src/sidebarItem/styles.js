const styles = theme => ({
    listItem: {
      cursor: 'pointer'
    },
    textSection: {
      maxWidth: '85%',
      '&:hover' : {
        color:'#226CE0'
      },
      maxHeight:'50px',
      overflow:'hidden',


    },  
    deleteIcon: {
      position: 'absolute',
      right: '5px',
      color:'black',
      top: 'calc(50% - 15px)',
      '&:hover': {
        color: 'red'
      }
    }
  });
  
  export default styles;

  