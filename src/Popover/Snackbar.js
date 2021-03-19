import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useSelector } from 'react-redux';
import { selectToggleIsOpen } from '../features/toggleSlice';
import './Snackbar.css'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

export default function SimpleSnackbar() {

  const selectedToggle = useSelector(selectToggleIsOpen);


  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={selectedToggle}
        autoHideDuration={500}
        message="Saved"
        action = {
            <>
            <CheckCircleOutlineIcon />
            </>
        }
      />
      
    </div>
  );
}