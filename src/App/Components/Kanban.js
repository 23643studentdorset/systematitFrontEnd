import React, { useState} from 'react';
import useAuth from '../../hooks/useAuth';
import jwt_decode from "jwt-decode";
import Column from './KanbanBoard/Column';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { Box, Button } from '@mui/material';
import { Tooltip } from '@mui/material';
import AddItemModal from './KanbanBoard/AddItemModal';

export default function Kanban() {
    const [showModal, setShowModal] = useState(false);
    const [taskChanged, setTaskChanged] = useState(false);
 
    /*
    useEffect(() => {
        let isMountet = true
        const controller = new AbortController();

        const getTaskFromUser = async () => {
            try {
                
                //console.log(auth)

                const response = await axios.get(`/api/Kanban/UserId?userId=${userId}`, {
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'https://localhost:3000',
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                })
                //console.log(response?.data)
                isMountet && setTasks(response?.data)
                setTaskChanged(false)
            } catch (err) {
                console.log(err)
            }
        }
        getTaskFromUser();
        return () => {
            isMountet = false
            controller.abort()
        }
    }, [taskChanged])
    
    const [toDoTasks, setToDoTasks] = useState([]);
    const [inProgressTasks, setInProgressTasks] = useState([]);
    const [doneTasks, setDoneTasks] = useState([]);
    const [cancelledTasks, setCancelledTasks] = useState([]);
    const [blockedTasks, setBlockedTasks] = useState([]);
    
    useEffect(() => {
        setToDoTasks(tasks?.filter(task => task.taskStatus.name === "ToDo"))
        setInProgressTasks(tasks?.filter(task => task.taskStatus.name === "InProgress"))
        setDoneTasks(tasks?.filter(task => task.taskStatus.name === "Done"))
        setCancelledTasks(tasks?.filter(task => task.taskStatus.name === "Cancelled"))
        setBlockedTasks(tasks?.filter(task => task.taskStatus.name === "Blocked"))
    }, [tasks])
    */

    const openAddNewTaskModal = () => {
        setShowModal(true);
    }
    
    const addItem = () => {
        setShowModal(false);
        updateItem(true);
    };
    
    const updateItem = (itemAdded) => {
        setTaskChanged(itemAdded);
    }

    return (
        <>
            <h1>Kanban Board</h1>

            <Box sx={{ width: "100%" }}>
                <Tooltip title="add new task">
                    <Button variant="contained" endIcon={<ControlPointIcon fontSize="inherit" />} onClick={openAddNewTaskModal}>
                        Add new task
                    </Button>
                </Tooltip>
            </Box>

            {showModal &&
                (<AddItemModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    addItem={addItem}
                ></AddItemModal>)}

            <div className="columns">
                <Column
                    //tasksList={toDoTasks}
                    colTitle={'To Do'}
                    color={'#ffd401'}
                    updateItem={updateItem}
                    taskChanged={taskChanged}
                    
                />
                <Column
                    //tasksList={inProgressTasks}
                    colTitle={'In Progress'}       
                    color={'#00468e'}
                    taskChanged={taskChanged}
                    updateItem={updateItem}
                />
                <Column
                    //tasksList={doneTasks}
                    colTitle={'Done'}
                    color={'#008e56'}
                    taskChanged={taskChanged}
                    updateItem={updateItem}
                />
                <Column
                    //tasksList={cancelledTasks}
                    colTitle={'Cancelled'}
                    color={'#ce0019'}
                    taskChanged={taskChanged}
                    updateItem={updateItem}
                />
                <Column
                    //tasksList={blockedTasks}
                    colTitle={'Blocked'}
                    color={'#ff6602'}
                    taskChanged={taskChanged}
                    updateItem={updateItem}
                />
            </div>
        </>
    )
};

