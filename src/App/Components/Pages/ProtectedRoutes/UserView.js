import { useEffect, useState } from "react"
import Kanban from "../../Kanban"
import Users from "../../Users"
import { Button, Typography, Box, Autocomplete, TextField, experimentalStyled } from "@mui/material"
import axios from "../../../../Api/axios"
import useAuth from "../../../../hooks/useAuth"
import { RadioGroup, Radio } from "@mui/material"
import React from "react"
import Chat from "../../Chat"

export default function UserView() {

    const [departments, setDepartments] = useState([])
    const [users, setUsers] = useState([])
    const [department, setDepartment] = useState("")
    const [user, setUser] = useState("")
    const [departmentId, setDepartmentId] = useState(0)
    const [userId, setUserId] = useState(0)
    const [showBoard, setShowBoard] = useState(false)
    const { auth } = useAuth()

    useEffect(() => {
        let isMountet = true
        const controller = new AbortController();
        const getDepartments = async () => {
            try {
                const response = await axios.get(`/api/Department`, {
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'https://localhost:3000',
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                })
                isMountet && setDepartments(response?.data)
                //console.log(response?.data)
            } catch (err) {
                console.log(err)
            }
        }
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
                isMountet && setUsers(response?.data)
                //console.log(response?.data)                
            } catch (err) {
                console.log(err)
            }
        }
        getDepartments()
        getUsers()
        return () => {
            isMountet = false
            controller.abort()
        }
    }, [])

    const getKanbanByDepartment = (value) => {
        setShowBoard(false)
        setDepartment(value)
        //console.log("value:" + value)
        value !== "" ? setDepartmentId(departments.find((departmentElement) => departmentElement.name === value).departmentId) : setDepartmentId(0)
    }
    const getKanbanByUser = (value) => {
        setShowBoard(false)
        setUser(value)
        value !== "" ? setUserId(users.find((userElement) => `${userElement.firstName} ${userElement.lastName}` === value).userId) : setUserId(0)
    }

    const [selectedValue, setSelectedValue] = React.useState('byUser');

    const handleRadioChange = (event) => {
        setShowBoard(false)
        setSelectedValue(event.target.value);
        //console.log(event.target.value)
    };


    return (
        <>

            <Box margin={10} sx={{ display: "flex", minWidth: "50em" }}>
                <Box sx={{ width: "40%", display: "flex", alignItems: "center" }}>
                    <Typography variant="h6">By user</Typography>
                    <Radio
                        label="byUser"
                        checked={selectedValue === 'byUser'}
                        onChange={handleRadioChange}
                        value="byUser"
                        name="radio-buttons-byUser"
                        inputProps={{ 'aria-label': 'byUser' }}
                    />
                    <Typography variant="h6">By Department</Typography>
                    <Radio
                        checked={selectedValue === 'byDepartment'}
                        onChange={handleRadioChange}
                        value="byDepartment"
                        name="radio-buttons-byDepartment"
                        inputProps={{ 'aria-label': 'byDepartment' }}
                    />
                </Box>

                {selectedValue === "byDepartment" ?
                    <Autocomplete
                        key={showBoard}
                        defaultValue={""}
                        sx={{ width: "40%", marginRight: "2em" }}
                        id="department"
                        options={departments.map((option) => `${option.name}`)}
                        renderInput={(params) => <TextField {...params} label="department" variant="standard" onChange={getKanbanByDepartment} />}
                        onInputChange={(_, value) => { getKanbanByDepartment(value) }}

                    /> : selectedValue === "byUser" ?
                        <Autocomplete
                        key={showBoard}
                        defaultValue={""}
                            sx={{ width: "40%", marginRight: "2em" }}
                            id="users"
                            options={users.map((option) => `${option.firstName} ${option.lastName}`)}
                            renderInput={(params) => <TextField {...params} label="users" variant="standard" onChange={getKanbanByUser} />}
                            onInputChange={(_, value) => { getKanbanByUser(value) }}

                        /> : null}

                <Button variant="outlined" onClick={() => setShowBoard(true)}>Search</Button>
            </Box>

            {selectedValue === "byUser" && showBoard && userId !== 0 ?
                <Kanban
                    KanbanTitle={user}
                    departmentId={null}
                    userId={userId}
                /> : null}
            {selectedValue === "byDepartment" && showBoard && departmentId !== 0 ?
                <Kanban
                    KanbanTitle={department}
                    departmentId={departmentId}
                    userId={null}
                /> : null}

            <Chat />
        </>
    )
}