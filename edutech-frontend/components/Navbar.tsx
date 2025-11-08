'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Avatar,
  Chip
} from '@mui/material';
import {
  Home,
  Quiz,
  Dashboard,
  Feedback,
  Chat,
  Summarize,
  Menu as MenuIcon,
  Login,
  PersonAdd,
  Logout
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const { user, token, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);

  const navLinks = [
    { href: '/', label: 'Home', icon: <Home /> },
    { href: '/quizzes', label: 'Quizzes', icon: <Quiz /> },
    { href: '/dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { href: '/feedback', label: 'Feedback', icon: <Feedback /> },
    { href: '/chatbot', label: 'Chatbot', icon: <Chat /> },
    { href: '/summarize', label: 'Summarizer', icon: <Summarize /> },
  ];

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
              <Logo size={24} />
            </Avatar>
            <Typography variant="h6" component="div" sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              EduTech
            </Typography>
          </Box>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                <Button
                  startIcon={link.icon}
                  sx={{
                    color: 'text.primary',
                    borderRadius: 3,
                    px: 2,
                    py: 1,
                    '&:hover': {
                      bgcolor: 'rgba(59, 130, 246, 0.1)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </Box>
        )}

        {/* Auth Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {token ? (
            <>
              {!isMobile && (
                <Chip
                  avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}>{user?.username?.[0]?.toUpperCase()}</Avatar>}
                  label={`Welcome, ${user?.username || 'User'}`}
                  variant="outlined"
                  sx={{ borderRadius: 3 }}
                />
              )}
              <Button
                onClick={logout}
                startIcon={<Logout />}
                variant="outlined"
                color="error"
                sx={{ borderRadius: 3 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button
                  startIcon={<Login />}
                  variant="outlined"
                  sx={{ borderRadius: 3, mr: 1 }}
                >
                  Login
                </Button>
              </Link>
              <Link href="/register" style={{ textDecoration: 'none' }}>
                <Button
                  startIcon={<PersonAdd />}
                  variant="contained"
                  sx={{
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1d4ed8, #7c3aed)'
                    }
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <>
              <IconButton
                onClick={handleMobileMenuOpen}
                sx={{ color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleMobileMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 3,
                    minWidth: 200
                  }
                }}
              >
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <MenuItem onClick={handleMobileMenuClose} sx={{ gap: 2, py: 1.5 }}>
                      {link.icon}
                      {link.label}
                    </MenuItem>
                  </Link>
                ))}
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
