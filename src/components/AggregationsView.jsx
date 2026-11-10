import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  MenuItem,
  TextField,
  Paper,
  Stack,
} from '@mui/material';
import {
  Hub as PipelineIcon,
  PlayArrow as RunIcon,
  Article as PostIcon,
  GroupWork as GroupIcon,
} from '@mui/icons-material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AggregationsView = () => {
  const { user, isAdmin } = useAuth();

  // Scenario 1 State
  const [scenario1Data, setScenario1Data] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [error1, setError1] = useState('');

  // Scenario 2 State
  const [scenario2Data, setScenario2Data] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading2, setLoading2] = useState(false);
  const [error2, setError2] = useState('');

  // Run Scenario 1: Group by Interests
  const runScenario1 = async () => {
    setLoading1(true);
    setError1('');
    try {
      const res = await api.get('/aggregations/group-by-interests');
      setScenario1Data(res.data.data);
    } catch (err) {
      setError1(err.message);
    } finally {
      setLoading1(false);
    }
  };

  // Run Scenario 2: User Posts with $lookup
  const runScenario2 = async (targetId) => {
    const idToQuery = targetId || selectedUserId;
    if (!idToQuery) return;
    setLoading2(true);
    setError2('');
    try {
      const res = await api.get(`/aggregations/user-posts/${idToQuery}`);
      setScenario2Data(res.data.data);
    } catch (err) {
      setError2(err.message);
    } finally {
      setLoading2(false);
    }
  };

  // Fetch users list for Scenario 2 selector
  useEffect(() => {
    const loadUsers = async () => {
      try {
        if (isAdmin) {
          const res = await api.get('/admin/users?limit=50');
          setUsersList(res.data.data);
          if (res.data.data.length > 0) {
            setSelectedUserId(res.data.data[0]._id);
            runScenario2(res.data.data[0]._id);
          }
        } else if (user) {
          setSelectedUserId(user._id);
          runScenario2(user._id);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadUsers();
    runScenario1(); // Auto-load Scenario 1 on mount
  }, [isAdmin, user]);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          MongoDB Aggregation Pipelines
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Real-time demonstration of the two required technical aggregation scenarios backed by custom indexes.
        </Typography>
      </Box>

      <Grid container spacing={3.5}>
        {/* Scenario 1 Card */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1, p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Chip
                  label="Scenario 1"
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                />
                <Chip
                  label="Index: { interests: 1 }"
                  variant="outlined"
                  size="small"
                  sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                />
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Group Users by Interests
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
                Uses <strong>exactly one <code>collection.aggregate()</code> call</strong> unwinding the <code>interests</code> multikey array and grouping users alphabetically.
              </Typography>

              <Button
                variant="contained"
                startIcon={loading1 ? <CircularProgress size={18} color="inherit" /> : <RunIcon />}
                onClick={runScenario1}
                disabled={loading1}
                sx={{ mb: 3 }}
              >
                Execute Group By Pipeline
              </Button>

              {error1 && <Alert severity="error" sx={{ mb: 2 }}>{error1}</Alert>}

              {scenario1Data && (
                <Stack spacing={1.5}>
                  {scenario1Data.map((group) => (
                    <Paper
                      key={group._id}
                      variant="outlined"
                      sx={{ p: 2, borderRadius: 2, bgcolor: '#fafafa' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Chip
                          icon={<GroupIcon fontSize="small" />}
                          label={group._id}
                          color="secondary"
                          size="small"
                          sx={{ fontWeight: 700, textTransform: 'capitalize' }}
                        />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          {group.totalUsers} {group.totalUsers === 1 ? 'user' : 'users'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {group.users.map((u) => (
                          <Chip
                            key={u._id}
                            avatar={<Avatar sx={{ bgcolor: 'primary.main', width: 22, height: 22, fontSize: '0.7rem' }}>{u.username[0]}</Avatar>}
                            label={`${u.username} (${u.role})`}
                            size="small"
                            variant="outlined"
                            sx={{ bgcolor: '#fff' }}
                          />
                        ))}
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Scenario 2 Card */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1, p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Chip
                  label="Scenario 2"
                  color="secondary"
                  size="small"
                  sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                />
                <Chip
                  label="Index: { userId: 1, createdAt: -1 }"
                  variant="outlined"
                  size="small"
                  sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                />
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                User Posts with $lookup
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
                Retrieves all posts belonging to a target user via a <strong>single aggregation pipeline with a <code>$lookup</code> stage</strong> into the <code>posts</code> collection.
              </Typography>

              {/* User Selector */}
              <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
                {isAdmin && usersList.length > 0 ? (
                  <TextField
                    select
                    label="Select Target User"
                    size="small"
                    fullWidth
                    value={selectedUserId}
                    onChange={(e) => {
                      setSelectedUserId(e.target.value);
                      runScenario2(e.target.value);
                    }}
                  >
                    {usersList.map((u) => (
                      <MenuItem key={u._id} value={u._id}>
                        {u.username} ({u.email})
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <TextField
                    label="Target User ID"
                    size="small"
                    fullWidth
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    placeholder="Enter User ObjectId"
                  />
                )}
                <Button
                  variant="contained"
                  startIcon={loading2 ? <CircularProgress size={18} color="inherit" /> : <RunIcon />}
                  onClick={() => runScenario2()}
                  disabled={loading2}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Run $lookup
                </Button>
              </Box>

              {error2 && <Alert severity="error" sx={{ mb: 2 }}>{error2}</Alert>}

              {scenario2Data && (
                <Box>
                  <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {scenario2Data.username} ({scenario2Data.email})
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                      Role: {scenario2Data.role} | Interests: {(scenario2Data.interests || []).join(', ') || 'none'}
                    </Typography>
                    <Chip
                      label={`Total Joined Posts: ${scenario2Data.totalPosts || 0}`}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </Paper>

                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                    Joined Posts from Separate Collection:
                  </Typography>

                  {(!scenario2Data.posts || scenario2Data.posts.length === 0) ? (
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                      This user has not published any public posts yet.
                    </Typography>
                  ) : (
                    <Stack spacing={1.5}>
                      {scenario2Data.posts.map((post) => (
                        <Paper
                          key={post._id}
                          variant="outlined"
                          sx={{ p: 1.5, borderRadius: 2, bgcolor: '#ffffff' }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PostIcon fontSize="small" color="primary" /> {post.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                            {post.content}
                          </Typography>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AggregationsView;
