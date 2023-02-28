import React, { useState, useEffect } from 'react'
import { Autocomplete, TextField, Box } from '@mui/material'
import axios from "../../Api/axios"
import useAuth from "../../hooks/useAuth"
import jwt_decode from "jwt-decode"

const UpdateRoles = () => {

    const [users, setUsers] = useState([])
    const { auth } = useAuth()
    let currentUserId = jwt_decode(auth.accessToken).UserId
    const [showRoles, setShowRoles] = useState(false)
    const [roles, setRoles] = useState([])
    const [rolesToPick, setRolesToPick] = useState([])
    
    const enumeRoles = Object.freeze({
        "Admin": 1,
        "Manager": 2,
        "Regular": 3,
    })

    const availableRoles = [
        {"roleName": "Admin", "roleId": enumeRoles.Admin}, 
        {"roleName": "Manager", "roleId": enumeRoles.Manager}, 
        {"roleName": "Regular", "roleId": enumeRoles.Regular}]

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
            console.log(response?.data.userRoles)
            setRoles(response?.data.userRoles)        
            
            console.log(availableRoles.filter((role) => role.roleName !== response?.data.userRoles[0].roleName))
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

    return (
        <>
            <h1>UpdateRoles</h1>
            <Box sx={{display:"flex", width: "30rem"}}>
            <Autocomplete
                key={users.userId}
                defaultValue={""}
                sx={{ width: "40%", marginRight: "2em" }}
                id="Users"
                options={users.map((option) => `${option.firstName} ${option.lastName}`)}
                renderInput={(params) => <TextField {...params} label="users" variant="standard"/>}
                onInputChange={(_, value) => { showRolesHandler(value) }}
            />
            {showRoles ? <Autocomplete
                key={roles.roleId}
                defaultValue={""}
                sx={{ width: "40%", marginRight: "2em" }}
                id="Roles"
                options={roles.map((option) => option.roleName)}
                renderInput={(params) => <TextField {...params} label="Available roles" variant="standard"/>}
                onInputChange={(_, value) => { console.log(value) }}
            />
            : null}

        </Box>
</>

    )
}

export default UpdateRoles