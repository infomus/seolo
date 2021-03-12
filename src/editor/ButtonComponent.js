import React from 'react'
import { useSelector } from "react-redux"
import { selectToggleIsOpen } from '../features/toggleSlice'

export default function ButtonComponent() {

    const ToggleIsOpen = useSelector(selectToggleIsOpen)
    
    return(
        <div>
           {ToggleIsOpen && <button>hello there</button> } 
        </div>
    )
}