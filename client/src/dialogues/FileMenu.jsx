import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFileMenu, setUploadingLoader } from '../redux/reducers/misc';
import { AudioFile as AudioFileIcon, Image as ImageIcon, UploadFile as UploadFileIcon, VideoFile as VideoFileIcon} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { useSendAttachmentsMutation } from '../redux/api/api';

const FileMenu = ({anchorE1 , chatId}) => {

  const {isFileMenu} = useSelector((state) => state.misc);

  const dispatch = useDispatch();

  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const fileRef = useRef(null);

  const [sendAttachments] = useSendAttachmentsMutation();

  const closeFileMenu = () => {
    dispatch(setIsFileMenu(false));
  }

  const selectImage = () => imageRef.current?.click();
  const selectAudio = () => audioRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  const selectFile = () => fileRef.current?.click();

  const fileChangeHandler = async(e , key) => {

    const files = Array.from(e.target.files);

    if(files.length <= 0) return ;

    if(files.length > 5){
      return toast.error(`You can only upload upto 5 ${key} at a time`);
    }

    dispatch(setUploadingLoader(true));
    closeFileMenu();

    // fetching here
    try {
      const toastId = toast.loading(`Sending ${key}...`);
      const myForm = new FormData();

      myForm.append("chatId" , chatId);
      files.forEach((file) => myForm.append("files" , file));

      const res = await sendAttachments(myForm);

      if(res.data){
        toast.success(`${key} sent successfully`, {id: toastId});

        // added by me 
        const fileMessage = {
                    _id: Date.now().toString(),
                    attachments: res.data.attachments, // File data from server response
                    sender: {
                        _id: user._id,
                        name: user.name,
                    },
                    chat: chatId,
                    createdAt: new Date().toISOString(),
                };

                // ✅ Add to local state immediately
                setMessages(prev => [...prev, fileMessage]);

                // ✅ Emit through socket for real-time
                socket.emit(NEW_MESSAGE, {
                    chatId,
                    members,
                    message: fileMessage
                });

                // till here 


      }else{
        toast.error(`Failed to send ${key}`, {id: toastId});
      };

    } catch (error) {
      toast.error(error , {id: toastId});
    } finally {
      dispatch(setUploadingLoader(false));
    }

    
  }

  return (
    <Menu open={isFileMenu} anchorEl={anchorE1} onClose={closeFileMenu}>
       <div style={{
          width: "10rem"
        }}
       >

        <MenuList >
          <MenuItem onClick={selectImage}>
            <Tooltip title="Image">
              <ImageIcon />
            </Tooltip>

            <ListItemText style={{marginLeft: "0.5rem"}}>
              Image
            </ListItemText>

            <input type="file" multiple accept="image/png , image/jpg , image/jpeg / image/gif" 
              style={{display: "none"}}
              onChange={(e) => fileChangeHandler(e , "Images")}
              ref={imageRef}
            />
            
          </MenuItem>
      
          <MenuItem onClick={selectAudio}>
            <Tooltip title="Audio">
              <AudioFileIcon />
            </Tooltip>

            <ListItemText style={{marginLeft: "0.5rem"}}>
              Audio
            </ListItemText>

            <input type="file" multiple accept="audio/mp3 , audio/wav , audio/mpeg" 
              style={{display: "none"}}
              onChange={(e) => fileChangeHandler(e , "Audios")}
              ref={audioRef}
            />
            
          </MenuItem>
       
          <MenuItem onClick={selectVideo}>
            <Tooltip title="Video">
              <VideoFileIcon />
            </Tooltip>

            <ListItemText style={{marginLeft: "0.5rem"}}>
              Video
            </ListItemText>

            <input type="file" multiple accept="video/mp4 , video/mpeg , video/webm , video/ogg" 
              style={{display: "none"}}
              onChange={(e) => fileChangeHandler(e , "Videos")}
              ref={videoRef}
            />
            
          </MenuItem>
     
          <MenuItem onClick={selectFile}>
            <Tooltip title="File">
              <UploadFileIcon />
            </Tooltip>

            <ListItemText style={{marginLeft: "0.5rem"}}>
              File
            </ListItemText>

            <input type="file" multiple accept="*" 
              style={{display: "none"}}
              onChange={(e) => fileChangeHandler(e , "Files")}
              ref={fileRef}
            />
            
          </MenuItem>
        </MenuList>

       </div>
    </Menu>
  )
}

export default FileMenu
