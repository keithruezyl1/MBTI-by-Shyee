import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom
} from '@mui/material';
import { styled } from '@mui/material/styles';
import WorkIcon from '@mui/icons-material/Work';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { mbtiDescriptions } from '../data/mbti_descriptions';
import { mbtiCareers } from '../data/mbti_careers';
import { mbtiStrengths } from '../data/mbti_strengths';
import { mbtiWeaknesses } from '../data/mbti_weaknesses';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}));

const ResultCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  }
}));

const DimensionChip = styled(Chip)(({ theme, active }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[200],
  color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.grey[300],
  }
}));

const ResultPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mbtiResult, setMbtiResult] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [dimensionScores, setDimensionScores] = useState({
    EI: 0,
    SN: 0,
    TF: 0,
    JP: 0
  });

  useEffect(() => {
    const result = localStorage.getItem('mbtiResult');
    if (!result) {
      navigate('/setup');
      return;
    }
    setMbtiResult(result);
    calculateDimensionScores(result);
  }, [navigate]);

  const calculateDimensionScores = (result) => {
    const scores = {
      EI: result[0] === 'E' ? 60 : 40,
      SN: result[1] === 'S' ? 60 : 40,
      TF: result[2] === 'T' ? 60 : 40,
      JP: result[3] === 'J' ? 60 : 40
    };
    setDimensionScores(scores);
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleDownload = () => {
    const resultText = `
MBTI Personality Type: ${mbtiResult}
Description: ${mbtiDescriptions[mbtiResult]}

Strengths:
${mbtiStrengths[mbtiResult].join('\n')}

Weaknesses:
${mbtiWeaknesses[mbtiResult].join('\n')}

Career Suggestions:
${mbtiCareers[mbtiResult].join('\n')}
    `;

    const blob = new Blob([resultText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mbti-result-${mbtiResult}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleReset = () => {
    localStorage.removeItem('mbtiResult');
    navigate('/setup');
  };

  if (!mbtiResult) return null;

  return (
    <Container maxWidth="lg">
      <Fade in={true} timeout={1000}>
        <StyledPaper elevation={3}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              Your MBTI Type: {mbtiResult}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              {mbtiDescriptions[mbtiResult]}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Dimension Scores */}
            <Grid item xs={12} md={6}>
              <ResultCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <PsychologyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Personality Dimensions
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {Object.entries(dimensionScores).map(([dimension, score]) => (
                      <Box key={dimension} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {dimension === 'EI' ? 'Extraversion vs Introversion' :
                           dimension === 'SN' ? 'Sensing vs Intuition' :
                           dimension === 'TF' ? 'Thinking vs Feeling' :
                           'Judging vs Perceiving'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DimensionChip
                            label={dimension[0]}
                            active={mbtiResult.includes(dimension[0])}
                          />
                          <Box sx={{ flex: 1, height: 8, bgcolor: 'grey.200', borderRadius: 4 }}>
                            <Box
                              sx={{
                                width: `${score}%`,
                                height: '100%',
                                bgcolor: 'primary.main',
                                borderRadius: 4,
                              }}
                            />
                          </Box>
                          <DimensionChip
                            label={dimension[1]}
                            active={mbtiResult.includes(dimension[1])}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </ResultCard>
            </Grid>

            {/* Strengths and Weaknesses */}
            <Grid item xs={12} md={6}>
              <ResultCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <EmojiObjectsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Strengths & Weaknesses
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Strengths
                      </Typography>
                      <List dense>
                        {mbtiStrengths[mbtiResult].map((strength, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={strength} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="error" gutterBottom>
                        Weaknesses
                      </Typography>
                      <List dense>
                        {mbtiWeaknesses[mbtiResult].map((weakness, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={weakness} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                </CardContent>
              </ResultCard>
            </Grid>

            {/* Career Suggestions */}
            <Grid item xs={12}>
              <ResultCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Career Suggestions
                  </Typography>
                  <Grid container spacing={2}>
                    {mbtiCareers[mbtiResult].map((career, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper
                          sx={{
                            p: 2,
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: theme.shadows[4],
                            }
                          }}
                        >
                          <WorkIcon color="primary" />
                          <Typography>{career}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </ResultCard>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<ShareIcon />}
              onClick={handleShare}
            >
              Share Results
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
            >
              Download Results
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<RestartAltIcon />}
              onClick={handleReset}
            >
              Take Test Again
            </Button>
          </Box>
        </StyledPaper>
      </Fade>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onClose={() => setShowShareDialog(false)}>
        <DialogTitle>Share Your Results</DialogTitle>
        <DialogContent>
          <Typography>
            Share your MBTI type and personality insights with others!
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Your MBTI Type: {mbtiResult}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {mbtiDescriptions[mbtiResult]}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShareDialog(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              navigator.clipboard.writeText(
                `My MBTI Type: ${mbtiResult}\n${mbtiDescriptions[mbtiResult]}`
              );
              setShowShareDialog(false);
            }}
          >
            Copy to Clipboard
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ResultPage; 