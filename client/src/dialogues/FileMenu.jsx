import { Menu } from '@mui/material'
import React from 'react'

const FileMenu = ({anchorE1}) => {
  return (
    <Menu open={false} anchorEl={anchorE1}>
        <div
            style={{
                width: "10rem"
            }}
        >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum architecto omnis eveniet ipsa molestiae, modi quibusdam eos autem earum? Iste.
        </div>
    </Menu>
  )
}

export default FileMenu
