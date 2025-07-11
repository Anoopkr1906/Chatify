import { Button, Container, Paper, Typography , TextField, Stack, Avatar, IconButton } from '@mui/material'
import {CameraAlt as CameraAltIcon} from '@mui/icons-material'
import React, { useEffect } from 'react'
import { useInputValidation } from '6pp'
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin, getAdmin } from '../../redux/thunks/admin';


const AdminLogin = () => {

    const {isAdmin} = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const secretKey = useInputValidation("")

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(adminLogin(secretKey.value));
    }

    useEffect(() => {
        dispatch(getAdmin());
    },[dispatch])

    if(isAdmin){
        return <Navigate to="/admin/dashboard"/>
    }

  return (
    <div
        style={{
            backgroundImage: "linear-gradient(rgba(215,200,200,0.5) , rgba(170 , 110 ,220 , 0.5))" ,
            minHeight: '100vh',  
            display: 'flex',
            alignItems: 'center', 
            justifyContent: 'center' 
        }}
    >
        <Container component={"main"} maxWidth="xs"
        >
            <Paper 
                elevation={3} 
                sx={{
                    padding: 4, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    borderRadius: "2rem",
                    backgroundImage: "linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(55, 65, 81, 0.8), rgba(75, 85, 99, 0.6))",
                }}>
                        
                        <>
                        <Typography variant='h5'>Admin Login</Typography>
                        <form 
                                style={{
                                    width: "100%",
                                    marginTop: "1rem",
                                }} 
                                onSubmit={submitHandler}>


                                <TextField 
                                    required 
                                    fullWidth 
                                    label="Secret Key" 
                                    type="password"
                                    margin="normal" 
                                    variant="outlined"
                                    value={secretKey.value}
                                    onChange={secretKey.changeHandler}
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
                                <Button 
                                    sx={{
                                        marginTop: "1rem",
                                    }}
                                    variant='contained' 
                                    color='error'
                                    fullWidth 
                                    type='submit'
                                    onClick={() => navigate("/")}
                                >
                                    Go back to home
                                </Button>

                        </form>
                        </>
                     
            </Paper>
        </Container>
    </div>
  )
}

export default AdminLogin
