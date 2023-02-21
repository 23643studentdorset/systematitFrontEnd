import React, { useEffect, useState } from 'react';
import { Paper, Grid, Divider, TextField, Typography, List, ListItem, ListItemIcon, ListItemText, Avatar, Fab, Box, Autocomplete, ListItemButton } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import axios from "../../Api/axios"
import useAuth from "../../hooks/useAuth"


const Chat = () => {
    const { auth } = useAuth()
    const [users, setUsers] = useState([])
    const [user, setUser] = useState("")
    const [userId, setUserId] = useState(0)
    const [messages, setMessages] = useState([])

    useEffect(() => {
        const getUsers = async () => {
            let isMountet = true
            const controller = new AbortController();
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
                console.log("auth: "+ auth.)
            } catch (err) {
                console.log(err)
            }
        }
        getUsers()
    }, [])

   useEffect(() => {
    const getMessages = async () => {
        let isMountet = true
        const controller = new AbortController();
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
            console.log(response?.data)
        } catch (err) {
            console.log(err)
        }
    }
    getMessages()
   }, [userId])

    const getUserIdAutocomplete = (value) => {
        console.log(value)
        value !== "" ? setUserId(users.find((userElement) => `${userElement.firstName} ${userElement.lastName}` === value).userId) : setUserId(0)
    }

    return (
        <Box sx={{ width: "80%" }}>
            <Grid container>
                <Grid item xs={12} >
                    <Typography variant="h5">Chat</Typography>
                </Grid>
            </Grid>
            <Grid container component={Paper}>
                <Grid item xs={4}>
                    <List>
                        <ListItem key="John Wick">
                            <ListItemIcon>
                                <Avatar alt="John Wick" src="https://material-ui.com/static/images/avatar/1.jpg" />
                            </ListItemIcon>
                            <ListItemText primary="John Wick"></ListItemText>
                        </ListItem>
                    </List>
                    <Divider />
                    
                    <Grid item xs={12} style={{ padding: '10px' }}>
                     

                        <Autocomplete
                            key={user}
                            defaultValue={""}
                            sx={{ width: "100%", marginRight: "2em" }}
                            id="users"
                            options={users.map((option) => `${option.firstName} ${option.lastName}`)}
                            renderInput={(params) => <TextField {...params} label="users" variant="standard" onChange={getUserIdAutocomplete} />}
                            onInputChange={(_, value) => { getUserIdAutocomplete(value) }}
                        />
      
                    </Grid>
                    <Divider />
    
                    <List sx={{ overflow: 'auto', maxHeight: 200 }}>
                        {users.map((user) => (
                            <ListItemButton onClick={()=>{
                                setUserId(user.userId)
                                console.log(user)}}>
                                <ListItem key={user.userId}>
                                    <ListItemIcon>
                                        <Avatar src="https://material-ui.com/static/images/avatar/1.jpg" />
                                    </ListItemIcon>
                                    <ListItemText primary={`${user.firstName} ${user.lastName}`}></ListItemText>
                                </ListItem>
                            </ListItemButton>
                        ))}
                    </List>
                </Grid>
                <Grid item xs={8}>
                    <List>
                        <ListItem key="1">
                            <Grid container>
                                <Grid item xs={12}>
                                    <ListItemText align="right" primary="Hey man, What's up ?"></ListItemText>
                                </Grid>
                                <Grid item xs={12}>
                                    <ListItemText align="right" secondary="09:30"></ListItemText>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem key="2">
                            <Grid container>
                                <Grid item xs={12}>
                                    <ListItemText align="left" primary="Hey, Iam Good! What about you ?"></ListItemText>
                                </Grid>
                                <Grid item xs={12}>
                                    <ListItemText align="left" secondary="09:31"></ListItemText>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem key="3">
                            <Grid container>
                                <Grid item xs={12}>
                                    <ListItemText align="right" primary="Cool. i am good, let's catch up!"></ListItemText>
                                </Grid>
                                <Grid item xs={12}>
                                    <ListItemText align="right" secondary="10:30"></ListItemText>
                                </Grid>
                            </Grid>
                        </ListItem>
                    </List>
                    <Divider />
                    <Grid container style={{ padding: '20px' }}>
                        <Grid item xs={11}>
                            <TextField id="outlined-basic-email" label="Type Something" fullWidth />
                        </Grid>
                        <Grid xs={1} align="right">
                            <Fab color="primary" aria-label="add"><SendIcon /></Fab>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Chat;