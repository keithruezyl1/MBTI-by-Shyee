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
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import questions from '../mbti_60_questions.json';
import { calculateMBTI } from '../utils/mbtiCalculator';

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

const StyledPaper = styled(Paper)({
  padding: '16px 24px 32px 24px',
  maxWidth: '700px',
  width: '100%',
  borderRadius: '18px',
  boxShadow: '0 8px 32px rgba(44, 62, 80, 0.10)',
  background: '#fff',
  position: 'relative',
  marginTop: '32px',
  marginBottom: '32px',
  minHeight: '500px',
  // maxHeight: '80vh', // Commented out to prevent overflow
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const QuestionText = styled(Typography)({
  fontWeight: 700,
  fontSize: '1.35rem',
  marginBottom: '32px',
  color: '#222',
  textAlign: 'center',
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
  height: 8,
  borderRadius: 6,
  backgroundColor: '#e0e0e0',
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
});

const NextButton = styled(Button)({
  backgroundColor: '#4CAF50',
  color: '#fff',
  borderRadius: '8px',
  padding: '12px 32px',
  fontWeight: 600,
  fontSize: '1rem',
  marginTop: '16px',
  boxShadow: '0 2px 8px rgba(76,175,80,0.08)',
  transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
  '&:hover': {
    backgroundColor: '#43A047',
    transform: 'scale(1.04)',
  },
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

const BlurredOverlay = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(4px)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '400px',
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
});

const DialogButton = styled(Button)({
  borderRadius: '8px',
  padding: '10px 24px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
  '&:hover': {
    transform: 'scale(1.04)',
  },
});

const MBTITest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [started, setStarted] = useState(false);
  const [showRefreshDialog, setShowRefreshDialog] = useState(false);
  const navigate = useNavigate();

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Handle page refresh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (started && Object.keys(answers).length > 0) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [started, answers]);

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
          setShowRefreshDialog(true);
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
    setStarted(true);
    setShowRefreshDialog(false);
    localStorage.removeItem('mbtiAnswers');
    localStorage.removeItem('currentQuestion');
  };

  const handleContinue = () => {
    setShowRefreshDialog(false);
    
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
      const mbtiType = calculateMBTI(answers, questions);
      // Store both answers and result
      localStorage.setItem('mbtiAnswers', JSON.stringify(answers));
      localStorage.setItem('mbtiResult', mbtiType);
      navigate('/result');
    }
  };

  const handleDevShortcut = () => {
    const allAnswers = {};
    questions.forEach(question => {
      allAnswers[question.id] = '2'; // '2' represents "Disagree"
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

  const options = [
    { value: '1', label: 'Strongly Disagree' },
    { value: '2', label: 'Disagree' },
    { value: '3', label: 'Neutral' },
    { value: '4', label: 'Agree' },
    { value: '5', label: 'Strongly Agree' },
  ];

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
          <Tooltip title="Development shortcut - Auto-fill all questions with 'Disagree'">
            <DevButton 
              onClick={handleDevShortcut}
              size="small"
              sx={{ mt: 0.5 }}
            >
              Dev: All Disagree
            </DevButton>
          </Tooltip>
        )}
      </Box>
      <Box sx={{ width: '100%', maxWidth: 700, mx: 'auto', p: 2 }}>
        {!started ? (
          <>
            <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 2, color: '#4CAF50' }}>
              Welcome to the MBTI Test
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 2 }}>
              You are about to take the Myers-Briggs Type Indicator (MBTI) test. This test consists of 60 questions and is designed to help you discover your personality type based on your preferences and behaviors.
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 2 }}>
              <b>Be as honest as possible</b> with your answers. There are no right or wrong responses. The more truthful you are, the more accurate your result will be.
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 2 }}>
              <b>Note:</b> Once you answer a question, you <b>cannot go back</b> to previous questions. Please answer each question carefully before proceeding.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <NextButton onClick={() => setStarted(true)}>
                Start Test
              </NextButton>
            </Box>
          </>
        ) : (
          <>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600, color: '#4CAF50', letterSpacing: 1, textAlign: 'center' }}
            >
              Question {currentQuestion + 1} of {questions.length}
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
                <QuestionText>
                  {questions[currentQuestion].question}
                </QuestionText>
                <FormControl component="fieldset" sx={{ width: '100%' }}>
                  <RadioGroup
                    value={answers[questions[currentQuestion].id] || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                  >
                    {options.map((option) => (
                      <OptionCard
                        key={option.value}
                        selected={answers[questions[currentQuestion].id] === option.value}
                        onClick={() => handleAnswer(option.value)}
                      >
                        <Radio
                          checked={answers[questions[currentQuestion].id] === option.value}
                          value={option.value}
                          sx={{
                            color: '#4CAF50',
                            '&.Mui-checked': {
                              color: '#4CAF50',
                            },
                            marginRight: 2,
                          }}
                        />
                        <Typography variant="body1" sx={{ fontWeight: 500, color: '#222' }}>{option.label}</Typography>
                      </OptionCard>
                    ))}
                  </RadioGroup>
                </FormControl>
              </motion.div>
            </AnimatePresence>
            {error && (
              <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>{error}</Typography>
            )}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <NextButton
                type="button"
                onClick={handleNext}
                disabled={!answers[questions[currentQuestion].id]}
              >
                {currentQuestion === questions.length - 1 ? 'See MBTI Result' : 'Next'}
              </NextButton>
            </Box>
          </>
        )}
      </Box>
      {showRefreshDialog && (
        <BlurredOverlay>
          <StyledDialog
            open={showRefreshDialog}
            onClose={() => setShowRefreshDialog(false)}
            aria-labelledby="refresh-dialog-title"
          >
            <DialogTitle id="refresh-dialog-title" sx={{ textAlign: 'center', pb: 1 }}>
              Would you like to continue on the same question?
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" align="center" color="text.secondary">
                or start over from the first question?
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', gap: 2, pt: 2 }}>
              <DialogButton
                variant="outlined"
                color="primary"
                onClick={handleReset}
              >
                Reset
              </DialogButton>
              <DialogButton
                variant="contained"
                color="primary"
                onClick={handleContinue}
              >
                Continue
              </DialogButton>
            </DialogActions>
          </StyledDialog>
        </BlurredOverlay>
      )}
    </BgContainer>
  );
};

export default MBTITest; 