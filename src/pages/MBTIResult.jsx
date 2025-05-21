import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Fade,
  Zoom,
  useTheme,
  Chip,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import HomeIcon from '@mui/icons-material/Home';
import ReplayIcon from '@mui/icons-material/Replay';
import { getTypeDescription } from '../utils/mbtiCalculator';

const MBTIResult = () => {
  const [result, setResult] = useState('');
  const [userName, setUserName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [typeInfo, setTypeInfo] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const storedResult = localStorage.getItem('mbtiResult');
    const storedName = localStorage.getItem('userName');
    const storedPhoto = localStorage.getItem('profilePhoto');
    const mbtiAnswers = localStorage.getItem('mbtiAnswers');
    
    if (!storedName || !storedResult) {
      navigate('/setup');
      return;
    }
    // Restrict navigation to Result unless all questions are answered
    if (!mbtiAnswers) {
      navigate('/test');
      return;
    }
    try {
      const parsed = JSON.parse(mbtiAnswers);
      if (!parsed || Object.keys(parsed).length !== 60) {
        navigate('/test');
        return;
      }
    } catch {
      navigate('/test');
      return;
    }
    
    setResult(storedResult);
    setUserName(storedName);
    if (storedPhoto) {
      setProfilePhoto(storedPhoto);
    }
    // Get comprehensive type description
    setTypeInfo(getTypeDescription(storedResult, storedName));
  }, [navigate]);

  const handleGoToHome = () => {
    navigate('/home');
  };

  const handleRetake = () => {
    setConfirmOpen(true);
  };

  const handleConfirmRetake = () => {
    setConfirmOpen(false);
    localStorage.removeItem('mbtiAnswers');
    localStorage.removeItem('mbtiResult');
    navigate('/test');
  };

  const handleCancelRetake = () => {
    setConfirmOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #f8fefa 0%, #e6fcf1 100%)',
        py: isMobile ? 2 : 6,
        px: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md" sx={{ px: isMobile ? 0.5 : 2 }}>
        <Fade in timeout={1000}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: isMobile ? 2 : 4, 
              mt: 0, 
              borderRadius: 3,
              background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
              boxShadow: '0 8px 32px rgba(44, 62, 80, 0.10)',
              maxWidth: 700,
              mx: 'auto',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Zoom in timeout={1000}>
                <Avatar
                  src={profilePhoto}
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mb: 2,
                    border: `4px solid ${theme.palette.primary.main}`,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  }}
                />
              </Zoom>
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                {userName}
              </Typography>
            </Box>

            <Grid container spacing={isMobile ? 2 : 3}>
              <Grid item xs={12}>
                <Zoom in timeout={1200}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: isMobile ? 2 : 4, 
                      bgcolor: 'rgba(255,255,255,0.9)',
                      borderRadius: 2,
                      border: `1.5px solid ${theme.palette.primary.light}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Chip
                      label={result}
                      color="success"
                      sx={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        letterSpacing: 2,
                        px: 2,
                        py: 1,
                        mb: 1,
                        borderRadius: 2,
                        background: theme.palette.success.light,
                        color: theme.palette.success.dark,
                        boxShadow: '0 2px 8px rgba(76,175,80,0.08)',
                        textTransform: 'uppercase',
                      }}
                    />
                    <Typography 
                      variant="h5" 
                      align="center" 
                      color="primary" 
                      gutterBottom
                      sx={{ fontWeight: 500 }}
                    >
                      {(result === 'XXXX' || result.includes('X'))
                        ? "Result Inconclusive"
                        : typeInfo?.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      align="center" 
                      paragraph
                      sx={{ 
                        lineHeight: 1.8,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {(result === 'XXXX' || result.includes('X'))
                        ? "Your answers were too balanced or neutral to determine a clear MBTI type. Please try to answer more decisively, or retake the test for a more accurate result."
                        : typeInfo?.description}
                    </Typography>
                  </Paper>
                </Zoom>
              </Grid>
            </Grid>

            <Divider sx={{ my: isMobile ? 2 : 4, borderColor: theme.palette.primary.light, borderBottomWidth: 2 }} />

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: isMobile ? 2 : 3,
                alignItems: 'stretch',
                mb: isMobile ? 2 : 3,
              }}
            >
              <Fade in timeout={1400}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    flex: 1,
                    p: isMobile ? 2 : 3, 
                    minHeight: 220,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    borderRadius: 2,
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.02)',
                      boxShadow: '0 8px 24px rgba(76,175,80,0.10)',
                    },
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    Your Strengths
                  </Typography>
                  <List sx={{ flex: 1 }}>
                    {typeInfo?.strengths.map((strength, index) => (
                      <ListItem key={index} sx={{ py: 1 }}>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" sx={{ fontSize: 28 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={strength}
                          sx={{ 
                            '& .MuiListItemText-primary': {
                              fontWeight: 500,
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Fade>
              <Fade in timeout={1600}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    flex: 1,
                    p: isMobile ? 2 : 3, 
                    minHeight: 220,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    borderRadius: 2,
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.02)',
                      boxShadow: '0 8px 24px rgba(255,193,7,0.10)',
                    },
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    Areas for Growth
                  </Typography>
                  <List sx={{ flex: 1 }}>
                    {typeInfo?.challenges.map((challenge, index) => (
                      <ListItem key={index} sx={{ py: 1 }}>
                        <ListItemIcon>
                          <WarningIcon color="warning" sx={{ fontSize: 28 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={challenge}
                          sx={{ 
                            '& .MuiListItemText-primary': {
                              fontWeight: 500,
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Fade>
            </Box>

            <Box sx={{ mt: isMobile ? 3 : 4, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleGoToHome}
                startIcon={<HomeIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                Go to Home
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleRetake}
                startIcon={<ReplayIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    borderColor: theme.palette.primary.dark,
                    background: theme.palette.action.hover,
                  },
                  transition: 'all 0.2s',
                }}
              >
                Retake Test
              </Button>
            </Box>
            <Dialog open={confirmOpen} onClose={handleCancelRetake}>
              <DialogTitle>Retake Test?</DialogTitle>
              <DialogContent>
                <Typography>Are you sure you want to retake the test? Your previous answers and result will be lost.</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelRetake} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmRetake} color="error" variant="contained">
                  Yes, Retake
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default MBTIResult; 