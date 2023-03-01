import React, { useState, useEffect } from 'react'
import { Autocomplete, TextField, Box, Typography, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material'
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
    const [userRole, setUserRole] = useState("")

    const enumeRoles = Object.freeze({
        "Admin": 1,
        "Manager": 2,
        "Regular": 3,
    })

    const availableRoles = [
        { "roleName": "Admin", "roleId": enumeRoles.Admin },
        { "roleName": "Manager", "roleId": enumeRoles.Manager },
        { "roleName": "Regular", "roleId": enumeRoles.Regular }]

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
            //console.log(availableRoles.filter((role) => role.roleName !== response?.data.userRoles[0].roleName))
            setShowRoles(true)
        } catch (err) {
            console.log(err)
        }
    }


    const showRolesHandler = (value) => {
        //console.log(value)
        let seachUser = users.find((user) => `${user.firstName} ${user.lastName}` === value)
        //console.log(seachUser)
        seachUser !== undefined ? getUserDetails(seachUser.userId) : setShowRoles(false)
    }

    const handleSubmit = async () => {
        console.log(enumeRoles[userRole])
    }

    return (
        <Box sx={{alignItems: 'center', textAlign: "center" }}>
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
                                Current Roles
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ marginRight: "2rem" }}>
                                {roles.map((role) => (
                                    <ListItem divider>
                                        <ListItemText variant="standard" >{role.roleName}</ListItemText>
                                    </ListItem>
                                ))}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Box>
                    : null}


                {showRoles ? <Autocomplete
                    key={availableRoles.roleId}
                    defaultValue={""}
                    sx={{ width: "35%", marginRight: "2rem" }}
                    id="Roles"
                    options={availableRoles.map((option) => option.roleName)}
                    renderInput={(params) => <TextField {...params} label="Available roles" variant="standard" />}
                    onInputChange={(_, value) => { setUserRole(value)}}
                />
                    : null}
                
            </Box>
            <Button sx={{marginTop:"2rem"}} variant="outlined" onClick={handleSubmit}>Update</Button>
        </Box>

    )
}

export default UpdateRoles