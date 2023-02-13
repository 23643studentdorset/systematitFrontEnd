import React from 'react'
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useState } from 'react';
import UpdateModal from './UpdateModal';
import { Modal } from '@mui/material';


function Item({ task, color, updateItem }) {
    const [showUpdateModal, setShowUpdateModal] = useState(false);


    const openUpdateModal = () => {
        setShowUpdateModal(true);
    }

    const openTaskDetails = () => {
        console.log(`Open task: ${task.kanbanTaskId}`);
        openUpdateModal();
        updateItem(task);
    }

    const changeItem = () => {
        setShowUpdateModal(false);
    };

    return (
        <>
            <Card sx={{ marginTop: 1, minWidth: 250, maxWidth: 360, bgcolor: "#fefefe", borderTop: `4px solid ${color}` }}>
                <CardActionArea sx={{ padding: 1 }} onClick={openTaskDetails}>
                    <Box>
                        <Tooltip title={"Taks name"}>
                            <Typography gutterBottom variant="h6" component="div" color={"textDark"}>
                                {task.title}
                            </Typography>
                        </Tooltip>
                        <Tooltip title={`Assigne ${task.assignee.firstName} ${task.assignee.lastName}`}>
                            <IconButton sx={{ border: 0.1, marginRight: 1, backgroundColor: "#ffffee" }}>
                                <Typography variant="body2">
                                    {task.assignee.firstName[0]}{task.assignee.lastName[0]}
                                </Typography>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={`Reporter ${task.reporter.firstName} ${task.reporter.lastName}`}>
                            <IconButton sx={{ border: 0.1, marginRight: 1, backgroundColor: "#eeeeff" }}>
                                <Typography variant="body2">
                                    {task.reporter.firstName[0]}{task.reporter.lastName[0]}
                                </Typography>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={`Task created on`}>
                            <Button sx={{ color: "#888888" }}>
                                <Typography variant="body2" color="textDark">
                                    {formatDate(task.createdOn)}
                                </Typography>
                            </Button>
                        </Tooltip>
                    </Box>
                </CardActionArea>
            </Card>
            <div>
                {showUpdateModal &&
                    (<Modal
                        open={openUpdateModal}
                        onClose={changeItem}
                    >
                        <UpdateModal
                            setShowUpdateModal={setShowUpdateModal}
                            changeItem={changeItem}
                            task={task}
                        ></UpdateModal></Modal>)}
            </div>
        </>
    )
}

const formatDate = (date) => {
    let newDate = new Date(date);
    let day = newDate.getDate();
    let month = newDate.getMonth();
    return `${day < 10 ? `0${day}` : day}-${month < 10 ? `0${month}` : month}-${newDate.getFullYear()}`;
}


export default Item;