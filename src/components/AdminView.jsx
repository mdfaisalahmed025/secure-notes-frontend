import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Pagination,
  Tabs,
  Tab,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  PersonAdd as AddUserIcon,
  Delete as DeleteIcon,
  Security as AdminBadgeIcon,
  People as UsersIcon,
  Description as NotesIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import api from '../services/api';

const AdminView = () => {
  const [activeTab, setActiveTab] = useState(0); // 0: Users, 1: System Notes
  const [users, setUsers] = useState([]);
  const [usersPagination, setUsersPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [notes, setNotes] = useState([]);
  const [notesPagination, setNotesPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loadingNotes, setLoadingNotes] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add User Dialog
  const [openAddUser, setOpenAddUser] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [interests, setInterests] = useState('');
  const [savingUser, setSavingUser] = useState(false);

  const fetchUsers = async (page = 1) => {
    setLoadingUsers(true);
    setError('');
    try {
      const res = await api.get(`/admin/users?page=${page}&limit=5`);
      setUsers(res.data.data);
      setUsersPagination(res.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchAllNotes = async (page = 1) => {
    setLoadingNotes(true);
    setError('');
    try {
      const res = await api.get(`/admin/notes?page=${page}&limit=5`);
      setNotes(res.data.data);
      setNotesPagination(res.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingNotes(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
    fetchAllNotes(1);
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSavingUser(true);
    setError('');
    try {
      const parsedInterests = interests.split(',').map((s) => s.trim()).filter(Boolean);
      await api.post('/admin/users', { username, email, password, role, interests: parsedInterests });
      setSuccess('User created successfully.');
      setOpenAddUser(false);
      setUsername('');
      setEmail('');
      setPassword('');
      setInterests('');
      fetchUsers(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user? All their notes and posts will be cascade deleted.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setSuccess('User and their data deleted.');
      fetchUsers(usersPagination.page);
      fetchAllNotes(notesPagination.page);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AdminBadgeIcon color="warning" /> Administrator Management Console
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Full system control: Manage users & monitor all platform notes with indexed pagination.
          </Typography>
        </Box>
        {activeTab === 0 && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddUserIcon />}
            onClick={() => setOpenAddUser(true)}
          >
            Add New User
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2.5 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{ mb: 3, borderBottom: '1px solid #e2e8f0' }}
      >
        <Tab icon={<UsersIcon />} iconPosition="start" label={`Users Directory (${usersPagination.total})`} />
        <Tab icon={<NotesIcon />} iconPosition="start" label={`All Notes Monitor (${notesPagination.total})`} />
      </Tabs>

      {/* TAB 0: USERS MANAGEMENT */}
      {activeTab === 0 && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Interests</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Joined</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u._id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{u.username}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={u.role}
                        color={u.role === 'admin' ? 'warning' : 'default'}
                        size="small"
                        sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {(u.interests || []).map((interest) => (
                          <Chip key={interest} label={interest} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Delete User">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteUser(u._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {usersPagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination
                count={usersPagination.totalPages}
                page={usersPagination.page}
                onChange={(_, p) => fetchUsers(p)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </Card>
      )}

      {/* TAB 1: ALL NOTES MONITOR */}
      {activeTab === 1 && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Author</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Content Snippet</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Created Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notes.map((n) => (
                  <TableRow key={n._id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{n.title}</TableCell>
                    <TableCell>
                      <Chip
                        label={n.userId ? `${n.userId.username} (${n.userId.role})` : 'Unknown'}
                        size="small"
                        color={n.userId?.role === 'admin' ? 'warning' : 'primary'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 350, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {n.content}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {notesPagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination
                count={notesPagination.totalPages}
                page={notesPagination.page}
                onChange={(_, p) => fetchAllNotes(p)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </Card>
      )}

      {/* Add User Dialog */}
      <Dialog open={openAddUser} onClose={() => setOpenAddUser(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleCreateUser}>
          <DialogTitle sx={{ fontWeight: 700 }}>Add New System User</DialogTitle>
          <DialogContent dividers>
            <TextField
              label="Username"
              fullWidth
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email Address"
              fullWidth
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              fullWidth
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Role"
              select
              fullWidth
              value={role}
              onChange={(e) => setRole(e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <TextField
              label="Interests (comma separated)"
              fullWidth
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. chess, security, ai"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenAddUser(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={savingUser}>
              {savingUser ? 'Creating...' : 'Create User'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AdminView;

