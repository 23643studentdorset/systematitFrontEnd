import React from 'react'
import { useRef,useState, useEffect } from 'react'

function Login() {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");
    

  return (
    <div>Login</div>
  )
}

export default Login