import { Box, Typography, Button, Autocomplete, Stack, List, ListItem, ListItemText, Tooltip, IconButton, Divider } from '@mui/material'
import { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth'
import axios from "../../../Api/axios"
import TextField from '@mui/material/TextField';
import React from 'react';


function UpdateModal({ task, setShowUpdateModal, renderColumn }) {

    const [taskTitle, setTaskTitle] = useState(task.title);
    const [taskStatus, setTaskStatus] = useState(task.taskStatus.name);
    const [taskDepartment, setTaskDepartment] = useState(task.department);
    const [taskStore, setTaskStore] = useState(task.store);
    const [taskAssignee, setTaskAssignee] = useState(task.assignee);
    const [taskDescription, setTaskDescription] = useState(task.description);

    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [stores, setStores] = useState([]);
    const taskStatuses = [{ name: "To Do", statusId: 1 }, { name: "In Progress", statusId: 2 },
    { name: "Done", statusId: 3 }, { name: "Cancelled", statusId: 4 }, { name: "Blocked", statusId: 5 }]
    const [taskComment, setTaskComment] = useState("");
    const [comments, setComments] = useState(task.comments);
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
        getComments();
        return () => {
            isMountet = false
            controller.abort()
        }
    }, [])

    const sendComment = async () => {
        setTaskComment("")
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
            getComments()
        } catch (error) {
            console.log(error)
        }
    }

    const getComments = async () => {
        try {
            const response = await axios.get(`/api/Kanban/GetAllCommentsByTaskId?taskId=${task.kanbanTaskId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'https://localhost:3000',
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                })
            //console.log(response?.data)
            setComments(response?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = () => {
        //console.log(taskStore)
        if (taskTitle.length > 0 && taskStatus.length > 0
            && taskDepartment.length > 0 && taskAssignee.length > 0
            && taskDescription.length > 0) {
            updateTask()
            console.log("task.status: " + task.taskStatus.name)
            const status = task.taskStatus.name.replace(/\s+/g, '')
            renderColumn(taskStatus, status)
            setShowUpdateModal(false)
        }

    }

    const updateTask = async () => {
        const assigneeId = users.find((user) => user.email === taskAssignee.split(" - ")[1]).userId
        const departmentId = departments.find((department) => department.name === taskDepartment).departmentId
        const storeId = stores.length > 0 && taskStore !== "N/A" && taskStore !== "" ? stores.find((store) => store.name === taskStore).storeId : 0
        const statusId = taskStatuses.find((status) => status.name === taskStatus).statusId
        try {
            const response = await axios.put("/api/Kanban", JSON.stringify({
                kanbanTaskId: task.kanbanTaskId,
                title: taskTitle,
                statusId: statusId,
                departmentId: departmentId,
                storeId: storeId,
                assigneeId: assigneeId,
                description: taskDescription,
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

    return (
        <Box component="form" noValidate >
            <div className='modal'>
                <div className='modalWrapper'>

                    <Typography variant='h5'>Update task: {task.title}</Typography>
                    <Box sx={{ display: "flex", marginTop: "1em" }}>
                        <TextField sx={{ width: "40%", marginRight: "1em" }} label="Title" defaultValue={`${task.title}`} variant="standard" onChange={(e) => setTaskTitle(e.target.value)} />

                        <Autocomplete
                            sx={{ width: "40%" }}
                            id="Status"
                            defaultValue={taskStatuses[task.taskStatus.statusId - 1].name}
                            options={taskStatuses.map((option) => `${option.name}`)}
                            renderInput={(params) => <TextField {...params} label="Status" variant="standard" onChange={(e) => setTaskStatus(e.target.value)} />}
                            //Sets the value of the input when you chose it from the list
                            onInputChange={(_, newInputValue) => {
                                setTaskStatus(newInputValue);
                            }}
                        />

                    </Box>
                    <Box sx={{ display: "flex", marginTop: "1em" }}>

                        <Autocomplete
                            sx={{ width: "40%", marginRight: "1em" }}
                            id="department"
                            options={departments.map((option) => `${option.name}`)}
                            defaultValue={task.department.name}
                            renderInput={(params) => <TextField {...params} label="Department" variant="standard" />}
                            onInputChange={(_, newValue) => {
                                setTaskDepartment(newValue)
                            }}
                        />
                        <Autocomplete
                            sx={{ width: "40%" }}
                            id="assinnee"
                            defaultValue={`${task.assignee.firstName} ${task.assignee.lastName} - ${task.assignee.email}`}
                            options={users.map((option) => `${option.firstName} ${option.lastName} - ${option.email}`)}
                            renderInput={(params) => <TextField {...params} label="Assinnee" variant="standard" onChange={(e) => setTaskAssignee(e.target.value)} />}
                            //Sets the value of the input when you chose it from the list
                            onInputChange={(_, newInputValue) => {
                                setTaskAssignee(newInputValue);
                            }}
                        />
                    </Box>
                    <Box sx={{ display: "flex", marginTop: "1em" }}>
                        <TextField sx={{ width: "40%", marginRight: "1em" }} id="standard-basic" defaultValue={`${task.description}`} label="Description" variant="standard" onChange={(e) => setTaskDescription(e.target.value)} />

                        {stores.length > 0 ?
                            <Autocomplete
                                sx={{ width: "40%" }}
                                id="store"
                                options={stores.map((option) => `${option.name}`)}
                                defaultValue={task.store !== null ? `${task.store.name}` : `N/A`}
                                renderInput={(params) => <TextField {...params} label="Store" variant="standard" />}
                                onInputChange={(_, newValue) => {
                                    setTaskStore(newValue)
                                }}
                            />
                            : null
                        }
                    </Box>
                   
                    {comments.length > 0 ? <List sx={{ marginTop: "1em", width: '80%', borderRadius: '10px', border: 0.1, borderColor: "#777777" }}
                        style={{ maxHeight: 200, overflow: 'auto' }}>

                        {
                            comments.map((i, index) => (
                                <>

                                    {index !== 0 ? <Divider variant="middle" /> : null}
                                    <ListItem alignItems="flex-start"
                                        key={index}>
                                        <Tooltip title={`Reporter ${task.reporter.firstName}`}>
                                            <Box sx={{
                                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: 0.1, marginRight: 1, backgroundColor: "#eeeeff", width: "3em", height: "3em"
                                            }}>
                                                <Typography variant="body2">
                                                    {task.reporter.firstName[0]}
                                                </Typography>
                                            </Box>
                                        </Tooltip>

                                        <ListItemText
                                            primary={`${i.description}`} />
                                    </ListItem>
                                </>
                            ))
                        }
                    </List> : null}
    
                    <Box sx={{ borderRadius: '10px', border: 0.1, borderColor: "#777777", width: "80%", p: 1, marginTop: "1em", display: "flex" }}>
                        <TextField sx={{ width: "90%" }} id="standard-basic" label="Add comment" variant="standard" onChange={(e) => setTaskComment(e.target.value)} />
                        <Button variant='outlined' sx={{ marginTop: "0.2em", ml: '10em' }} onClick={sendComment}>Send</Button>
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