import { Box, Typography } from '@mui/material';
import React, { memo } from 'react'
import { lightBlue } from '../../constants/color';
import moment from 'moment';

const MessageComponent = ({message , user}) => {

    const {sender , content , attachments=[] , createdAt} = message ;
    const sameSender = sender?._id === user?._id ;
    const timeAgo = moment(createdAt).fromNow();

  return (
    <div
        style={{
            alignSelf: sameSender ? "flex-end" : "flex-start",
            background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
            color: "black",
            borderRadius: "5px",
            padding: "0.5rem",
            width: "fit-content"
        }}
    >
      {!sameSender && <Typography color={lightBlue} fontWeight={"600"} variant="caption">{sender.name}</Typography>}

      {content && <Typography>{content}</Typography>}

      {/* Attachments*/}
      {
        attachments.length > 0 && (
            attachments.map(( attachment , index) => {

                const url = attachment.url ;
                const file = "asw";

                return (
                    <Box key={index}>
                        <a href="" target="_blank" download style={{
                            color: "black",
                        }}>

                        </a>
                    </Box>
                )

            })
        )
      }

      <Typography variant="caption" color="text.secondary">{timeAgo}</Typography>

    </div>
  )
}

export default memo(MessageComponent)
