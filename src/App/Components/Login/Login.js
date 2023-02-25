import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Snackbar, Alert } from '@mui/material';
import axios from '../../../Api/axios';
import useAuth from '../../../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const LOGIN_URL = "/api/Auth";

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/UserView";


  const errorRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [openError, setOpenError] = React.useState(false);

  useEffect(() => {
    setErrMsg("");
  }, [email, password])

  const handleClick = (option) => {
    if (option === "error")
      setOpenError(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify({ email, password }),
        {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'https://localhost:3000' }
        }
      );
      //console.log(JSON.stringify(response?.data));
      setAuth(response?.data);
      const accessToken = response?.data?.token;
      //console.log(accessToken)
      setAuth({ accessToken });
      setEmail("");
      setPassword("");
      navigate(from, { replace: true });
    }
    catch (err) {
      handleClick("error");
      if (!err?.response) {
        setErrMsg("No server response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing or invalid email or password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Unknown error");
      }
      //errorRef.current.focus();
    }
  }



  return (
    <Box m={10} sx={{ width: 500, backgroundColor: 'textDark', alignItems: "center" }}>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openError} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errMsg}
                </Alert>
            </Snackbar>
      <section>
        <Typography sx={{ textAlign: "center" }} variant="h5">Sign in</Typography>
        <form>
          <TextField
            sx={{ width: "66%" }}
            id="standard"
            label="Email"
            variant="standard"
            required
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
            inputProps={{ style: { color: "textLight" } }}
          ></TextField>
          
          <TextField
            sx={{ width: "66%" }}
            id="password"
            label="Password"
            type="password"
            variant="standard"
            required
            onChange={(e) => setPassword(e.target.value)}
            inputProps={{ style: { color: "textLight" } }}
          ></TextField>

          <Box marginTop={2} sx={{ alignItems: 'center', textAlign: "center" }}>
            <Button size="medium" color="textDark" variant='outlined' onClick={handleSubmit}>Sign In</Button>
          </Box>

        </form>
      </section>
    </Box>

  )
}

export default Login