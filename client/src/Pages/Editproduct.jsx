import React, { useState } from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { singleproduct, updateproduct } from './apicall';
import { useForm, Controller } from "react-hook-form"; // Import React Hook Form 
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress } from "@mui/material"; // Circle Loader 



function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                CRUD webside
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


const defaultTheme = createTheme();

const Editproduct = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    // React Hook Form Area
    const { register, handleSubmit, watch, formState: { errors }, reset, control } = useForm();
    const [size, setSize] = useState([]);
    const [color, setColor] = useState([]);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState('');

    // Single data fetch for image handling 
    const getAmi = async () => {
        const response = await singleproduct(id)
        console.log("AMIIIIII", response);
        return response?.data
    }
    const { data: amardata } = useQuery({
        queryKey: ["amardata", id],
        queryFn: getAmi
    })

    // Get product For Single Value (Start)
    const getProduct = async () => {
        try {
            const response = await singleproduct(id);
            console.log("kakaka", response);

            const reg = {
                p_name: response?.data?.p_name,
                p_size: response?.data?.p_size,
                p_color: response?.data?.p_color,
                image: response?.data?.image,
                brand: response?.data?.brand,
                price: response?.data?.price,
                p_description: response?.data?.p_description
            };
            reset(reg)
            setSize(response?.data?.p_size)
            setColor(response?.data?.p_color)

        } catch (error) {
            console.log(error);
        }
    };

    useQuery({ queryFn: getProduct, queryKey: ['singleproduct', id] }) // This line of code work as same as useEffect()
    // Get product For Single Value (End)

    const onSubmit = async (data,e) => {
        e.preventDefault(); // For to stop default behavour
        setLoading(true);
        // Handling Form Data 
        const formdata = new FormData();
        formdata.append("p_name", data.p_name);
        formdata.append("p_size", size);
        formdata.append("p_color", color);
        formdata.append("image", image || amardata.image);
        formdata.append("brand", data.brand);
        formdata.append("price", data.price);
        formdata.append("p_description", data.p_description);
        try {
            const response = await updateproduct({ formdata, id })
            console.log("Product Create Response...", response);
            if (response && response?.status === 200) {
                navigate('/product')
                setLoading(false)
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            setLoading(false)
        }
    }

    // Handle For Size Check Box
    const handleSize = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setSize([...size, value]); // Add value to size array if checked
        } else {
            setSize(size.filter(item => item !== value));
        }
    };

    // Handle For Color Check Box
    const handleColor = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setColor([...color, value]); // Add value to size array if checked
        } else {
            setColor(color.filter(item => item !== value));
        }
    };

    return (
        <>


            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 10,
                            padding: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderRadius: 2,
                            backgroundColor: 'white',
                            boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.12)'
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                            <EditIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                            Update Product
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3, width: '100%' }}>
                            <Grid container spacing={3}>

                                {/* Product name */}
                                <Grid item xs={12}>
                                    <TextField
                                        name="p_name"
                                        required
                                        fullWidth
                                        id="p_name"
                                        label="Product Name"
                                        autoFocus
                                        InputLabelProps={{
                                            shrink: true,
                                            style: { fontSize: '1rem' } // Adjust the font size as needed
                                        }}
                                        {...register("p_name")}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'rgba(25, 118, 210, 0.5)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#1976d2',
                                                }
                                            }
                                        }}
                                    />
                                </Grid>

                                {/* Product Size */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>
                                        Product Size
                                    </Typography>
                                    <div onChange={handleSize} value={size}>
                                        {['s', 'm', 'xl', 'xxl'].map((label) => (
                                            <label key={label} style={{ display: 'block', margin: '5px 0', color: '#555' }}>
                                                <input
                                                    type="checkbox"
                                                    value={label}
                                                    checked={Array.isArray(size) && size.includes(label)}
                                                    style={{ marginRight: '8px' }}
                                                />{" "}
                                                {label}
                                            </label>
                                        ))}
                                    </div>
                                </Grid>

                                {/* Product Color */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>
                                        Product Color
                                    </Typography>
                                    <div onChange={handleColor} value={color}>
                                        {['white', 'purple', 'blue', 'black'].map((label) => (
                                            <label key={label} style={{ display: 'block', margin: '5px 0', color: '#555' }}>
                                                <input
                                                    type="checkbox"
                                                    value={label}
                                                    checked={Array.isArray(color) && color.includes(label)}
                                                    style={{ marginRight: '8px' }}
                                                />{" "}
                                                {label}
                                            </label>
                                        ))}
                                    </div>
                                </Grid>

                                {/*Handle Image Area Start*/}
                                <Grid item xs={12}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <input
                                            type="file"
                                            onChange={(e) => setImage(e.target.files[0])}
                                            name="image"
                                            accept="image/*"
                                            className="form-control"
                                        />

                                        {image ? (
                                            <img
                                                height="180px"
                                                src={URL.createObjectURL(image)}
                                                alt="Uploaded"
                                                className="upload-img"
                                            />
                                        ) : (
                                            <img
                                                height="180px"
                                                src={`http://localhost:3004/${amardata?.image}`}
                                                alt="Existing Employee"
                                                className="upload-img"
                                            />
                                        )}
                                    </div>
                                </Grid>
                                {/*Handle Image area end*/}

                                {/* Product brand */}
                                <Grid item xs={12}>
                                    <FormControl fullWidth required>
                                        <InputLabel id="brand-label">Brand</InputLabel>
                                        <Controller
                                            name="brand"
                                            control={control} // Use control from React Hook Form
                                            defaultValue={amardata?.brand || ''} // Default brand value
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    labelId="brand-label"
                                                    id="brand"
                                                    label="Brand"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': {
                                                                borderColor: 'rgba(25, 118, 210, 0.5)',
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: '#1976d2',
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value="levis">Levis</MenuItem>
                                                    <MenuItem value="nike">Nike</MenuItem>
                                                    <MenuItem value="mufti">Mufti</MenuItem>
                                                    <MenuItem value="adidas">Adidas</MenuItem>
                                                    {/* Add more brands as needed */}
                                                </Select>
                                            )}
                                        />
                                    </FormControl>
                                </Grid>

                                {/* Product price */}
                                <Grid item xs={12}>
                                    <TextField
                                        name="price"
                                        required
                                        fullWidth
                                        id="price"
                                        label="Price"
                                        type="number"
                                        autoFocus
                                        InputLabelProps={{
                                            shrink: true,
                                            style: { fontSize: '1rem' } // Adjust the font size as needed
                                        }}
                                        {...register("price")}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'rgba(25, 118, 210, 0.5)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#1976d2',
                                                }
                                            }
                                        }}
                                    />
                                </Grid>

                                {/* Product description */}
                                <Grid item xs={12}>
                                    <TextField
                                        name="p_description"
                                        required
                                        fullWidth
                                        id="p_description"
                                        label="Product Description"
                                        autoFocus
                                        InputLabelProps={{
                                            shrink: true,
                                            style: { fontSize: '1rem' } // Adjust the font size as needed
                                        }}
                                        {...register("p_description")}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'rgba(25, 118, 210, 0.5)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#1976d2',
                                                }
                                            }
                                        }}
                                    />
                                </Grid>

                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 4,
                                    mb: 2,
                                    paddingY: 1.2,
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    backgroundColor: '#1976d2',
                                    '&:hover': {
                                        backgroundColor: '#125a9e',
                                    },
                                }}
                            >
                                {loading ? <CircularProgress size={24} /> : "Update Product"}
                            </Button>
                        </Box>
                    </Box>
                    <Copyright sx={{ mt: 5, color: '#888' }} />
                </Container>
            </ThemeProvider>



        </>
    )
}

export default Editproduct