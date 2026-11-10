import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
  Chip,
  Avatar,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  Add as AddIcon,
  Article as ArticleIcon,
  Person as AuthorIcon,
} from '@mui/icons-material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PostsView = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create Post Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/posts?page=${page}&limit=6`);
      setPosts(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/posts', { title, content });
      setOpenDialog(false);
      setTitle('');
      setContent('');
      fetchPosts(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3.5,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Public Posts Feed
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Posts stored in the separate <code>Posts</code> collection (supporting Scenario 2 $lookup).
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Publish Post
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Grid container spacing={2.5}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Card sx={{ height: 160, p: 2 }}>
                <Skeleton variant="text" width="70%" height={28} />
                <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1.5 }} />
                <Skeleton variant="rectangular" height={50} />
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : posts.length === 0 ? (
        <Card sx={{ py: 6, textAlign: 'center', borderStyle: 'dashed' }}>
          <ArticleIcon sx={{ fontSize: 44, color: 'text.secondary', mb: 1 }} />
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            No public posts available yet.
          </Typography>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setOpenDialog(true)}>
            Publish the First Post
          </Button>
        </Card>
      ) : (
        <Grid container spacing={2.5}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} key={post._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {post.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Chip
                      avatar={<Avatar>{post.userId?.username?.[0] || '?'}</Avatar>}
                      label={post.userId?.username || 'Community Member'}
                      size="small"
                      variant="outlined"
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
                    {post.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={(_, p) => fetchPosts(p)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}

      {/* Create Post Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleCreatePost}>
          <DialogTitle sx={{ fontWeight: 700 }}>Publish Public Post</DialogTitle>
          <DialogContent dividers>
            <TextField
              label="Post Title"
              fullWidth
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2.5 }}
              placeholder="e.g. Distributed Consensus in Modern Databases"
            />
            <TextField
              label="Content"
              fullWidth
              required
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share thoughts visible across the entire platform..."
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenDialog(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default PostsView;

