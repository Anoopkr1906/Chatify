import { Button, Container, Paper, Typography , TextField, Stack, Avatar, IconButton } from '@mui/material'
import {CameraAlt as CameraAltIcon} from '@mui/icons-material'
import React from 'react'
import { VisuallyHiddenInput } from '../components/styles/StyledComponents';
import {useFileHandler, useInputValidation} from "6pp"
import { usernameValidator } from '../utils/validators';
import axios from 'axios';
import { server } from '../constants/config';
import { useDispatch } from 'react-redux';
import { userExists } from '../redux/reducers/auth';
import toast from 'react-hot-toast';

function Login() {

    const [isLogin , setIsLogin] = React.useState(true);

    const toggleLogin = () => {
        setIsLogin((prev) => !prev);
    }

    const name = useInputValidation("")
    const bio = useInputValidation("")
    const username = useInputValidation("" , usernameValidator)
    const password = useInputValidation("");

    const avatar = useFileHandler("single");

    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();

        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const {data} = await axios.post(`${server}/api/v1/user/login` , {
                username: username.value,
                password: password.value
                },
                config
                );
            
            dispatch(userExists(true));
            toast.success(data.message);

        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }
    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!avatar.file) {
            toast.error("Please select an avatar");
            return;
        }

        const formData = new FormData();
        formData.append("avatar" , avatar.file);
        formData.append("name" , name.value);
        formData.append("bio" , bio.value);
        formData.append("username" , username.value);
        formData.append("password" , password.value);

        console.log("Form data:");
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        const config = {
            withCredentials: true,
            // headers: {
            //     "Content-Type": "multipart/form-data"
            // }
        }

        try {
            const {data} = await axios.post(`${server}/api/v1/user/new` , formData , config);

            dispatch(userExists(true));
            toast.success(data.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }

  return (
    <div
        style={{
            backgroundImage: "linear-gradient(rgba(215,200,200,0.5) , rgba(170 , 110 ,220 , 0.5))" ,
            minHeight: "100vh",
            width: "100vw",   
        }}
    >
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
                                }} 
                                onSubmit={handleLogin}>
                                <TextField 
                                    required 
                                    fullWidth 
                                    label="Username" 
                                    margin="normal" 
                                    variant="outlined"
                                    value={username.value}
                                    onChange={username.changeHandler}
                                />

                                {
                                    username.error && (
                                        <Typography 
                                            color='error' 
                                            variant='caption' 
                                        >
                                                {username.error}
                                        </Typography>
                                    )
                                }


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
                                onSubmit={handleSignUp}
                            >
                                {/* Its automatically is flex and flexDirection is column */}
                                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                                    <Avatar 
                                        sx={{
                                            width: "10rem", 
                                            height: "10rem",
                                            objectFit: "contain", 
                                        }}
                                        src={avatar.preview}
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
                                            <VisuallyHiddenInput type="file" onChange={avatar.changeHandler}/>
                                        </>
                                    </IconButton>
                                </Stack>
                                {
                                    avatar.error && (
                                        <Typography 
                                            m={"1rem auto"}
                                            width={"fit-content"}
                                            display={"block"}
                                            color='error' 
                                            variant='caption' 
                                        >
                                                {avatar.error}
                                        </Typography>
                                    )
                                }

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
                                {
                                    username.error && (
                                        <Typography 
                                            color='error' 
                                            variant='caption' 
                                        >
                                                {username.error}
                                        </Typography>
                                    )
                                }
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
                                    type="submit">
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
    </div>
  )
}

export default Login
