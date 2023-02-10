import { Box, Typography, Button, Autocomplete, Stack, ListItem, List, ListItemText } from '@mui/material'
import { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth'
import axios from "../../../Api/axios"
import TextField from '@mui/material/TextField';
import { fontSize, margin } from '@mui/system';

function UpdateModal({ task, setShowUpdateModal }) {
    const [taskTitle, setTaskTitle] = useState(task.title);
    const [taskStatus, setTaskStatus] = useState(task.status);
    const [taskDepartment, setTaskDepartment] = useState(task.department);
    const [taskStore, setTaskStore] = useState(task.store);
    const [taskAssignee, setTaskAssignee] = useState(task.assignee);
    const [taskDescription, setTaskDescription] = useState(task.description);
    const [taskComment, setTaskComment] = useState(task.comments);

    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [stores, setStores] = useState([]);
    const taskStatuses = [{ name: "To Do", statusId: 1 }, { name: "In Progress", statusId: 2 },
    { name: "Done", statusId: 3 }, { name: "Cancelled", statusId: 4 }, { name: "Blocked", statusId: 5 }]

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

    const sendComment = async () => {
        try {
            const response = await axios.post("/api/Kanban/CreateComment", JSON.stringify({
                comment: taskComment,
                taskId: task.kanbanTaskId
            }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'https://localhost:3000',
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                });
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = () => {

        if (taskTitle.length > 0 && taskStatus.length > 0
            && taskDepartment.length > 0 && taskStore.length > 0
            && taskAssignee.length > 0 && taskDescription.length > 0) {
            console.log(task)
            console.log(typeof taskStatus + taskStatus.length);
        }

    }

    return (
        <Box component="form" sx={{ zIndex: 5 }} noValidate>
            <div className='modal'>
                <div className='modalWrapper'>
                    <Typography variant='h5'>Update task: {task.title}</Typography>
                    <TextField sx={{ width: "66%" }} label="Title" defaultValue={`${task.title}`} variant="standard" onChange={(e) => setTaskTitle(e.target.value)} />

                    <Autocomplete
                        sx={{ width: "66%" }}
                        id="Status"
                        defaultValue={taskStatuses[task.taskStatus.statusId - 1].name}
                        options={taskStatuses.map((option) => `${option.name}`)}
                        renderInput={(params) => <TextField {...params} label="Status" variant="standard" onChange={(e) => setTaskStatus(e.target.value)} />}
                        //Sets the value of the input when you chose it from the list
                        onInputChange={(_, newInputValue) => {
                            setTaskStatus(newInputValue);
                        }}
                    />

                    <Autocomplete
                        sx={{ width: "66%" }}
                        id="department"
                        options={departments.map((option) => `${option.name}`)}
                        defaultValue={task.department.name}
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
                            defaultValue={task.store !== null ? `${task.store.name}` : `N/A`}
                            renderInput={(params) => <TextField {...params} label="Store" variant="standard" />}
                            onInputChange={(_, newValue) => {
                                setTaskStore(newValue)
                            }}
                        />
                        :
                        null
                    }

                    <Autocomplete
                        sx={{ width: "66%" }}
                        id="assinnee"
                        defaultValue={`${task.assignee.firstName} ${task.assignee.lastName} - ${task.assignee.email}`}
                        options={users.map((option) => `${option.firstName} ${option.lastName} - ${option.email}`)}
                        renderInput={(params) => <TextField {...params} label="Assinnee" variant="standard" onChange={(e) => setTaskAssignee(e.target.value)} />}
                        //Sets the value of the input when you chose it from the list
                        onInputChange={(_, newInputValue) => {
                            setTaskAssignee(newInputValue);
                        }}
                    />

                    <TextField sx={{ width: "66%" }} id="standard-basic" defaultValue={`${task.description}`} label="Description" variant="standard" onChange={(e) => setTaskDescription(e.target.value)} />

                    {task.comments.length > 0 ? <List sx={{ width: '66%' }} >

                        {
                            task.comments.map((i, index) => (
                                <ListItem
                                    key={index}>
                                    <ListItemText
                                        primary={`${i.description}`} />
                                </ListItem>

                            ))
                        }

                    </List> : null}
                    <Box>
                        <TextField sx={{ width: "66%", mr: "1em" }} id="standard-basic" label="Add comment" variant="standard" onChange={(e) => setTaskComment(e.target.value)} />
                        <Button sx={{ marginTop: "1em" }} onClick={sendComment}>Send</Button>
                    </Box>

                    <Box sx={{ marginTop: "1em", display: "flex" }}>
                        <Stack direction="row" spacing={2} >
                            <Button variant="outlined" onClick={handleSubmit}>Save</Button>
                            <Button variant="outlined" onClick={() => setShowUpdateModal(false)} color="error">Cancel</Button>
                        </Stack>
                    </Box>

                </div>
            </div>

        </Box >


    )
}

export default UpdateModal;