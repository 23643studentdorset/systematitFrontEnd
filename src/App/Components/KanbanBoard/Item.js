import React from 'react'
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { useState } from 'react';
import UpdateModal from './UpdateModal';
import { Modal } from '@mui/material';


function Item({ task, color, renderColumn }) {
    const [showUpdateModal, setShowUpdateModal] = useState(false);


    const openUpdateModal = () => {
        setShowUpdateModal(true);
    }

    const openTaskDetails = () => {
        //console.log(`Open task: ${task.kanbanTaskId}`);
        openUpdateModal();

    }


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

                        <Box sx={{ display: "flex" }}>
                            <Tooltip title={`Assigne ${task.assigneeUserFirstName} ${task.assigneeUserLastName}`}>
                                <Box sx={{
                                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: 1, marginRight: 1, backgroundColor: "#ffffee", width: "3em", height: "3em"
                                }}>
                                    <Typography variant="body2">

                                        {task.assigneeUserFirstName[0]}{task.assigneeUserLastName[0]}
                                    </Typography>
                                </Box>
                            </Tooltip>
                            <Tooltip title={`Reporter ${task.reporterUserFirstName} ${task.reporterUserLastName}`}>
                                <Box sx={{
                                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: 0.1, marginRight: 1, backgroundColor: "#eeeeff", width: "3em", height: "3em"
                                }}>
                                    <Typography variant="body2">
                                        {task.reporterUserFirstName[0]}{task.reporterUserLastName[0]}
                                    </Typography>
                                </Box>
                            </Tooltip>
                        </Box>

                        {
                            task.lastModifiedOn === null ?
                                <Tooltip title={`Task created on`}>
                                    <Box sx={{ color: "#888888", marginTop: 1 }}>
                                        <Typography variant="body2" color="textDark">
                                            {formatDate(task.createdOn)}
                                        </Typography>
                                    </Box>
                                </Tooltip> :
                                <Tooltip title={`Task last modified on`}>
                                    <Box sx={{ color: "#888888", marginTop: 1 }}>
                                        <Typography variant="body2" color="textDark">
                                            {formatDate(task.lastModifiedOn)}
                                        </Typography>
                                    </Box>
                                </Tooltip>
                        }

                    </Box>
                </CardActionArea>
            </Card>
            <div>
                {showUpdateModal &&
                    (<Modal
                        open={openUpdateModal}
                        onClose={renderColumn}
                    >
                        <UpdateModal
                            setShowUpdateModal={setShowUpdateModal}
                            renderColumn={renderColumn}
                            taskId={task.kanbanTaskId}
                        ></UpdateModal></Modal>)}
            </div>
        </>
    )
}

const formatDate = (date) => {
    let newDate = new Date(date);
    let day = newDate.getDate();
    let month = newDate.getMonth();
    let hour = newDate.getHours();
    let minutes = newDate.getMinutes();
    return `${day < 10 ? `0${day}` : day}-${month < 10 ? `0${month}` : month}-${newDate.getFullYear()} ${hour < 10 ? `0${hour}` : hour}:${minutes < 10 ? `0${minutes}` : minutes}`;
}


export default Item;