import React, { useEffect, useState } from 'react'
import { Box, Button, TextField, Typography, Autocomplete, Stack } from '@mui/material';
import useAuth from '../../../hooks/useAuth'
import axios from "../../../Api/axios"

function Modal({ setShowModal, addItem }) {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDepartment, setTaskDepartment] = useState('');
    const [taskStore, setTaskStore] = useState('');
    const [taskAssignee, setTaskAssignee] = useState('');
    const [taskDescription, setTaskDescription] = useState('');

    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [stores, setStores] = useState([]);

    const { auth } = useAuth();

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
                isMountet && setUsers(response?.data)
                //console.log(response?.data)                
            } catch (err) {
                console.log(err)
            }
        }
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
        getUsers();
        getDepartments();
        getStores();
        return () => {
            isMountet = false
            controller.abort()
        }
    }, [])

    const createNewTask = async () => {
        const assigneeId = users.find((user) => user.email === taskAssignee.split(" - ")[1]).userId
        const departmentId = departments.find((department) => department.name === taskDepartment).departmentId
        const storeId = stores.length > 0 && taskStore !== "" ? stores.find((store) => store.name === taskStore).storeId : 0
        try {
            const response = await axios.post("/api/Kanban", JSON.stringify({
                title: taskTitle,
                departmentId: departmentId,
                storeId: storeId,
                assigneeId: assigneeId,
                description: taskDescription
            }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'https://localhost:3000',
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                });
            if (response.status === 200) {
                addItem(response.data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleSubmit = () => {
        createNewTask();
    };

    return (
        <Box component="form" sx={{ zIndex: 5 }} noValidate>
            <div className='modal'>
                <div className='modalWrapper'>

                    <Typography variant='h5'>Add task</Typography>

                    <TextField sx={{ width: "66%" }} id="standard-basic" label="Title" variant="standard" onChange={(e) => setTaskTitle(e.target.value)} />

                    <Autocomplete
                        sx={{ width: "66%" }}
                        id="assinnee"
                        options={users.map((option) => `${option.firstName} ${option.lastName} - ${option.email}`)}
                        renderInput={(params) => <TextField {...params} label="Assinnee" variant="standard" onChange={(e) => setTaskAssignee(e.target.value)} />}
                        //Sets the value of the input when you chose it from the list
                        onInputChange={(_, newInputValue) => {
                            setTaskAssignee(newInputValue);
                        }}
                    />
                    <Autocomplete
                        sx={{ width: "66%" }}
                        id="department"
                        options={departments.map((option) => `${option.name}`)}
                        renderInput={(params) => <TextField {...params} label="Department" variant="standard" />}
                        onInputChange={(_, newValue) => {
                            setTaskDepartment(newValue)
                        }}
                    />
                    {stores.length > 0 ?
                        <Autocomplete
                            sx={{ width: "66%" }}
                            id="store"
                            options={stores.map((option) => `${option.name}`)}
                            renderInput={(params) => <TextField {...params} label="Store" variant="standard" />}
                            onInputChange={(_, newValue) => {
                                setTaskStore(newValue)
                            }}
                        />
                        :
                        null
                    }
                    <TextField sx={{ width: "66%" }} id="standard-basic" label="Description" variant="standard" onChange={(e) => setTaskDescription(e.target.value)} />

                    <Box sx={{ marginTop: "1em", display: "flex" }}>
                        <Stack direction="row" spacing={2}>
                            <Button onClick={handleSubmit} variant='outlined' disabled=
                                {(taskTitle === '' || taskDepartment === '' || (taskStore === '' && stores.length < 0)
                                    || taskAssignee === '' || taskDescription === '') ? true : false} >Save</Button>

                            <Button onClick={() => setShowModal(false)} variant='outlined' color="error">Cancel</Button>
                        </Stack>


                    </Box>
                </div>
            </div>
        </Box>


    )
}

export default Modal