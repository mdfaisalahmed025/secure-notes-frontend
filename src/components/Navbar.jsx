import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LockOutlined as LockIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        color: '#0f172a',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        {/* Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)',
            }}
          >
            <LockIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              SecureNotes
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontSize: '0.72rem', display: { xs: 'none', sm: 'block' } }}
            >
              RBAC & Index Optimized
            </Typography>
          </Box>
        </Box>

        {/* User Info & Actions */}
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Chip
              icon={isAdmin ? <AdminIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
              label={isAdmin ? 'Administrator' : 'Standard User'}
              color={isAdmin ? 'warning' : 'primary'}
              size="small"
              sx={{ fontWeight: 600, textTransform: 'capitalize' }}
            />

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: isAdmin ? 'secondary.main' : 'primary.light',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                {user.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.1 }}>
                  {user.username}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {user.email}
                </Typography>
              </Box>
            </Box>

            <Tooltip title="Logout">
              <IconButton
                onClick={logout}
                color="error"
                size="small"
                sx={{
                  bgcolor: 'rgba(239, 68, 68, 0.08)',
                  '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.16)' },
                }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

