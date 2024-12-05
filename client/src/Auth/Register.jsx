import React, { useState, useEffect } from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Wrapper from '../Common/Wrapper'
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from "@tanstack/react-query";
import { registerUser } from './authslice';
import { useNavigate } from 'react-router-dom';



function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const defaultTheme = createTheme();



const Register = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state?.Auth);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [image, setImage] = useState(null); // For Image

    const reg = async (data) => {

        // Handling Form Data 
        const formdata = new FormData();
        formdata.append("name", data.name);
        formdata.append("email", data.email);
        formdata.append("password", data.password);
        formdata.append("confirmpassword", data.confirmpassword);
        formdata.append("image", image);
        formdata.append("mobile", data.mobile);

        const response = await dispatch(registerUser(formdata))
        console.log("My Reg response is ", response);
        if (response && response?.payload.success === true) {
            reset(); // Blank form after submitting data
            navigate('/verifyotp')
            setImage('');
        } else {
            console.log("Error");

        }
        return response.data;
    };

    // Start Mutation Area
    const mutation = useMutation({
        mutationFn: (data) => reg(data),
    });

    // Handle On Submit Area
    const onSubmit = (data) => {
        mutation.mutate(data);
    };


    return (
        <>
            <Wrapper>

                <ThemeProvider theme={defaultTheme}>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <Box
                            sx={{
                                marginTop: 15,
                                marginBottom: 8,
                                padding: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.12)'
                            }}
                        >
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Register
                            </Typography>
                            <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit(onSubmit)}>

                                <Grid container spacing={2}>

                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="name"
                                            label="Name "
                                            {...register("name")}
                                        />

                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            type="email"
                                            id="email"
                                            label="Email"
                                            {...register("email")}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            type="password"
                                            id="password"
                                            label="Password"
                                            {...register("password")}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            type="password"
                                            id="confirmpassword"
                                            label="Confirm Password"
                                            {...register("confirmpassword")}
                                        />
                                    </Grid>

                                    {/*This form section is for the submit image*/}
                                    <Grid item xs={12}>
                                        <div style={{ marginBottom: '20px' }}>
                                            <input type="file" onChange={(e) => setImage(e.target.files[0])} name="image" accept="image/*" className="form-control" />

                                            {image !== "" && image !== undefined && image !== null ? (
                                                <img style={{ height: "180px" }} src={URL.createObjectURL(image)} alt="" className="upload-img" />
                                            ) : (
                                                <>{image === "" && <p style={{ color: 'white' }}>Drag or drop content here</p>}</>
                                            )}
                                        </div>
                                    </Grid>
                                    {/*Image area end*/}

                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            type="number"
                                            id="mobile"
                                            label="Mobile"
                                            {...register("mobile")}
                                        />
                                    </Grid>

                                </Grid>


                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    {loading ? 'Please wait...' : 'Register'}
                                </Button>

                                <Grid container>
                                    <Grid item>
                                        <Link to="/login" variant="body2">
                                            {"You have an account? Login"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Container>
                </ThemeProvider>

            </Wrapper>
        </>
    )
}

export default Register