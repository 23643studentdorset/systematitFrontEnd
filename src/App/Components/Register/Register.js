import { useRef, useState, useEffect } from "react";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { Button, Box, Typography, TextField } from "@mui/material";
import axios from "../../../Api/axios";
import { Navigate } from "react-router-dom";

const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const NAME_REGEX = /^[a-zA-Z]+$/;
const ADDRESS_REGEX = /^[a-zA-Z0-9\s,'-]+$/;
const DOB_REGEX = /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d$/;
const MOBILE_REGEX = /^[0-9]+$/;
const REGISTER_URL = "/api/User"



const Register = () => {
    const emailRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const mobileRef = useRef();
    const addressRef = useRef();
    const companyRef = useRef();
    const dobRef = useRef();
    const errorRef = useRef();

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
    /*
    useEffect(() => {
        firstNameRef.current.focus();
    }, []);
*/
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
            console.log(response.data);
            console.log(response);
            setSuccess(true);

            //post();
        } catch (error) {
            //setSuccess(true);
            if (!error?.response) {
                setErrMsg("No server response");
            } else if (error.response?.status === 409) {
                setErrMsg("Email already exists");
            } else {
                setErrMsg("Registration failed");
            }
            errorRef.current.focus();
        }
    }

    return (
        <Box m={10} sx={{ width: "100%", alignItems: "center" }}>
            <Typography sx={{ textAlign: "center" }} variant="h5"><p ref={errorRef} className={errMsg ? "errMsg" :
                "offscreen"} aria-live="assertive">{errMsg}</p></Typography>
            {success ? (
                <Navigate to="/Login" replace={true} />
            ) : (
                <Box component="form"
                sx={{'& .MuiTextField-root': { m: 1.25, width: '25ch' },}}>
                    <Typography sx={{ textAlign: "center", color:"#333333" }} variant="h5">Register</Typography>
                    <section>
                        <form>
                        
                        <TextField 
                            sx={{ width: "66%"}}
                            error = {!validFirstName}
                            id="standard-error-helper-text"
                            label="First name"
                            helperText="Must contain only letters"
                            variant="standard"
                            required
                            autoFocus
                            color="success"
                            onChange={(e) => setFirstName(e.target.value)}
                            inputProps={{ style: { color: "textLight" } }}
                            onFocus={() => setFirstNameFocus(true)}
                         
                            ></TextField>
                    {/*
                        <label htmlFor="FirstName">
                            First name:
                            <span className={validFirstName ? "valid" : "hide"}>
                                <CheckOutlinedIcon />
                            </span>
                            <span className={validFirstName || !firstName ? "hide" : "invalid"}>
                                <ErrorOutlineIcon />
                            </span>
                        </label>
                        <input
                            type="text"
                            id="FirstName"
                            ref={firstNameRef}
                            autoComplete="on"
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            aria-invalid={validFirstName ? "false" : "true"}
                            aria-describedby="nameNote"
                            onFocus={() => setFirstNameFocus(true)}
                            onBlur={() => setFirstNameFocus(false)}
                        />
                        <p id="nameNote" className={firstNameFocus && firstName && !validFirstName ? "instructions" : "offscreen"}>
                            <ErrorOutlineIcon /> Must contain only letters
                        </p>
            */}
                        <label htmlFor="LastName">
                            Last name:
                            <span className={validLastName ? "valid" : "hide"}>
                                <CheckOutlinedIcon />
                            </span>
                            <span className={validLastName || !lastName ? "hide" : "invalid"}>
                                <ErrorOutlineIcon />
                            </span>
                        </label>
                        <input
                            type="text"
                            id="LastName"
                            ref={lastNameRef}
                            autoComplete="on"
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            aria-invalid={validLastName ? "false" : "true"}
                            aria-describedby="nameNote"
                            onFocus={() => setLastNameFocus(true)}
                            onBlur={() => setLastNameFocus(false)}
                        />
                        <p id="nameNote" className={lastNameFocus && lastName && !validLastName ? "instructions" : "offscreen"}>
                            <ErrorOutlineIcon /> Must contain only letters
                        </p>

                        <label htmlFor="email">
                            Email:
                            <span className={validEmail ? "valid" : "hide"}>
                                <CheckOutlinedIcon />
                            </span>
                            <span className={validEmail || !email ? "hide" : "invalid"}>
                                <ErrorOutlineIcon />
                            </span>
                        </label>
                        <input
                            type="text"
                            id="email"
                            ref={emailRef}
                            autoComplete="on"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                            <ErrorOutlineIcon />Email must be in the format user@example.com<br />
                            Must begin with a letter<br />
                            Only one @ is allowed<br />
                            The suffix must be 2-4 characters long
                        </p>

                        <label htmlFor="Mobile">
                            Mobile:
                            <span className={validMobile ? "valid" : "hide"}>
                                <CheckOutlinedIcon />
                            </span>
                            <span className={validMobile || !mobile ? "hide" : "invalid"}>
                                <ErrorOutlineIcon />
                            </span>
                        </label>
                        <input
                            type="text"
                            id="Mobile"
                            ref={mobileRef}
                            autoComplete="on"
                            onChange={(e) => setMobile(e.target.value)}
                            required
                            aria-invalid={validMobile ? "false" : "true"}
                            aria-describedby="MobileNote"
                            onFocus={() => setMobileFocus(true)}
                            onBlur={() => setMobileFocus(false)}
                        />
                        <p id="MobileNote" className={mobileFocus && mobile && !validMobile ? "instructions" : "offscreen"}>
                            <ErrorOutlineIcon /> Must contain only numbers
                        </p>

                        <label htmlFor="Address">
                            Address:
                            <span className={validAddress ? "valid" : "hide"}>
                                <CheckOutlinedIcon />
                            </span>
                            <span className={validAddress || !address ? "hide" : "invalid"}>
                                <ErrorOutlineIcon />
                            </span>
                        </label>
                        <input
                            type="text"
                            id="Address"
                            ref={addressRef}
                            autoComplete="on"
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            aria-invalid={validAddress ? "false" : "true"}
                            aria-describedby="addressNote"
                            onFocus={() => setAddressFocus(true)}
                            onBlur={() => setAddressFocus(false)}
                        />
                        <p id="addressNote" className={addressFocus && address && !validAddress ? "instructions" : "offscreen"}>
                            <ErrorOutlineIcon />Required field <br />
                            Must contain only letters, numbers and ,'- characters
                        </p>

                        <label htmlFor="Company">
                            Company:
                            <span className={validCompany ? "valid" : "hide"}>
                                <CheckOutlinedIcon />
                            </span>
                            <span className={validCompany || !company ? "hide" : "invalid"}>
                                <ErrorOutlineIcon />
                            </span>
                        </label>
                        <input
                            type="text"
                            id="Company"
                            ref={companyRef}
                            autoComplete="on"
                            onChange={(e) => setCompany(e.target.value)}
                            required
                            aria-invalid={validCompany ? "false" : "true"}
                            aria-describedby="CompanyNote"
                            onFocus={() => setCompanyFocus(true)}
                            onBlur={() => setCompanyFocus(false)}
                        />
                        <p id="CompanyNote" className={companyFocus && company && !validCompany ? "instructions" : "offscreen"}>
                            <ErrorOutlineIcon />Required field <br />
                            Must contain only letters
                        </p>

                        <label htmlFor="Dob">
                            Date of Birth:
                            <span className={validDob ? "valid" : "hide"}>
                                <CheckOutlinedIcon />
                            </span>
                            <span className={validDob || !dob ? "hide" : "invalid"}>
                                <ErrorOutlineIcon />
                            </span>
                        </label>
                        <input
                            type="text"
                            id="Dob"
                            ref={dobRef}
                            autoComplete="on"
                            onChange={(e) => setDob(e.target.value)}
                            required
                            aria-invalid={validDob ? "false" : "true"}
                            aria-describedby="DobNote"
                            onFocus={() => setDobFocus(true)}
                            onBlur={() => setDobFocus(false)}
                        />
                        <p id="MobileNote" className={dobFocus && dob && !validDob ? "instructions" : "offscreen"}>
                            <ErrorOutlineIcon /> Must be in format dd/mm/yyyy
                        </p>

                        <label htmlFor="password">
                            Password:
                            <span className={validPassword ? "valid" : "hide"}>
                                <CheckOutlinedIcon />
                            </span>
                            <span className={validPassword || !password ? "hide" : "invalid"}>
                                <ErrorOutlineIcon />
                            </span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            aria-invalid={validPassword ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)}
                        />
                        <p id="pwdnote" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                            <ErrorOutlineIcon />Password must have 8 to 24 <br />
                            Must include uppercase and lowercase letters a numeber and a special character<br />
                            Allowed special characters are !@#$%^&*
                        </p>
                        <label htmlFor="confirm_password">
                            Confirm Password:
                            <span className={validMatch && matchPassword ? "valid" : "hide"}>
                                <CheckOutlinedIcon />
                            </span>
                            <span className={validPassword || !password ? "hide" : "invalid"}>
                                <ErrorOutlineIcon />
                            </span>
                        </label>
                        <input
                            type="password"
                            id="confirm_password"
                            onChange={(e) => setMatchPassword(e.target.value)}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <ErrorOutlineIcon />Passwords must match
                        </p>
                        <Box marginTop={2} sx={{ alignItems: 'center', textAlign: "center" }}>
                            <Button variant="outlined" size="medium" color="textLight" disabled=
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