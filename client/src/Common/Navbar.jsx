import React from 'react';
import { toast } from 'react-toastify';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import BookIcon from '@mui/icons-material/Book';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../Auth/authslice';

const pages = ['Home', 'Product','Cart'];
const settings = ['Dashboard', 'Update Password', 'Logout'];

const Navbar = () => {
    const dispatch = useDispatch();
    const { Logouttoggle } = useSelector((state) => state?.Auth);
    const name = localStorage.getItem("name");
    const image = localStorage.getItem("image");
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseNavMenu = () => setAnchorElNav(null);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    // Function to check if a page is active
    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Navbar Start */}
            <AppBar position="fixed" sx={{ background: 'linear-gradient(to right, #1e3c72, #2a5298)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <BookIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, fontSize: '40px', color: '#FFD700' }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            to="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.2rem',
                                color: '#FFD700',
                                textDecoration: 'none',
                            }}
                        >
                            CRUD APP
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="menu"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                keepMounted
                                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: 'block', md: 'none' } }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Link
                                            to={page === 'Home' ? '/' : `/${page.toLowerCase()}`}
                                            style={{
                                                textDecoration: 'none',
                                                color: isActive(page === 'Home' ? '/' : `/${page.toLowerCase()}`) ? '#FFD700' : '#333',
                                                fontWeight: isActive(page === 'Home' ? '/' : `/${page.toLowerCase()}`) ? 'bold' : 'normal',
                                            }}
                                        >
                                            <Typography textAlign="center">{page}</Typography>
                                        </Link>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    component={Link}
                                    to={page === 'Home' ? '/' : `/${page.toLowerCase()}`}
                                    sx={{
                                        my: 2,
                                        color: isActive(page === 'Home' ? '/' : `/${page.toLowerCase()}`) ? '#FFD700' : '#fff',
                                        fontSize: '16px',
                                        fontWeight: isActive(page === 'Home' ? '/' : `/${page.toLowerCase()}`) ? '700' : '600',
                                        textTransform: 'capitalize',
                                        marginRight: '15px',
                                        '&:hover': { color: '#FFD700' },
                                    }}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            {Logouttoggle ? (
                                <>
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar src={`${process.env.REACT_APP_BASE_URL}${image}`} alt={name} />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                        keepMounted
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        {settings.map((setting) => (
                                            <MenuItem key={setting} onClick={setting === 'Logout' ? handleLogout : handleCloseUserMenu}>
                                                {setting === 'User' ? (
                                                    <Typography textAlign="center">User: {name}</Typography>
                                                ) : setting === 'Update Password' ? (
                                                    <Typography textAlign="center">
                                                        <Link to="/updatepassword">Update Password</Link>
                                                    </Typography>
                                                ) : (
                                                    <Typography textAlign="center">
                                                        <Link to={`/${setting.toLowerCase()}`}>{setting}</Link>
                                                    </Typography>
                                                )}
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </>
                            ) : (
                                <Button component={Link} to="/login" sx={{ color: '#FFD700', fontWeight: '600' }}>
                                    Login
                                </Button>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            {/* Navbar End */}
        </>
    );
};

export default Navbar;
