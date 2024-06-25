import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL, getConfig } from '../../helpers/config';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Container } from '@mui/material';

export default function Header() {
    const { accessToken, setAccessToken, currentUser, setCurrentUser } = useContext(AuthContext);
    const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const logoutUser = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/user/logout`, null, getConfig(accessToken));
            localStorage.removeItem('currentToken');
            localStorage.removeItem('currentUser')
            setCurrentUser(null);
            setAccessToken('');
            toast.success(response.data.message);
        } catch (error) {
            if (error?.response?.status === 401) {
                localStorage.removeItem('currentToken');
                setCurrentUser(null);
                setAccessToken('');
            }
            console.error(error);
        }
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleUserMenuItemClick = (setting) => {
        if (setting === 'Logout') {
            logoutUser();
        }
        handleCloseUserMenu();
    };

    return (
        <>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
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
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            LOGO
                        </Typography>

                        <Box sx={{ flexGrow: 1 }} />

                        <Box sx={{ flexGrow: 0 }}>
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={() => handleUserMenuItemClick(setting)}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerToggle}
            >
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={handleDrawerToggle}
                    onKeyDown={handleDrawerToggle}
                >
                    <List>
                        <ListItem component={Link} to="/" button key="Inicio">
                            <ListItemText primary="Inicio" />
                        </ListItem>
                        <ListItem component={Link} to="/contract" button key="Gestionar contratos">
                            <ListItemText primary="Gestionar contratos" />
                        </ListItem>
                        <ListItem component={Link} to="/users" button key="Gestionar usuarios">
                            <ListItemText primary="Gestionar usuarios" />
                        </ListItem>
                        <ListItem component={Link} to="/dailys" button key="Gestionar Dailys">
                            <ListItemText primary="Gestionar Dailys" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    );
}
