import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Avatar,
  styled
} from '@mui/material';
import { motion } from 'framer-motion';

const StyledContainer = styled(Container)({
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  background: '#F5F5F5',
});

const StyledPaper = styled(Paper)({
  padding: '40px 32px',
  maxWidth: '420px',
  width: '100%',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(44, 62, 80, 0.10)',
  background: 'transparent',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const PhotoFrame = styled(Box)({
  width: '120px',
  height: '120px',
  borderRadius: '50%',
  border: '2.5px dashed #4CAF50',
  margin: '0 auto 24px',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  background: 'linear-gradient(135deg, #e6fcf1 0%, #f8fefa 100%)',
  transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    borderColor: '#43A047',
    boxShadow: '0 4px 12px rgba(76,175,80,0.10)',
    background: 'linear-gradient(135deg, #f8fefa 0%, #e6fcf1 100%)',
    transform: 'scale(1.05)',
  },
});

const EmptyPhotoFrame = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  color: '#A5D6A7',
  textAlign: 'center',
  fontSize: '1rem',
  position: 'relative',
});

const PhotoFrameWrapper = styled(Box)({
  position: 'relative',
  display: 'inline-block',
});

const AddIconCircle = styled(Box)({
  position: 'absolute',
  bottom: '10px',
  right: '10px',
  width: '36px',
  height: '36px',
  backgroundColor: '#4CAF50',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
  zIndex: 2,
  border: '2px solid #fff',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E0E0E0',
      borderRadius: '10px',
    },
    '&:hover fieldset': {
      borderColor: '#4CAF50',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#4CAF50',
    },
  },
  background: '#fff',
});

const StyledButton = styled(Button)({
  background: 'linear-gradient(90deg, #43A047 0%, #66bb6a 100%)',
  color: '#FFFFFF',
  padding: '14px 0',
  borderRadius: '12px',
  fontWeight: 700,
  fontSize: '1.1rem',
  marginTop: '32px',
  boxShadow: '0 2px 8px rgba(76,175,80,0.10)',
  transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
  '&:hover': {
    background: 'linear-gradient(90deg, #388e3c 0%, #43A047 100%)',
    transform: 'scale(1.04)',
  },
});

const pageTransition = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.98
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1
  },
  transition: { 
    duration: 0.4,
    ease: "easeInOut"
  }
};

const StartPage = () => {
  const [name, setName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Reset all MBTI-related localStorage data on mount
  useEffect(() => {
    localStorage.removeItem('mbtiAnswers');
    localStorage.removeItem('mbtiResult');
    localStorage.removeItem('currentQuestion');
    localStorage.removeItem('userName');
    localStorage.removeItem('profilePhoto');
  }, []);

  const handlePhotoChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !profilePhoto) {
      setError('Please enter your name and upload a photo.');
      return;
    }
    setError('');
    localStorage.setItem('userName', name);
    localStorage.setItem('profilePhoto', profilePhoto);
    navigate('/test');
  };

  return (
    <StyledContainer>
      <motion.div {...pageTransition}>
        <StyledPaper elevation={3}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ 
              fontFamily: "'Inter', sans-serif",
              color: '#212121',
              marginBottom: '12px',
              fontWeight: 800,
              letterSpacing: 1
            }}
          >
            Set up your profile
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{ color: '#388e3c', mb: 3, fontWeight: 500, fontSize: '1rem', opacity: 0.7 }}
          >
            Personalize your experience before starting the MBTI test.
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <label htmlFor="profile-photo" style={{ cursor: 'pointer', display: 'inline-block' }}>
                <PhotoFrameWrapper>
                  <PhotoFrame>
                    {profilePhoto ? (
                      <Avatar
                        src={profilePhoto}
                        sx={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      <EmptyPhotoFrame>
                        <Typography variant="body2" sx={{ width: '100%' }}>
                          Click to add photo
                        </Typography>
                      </EmptyPhotoFrame>
                    )}
                  </PhotoFrame>
                  {!profilePhoto && (
                    <AddIconCircle>
                      <Typography variant="h5" sx={{ color: '#FFF', fontWeight: 700, userSelect: 'none' }}>+</Typography>
                    </AddIconCircle>
                  )}
                </PhotoFrameWrapper>
                <input
                  accept="image/*"
                  id="profile-photo"
                  type="file"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
              </label>
            </Box>

            <StyledTextField
              fullWidth
              label="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              margin="normal"
              variant="outlined"
              sx={{ marginTop: '24px' }}
            />

            {error && (
              <Typography color="error" sx={{ 
                mt: 1, 
                textAlign: 'center',
                background: 'rgba(211, 47, 47, 0.08)',
                color: '#d32f2f',
                fontWeight: 500,
                borderRadius: '8px',
                py: 1,
                px: 2
              }}>{error}</Typography>
            )}

            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              disabled={!name.trim() || !profilePhoto}
              sx={{ marginTop: '32px' }}
            >
              Start MBTI Test
            </StyledButton>
          </Box>
        </StyledPaper>
      </motion.div>
    </StyledContainer>
  );
};

export default StartPage; 