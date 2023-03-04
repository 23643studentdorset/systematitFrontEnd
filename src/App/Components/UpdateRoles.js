import React, { useState, useEffect } from 'react'
import {Snackbar, Alert, Autocomplete, TextField, Box, Typography, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material'
import axios from "../../Api/axios"
import useAuth from "../../hooks/useAuth"
import jwt_decode from "jwt-decode"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const UpdateRoles = () => {

    const [users, setUsers] = useState([])
    const { auth } = useAuth()
    let currentUserId = jwt_decode(auth.accessToken).UserId
    const [showRoles, setShowRoles] = useState(false)
    const [roles, setRoles] = useState([])
    const [expanded, setExpanded] = React.useState(false);
    const [userId, setUserId] = useState(null)
    const [msg, setMsg] = useState("")
    const [openError, setOpenError] = React.useState(false);
    const [openSuccess, setOpenSuccess] = React.useState(false);

    const enumRoles = Object.freeze({
        "Admin": 1,
        "Manager": 2,
        "Regular": 3,
    })

    const [availableRoles, setAvailableRoles] = useState([])

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    useEffect(() => {
        let isMountet = true
        const controller = new AbortController();
        const getUsers = async () => {
            try {
                const response = await axios.get(`/api/User`, {
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'https://localhost:3000',
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                })
                isMountet && setUsers(response?.data.filter((user) => user.userId != currentUserId))
                //console.log(response?.data)
                //isMountet && setUsers(response?.data)
            } catch (err) {
                console.log(err)
            }
        }
        getUsers()
        return () => {
            isMountet = false
            controller.abort()
        }
    }, [])

    const getUserDetails = async (userId) => {
        setAvailableRoles([])
        try {
            const response = await axios.get(`/api/User/Detailed/id?id=${userId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'https://localhost:3000',
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                })
            //console.log(response?.data.userRoles)
            setRoles(response?.data.userRoles)
            let searchAdmin = response?.data.userRoles.find(role => role.roleName === "Admin")
            searchAdmin === undefined
                ? setAvailableRoles([...availableRoles, { "roleName": "Admin" }])
                : console.log("Admin already exists")

            let searchManager = response?.data.userRoles.find(role => role.roleName === "Manager")
            searchManager === undefined
                ? setAvailableRoles([...availableRoles, { "roleName": "Manager" }])
                : console.log("Manager already exists")

            let searchRegular = response?.data.userRoles.find(role => role.roleName === "Regular")
            searchRegular === undefined
                ? setAvailableRoles([...availableRoles, { "roleName": "Regular" }])
                : console.log("Regular already exists")

            setShowRoles(true)
        } catch (err) {
            console.log(err)
        }
    }


    const showRolesHandler = (value) => {
        //console.log(value)
        //setAvailableRoles([])
        setShowRoles(false)
        if (value !== "") {
            let searchUser = users.find((user) => `${user.firstName} ${user.lastName}` === value)
            setUserId(searchUser.userId)
            //console.log(seachUser)
            searchUser !== undefined ? getUserDetails(searchUser.userId) : setShowRoles(false)
        }

    }

    const handleGrantSubmit = async (userRole) => {
        availableRoles.filter(role => role.roleName === userRole)
        try {
            const response = await axios.post("/api/UserRoles/RoleId", JSON.stringify({
                userId: userId,
                roleId: enumRoles[userRole],

            }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'https://localhost:3000',
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                });
            setMsg(response?.data)
            getUserDetails(userId)
            handleClick("success")
        } catch (error) {
            console.log(error)
            setMsg(error?.response?.data)
            handleClick("error")
        }
    }

    const handleDeleteSubmit = async (userRole) => {
        try {
            const response = await axios.delete("/api/UserRoles/RoleId",
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'https://localhost:3000',
                        'Authorization': `Bearer ${auth.accessToken}`
                    },
                    data: JSON.stringify({
                        userId: userId,
                        roleId: enumRoles[userRole],
                    })
                });
            setMsg(response?.data)
            getUserDetails(userId)
            handleClick("success")

        } catch (error) {
            console.log(error)
            handleClick("error")
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
        setOpenError(false);
    };

    const handleClick = (option) => {
        if (option === "success")
            setOpenSuccess(true);
        if (option === "error")
            setOpenError(true);
    };


    return (
        <>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSuccess} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    User Roles updated successfully!
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openError} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    Ups there is a problem... {msg}
                </Alert>
            </Snackbar>
            <Box sx={{ alignItems: 'center', textAlign: "center" }}>
                <h1>Update user roles</h1>
                <Box sx={{ display: "flex", width: "45rem" }}>
                    <Autocomplete
                        key={users.userId}
                        defaultValue={""}
                        sx={{ width: "35%", marginRight: "2rem" }}
                        id="Users"
                        options={users.map((option) => `${option.firstName} ${option.lastName}`)}
                        renderInput={(params) => <TextField {...params} label="users" variant="standard" />}
                        onInputChange={(_, value) => { showRolesHandler(value) }}
                    />

                    {showRoles ? <Box sx={{ marginRight: "2rem" }}>
                        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header">
                                <Typography sx={{ flexShrink: 0 }}>
                                    Current roles
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box >
                                    {roles.map((role) => (
                                        <ListItem divider>
                                            <ListItemText variant="standard" >{role.roleName}</ListItemText>
                                            <Button
                                                sx={{ marginLeft: "1rem" }}
                                                color="error"
                                                variant='outlined'
                                                size="small"
                                                onClick={() => handleDeleteSubmit(role.roleName)}
                                            >Remove</Button>
                                        </ListItem>

                                    ))}
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                        : null}

                    {showRoles ? <Box>
                        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header">
                                <Typography sx={{ flexShrink: 0 }}>
                                    Available roles
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box >
                                    {availableRoles.map((role) => (
                                        <ListItem divider>
                                            <ListItemText variant="standard" >{role.roleName}</ListItemText>
                                            <Button
                                                sx={{ marginLeft: "1rem" }}
                                                variant='outlined'
                                                size="small"
                                                onClick={() => handleGrantSubmit(role.roleName)}
                                            >Grant</Button>
                                        </ListItem>

                                    ))}
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                        : null}


                </Box>

            </Box>

        </>
    )
}

export default UpdateRoles