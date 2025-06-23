import { Button, Container, Paper, Typography , TextField, Stack, Avatar, IconButton } from '@mui/material'
import {CameraAlt as CameraAltIcon} from '@mui/icons-material'
import React from 'react'
import { VisuallyHiddenInput } from '../components/styles/StyledComponents';
import {useInputValidation} from "6pp"

function Login() {

    const [isLogin , setIsLogin] = React.useState(true);

    const toggleLogin = () => {
        setIsLogin((prev) => !prev);
    }

    const name = useInputValidation("")
    const bio = useInputValidation("")
    const username = useInputValidation("")
    const password = useInputValidation("")

  return (
    <Container component={"main"} maxWidth="xs"
        sx={{
            display: 'flex',  
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh'
        }}>
        <Paper 
            elevation={3} 
            sx={{
                padding: 4, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center'
            }}>
               {
                isLogin ? (
                    <>
                       <Typography variant='h5'>Login</Typography>
                       <form 
                            style={{
                                width: "100%",
                                marginTop: "1rem",
                            }}>
                            <TextField 
                                required 
                                fullWidth 
                                label="Username" 
                                margin="normal" 
                                variant="outlined"
                                value={username.value}
                                onChange={username.changeHandler}
                            />
                            <TextField 
                                required 
                                fullWidth 
                                label="Password" 
                                type="password"
                                margin="normal" 
                                variant="outlined"
                                value={password.value}
                                onChange={password.changeHandler}
                            />

                            <Button 
                                sx={{
                                    marginTop: "1rem",
                                }}
                                variant='contained' 
                                color='primary'
                                fullWidth 
                                type='submit'>
                                Login
                            </Button>

                            <Typography textAlign={"center"} m={"1rem"}>OR</Typography>

                            <Button
                                sx={{
                                    
                                }}
                                fullWidth
                                variant='text'
                                onClick={toggleLogin}>
                                    Signup Instead
                            </Button>
                       </form>
                    </>
                ) 
                : 
                (
                    <>
                       <Typography variant='h5'>Sign Up</Typography>
                       <form 
                            style={{
                                width: "100%",
                                marginTop: "1rem",
                            }}
                        >
                            {/* Its automatically is flex and flexDirection is column */}
                            <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                                <Avatar 
                                    sx={{
                                        width: "10rem", 
                                        height: "10rem",
                                        objectFit: "contain", 
                                    }}
                                />

                                <IconButton
                                    sx={{
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
                                        color: "white",
                                        bgcolor: "rgba(0, 0, 0, 0.5)",
                                        ":hover" : {
                                            bgcolor: "rgba(0, 0, 0, 0.7)",
                                        }
                                    }}
                                    component="label"
                                    >
                                    <>
                                        <CameraAltIcon />
                                        <VisuallyHiddenInput type="file"/>
                                    </>
                                </IconButton>
                            </Stack>

                            <TextField 
                                required 
                                fullWidth 
                                label="Name" 
                                margin="normal" 
                                variant="outlined"
                                value={name.value}
                                onChange={name.changeHandler}
                            />
                            <TextField 
                                required 
                                fullWidth 
                                label="Bio" 
                                margin="normal" 
                                variant="outlined"
                                value={bio.value}
                                onChange={bio.changeHandler}
                            />
                            <TextField 
                                required 
                                fullWidth 
                                label="Username" 
                                margin="normal" 
                                variant="outlined"
                                value={username.value}
                                onChange={username.changeHandler}
                            />
                            <TextField 
                                required 
                                fullWidth 
                                label="Password" 
                                type="password"
                                margin="normal" 
                                variant="outlined"
                                value={password.value}
                                onChange={password.changeHandler}
                            />

                            <Button 
                                sx={{
                                    marginTop: "1rem",
                                }}
                                variant='contained' 
                                color='primary'
                                fullWidth 
                                type='submit'>
                                Sign Up
                            </Button>

                            <Typography textAlign={"center"} m={"1rem"}>OR</Typography>

                            <Button
                                sx={{
                                    
                                }}
                                fullWidth
                                variant='text'
                                onClick={toggleLogin}>
                                    Login Instead
                            </Button>
                       </form>
                    </>
                )
               }
        </Paper>
    </Container>
  )
}

export default Login
