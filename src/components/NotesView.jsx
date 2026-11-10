import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
  Skeleton,
  Tooltip,
  Alert,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  AccessTime as TimeIcon,
  DescriptionOutlined as NoteIcon,
} from '@mui/icons-material';
import api from '../services/api';

const NotesView = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchNotes = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/notes?page=${page}&limit=6`);
      setNotes(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(1);
  }, []);

  const handleOpenCreate = () => {
    setEditingNote(null);
    setFormTitle('');
    setFormContent('');
    setOpenDialog(true);
  };

  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setFormTitle(note.title);
    setFormContent(note.content);
    setOpenDialog(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingNote) {
        await api.put(`/notes/${editingNote._id}`, { title: formTitle, content: formContent });
      } else {
        await api.post('/notes', { title: formTitle, content: formContent });
      }
      setOpenDialog(false);
      fetchNotes(pagination.page);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      fetchNotes(pagination.page);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      {/* Header Bar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 3.5,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            My Personal Notes
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Encrypted & protected by compound index <code>{'{ userId: 1, createdAt: -1 }'}</code>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, width: { xs: '100%', sm: 'auto' } }}>
          <TextField
            size="small"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: 220 } }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Create Note
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Grid of Notes */}
      {loading ? (
        <Grid container spacing={2.5}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card sx={{ height: 180, p: 2 }}>
                <Skeleton variant="text" width="60%" height={28} />
                <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1.5 }} />
                <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : filteredNotes.length === 0 ? (
        <Card
          sx={{
            py: 8,
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderStyle: 'dashed',
          }}
        >
          <NoteIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {search ? 'No notes matched your search query.' : 'No notes found.'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, mb: 2 }}>
            Start by clicking "Create Note" above to write your first entry.
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenCreate}>
            Create First Note
          </Button>
        </Card>
      ) : (
        <Grid container spacing={2.5}>
          {filteredNotes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                  },
                }}
              >
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, wordBreak: 'break-word' }}>
                    {note.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                    <TimeIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {new Date(note.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      maxHeight: 120,
                      overflowY: 'auto',
                    }}
                  >
                    {note.content}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 1.5 }}>
                  <Tooltip title="Edit Note">
                    <IconButton size="small" color="primary" onClick={() => handleOpenEdit(note)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Note">
                    <IconButton size="small" color="error" onClick={() => handleDelete(note._id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination Bar */}
      {!loading && pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={(_, p) => fetchNotes(p)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleSave}>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {editingNote ? 'Edit Note' : 'Create New Note'}
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              label="Title"
              fullWidth
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              sx={{ mb: 2.5 }}
              placeholder="e.g. Architecture RFC Review"
            />
            <TextField
              label="Content"
              fullWidth
              required
              multiline
              rows={4}
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="Write your note markdown or text here..."
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenDialog(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Saving...' : editingNote ? 'Update Note' : 'Save Note'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default NotesView;

