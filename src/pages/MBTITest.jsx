import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  LinearProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Avatar,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  IconButton,
  FormLabel
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import questions from '../mbti_60_questions.json';
import { calculateMBTI } from '../utils/mbtiCalculator';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const BgContainer = styled(Container)({
  minHeight: '100vh',
  height: '100vh',
  background: 'linear-gradient(135deg, #f8fefa 0%, #e6fcf1 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  position: 'relative',
  overflow: 'hidden',
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: '700px',
  width: '100%',
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  position: 'relative',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  minHeight: '500px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}));

const QuestionText = styled(Typography)({
  fontWeight: 700,
  fontSize: '1.5rem',
  marginBottom: '32px',
  color: '#1a1a1a',
  textAlign: 'center',
  lineHeight: 1.4,
});

const OptionCard = styled(Box)(({ selected }) => ({
  border: selected ? '2px solid #4CAF50' : '2px solid #e0e0e0',
  background: selected ? 'rgba(76, 175, 80, 0.08)' : '#fafbfc',
  borderRadius: '12px',
  padding: '16px 20px',
  marginBottom: '18px',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  boxShadow: selected ? '0 2px 8px rgba(76,175,80,0.08)' : 'none',
  transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
  '&:hover': {
    borderColor: '#4CAF50',
    background: 'rgba(76, 175, 80, 0.12)',
  },
}));

const StyledProgress = styled(LinearProgress)({
  height: 10,
  borderRadius: 8,
  backgroundColor: 'rgba(76, 175, 80, 0.12)',
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    transition: 'transform 0.4s ease',
  },
});

const NextButton = styled(Button)({
  backgroundColor: '#4CAF50',
  color: '#fff',
  borderRadius: '12px',
  padding: '14px 36px',
  fontWeight: 600,
  fontSize: '1.1rem',
  marginTop: '16px',
  boxShadow: '0 4px 12px rgba(76,175,80,0.15)',
  transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
  '&:hover': {
    backgroundColor: '#43A047',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(76,175,80,0.2)',
  },
  '&:disabled': {
    backgroundColor: '#e0e0e0',
    color: '#9e9e9e',
  }
});

const DevButton = styled(Button)({
  backgroundColor: '#ff9800',
  color: '#fff',
  borderRadius: '8px',
  padding: '8px 16px',
  fontWeight: 600,
  fontSize: '0.875rem',
  marginTop: '16px',
  boxShadow: '0 2px 8px rgba(255,152,0,0.2)',
  transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
  '&:hover': {
    backgroundColor: '#f57c00',
    transform: 'scale(1.04)',
  },
});

const QuestionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  position: 'relative',
  '&:hover': {
    '& .help-icon': {
      opacity: 1,
    }
  }
}));

const HelpIcon = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: -40,
  top: 0,
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    right: 0,
    top: -40,
  }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginTop: theme.spacing(3),
  '& .MuiFormLabel-root': {
    color: theme.palette.text.primary,
    fontWeight: 600,
    fontSize: '1.1rem',
    marginBottom: theme.spacing(1),
  },
  '& .MuiRadio-root': {
    color: theme.palette.primary.main,
    '&.Mui-checked': {
      color: '#4CAF50',
    },
  },
  '& .MuiFormControlLabel-label': {
    fontSize: '1.05rem',
    color: '#424242',
  }
}));

const NavigationButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: theme.spacing(4),
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  }
}));

