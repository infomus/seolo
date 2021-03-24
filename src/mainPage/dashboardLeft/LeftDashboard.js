import React, {useContext} from 'react' 

import { IconButton } from "@material-ui/core";
import MouseOverPopover from "../../Popover/HoverPopOver/PopHover";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useDispatch } from "react-redux";
import { FirebaseContext } from "../../context/firebase";
import { useHistory } from "react-router-dom";
import { logout } from "../../features/userSlice";
import { useAuthListener } from "../../hooks";
import InfoIcon from "@material-ui/icons/Info";



export default function LeftColumn() {




    return(
        <div className="universal-dashboard-left-column">
        <div className="left-column-icons">
          <div className="icons">
            <IconButton>
            <MouseOverPopover name = 'infoIcon' Icon = {InfoIcon} text = 'Shortcuts' className = 'PopHover' />
              
            </IconButton>
          </div>
        </div>
      </div>
    )
}