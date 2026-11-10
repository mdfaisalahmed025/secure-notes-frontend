import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  Divider,
  Chip,
  MenuItem,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  LockOutlined as LockIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  FlashOn as QuickIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const AuthView = () => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState(0); // 0: Login, 1: Register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regInterests, setRegInterests] = useState('');
  const [regRole, setRegRole] = useState('user');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        username: regUsername,
        email: regEmail,
        password: regPassword,
        interests: regInterests,
        role: regRole,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setDemoLogin = (email, password) => {
    setTab(0);
    setLoginEmail(email);
    setLoginPassword(password);
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4.5 },
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              bgcolor: 'primary.main',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1.5,
              boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
            }}
          >
            <LockIcon fontSize="medium" />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Secure Note-Taking Platform
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            JWT Authentication & Role-Based Access Control
          </Typography>
        </Box>

        {/* Quick Demo Logins for Interview / Review */}
        <Box sx={{ mb: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}
          >
            <QuickIcon fontSize="inherit" color="primary" /> QUICK DEMO SIGN-IN:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip
              label="Admin Demo (System Admin)"
              color="warning"
              size="small"
              clickable
              onClick={() => setDemoLogin('admin@example.com', 'AdminPassword123!')}
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="User Demo (Alice)"
              color="primary"
              size="small"
              clickable
              onClick={() => setDemoLogin('alice@example.com', 'UserPassword123!')}
              sx={{ fontWeight: 600 }}
            />
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Tabs
          value={tab}
          onChange={(_, val) => {
            setTab(val);
            setError('');
          }}
          variant="fullWidth"
          sx={{ mb: 3, borderBottom: '1px solid #e2e8f0' }}
        >
          <Tab icon={<LoginIcon />} iconPosition="start" label="Sign In" />
          <Tab icon={<RegisterIcon />} iconPosition="start" label="Create Account" />
        </Tabs>

        {tab === 0 ? (
          <Box component="form" onSubmit={handleLoginSubmit}>
            <TextField
              label="Email Address"
              fullWidth
              required
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="e.g. admin@example.com"
            />
            <TextField
              label="Password"
              fullWidth
              required
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              sx={{ mb: 3 }}
              placeholder="••••••••"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ py: 1.3 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In to Dashboard'}
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleRegisterSubmit}>
            <TextField
              label="Username"
              fullWidth
              required
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="e.g. John Doe"
            />
            <TextField
              label="Email Address"
              fullWidth
              required
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="e.g. john@example.com"
            />
            <TextField
              label="Password (min 6 characters)"
              fullWidth
              required
              type="password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="••••••••"
            />
            <TextField
              label="Interests (comma separated)"
              fullWidth
              value={regInterests}
              onChange={(e) => setRegInterests(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="e.g. chess, reading, ai"
              helperText="Powers MongoDB Multikey Index & Scenario 1 Aggregation"
            />
            <TextField
              label="Role"
              select
              fullWidth
              value={regRole}
              onChange={(e) => setRegRole(e.target.value)}
              sx={{ mb: 3 }}
            >
              <MenuItem value="user">User (Standard Access)</MenuItem>
              <MenuItem value="admin">Admin (Full System Access)</MenuItem>
            </TextField>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ py: 1.3 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register Account'}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AuthView;