const MBTITest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [started, setStarted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [helpContent, setHelpContent] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Check for existing progress on mount
  useEffect(() => {
    const storedAnswers = localStorage.getItem('mbtiAnswers');
    const storedQuestion = localStorage.getItem('currentQuestion');
    
    if (storedAnswers && storedQuestion) {
      try {
        const parsedAnswers = JSON.parse(storedAnswers);
        const parsedQuestion = parseInt(storedQuestion);
        if (Object.keys(parsedAnswers).length > 0) {
          setAnswers(parsedAnswers);
          setCurrentQuestion(parsedQuestion);
          setStarted(true);
        }
      } catch (error) {
        console.error('Error parsing stored progress:', error);
      }
    }
  }, []);

  const handleAnswer = (value) => {
    const newAnswers = {
      ...answers,
      [questions[currentQuestion].id]: value
    };
    setAnswers(newAnswers);
    localStorage.setItem('mbtiAnswers', JSON.stringify(newAnswers));
    localStorage.setItem('currentQuestion', currentQuestion.toString());
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentQuestion(0);
    localStorage.removeItem('mbtiAnswers');
    localStorage.removeItem('currentQuestion');
    setShowResetDialog(false);
  };

  const handleContinue = () => {
    // Find the last unanswered question
    let lastUnansweredIndex = 0;
    for (let i = 0; i < questions.length; i++) {
      if (!answers[questions[i].id]) {
        lastUnansweredIndex = i;
        break;
      }
    }
    
    // If all questions are answered, go to the last question
    if (lastUnansweredIndex === 0 && Object.keys(answers).length === questions.length) {
      lastUnansweredIndex = questions.length - 1;
    }
    
    setCurrentQuestion(lastUnansweredIndex);
  };

  const handleNext = () => {
    if (!answers[questions[currentQuestion].id]) {
      setError('Please select an answer to continue.');
      return;
    }
    setError('');
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Check if all questions are answered
      if (Object.keys(answers).length !== questions.length) {
        setError('Please answer all questions before seeing your result.');
        return;
      }
      // Calculate MBTI type
      const mbtiTypeObj = calculateMBTI(answers, questions);
      // Store both answers and result
      localStorage.setItem('mbtiAnswers', JSON.stringify(answers));
      localStorage.setItem('mbtiResult', mbtiTypeObj.type);
      navigate('/result');
    }
  };

  const handleDevShortcut = () => {
    const allAnswers = {};
    questions.forEach(question => {
      allAnswers[question.id] = '3'; // '3' represents "Neutral"
    });
    setAnswers(allAnswers);
    setCurrentQuestion(questions.length - 1);
    localStorage.setItem('mbtiAnswers', JSON.stringify(allAnswers));
    localStorage.setItem('currentQuestion', (questions.length - 1).toString());
  };

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedProfilePhoto = localStorage.getItem('profilePhoto');
    if (!storedUserName || !storedProfilePhoto) {
      navigate('/setup');
      return;
    }
    setUserName(storedUserName);
    setProfilePhoto(storedProfilePhoto);
    
    // Prevent retaking if already completed
    const mbtiAnswers = localStorage.getItem('mbtiAnswers');
    if (mbtiAnswers) {
      const parsed = JSON.parse(mbtiAnswers);
      if (parsed && Object.keys(parsed).length === questions.length) {
        navigate('/result');
        return;
      }
    }
  }, [navigate]);

  const handleHelpClick = (dimension) => {
    const helpText = {
      'EI': 'Extraversion (E) vs Introversion (I): How you direct and receive energy',
      'SN': 'Sensing (S) vs Intuition (N): How you take in information',
      'TF': 'Thinking (T) vs Feeling (F): How you make decisions',
      'JP': 'Judging (J) vs Perceiving (P): How you organize your life'
    };
    setHelpContent(helpText[dimension]);
    setShowHelp(true);
  };

  const currentQuestionData = questions[currentQuestion];
  const dimension = currentQuestionData.dimension;

  return (
    <BgContainer maxWidth={false} disableGutters>
      <Box sx={{ 
        position: 'absolute', 
        top: 16, 
        left: 16, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'flex-start', 
        gap: 1,
        zIndex: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar 
            src={profilePhoto} 
            sx={{ width: 32, height: 32 }}
          />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {userName}
          </Typography>
        </Box>
        {process.env.NODE_ENV === 'development' && (
          <Tooltip title="Development shortcut - Auto-fill all questions with 'Neutral'">
            <DevButton 
              onClick={handleDevShortcut}
              size="small"
              sx={{ mt: 0.5 }}
            >
              Dev: All Neutral
            </DevButton>
          </Tooltip>
        )}
      </Box>
      <Box sx={{ 
        width: '100%', 
        maxWidth: 700, 
        mx: 'auto', 
        p: 2,
        mt: 4
      }}>
        {!started ? (
          <Fade in={!started} timeout={800}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '70vh',
            }}>
              <Paper elevation={4} sx={{
                p: { xs: 3, sm: 5 },
                borderRadius: 4,
                maxWidth: 500,
                width: '100%',
                boxShadow: '0 8px 32px rgba(44, 62, 80, 0.10)',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f8fefa 0%, #e6fcf1 100%)',
              }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#43A047', mb: 2, letterSpacing: 1 }}>
                  Welcome to the MBTI Test
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary', fontSize: '1.1rem' }}>
                  You are about to take the Myers-Briggs Type Indicator (MBTI) test. This test consists of 60 questions and is designed to help you discover your personality type based on your preferences and behaviors.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, color: 'text.primary', fontWeight: 500 }}>
                  <b>Be as honest as possible</b> with your answers. There are no right or wrong responses. The more truthful you are, the more accurate your result will be.
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(90deg, #43A047 0%, #66bb6a 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    borderRadius: 2,
                    px: 5,
                    py: 1.5,
                    boxShadow: '0 2px 8px rgba(76,175,80,0.12)',
                    mb: 1,
                    '&:hover': {
                      background: 'linear-gradient(90deg, #388e3c 0%, #43A047 100%)',
                      transform: 'scale(1.04)',
                    },
                  }}
                  onClick={() => setStarted(true)}
                >
                  Start Test
                </Button>
              </Paper>
            </Box>
          </Fade>
        ) : (
          <>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{ 
                fontWeight: 700, 
                color: '#2E7D32', 
                letterSpacing: 0.5, 
                textAlign: 'center', 
                position: 'relative',
                fontSize: '1.25rem',
                mb: 3
              }}
            >
              Question {currentQuestion + 1} of {questions.length}
              <HelpIcon 
                className="help-icon"
                onClick={() => handleHelpClick(dimension)}
                size="small"
                sx={{ 
                  position: 'absolute',
                  right: -40,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  opacity: 1,
                  color: '#4CAF50',
                  '&:hover': {
                    color: '#2E7D32',
                  }
                }}
              >
                <HelpOutlineIcon />
              </HelpIcon>
            </Typography>
            <StyledProgress variant="determinate" value={progress} sx={{ mb: 4 }} />
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <QuestionContainer>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontSize: '1.4rem',
                    fontWeight: 600,
                    color: '#1a1a1a',
                    mb: 3,
                    lineHeight: 1.4
                  }}>
                    {currentQuestionData.question}
                  </Typography>
                  <StyledFormControl component="fieldset">
                    <FormLabel component="legend" sx={{ mb: 2 }}>Select your answer:</FormLabel>
                    <RadioGroup
                      value={answers[currentQuestionData.id] || ''}
                      onChange={(e) => handleAnswer(e.target.value)}
                    >
                      <FormControlLabel 
                        value="1" 
                        control={<Radio />} 
                        label="Strongly Disagree" 
                        sx={{ mb: 1 }}
                      />
                      <FormControlLabel 
                        value="2" 
                        control={<Radio />} 
                        label="Disagree" 
                        sx={{ mb: 1 }}
                      />
                      <FormControlLabel 
                        value="3" 
                        control={<Radio />} 
                        label="Neutral" 
                        sx={{ mb: 1 }}
                      />
                      <FormControlLabel 
                        value="4" 
                        control={<Radio />} 
                        label="Agree" 
                        sx={{ mb: 1 }}
                      />
                      <FormControlLabel 
                        value="5" 
                        control={<Radio />} 
                        label="Strongly Agree" 
                      />
                    </RadioGroup>
                  </StyledFormControl>
                </QuestionContainer>
              </motion.div>
            </AnimatePresence>
            {error && (
              <Typography color="error" sx={{ 
                mt: 2, 
                textAlign: 'center',
                fontWeight: 500,
                color: '#d32f2f',
                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                padding: '8px 16px',
                borderRadius: '8px'
              }}>
                {error}
              </Typography>
            )}
            <NavigationButtons>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 0}
                fullWidth={isMobile}
                sx={{
                  borderRadius: '12px',
                  padding: '10px 24px',
                  borderColor: '#4CAF50',
                  color: '#4CAF50',
                  '&:hover': {
                    borderColor: '#43A047',
                    backgroundColor: 'rgba(76, 175, 80, 0.08)',
                  }
                }}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={() => setShowSaveDialog(true)}
                fullWidth={isMobile}
                sx={{
                  borderRadius: '12px',
                  padding: '10px 24px',
                  borderColor: '#4CAF50',
                  color: '#4CAF50',
                  '&:hover': {
                    borderColor: '#43A047',
                    backgroundColor: 'rgba(76, 175, 80, 0.08)',
                  }
                }}
              >
                Save Progress
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<RestartAltIcon />}
                onClick={() => setShowResetDialog(true)}
                fullWidth={isMobile}
                sx={{
                  borderRadius: '12px',
                  padding: '10px 24px',
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                  }
                }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!answers[currentQuestionData.id]}
                fullWidth={isMobile}
                sx={{
                  borderRadius: '12px',
                  padding: '10px 24px',
                  backgroundColor: '#4CAF50',
                  '&:hover': {
                    backgroundColor: '#43A047',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(76,175,80,0.2)',
                  },
                  '&:disabled': {
                    backgroundColor: '#e0e0e0',
                    color: '#9e9e9e',
                  }
                }}
              >
                {currentQuestion === questions.length - 1 ? 'See MBTI Result' : 'Next'}
              </Button>
            </NavigationButtons>
          </>
        )}
      </Box>

      {/* Help Dialog */}
      <Dialog open={showHelp} onClose={() => setShowHelp(false)}>
        <DialogTitle>Understanding MBTI Dimensions</DialogTitle>
        <DialogContent>
          <Typography>{helpContent}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHelp(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Save Progress Dialog */}
      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)}>
        <DialogTitle>Progress Saved</DialogTitle>
        <DialogContent>
          <Typography>Your progress has been saved. You can continue the test later.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onClose={() => setShowResetDialog(false)}>
        <DialogTitle>Reset Test</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to reset the test? All your progress will be lost.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetDialog(false)}>Cancel</Button>
          <Button onClick={handleReset} color="error">Reset</Button>
        </DialogActions>
      </Dialog>
    </BgContainer>
  );
};

export default MBTITest; 