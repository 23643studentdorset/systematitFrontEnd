import React, { useRef, useEffect, useState } from 'react';
import { Paper, Grid, Divider, TextField, Typography, List, ListItem, ListItemIcon, ListItemText, Avatar, Fab, Box, Autocomplete, ListItemButton } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import axios from "../../Api/axios"
import useAuth from "../../hooks/useAuth"
import jwt_decode from "jwt-decode";


const Chat = () => {
    const { auth } = useAuth()
    const [restOfUsers, setRestOfUsers] = useState([])
    const [userId, setUserId] = useState(0)
    const [messages, setMessages] = useState([])
    const [currentUser, setCurrentUser] = useState({})
    const [message, setMessage] = useState("")
    const [messagesChanged, setMessagesChanged] = useState(false)
    const listRef = useRef();
    let currentUserId = jwt_decode(auth.accessToken).UserId

    useEffect(() => {
        let isMountet = true;
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
                isMountet && setRestOfUsers(response?.data.filter((user) => user.userId != currentUserId))
                setCurrentUser(response?.data.find((currentUser) => currentUser.userId == currentUserId))
            } catch (err) {
            }
        }
        getUsers()
       
        return () => {
            
            isMountet = false
            controller.abort()
        }
    }, [])

    useEffect(() => {
        let isMountet = true
        const controller = new AbortController();
        const getMessages = async () => {
            try {
                const response = await axios.get(`/api/Message/receiverId?id=${userId}`, {
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'https://localhost:3000',
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                })
                isMountet && setMessages(response?.data)
                //console.log(response?.data)
            } catch (err) {
                //console.log(err)    
            }
        }
        getMessages()
        setInterval(() => {
            getMessages();
        }, 10000);
        return () => {
            isMountet = false
            controller.abort()
        }
    }, [userId, messagesChanged])

    const getUserIdAutocomplete = (value) => {
        //console.log(value)
        value !== "" ? setUserId(restOfUsers.find((userElement) => `${userElement.firstName} ${userElement.lastName}` === value).userId) : setUserId(0)
    }

    const handleSendMessage = () => {
        //console.log(message)
        sendMessage()

    }

    useEffect(() => {
        listRef.current?.lastElementChild?.scrollIntoView();  
    }, [messages])

    const sendMessage = async () => {
        try {
            const response = await axios.post("/api/Message", JSON.stringify({
                receiverId: userId,
                content: message
            }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'https://localhost:3000',
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                });
            //console.log(response?)
            setMessage("")
            setMessagesChanged(!messagesChanged)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Box sx={{ width: "45em" }}>
            <Grid container>
                <Grid item xs={12} >
                    <Typography variant="h5">Chat</Typography>
                </Grid>
            </Grid>
            <Grid container component={Paper}>
                <Grid item xs={4}>
                    <List>
                        <ListItem key={`${currentUserId}`}>
                            <ListItemIcon>
                                <Avatar alt="" src="https://material-ui.com/static/images/avatar/1.jpg" />
                            </ListItemIcon>
                            <ListItemText primary={currentUser != undefined ? `${currentUser.firstName} ${currentUser.lastName}` : null}></ListItemText>
                        </ListItem>
                    </List>
                    <Divider />

                    <Grid style={{ padding: '10px' }}>
                        <Autocomplete
                            key={restOfUsers.userId}
                            defaultValue={""}
                            sx={{ width: "100%", marginRight: "2em" }}
                            id="users"
                            options={restOfUsers.map((option) => `${option.firstName} ${option.lastName}`)}
                            renderInput={(params) => <TextField {...params} label="Type an user" variant="standard" onChange={getUserIdAutocomplete} />}
                            onInputChange={(_, value) => { getUserIdAutocomplete(value) }}
                        />

                    </Grid>
                    <Divider />
                    <Grid>

                    <List sx={{ overflow: 'auto', maxHeight: 200 }}>
                        {restOfUsers.map((user) => (
                            <ListItemButton key={user.userId} onClick={() =>
                                setUserId(user.userId)}>
                                <ListItem >
                                    <ListItemIcon>
                                        <Avatar src="https://material-ui.com/static/images/avatar/1.jpg" />
                                    </ListItemIcon>
                                    <ListItemText primary={`${user.firstName} ${user.lastName}`}></ListItemText>
                                </ListItem>
                            </ListItemButton>
                        ))}
                    </List>
                        </Grid>
                </Grid>
                <Grid item xs={8}>
                    <List sx={{ overflow: 'auto', height: 275 }} ref={listRef}>
                        {messages.map((message) => (
                            <ListItem key={message.messageId}>
                                <Grid container>
                                    <Grid item xs={12} align={currentUserId == message.sender.userId ? "right" : "left"}>
                                        <ListItemText
                                            secondary={currentUserId == message.sender.userId ?
                                                `${currentUser.firstName} ${currentUser.lastName}` :
                                                `${message.sender.firstName} ${message.sender.lastName}`} />

                                        <ListItemText sx={{ backgroundColor: currentUserId == message.sender.userId ? "#eef7fe" : "#eeeefe", border: 1, padding: "0.3em", borderRadius: '0.7em', maxWidth: "20em"}}
                                            primary={`${message.content}`} align="left"
                                            style={currentUserId == message.sender.userId ? { 'borderBottomRightRadius': "0%" } : { 'borderBottomLeftRadius': "0%" }} />
                                        <ListItemText secondary={`${formatDate(message.time)}`} />
                                    </Grid>
                                </Grid>
                            </ListItem>

                        ))}
                    </List>
                    <Divider />
                    <Grid container style={{ padding: '20px' }}>
                        <Grid item xs={11}>
                            <TextField
                                id="TypeSomething"
                                label="Type Something"
                                
                                fullWidth
                                onChange={(e) => setMessage(e.target.value)}
                                value={message} />
                        </Grid>
                        <Grid item xs={1} align="right">
                            <Fab color="primary" aria-label="add" onClick={handleSendMessage}><SendIcon /></Fab>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box >
    );
}

const formatDate = (date) => {
    let newDate = new Date(date);
    let day = newDate.getDate();
    let month = newDate.getMonth();
    let hour = newDate.getHours();
    let minutes = newDate.getMinutes();
    return `${day < 10 ? `0${day}` : day}-${month < 10 ? `0${month}` : month}-${newDate.getFullYear()} ${hour < 10 ? `0${hour}` : hour}:${minutes < 10 ? `0${minutes}` : minutes}`;
}

export default Chat;