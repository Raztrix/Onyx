import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Alert,
  Collapse,
} from '@mui/material';
import api from '../api/axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/auth/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();

  // Steps: 'input-phone' -> 'input-code'
  const [step, setStep] = useState<'input-phone' | 'input-code'>('input-phone');
  const [isNewUser, setIsNewUser] = useState(false); // To show Name/Email fields

  // Form Data
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  // 1. Try to Send Code (The Entry Point)
  const handleGetCode = async () => {
    try {
      // Try to find the user and send code
      const res = await api.post('/Auth/send-code', JSON.stringify(phone), {
        headers: { 'Content-Type': 'application/json' },
      });

      // IF SUCCESS (User Exists):
      alert(`[DEV MODE] Your Code: ${res.data.devCode}`);
      setStep('input-code');
    } catch (error: any) {
      // IF FAILED (404 = User Not Found):
      if (error.response && error.response.status === 404) {
        setIsNewUser(true); // <--- Reveal Name/Email fields
      } else {
        alert('Something went wrong');
      }
    }
  };

  // 2. Register (Only used if user was new)
  const handleRegister = async () => {
    try {
      // Create the user
      await api.post('/Auth/register', { fullName, email, phone });

      // Now that they exist, request the code again
      const res = await api.post('/Auth/send-code', JSON.stringify(phone), {
        headers: { 'Content-Type': 'application/json' },
      });

      alert(`[DEV MODE] Registered! Your Code: ${res.data.devCode}`);
      setStep('input-code');
    } catch (error) {
      alert('Registration failed. Email/Phone might be taken.');
    }
  };

  // 3. Verify Code (Final Step)
  const handleLogin = async () => {
    try {
      const res = await api.post('/Auth/login', { phone, code });
      dispatch(loginSuccess(res.data)); // Redux saves the user -> App switches to Tasks
    } catch (error) {
      alert('Incorrect code');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          {isNewUser ? 'Create Account' : 'Sign In'}
        </Typography>

        {/* STEP 1: PHONE INPUT */}
        {step === 'input-phone' && (
          <Stack spacing={2} sx={{ mt: 2 }}>
            {isNewUser && <Alert severity="info">Number not found. Please join us!</Alert>}

            <TextField
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
            />

            {/* HIDDEN FIELDS: Only appear if phone was not found */}
            <Collapse in={isNewUser}>
              <Stack spacing={2}>
                <TextField
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                />
              </Stack>
            </Collapse>

            <Button
              variant="contained"
              size="large"
              onClick={isNewUser ? handleRegister : handleGetCode}
            >
              {isNewUser ? 'Join & Get Code' : 'Get Login Code'}
            </Button>
          </Stack>
        )}

        {/* STEP 2: CODE INPUT */}
        {step === 'input-code' && (
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Typography variant="body2">Code sent to {phone}</Typography>

            <TextField
              label="6-Digit Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              fullWidth
            />

            <Button variant="contained" size="large" onClick={handleLogin}>
              Login
            </Button>
            <Button size="small" onClick={() => setStep('input-phone')}>
              Back
            </Button>
          </Stack>
        )}
      </Paper>
    </Container>
  );
}
