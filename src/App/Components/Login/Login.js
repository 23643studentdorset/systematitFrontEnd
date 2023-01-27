import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import axios from '../../../Api/axios';
import useAuth from '../../../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const LOGIN_URL = "/api/Auth";

const Login = () => {
  const {setAuth} = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/UserView";

  const emailRef = useRef();
  const errorRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
    
  useEffect(() => {
    emailRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg("");
  }, [email, password])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await axios.post(LOGIN_URL, JSON.stringify({email, password}),
        {  
        headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'https://localhost:3000'}
        }
      );
      //console.log(JSON.stringify(response?.data));
      setAuth(response.data);
      const accessToken = response?.data?.token;
      console.log(accessToken)
      setAuth({accessToken});
      setEmail("");
      setPassword("");
      navigate(from, {replace: true});
    }
    catch(err) {
      if (!err?.response){
        setErrMsg("No server response");
      }else if (err.response?.status === 400){
        setErrMsg("Missing or invalid email or password");
      }else if (err.response?.status === 401){
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Unknown error");
      }    
        errorRef.current.focus();
    }
  }

  return (
      <Box m={10} sx={{ width: 500, backgroundColor: 'textDark', alignItems:"center"}}>
        <Typography sx={{color:"errorBackground", textAlign:"center"}} variant="h5"><p ref={errorRef} className={errMsg ? "errMsg" :
                        "offscreen"} aria-live="assertive">{errMsg}</p></Typography>
        <section>
        <Typography sx={{textAlign:"center"}} variant="h5">Sign in</Typography>
        <form>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            ref={emailRef}
            autoComplete="on"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required          
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required          
          />
          <Box marginTop={2} sx={{alignItems: 'center', textAlign:"center"}}>
            <Button size="medium" color="textLight" onClick={handleSubmit}>Sign In</Button>
          </Box>              
                
        </form>
        </section>
      </Box>
          
  )
}

export default Login