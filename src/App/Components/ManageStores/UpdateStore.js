import { Typography, Snackbar, Alert, TextField, Button, Box, Paper, Autocomplete } from "@mui/material"
import React, { useEffect, useState } from "react"
import useAuth from "../../../hooks/useAuth"
import axios from "../../../Api/axios"

const UpdateStore = () => {
    const { auth } = useAuth()

    const [openError, setOpenError] = React.useState(false);
    const [openSuccess, setOpenSuccess] = React.useState(false);
    const [storeName, setStoreName] = useState("")
    const [newStoreName, setNewStoreName] = useState("")
    const [storeDescription, setStoreDescription] = useState("")
    const [stores, setStores] = useState([])
    const [storeId, setStoreId] = useState("")
    const [storesChanged, setStoresChanged] = useState(false)

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

    useEffect(() => {
        let isMountet = true
        const controller = new AbortController();

        const getStores = async () => {
            try {
                const response = await axios.get(`/api/Store`, {
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'https://localhost:3000',
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                })
                isMountet && setStores(response?.data)
                //console.log(response?.data)
            } catch (err) {
                console.log(err)
            }
        }

        getStores()
        return () => {
            isMountet = false
            controller.abort()
        }
    }, [])


    const getStore = async () => {
        try {
            const response = await axios.get(`/api/Store/name?name=${storeName}`, {

                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'https://localhost:3000',
                    'Authorization': `Bearer ${auth.accessToken}`
                }
            })
            setStoreDescription(response?.data.description)
            setNewStoreName(response?.data.name)
            setStoreId(response?.data.storeId)
            //console.log(response?.data)
        } catch (err) {
            console.log(err)
        }
    }



    const updateStoreSubmit = async () => {
        try {
            const response = await axios.put("/api/Store", JSON.stringify({
                storeId: storeId,
                name: newStoreName,
                description: storeDescription,
            }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'https://localhost:3000',
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                });
            //console.log(response?.status)
            if (response?.status === 200)
            {
                setStoresChanged(!storesChanged)
                handleClick("success")
            }
                

        } catch (error) {
            handleClick("error")
            console.log(error)
        }
    }

    return (
        <>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSuccess} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Store updated successfully!
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openError} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    Store update failed!
                </Alert>
            </Snackbar>
            <Paper sx={{ width: "30rem", padding: "1rem" }}>
                <Typography variant="h5">Update info from store</Typography>
                <Box marginTop={2} sx={{ display: "flex" }}>
                    {stores.length > 0 ?
                        <Autocomplete
                            sx={{ width: "40%", marginRight: "2em" }}
                            id="store"
                            options={stores.map((option) => `${option.name}`)}
                            defaultValue={""}
                            renderInput={(params) => <TextField {...params} label="Store" variant="standard" />}
                            onInputChange={(_, newValue) => {
                                //console.log("newValue: "+ newValue)
                                setNewStoreName("")
                                setStoreDescription("")
                                setStoreName(newValue)
                            }}
                        />
                        : null
                    }
                    <Button variant="outlined" onClick={getStore}>Search</Button>
                </Box>
                <TextField
                    sx={{ marginTop: "1rem", width: "60%" }}
                    id="Store name"
                    label="Store name"
                    variant="standard"
                    onChange={(e) => setNewStoreName(e.target.value)}
                    value={newStoreName} />
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
                        onClick={updateStoreSubmit}
                        disabled={(storeDescription === "" || storeName === "") ? true : false}
                    >Update</Button>
                </Box>

            </Paper>
        </>
    )
}

export default UpdateStore