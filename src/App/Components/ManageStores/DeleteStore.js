import { Typography, Snackbar, Alert, TextField, Button, Box, Paper, Autocomplete } from "@mui/material"
import React, { useEffect, useState } from "react"
import useAuth from "../../../hooks/useAuth"
import axios from "../../../Api/axios"


const DeleteStore = () => {
    const { auth } = useAuth()

    const [openError, setOpenError] = React.useState(false);
    const [openSuccess, setOpenSuccess] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [openWarning, setOpenWarning] = React.useState(false);

    const [stores, setStores] = useState([])
    const [storeName, setStoreName] = useState("")
    const [storesChanged, setStoresChanged] = useState(false)

    const handleClick = (option) => {
        if (option === "success")
            setOpenSuccess(true);
        if (option === "error")
            setOpenError(true);
        if (option === "delete")
            setOpenDelete(true)
        if (option === "warning")
            setOpenWarning(true)
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
        setOpenError(false);
        setOpenDelete(false)
        setOpenWarning(false)
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
    }, [storesChanged])

    const handleDeleteButton = () => {
        
        storeName === "" || stores.length === 0 ? handleClick("warning") : handleClick("delete")
        
    }

    const handleDeleteRequest = async () => {
        let storeId = stores.find((store) => store.name === storeName).storeId
        //console.log("Deleted store number: "+ storeId)
        try {
            const response = await axios.delete(`/api/Store/id?id=${storeId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'https://localhost:3000',
                    'Authorization': `Bearer ${auth.accessToken}`
                }
            })
            console.log(response?.status)
            if (response?.status === 200)
            {
                handleClick("success")
                setStoreName("")
                setStoresChanged(!storesChanged)
            }
      

        } catch (err) {
            handleClick("error")
            console.log(err)
        }

    }
    return (
        <>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSuccess} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Store deleted successfully!
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openError} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    Store delete failed!
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openWarning} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
                    You must select a store!
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openDelete} autoHideDuration={12000}
                onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    <Box sx={{display:"flex"}}>
                    <Typography sx={{marginRight:"2rem"}}>Delete a store canot be undone, Would you like to continue?</Typography>
                    <Button variant= "outlined" color="secondary" size="small" onClick={()=>{
                        handleClose()
                        handleDeleteRequest()}}>
                            Yes
                    </Button>
                    </Box>
                </Alert>
            </Snackbar >
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
                                setStoreName(newValue)
                            }}
                        />
                        : null
                    }
                    <Button variant="outlined" color={"error"} onClick={handleDeleteButton}>Delete</Button>
                </Box>
            </Paper>
        </>
    )
}

export default DeleteStore