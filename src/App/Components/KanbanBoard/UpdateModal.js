import { Box, Button, Stack, Typography, TextField, Autocomplete, List, Divider, ListItem, Tooltip, ListItemText } from '@mui/material'
import axios from '../../../Api/axios'
import useAuth from '../../../hooks/useAuth'
import { useEffect, useState } from 'react'

function UpdateModal({ taskId, setShowUpdateModal, renderColumn }) {
    const { auth } = useAuth()
    const [users, setUsers] = useState([])
    const [departments, setDepartments] = useState([])
    const [stores, setStores] = useState([])

    const [taskTitle, setTaskTitle] = useState("");
    const [taskStatus, setTaskStatus] = useState("");
    const [taskDepartment, setTaskDepartment] = useState("");
    const [taskAssignee, setTaskAssignee] = useState("");
    const [taskStore, setTaskStore] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskComment, setTaskComment] = useState("");
    const [comments, setComments] = useState([]);
    const [oldTaskStatus, setOldTaskStatus] = useState("");

    const taskStatuses = [
        { name: "To Do", statusId: 1 },
        { name: "In Progress", statusId: 2 },
        { name: "Done", statusId: 3 },
        { name: "Cancelled", statusId: 4 },
        { name: "Blocked", statusId: 5 }]

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
            } catch (err) {
                console.log(err)
            }
        }

        const getTask = async () => {
            try {
                const response = await axios.get(`/api/Kanban/taskDetailId?taskId=${taskId}`, {
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'https://localhost:3000',
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                })
                //isMountet && setTask(response?.data)
                isMountet && setTaskTitle(response?.data.title)
                console.log(response?.data)
                response?.data.taskStatus.name === "ToDo" ? isMountet && setTaskStatus("To Do") :
                    response?.data.taskStatus.name === "InProgress" ? isMountet && setTaskStatus("In Progress") :
                        isMountet && setTaskStatus(response?.data.taskStatus.name)
                setTaskDepartment(response?.data.department.name)
                setTaskAssignee(`${response?.data.assignee.firstName} ${response?.data.assignee.lastName}`)
                setTaskStore(response?.data.store !== null ? response?.data.store.name : "")
                setTaskDescription(response?.data.description)
                setComments(response?.data.comments)
                setOldTaskStatus(response?.data.taskStatus.name)

            } catch (err) {
                console.log(err)
            }
        }
        getUsers();
        getDepartments();
        getStores();
        getTask();
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
                taskId: taskId
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
            const response = await axios.get(`/api/Kanban/GetAllCommentsByTaskId?taskId=${taskId}`,
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
    
    const updateTask = async () => {
        const assigneeId = users.find((user) => `${user.firstName} ${user.lastName}` === taskAssignee).userId
        const departmentId = departments.find((department) => department.name === taskDepartment).departmentId
        const storeId = stores.length > 0 && taskStore !== "" ? stores.find((store) => store.name === taskStore).storeId : 0
        const statusId = taskStatuses.find((status) => status.name === taskStatus).statusId
        try {
            const response = await axios.put("/api/Kanban", JSON.stringify({
                kanbanTaskId: taskId,
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

    const handleSubmit = () => {
        if (taskTitle.length > 0 && taskStatus.length > 0
            && taskDepartment.length > 0 && taskAssignee.length > 0
            && taskDescription.length > 0) {
            console.log("oldTaskStatus: " + oldTaskStatus)
            console.log("taskStatus: " + taskStatus)
            updateTask()           
            renderColumn(taskStatus.replace(/\s+/g, ''), oldTaskStatus)
            setShowUpdateModal(false)
        }

    }


    return (
        <Box component="form" noValidate >
            <div className='modal'>
                <div className='modalWrapper'>
                    <Typography variant='h5'>Update task: { }</Typography>
                    <Box sx={{ display: "flex", marginTop: "1em" }}>
                        <TextField
                            sx={{ width: "40%", marginRight: "1em" }}
                            label="Title"
                            value={`${taskTitle}`}
                            variant="standard"
                            onChange={(e) => setTaskTitle(e.target.value)} />
                        <Autocomplete
                            sx={{ width: "40%" }}
                            id="Status"
                            value={taskStatus}
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
                            value={taskDepartment}
                            renderInput={(params) => <TextField {...params} label="Department" variant="standard" />}
                            onInputChange={(_, newValue) => {
                                setTaskDepartment(newValue)
                            }}
                        />
                        <Autocomplete
                            sx={{ width: "40%" }}
                            id="assinnee"
                            value={taskAssignee}
                            options={users.map((option) => `${option.firstName} ${option.lastName}`)}
                            renderInput={(params) => <TextField {...params} label="Assinnee" variant="standard" onChange={(e) => setTaskAssignee(e.target.value)} />}
                            //Sets the value of the input when you chose it from the list
                            onInputChange={(_, newInputValue) => {
                                setTaskAssignee(newInputValue);
                            }}
                        />
                    </Box>

                    {stores.length > 0 ?
                        <Autocomplete
                            sx={{ width: "40%" }}
                            id="store"
                            options={stores.map((option) => `${option.name}`)}
                            value={taskStore !== "" ? `${taskStore}` : null}
                            renderInput={(params) => <TextField {...params} label="Store" variant="standard" />}
                            onInputChange={(_, newValue) => {
                                setTaskStore(newValue)
                            }}
                        />
                        : null
                    }
                    <TextField
                        sx={{ width: "80%", marginTop: "1em" }}
                        id="standard-basic"
                        value={`${taskDescription}`}
                        label="Description"
                        variant="standard"
                        onChange={(e) => setTaskDescription(e.target.value)} />

                    {comments.length > 0 ? <List sx={{ marginTop: "1em", width: '80%', borderRadius: '10px', border: 0.1, borderColor: "#777777" }}
                        style={{ maxHeight: 200, overflow: 'auto' }}>

                        {

                            comments.map((c, index) => (
                                <Box>
                                    {index !== 0 ? <Divider variant="middle" /> : null}
                                    <ListItem
                                        key={index}
                                        alignItems="flex-start">
                                        <Tooltip title={`Sender ${c.user.firstName} ${c.user.lastName}`}>
                                            <Box sx={{
                                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: 0.1, marginRight: 1, backgroundColor: "#eeeeff", width: "3em", height: "3em"
                                            }}>
                                                <Typography variant="body2">
                                                    {c.user.firstName[0] + c.user.lastName[0]}
                                                </Typography>
                                            </Box>
                                        </Tooltip>
                                        <ListItemText
                                            primary={`${c.description}`} />
                                    </ListItem>
                                </Box>
                            ))
                        }
                    </List> : null}
                    <Box sx={{ borderRadius: '10px', border: 0.1, borderColor: "#777777", width: "80%", p: 1, marginTop: "1em", display: "flex" }}>
                        <TextField 
                        sx={{ width: "90%" }} 
                        id="standard-basic" 
                        label="Add comment"
                        value={taskComment} 
                        variant="standard" 
                        onChange={(e) => setTaskComment(e.target.value)} />
                        <Button 
                        variant='outlined' 
                        sx={{ marginTop: "0.2em", ml: '10em' }} 
                        onClick={sendComment}>Send</Button>
                    </Box>

                    <Box sx={{ marginTop: "1em", display: "flex" }}>
                        <Stack direction="row" spacing={2} >
                            <Button variant="outlined" onClick={handleSubmit}>Save</Button>
                            <Button variant="outlined" onClick={() => setShowUpdateModal(false)} color="error">Cancel</Button>
                        </Stack>
                    </Box>
                </div>
            </div>
        </Box>
    )
}
export default UpdateModal