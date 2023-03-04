import { useRef, useState, useEffect } from "react";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { Button, Box, Typography, TextField, Input } from "@mui/material";
import axios from "../../../Api/axios";
import { Navigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import * as React from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const NAME_REGEX = /^[a-zA-Z]+$/;
const ADDRESS_REGEX = /^[a-zA-Z0-9\s,'-]+$/;
const DOB_REGEX = /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d$/;
const MOBILE_REGEX = /^[0-9]+$/;
const REGISTER_URL = "/api/User"



const Register = () => {
    const emailRef = useRef();
    const lastNameRef = useRef();
    const mobileRef = useRef();
    const addressRef = useRef();
    const companyRef = useRef();
    const dobRef = useRef();
    const errorRef = useRef();

    const [openError, setOpenError] = React.useState(false);
    const [openSuccess, setOpenSuccess] = React.useState(false);

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    const handleClick = (option) => {
        if (option === "success")
            setOpenSuccess(true);
        if (option === "error")
            setOpenError(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
        setOpenError(false);
    };

    const [firstName, setFirstName] = useState("");
    const [validFirstName, setValidFirstName] = useState(false);
    const [firstNameFocus, setFirstNameFocus] = useState(false);

    const [lastName, setLastName] = useState("");
    const [validLastName, setValidLastName] = useState(false);
    const [lastNameFocus, setLastNameFocus] = useState(false);

    const [mobile, setMobile] = useState("");
    const [validMobile, setValidMobile] = useState(false);
    const [mobileFocus, setMobileFocus] = useState(false);

    const [address, setAddress] = useState("");
    const [validAddress, setValidAddress] = useState(false);
    const [addressFocus, setAddressFocus] = useState(false);

    const [company, setCompany] = useState("");
    const [validCompany, setValidCompany] = useState(false);
    const [companyFocus, setCompanyFocus] = useState(false);

    const [dob, setDob] = useState("");
    const [validDob, setValidDob] = useState(false);
    const [dobFocus, setDobFocus] = useState(false);

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [matchPassword, setMatchPassword] = useState("");
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email]);

    useEffect(() => {
        const result = NAME_REGEX.test(firstName);
        //console.log(firstName)
        //console.log(result)      
        setValidFirstName(result);
    }, [firstName]);

    useEffect(() => {
        const result = NAME_REGEX.test(lastName);
        setValidLastName(result);
    }, [lastName]);

    useEffect(() => {
        const result = MOBILE_REGEX.test(mobile);
        setValidMobile(result);
    }, [mobile]);

    useEffect(() => {
        const result = ADDRESS_REGEX.test(address);
        setValidAddress(result);
    }, [address]);

    useEffect(() => {
        const result = ADDRESS_REGEX.test(company);
        setValidCompany(result);
    }, [company]);

    useEffect(() => {
        const result = DOB_REGEX.test(dob);
        setValidDob(result);
    }, [dob]);

    useEffect(() => {
        const result = PASSWORD_REGEX.test(password);
        setValidPassword(result);
        const match = password === matchPassword;
        setValidMatch(match);
    }, [password, matchPassword]);

    useEffect(() => {
        setErrMsg("");
    }, [email, password, matchPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = EMAIL_REGEX.test(email);
        const v2 = PASSWORD_REGEX.test(password);
        const v3 = NAME_REGEX.test(firstName);
        const v4 = NAME_REGEX.test(lastName);
        const v5 = MOBILE_REGEX.test(mobile);
        const v6 = DOB_REGEX.test(dob);
        if (!v1 || !v2 || !v3 || !v4 || !v5 || !v6) {
            setErrMsg("One of the parameters is invalid");
            return;
        }
        try {

            const response = await axios.post(REGISTER_URL, JSON.stringify({ firstName, lastName, email, mobile, address, company, dob, password }),
                {
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'https://localhost:3000' }
                });
            setSuccess(true);
            handleClick("success")
        } catch (error) {
            handleClick("error")
            if (!error?.response) {
                setErrMsg("No server response");
            } else{
                setErrMsg(`${error.response?.data}`);
            }
        }
    }

    return (
        <Box m={10} sx={{ width: "100%", alignItems: "center" }}>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSuccess} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    User created!
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openError} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errMsg}
                </Alert>
            </Snackbar>
            {success ? (
                
                <Navigate to="/Login" replace={true} />
                
            
            ) : (
                <Box component="form"
                    sx={{ '& .MuiTextField-root': { m: 1.25 }, }}>
                    <Typography sx={{ textAlign: "center", color: "#333333" }} variant="h5">Register</Typography>
                    <section>
                        <form>
                            <Box sx={{ display: "flex" }}>
                                <TextField
                                    sx={{ width: "50%", marginRight: "1em" }}
                                    error={!validFirstName}
                                    id="FirstName"
                                    label="First name"
                                    helperText={!validFirstName && firstNameFocus ? "Must contain only letters" : null}
                                    variant="standard"
                                    required
                                    autoFocus
                                    color="success"
                                    onChange={(e) => setFirstName(e.target.value)}
                                    inputProps={{ style: { color: "textLight" } }}
                                    onFocus={() => setFirstNameFocus(true)}
                                    onBlur={() => setFirstNameFocus(false)}
                                />
                                <TextField
                                    sx={{ width: "50%" }}
                                    error={!validLastName}
                                    id="LastName"
                                    label="Last name"
                                    helperText={!validLastName && lastNameFocus ? "Must contain only letters" : null}
                                    variant="standard"
                                    required
                                    color="success"
                                    onChange={(e) => setLastName(e.target.value)}
                                    inputProps={{ style: { color: "textLight" } }}
                                    onFocus={() => setLastNameFocus(true)}
                                    onBlur={() => setLastNameFocus(false)}
                                />
                            </Box>

                            <TextField
                                sx={{ width: "77%", marginRight: "1em" }}
                                error={!validEmail}
                                id="Email"
                                label="Email"
                                helperText={!validEmail && emailFocus ?
                                    <>
                                        Email must be in the format user@example.com<br />
                                        Must begin with a letter<br />
                                        Only one @ is allowed<br />
                                        The suffix must be 2-4 characters long
                                    </> : null
                                }
                                variant="standard"
                                required
                                color="success"
                                onChange={(e) => setEmail(e.target.value)}
                                inputProps={{ style: { color: "textLight" } }}
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => setEmailFocus(false)}
                            />
                            <Box sx={{ display: "flex" }}>
                                <TextField
                                    sx={{ width: "50%", marginRight: "1em" }}
                                    error={!validMobile}
                                    id="Mobile"
                                    label="Mobile"
                                    helperText={!validMobile && mobileFocus ? "Must contain only numbers" : null}
                                    variant="standard"
                                    required
                                    color="success"
                                    onChange={(e) => setMobile(e.target.value)}
                                    inputProps={{ style: { color: "textLight" } }}
                                    onFocus={() => setMobileFocus(true)}
                                    onBlur={() => setMobileFocus(false)}
                                />
                                <TextField
                                    sx={{ width: "50%" }}
                                    error={!validAddress}
                                    id="Address"
                                    label="Address"
                                    helperText={!validAddress && addressFocus ? "Must contain only letters, numbers and/or the characters: ,'-" : null}
                                    variant="standard"
                                    required
                                    color="success"
                                    onChange={(e) => setAddress(e.target.value)}
                                    inputProps={{ style: { color: "textLight" } }}
                                    onFocus={() => setAddressFocus(true)}
                                    onBlur={() => setAddressFocus(false)}
                                />
                            </Box>

                            <Box sx={{ display: "flex" }}>
                                <TextField
                                    sx={{ width: "50%", marginRight: "1em" }}
                                    error={!validCompany}
                                    id="Company"
                                    label="Company"
                                    helperText={!validCompany && companyFocus ? "Must contain only letters, numbers and/or the characters: ,'-" : null}
                                    variant="standard"
                                    required
                                    color="success"
                                    onChange={(e) => setCompany(e.target.value)}
                                    inputProps={{ style: { color: "textLight" } }}
                                    onFocus={() => setCompanyFocus(true)}
                                    onBlur={() => setCompanyFocus(false)}
                                />
                                <TextField
                                    sx={{ width: "50%" }}
                                    error={!validDob}
                                    id="DatyeOfBirth"
                                    label="Date of birth"
                                    helperText={!validDob && dobFocus ? "Must be in format dd/mm/yyyy" : null}
                                    variant="standard"
                                    required
                                    color="success"
                                    onChange={(e) => setDob(e.target.value)}
                                    inputProps={{ style: { color: "textLight" } }}
                                    onFocus={() => setDobFocus(true)}
                                    onBlur={() => setDobFocus(false)}
                                />
                            </Box>
                            <Box sx={{ display: "flex" }}>
                                <TextField
                                    sx={{ width: "50%" }}
                                    error={!validPassword}
                                    id="password"
                                    label="Password"
                                    helperText={!validPassword && passwordFocus ?
                                        <>
                                            Password must have 8 to 24 <br />
                                            Must include uppercase and lowercase letters a numeber and a special character <br />
                                            Allowed special characters are !@#$%^&*
                                        </> : null}
                                    type={showPassword ? 'text' : 'password'}
                                    variant="standard"
                                    color="success"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                    inputProps={{ style: { color: "textLight" } }}
                                    onFocus={() => setPasswordFocus(true)}
                                    onBlur={() => setPasswordFocus(false)}
                                />
                                <Box sx={{ width: "1em", height: "1em", marginTop: "1.3em" }}>
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex" }}>
                                <TextField
                                    sx={{ width: "50%" }}
                                    error={!validMatch}
                                    id="confirm password"
                                    label="Comfirm password"
                                    helperText={!validMatch && matchFocus ?
                                        "Passwords must match" : null}
                                    type={showPassword ? 'text' : 'password'}
                                    variant="standard"
                                    color="success"
                                    required
                                    onChange={(e) => setMatchPassword(e.target.value)}
                                    inputProps={{ style: { color: "textLight" } }}
                                    onFocus={() => setMatchFocus(true)}
                                    onBlur={() => setMatchFocus(false)}
                                />
                            </Box>
                            <Box marginTop={2} sx={{ alignItems: 'center', textAlign: "center" }}>
                                <Button variant="outlined" size="medium" disabled=
                                    {(!validEmail || !validPassword || !validMatch
                                        || !validFirstName || !validLastName || !validAddress
                                        || !validDob || !validMobile || !validCompany) ? true : false}
                                    onClick={handleSubmit}>Register</Button>
                            </Box>
                        </form>
                    </section>
                </Box>
            )}
        </Box>
    );
}

export default Register;