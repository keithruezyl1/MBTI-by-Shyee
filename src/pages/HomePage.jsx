import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  Fade,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import mbtiQuotes from '../mbti_quotes_by_type.json';

// --- OPENAI API CONFIG ---
const OPENAI_API_KEY = "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";
const OPENAI_SYSTEM_PROMPT = `You are an AI that generates witty, personality-specific quotes based on a user’s MBTI type. 

Your job is to create ONE short, unique, and original quote each time you are prompted. The quote must reflect the psychological traits, quirks, worldview, or humor style of the specific MBTI type provided to you. You do not need to explain the quote or the type—just return the quote itself.

💡 Behavior Rules:
- The quote must be concise (ideally under 30 words).
- The quote must reflect the personality of the MBTI type provided. Speak *as if* the user with that type is saying or thinking it.
- The tone must always be *witty*, *clever*, or *philosophically playful*. Dry humor, sarcasm, poetic mischief, and thought-provoking irony are welcome.
- Quotes must be DIVERSE each time. Do not reuse templates or generic phrasing.
- You must NOT say the MBTI type out loud or explain it in the quote. Imply the personality traits through the voice or content.
- Avoid clichés or directly quoting known figures. All quotes must be original and unpredictable.
- The output must ONLY be the quote. No prefaces, comments, or labels.
- Never break character or explain what you're doing.

🧠 Example MBTI-quote mappings:
- INTJ: dry, strategic, detached brilliance with biting insight.
- ENFP: chaotic joy, random metaphors, and boundless enthusiasm.
- ISTP: minimal words, max logic, anti-drama energy.
- INFP: poetic, whimsical, deeply felt yet oddly worded.
- ESTJ: structured, confident, straight-to-the-point leadership vibes.

🛑 Forbidden:
- No lists
- No emoji
- No quotation marks unless used creatively inside the sentence
- No repeating earlier quotes verbatim

Your output is consumed by an application—no extra formatting, just raw quote text as the user would say it.
`;

const HomePage = () => {
  const [userName, setUserName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [mbtiResult, setMbtiResult] = useState('');
  const [quote, setQuote] = useState('');
  const [openQuote, setOpenQuote] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [loadingQuote, setLoadingQuote] = useState(false); // Loading state for quote
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedPhoto = localStorage.getItem('profilePhoto');
    const storedResult = localStorage.getItem('mbtiResult');

    if (!storedName || !storedResult) {
      navigate('/setup');
      return;
    }

    setUserName(storedName);
    setMbtiResult(storedResult);
    if (storedPhoto) {
      setProfilePhoto(storedPhoto);
    }
  }, [navigate]);

  const generateQuote = async () => {
    setLoadingQuote(true);
    setQuote(""); // Clear previous quote
    try {
      const prompt = OPENAI_SYSTEM_PROMPT;
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo-0125",
          messages: [
            { role: "system", content: prompt },
            { role: "user", content: `Generate a quote for ${mbtiResult}` }
          ],
          max_tokens: 60,
          temperature: 1.0,
          top_p: 1.0,
          frequency_penalty: 0.5,
          presence_penalty: 0.3,
        }),
      });
      const data = await response.json();
      const aiQuote = data.choices?.[0]?.message?.content?.trim() || "No quote generated.";
      setQuote(aiQuote);
      setOpenQuote(true);
    } catch (err) {
      setQuote("Failed to generate quote. Please try again.");
      setOpenQuote(true);
    }
    setLoadingQuote(false);
  };

  const handleCloseQuote = () => {
    setOpenQuote(false);
  };

  const handleResetClick = () => {
    setOpenResetDialog(true);
  };

  const handleResetConfirm = () => {
    // Clear all localStorage data
    localStorage.clear();
    // Redirect to setup
    navigate('/setup');
  };

  const handleResetCancel = () => {
    setOpenResetDialog(false);
  };

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        py: 4,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <Button
        variant="outlined"
        color="error"
        startIcon={<RestartAltIcon />}
        onClick={handleResetClick}
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1000,
          borderRadius: 2,
          textTransform: 'none',
          '&:hover': {
            backgroundColor: theme.palette.error.light,
            color: theme.palette.error.contrastText
          }
        }}
      >
        Reset All
      </Button>

      <Fade in={true} timeout={1000}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '600px',
            mx: 'auto'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            mb: 4,
            position: 'relative'
          }}>
            <Avatar
              src={profilePhoto}
              sx={{ 
                width: 120, 
                height: 120, 
                mb: 2,
                border: `4px solid ${theme.palette.primary.main}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            />
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: theme.palette.text.primary,
                textAlign: 'center'
              }}
            >
              {userName}
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: theme.palette.primary.main,
                fontWeight: 500,
                mb: 2,
                textAlign: 'center'
              }}
            >
              {mbtiResult}
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 4 
          }}>
            <Button
              variant="contained"
              size="large"
              onClick={generateQuote}
              startIcon={<AutoAwesomeIcon />}
              disabled={loadingQuote}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 2,
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loadingQuote ? 'Generating...' : 'Generate Daily Quote'}
            </Button>
          </Box>

          <Dialog
            open={openQuote}
            onClose={handleCloseQuote}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 2,
                p: 1
              }
            }}
          >
            <DialogTitle sx={{ 
              pb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Your Daily Quote
              </Typography>
              <IconButton
                aria-label="close"
                onClick={handleCloseQuote}
                sx={{ 
                  color: theme.palette.grey[500],
                  '&:hover': {
                    color: theme.palette.grey[700]
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Typography 
                variant="h6" 
                sx={{ 
                  mt: 2, 
                  textAlign: 'center',
                  fontStyle: 'italic',
                  color: theme.palette.text.secondary,
                  lineHeight: 1.6
                }}
              >
                {quote}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button 
                onClick={handleCloseQuote}
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Fade>

      {/* Reset Confirmation Dialog */}
      <Dialog
        open={openResetDialog}
        onClose={handleResetCancel}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.error.main }}>
            Reset Everything?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 1, color: theme.palette.text.secondary }}>
            You'll lose all your data
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleResetCancel}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleResetConfirm}
            variant="contained"
            color="error"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomePage; 