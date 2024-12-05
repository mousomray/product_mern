import React, { useState } from 'react';
import { productlist, deleteproduct } from './apicall';
import { useQuery } from '@tanstack/react-query';
import Wrapper from '../Common/Wrapper';
import Swal from 'sweetalert2'; // Import Sweet Alert 
import { Link } from 'react-router-dom';

import {
    Box,
    Grid,
    Paper,
    FormControlLabel,
    Checkbox,
    Slider,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    CardActions,
    CardMedia,
    FormControl,
    FormGroup,
    FormLabel,
    Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
}));

const Sidebar = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    borderRight: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
}));

const Product = () => {
    const [filters, setFilters] = useState({
        p_size: [],
        p_color: [],
        brand: [],
        priceRange: [0, 1000],
        searchQuery: '',
    });
    const [showMore, setShowMore] = useState(false);

    const handleFilterChange = (field, value) => {
        setFilters((prev) => {
            const currentValues = prev[field];
            const newValues = currentValues.includes(value)
                ? currentValues.filter((item) => item !== value)
                : [...currentValues, value];
            return { ...prev, [field]: newValues };
        });
    };

    const handleSearchChange = (event) => {
        setFilters((prev) => ({
            ...prev,
            searchQuery: event.target.value,
        }));
    };

    const handlePriceChange = (event, newValue) => {
        setFilters((prev) => ({ ...prev, priceRange: newValue }));
    };

    const getproduct = async () => {
        const response = await productlist();
        return response;
    };

    const { isLoading, isError, data: productdata, refetch } = useQuery({
        queryKey: ['productdata'],
        queryFn: getproduct,
    });

    // Make Handle For Delete (Start)
    const handleDelete = async (id) => {
        // For Sweet Alert
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this product!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });
        if (result.isConfirmed) {
            await deleteproduct(id);
            refetch()
            // After Deletation Message
            Swal.fire(
                'Deleted!',
                'Your Customer Details has been deleted',
                'success'
            );
        }
    }
    // Make Handle For Delete (End)

    if (isLoading) {
        return <h1 style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}>Loading...</h1>;
    }

    if (isError) {
        return <h1>Error fetching data</h1>;
    }

    const filteredProducts =
        Array.isArray(productdata) &&
        productdata.filter((product) => {
            const { p_size, p_color, brand, priceRange, searchQuery } = filters;
            return (
                // Check size (array field) - case-insensitive
                (!p_size.length ||
                    product.p_size?.some((size) =>
                        p_size.map((s) => s.toLowerCase()).includes(size.toLowerCase())
                    )) &&
                // Check color (array field) - case-insensitive
                (!p_color.length ||
                    product.p_color?.some((color) =>
                        p_color.map((c) => c.toLowerCase()).includes(color.toLowerCase())
                    )) &&
                // Check brand (single field) - case-insensitive
                (!brand.length ||
                    brand.map((b) => b.toLowerCase()).includes(product.brand.toLowerCase())) &&
                // Check price range
                product.price >= priceRange[0] &&
                product.price <= priceRange[1] &&
                // Check search query
                (!searchQuery ||
                    product.p_name?.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        });

    const handleShowMore = () => {
        setShowMore(true);
    };

    const handleShowLess = () => {
        setShowMore(false);
    };

    return (
        <Wrapper>
            <Box sx={{ flexGrow: 1, mt: 10, px: 2 }}>
                <Grid container spacing={2}>
                    {/* Sidebar */}
                    <Grid item xs={12} sm={4} md={3}>
                        <Sidebar>
                            <TextField
                                label="Search"
                                fullWidth
                                value={filters.searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search by product name..."
                                sx={{ mb: 2 }}
                            />

                            {/* Size Filter */}
                            <FormControl component="fieldset" fullWidth>
                                <FormLabel component="legend">Filter by Size</FormLabel>
                                <FormGroup>
                                    {['s', 'm', 'xl', 'xxl'].map((size) => (
                                        <FormControlLabel
                                            key={size}
                                            control={
                                                <Checkbox
                                                    checked={filters.p_size.includes(size)}
                                                    onChange={() => handleFilterChange('p_size', size)}
                                                />
                                            }
                                            label={size}
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>
                            <Divider sx={{ my: 2 }} />

                            {/* Color Filter */}
                            <FormControl component="fieldset" fullWidth sx={{ mt: 2 }}>
                                <FormLabel component="legend">Filter by Color</FormLabel>
                                <FormGroup>
                                    {['white', 'purple', 'blue', 'black'].map((color) => (
                                        <FormControlLabel
                                            key={color}
                                            control={
                                                <Checkbox
                                                    checked={filters.p_color.includes(color)}
                                                    onChange={() => handleFilterChange('p_color', color)}
                                                />
                                            }
                                            label={color}
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>
                            <Divider sx={{ my: 2 }} />

                            {/* Brand Filter */}
                            <FormControl component="fieldset" fullWidth sx={{ mt: 2 }}>
                                <FormLabel component="legend">Filter by Brand</FormLabel>
                                <FormGroup>
                                    {['Levis', 'Nike', 'Mufti', 'Adidas'].map((brand) => (
                                        <FormControlLabel
                                            key={brand}
                                            control={
                                                <Checkbox
                                                    checked={filters.brand.includes(brand)}
                                                    onChange={() => handleFilterChange('brand', brand)}
                                                />
                                            }
                                            label={brand}
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>
                            <Divider sx={{ my: 2 }} />

                            {/* Price Filter */}
                            <FormControl component="fieldset" fullWidth sx={{ mt: 2 }}>
                                <FormLabel component="legend" sx={{ fontSize: '1rem' }}>
                                    Filter by Price Range
                                </FormLabel>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    {`₹${filters.priceRange[0]} - ₹${filters.priceRange[1]}`}
                                </Typography>
                                <Slider
                                    value={filters.priceRange}
                                    onChange={handlePriceChange}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={1000}
                                    sx={{ mt: 1 }}
                                />
                            </FormControl>
                        </Sidebar>
                    </Grid>

                    {/* Product Display */}
                    <Grid item xs={12} sm={8} md={9}>
                        <Typography variant="h4" sx={{ mb: 2 }}>
                            Product List
                        </Typography>
                        <Button
                            variant="contained"
                            component={Link}
                            to="/addproduct"
                            sx={{
                                backgroundColor: '#9b4dca',
                                color: 'white',
                                mb: 2,
                                borderRadius: '20px',
                                padding: '6px 16px',
                            }}
                        >
                            Add Product
                        </Button>

                        <Grid container spacing={2}>
                            {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
                                filteredProducts
                                    .reverse() // Reverses the order of the filtered products
                                    .slice(0, showMore ? filteredProducts.length : 6)
                                    .map((product) => (
                                        <Grid item xs={12} sm={6} md={4} key={product.id}>
                                            <Card>
                                                <CardMedia
                                                    component="img"
                                                    height="200"
                                                    image={`${process.env.REACT_APP_BASE_URL}${product.image}`}
                                                    alt={product.p_name}
                                                />
                                                <CardContent>
                                                    <Typography variant="h6">{product.p_name}</Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {product.brand}
                                                    </Typography>
                                                    <Typography variant="body2">{product.p_size.join(', ')}</Typography>
                                                    <Typography variant="body2">{product.p_color.join(', ')}</Typography>
                                                    <Typography variant="h6" color="primary">
                                                        ₹{product.price}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {product.p_description}
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Link to={`/editproduct/${product._id}`}>
                                                        <Button variant="contained" color="error">
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <Button variant="contained" color="error" onClick={() => handleDelete(product._id)}>
                                                        Delete
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                            ) : (
                                <Typography sx={{ color: 'red', textAlign: 'center', mt: 2, width: '100%' }}>
                                    No products found.
                                </Typography>
                            )}
                        </Grid>

                        {/* Show More / Show Less Button */}
                        {filteredProducts.length > 6 && !showMore && (
                            <Button onClick={handleShowMore} variant="contained" color="primary" sx={{ mt: 2 }}>
                                Show More
                            </Button>
                        )}
                        {showMore && (
                            <Button onClick={handleShowLess} variant="contained" color="primary" sx={{ mt: 2 }}>
                                Show Less
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </Wrapper>
    );
};

export default Product;
