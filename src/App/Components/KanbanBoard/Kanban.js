import React, { useState} from 'react';
import Column from './Column';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { Box, Button } from '@mui/material';
import { Tooltip } from '@mui/material';
import AddItemModal from './AddItemModal';


export default function Kanban({KanbanTitle, departmentId, userId}) {
    const [showModal, setShowModal] = useState(false);
    const [taskChanged, setTaskChanged] = useState(false);

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
            <h1>{KanbanTitle} kanban board</h1>

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
                    userId={userId}
                    departmentId = {departmentId}
                    colTitle={'To Do'}
                    color={'#ffd401'}
                    updateItem={updateItem}
                    taskChanged={taskChanged}
                    
                />
                <Column
                    userId={userId}
                    departmentId = {departmentId}
                    colTitle={'In Progress'}       
                    color={'#00468e'}
                    taskChanged={taskChanged}
                    updateItem={updateItem}
                />
                <Column
                    userId={userId}
                    departmentId = {departmentId}
                    colTitle={'Done'}
                    color={'#008e56'}
                    taskChanged={taskChanged}
                    updateItem={updateItem}
                />
                <Column
                    userId={userId}
                    departmentId = {departmentId}
                    colTitle={'Cancelled'}
                    color={'#ce0019'}
                    taskChanged={taskChanged}
                    updateItem={updateItem}
                />
                <Column
                    userId={userId}
                    departmentId = {departmentId}
                    colTitle={'Blocked'}
                    color={'#ff6602'}
                    taskChanged={taskChanged}
                    updateItem={updateItem}
                />
            </div>
        </>
    )
};

