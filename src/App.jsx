import React, { useState } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  NoteAltOutlined as NotesIcon,
  HubOutlined as AggregationsIcon,
  DynamicFeedOutlined as PostsIcon,
  AdminPanelSettingsOutlined as AdminIcon,
} from '@mui/icons-material';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthView from './components/AuthView';
import NotesView from './components/NotesView';
import AggregationsView from './components/AggregationsView';
import AdminView from './components/AdminView';
import PostsView from './components/PostsView';

function App() {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar />
        <AuthView />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 3.5 }}>
        {/* Navigation Tabs Bar */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            px: 2,
            bgcolor: '#ffffff',
          }}
        >
          <Tabs
            value={currentTab}
            onChange={(_, val) => setCurrentTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '0.92rem',
                minHeight: 56,
              },
            }}
          >
            <Tab icon={<NotesIcon />} iconPosition="start" label="My Notes" />
            <Tab icon={<AggregationsIcon />} iconPosition="start" label="Aggregation Scenarios" />
            <Tab icon={<PostsIcon />} iconPosition="start" label="Public Posts" />
            {isAdmin && (
              <Tab
                icon={<AdminIcon color="warning" />}
                iconPosition="start"
                label="Admin Management Console"
                sx={{ color: '#d97706', '&.Mui-selected': { color: '#b45309' } }}
              />
            )}
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <Box sx={{ mt: 2 }}>
          {currentTab === 0 && <NotesView />}
          {currentTab === 1 && <AggregationsView />}
          {currentTab === 2 && <PostsView />}
          {currentTab === 3 && isAdmin && <AdminView />}
        </Box>
      </Container>
    </Box>
  );
}

export default App;
