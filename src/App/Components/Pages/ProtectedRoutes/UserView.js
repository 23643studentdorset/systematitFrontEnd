import Chat from "../../Chat"
import KanbanSearch from "../../KanbanBoard/KanbanSearch"
import useAuth from "../../../../hooks/useAuth"
import jwt_decode from "jwt-decode";
import { Button, Box, Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material"
import kanban from "../../../images/Kanban.jpg"
import messages from "../../../images/Messages.jpg"
import store from "../../../images/Store.jpg"
import access from "../../../images/Access.jpg"
import { useState, useEffect } from "react"
import ManageStores from "../../ManageStores/ManageStores";
import UpdateRoles from "../../UpdateRoles";
import axios from "../../../../Api/axios";

export default function UserView() {
    const [displayFeatures, setDisplayFeatures] = useState(true)
    const [displayKanban, setDisplayKanban] = useState(false)
    const [displayMessages, setDisplayMessages] = useState(false)
    const [displayManageStores, setDisplayManageStores] = useState(false)
    const [displayChangeRoles, setDisplayChangeRoles] = useState(false)
    const [userName, setUserName] = useState("")

    const { auth } = useAuth()
    const decoded = jwt_decode(auth.accessToken)

    //console.log(decoded)
    const roles = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]


    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`/api/User/id?id=${decoded.UserId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': 'https://localhost:3000',
                            'Authorization': `Bearer ${auth.accessToken}`
                        }
                    })
                //console.log(response?.data)
                setUserName(response?.data.firstName)            
            } catch (err) {
                console.log(err)
            }
        }
        getUser()
    }, [])


    //console.log("Roles:" + roles)

    const openKanban = () => {
        //console.log("Kanban")
        setDisplayKanban(true)
        setDisplayFeatures(false)
    }
    const openMessages = () => {
        //console.log("Messages")
        setDisplayMessages(true)
        setDisplayFeatures(false)
    }

    const openManageStores = () => {
        setDisplayManageStores(true)
        setDisplayFeatures(false)
    }

    const openChangeRoles = () => {
        setDisplayChangeRoles(true)
        setDisplayFeatures(false)
    }

    const handleDisplays = () => {
        setDisplayFeatures(true)
        setDisplayKanban(false)
        setDisplayMessages(false)
        setDisplayManageStores(false)
        setDisplayChangeRoles(false)
    }
    const regularFeatures = [
        {
            id: 1,
            title: "Kanban Boards",
            description: "A visual tool that helps teams track work progress and collaborate on tasks by representing them as cards on a board with columns representing different stages of a process.",
            image: kanban,
            event: openKanban
        },
        {
            id: 2,
            title: "Messages",
            description: "A real-time communication tool that allows users to exchange messages instantly in a chat-like interface",
            image: messages,
            event: openMessages
        }]

    const managerFeatures = [
        {
            id: 1,
            title: "Manage Stores",
            description: "Enables a user to add, change and delete Stores on the System",
            image: store,
            event: openManageStores
        }]
    const adminFeatures = [
        {
            id: 1,
            title: "Change user roles",
            description: "Enables Admin users to modify the access levels and features available of other users in the company",
            image: access,
            event: openChangeRoles
        }]

    return (
        <>

            <Button sx={{ color: "textDark.main" }} onClick={handleDisplays}><h1>{userName} Dashboard</h1></Button>

            <Box display="flex">
                {roles.includes("Regular") && displayFeatures ?
                    <>
                        {regularFeatures.map((feature) => (
                            <Card key={feature.id} sx={{ width: "21rem", height: "19rem", marginRight: "2rem" }}>
                                <CardActionArea onClick={feature.event} >
                                    <CardMedia sx={{ opacity: .8 }}
                                        component="img"
                                        height="140"
                                        image={feature.image}
                                        alt={`${feature.title} Image`}
                                    />
                                    <CardContent sx={{ height: "19rem" }}>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))}
                    </>
                    : null}
                {roles.includes("Manager") && displayFeatures ?
                    <>
                        {managerFeatures.map((feature) => (
                            <Card key={feature.id} sx={{ width: "21rem", height: "19rem", marginRight: "2rem" }}>
                                <CardActionArea onClick={feature.event}>
                                    <CardMedia sx={{ opacity: .8 }}
                                        component="img"
                                        height="140"
                                        image={feature.image}
                                        alt={`${feature.title} Image`}
                                    />
                                    <CardContent sx={{ height: "15rem" }}>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))}
                    </>
                    : null}
                {roles.includes("Admin") && displayFeatures ?
                    <>
                        {adminFeatures.map((feature) => (
                            <Card key={feature.id} sx={{ width: "21rem", height: "19rem", marginRight: "2rem" }}>
                                <CardActionArea onClick={feature.event}>
                                    <CardMedia sx={{ opacity: .8 }}
                                        component="img"
                                        height="140"
                                        image={feature.image}
                                        alt={`${feature.title} Image`}
                                    />
                                    <CardContent sx={{ height: "15rem" }}>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))}
                    </>
                    : null}
            </Box>
            {displayKanban ? <KanbanSearch /> : null}
            {displayMessages ? <Chat /> : null}
            {displayManageStores ? <ManageStores /> : null}
            {displayChangeRoles ? <UpdateRoles /> : null}
        </>
    )
}