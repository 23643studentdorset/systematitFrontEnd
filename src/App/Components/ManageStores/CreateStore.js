import { useEffect, useState } from "react"
import axios from "../../../Api/axios"
import useAuth from "../../../hooks/useAuth"
import React from 'react'
import { Button, Snackbar, Alert, Typography, Box, TextField, Paper } from '@mui/material';

const CreateStore = () => {
    const { auth } = useAuth()

    const [openError, setOpenError] = React.useState(false);
    const [openSuccess, setOpenSuccess] = React.useState(false);
    
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

    const [storeName, setStoreName] = useState("")
    const [storeDescription, setStoreDescription] = useState("")
    const createStoreSubmit = async () => {
        try {
            const response = await axios.post("/api/Store", JSON.stringify({
                name: storeName,
                description: storeDescription,
            }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'https://localhost:3000',
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                });
                console.log(response?.status)
            if (response?.status === 200) {
                handleClick("success");
                setStoreName("")
                setStoreDescription("")
            }
        } catch (err) {
            handleClick("error");
            console.log(err)
        }
    }

    return (
        <>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSuccess} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Store created successfully!
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openError} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    Store creation failed!
                </Alert>
            </Snackbar>
            <Paper sx={{ width: "30rem", padding: "1rem" }}>
                <Typography variant="h5">Create a new Store</Typography>
                <TextField
                    sx={{ marginTop: "1rem", width: "60%" }}
                    id="Store name"
                    label="Store name"
                    variant="standard"
                    onChange={(e) => setStoreName(e.target.value)}
                    value={storeName} />
                <TextField
                    sx={{ marginTop: "1rem", width: "60%" }}
                    id="Store description"
                    label="Store description"
                    variant="standard"
                    onChange={(e) => setStoreDescription(e.target.value)}
                    value={storeDescription} />

                <Box marginTop={2} sx={{ alignItems: 'center', textAlign: "center" }}>
                    <Button 
                    size="medium" 
                    color="textDark" 
                    variant='outlined' 
                    onClick={createStoreSubmit}
                    disabled={(storeDescription === "" || storeName === "") ? true : false}
                    >Create Store</Button>
                </Box>

            </Paper>
        </>
    )
}

export default CreateStore