import Chat from "../../Chat"
import KanbanSearch from "../../KanbanBoard/KanbanSearch"
import useAuth from "../../../../hooks/useAuth"
import jwt_decode from "jwt-decode";
import { Button, Box, Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material"
import kanban from "../../../images/Kanban.jpg"
import messages from "../../../images/Messages.jpg"
import { useState } from "react"

export default function UserView() {
    const [displayFeatures, setDisplayFeatures] = useState(true)
    const [displayKanban, setDisplayKanban] = useState(false)
    const [displayMessages, setDisplayMessages] = useState(false)
    const [displayCreateStore, setDisplayCreateStore] = useState(false)
    const [displayChangeRoles, setDisplayChangeRoles] = useState(false)

    const { auth } = useAuth()
    const decoded = jwt_decode(auth.accessToken)
    const roles = []
    roles.push(...decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"])
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

    const openCreateStore = () => {
        console.log("Create Store")
        setDisplayCreateStore(true)
        setDisplayFeatures(false)
    }

    const openChangeRoles = () => {
        console.log("Change Roles")
        setDisplayChangeRoles(true)
        setDisplayFeatures(false)
    }

    const handleDisplays = () => {
        setDisplayFeatures(true)
        setDisplayKanban(false)
        setDisplayMessages(false)
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
            title: "Create a new store",
            description: "Create new a branch store",
            image: kanban,
            event: openCreateStore
        }]
    const adminFeatures = [
        {
            id: 1,
            title: "Change user roles",
            description: "Change user roles to give them access to different features",
            image: kanban,
            event: openChangeRoles
        }]

    return (
        <>
            <Button sx={{color:"textDark.main"}} onClick={handleDisplays}><h1>Dashboard</h1></Button>
            <Box display="flex">
                {roles.includes("Regular") && displayFeatures ?
                    <>
                        {regularFeatures.map((feature) => (
                            <Card key={feature.id} sx={{ width: "21em", height: "19em", marginRight: "3em" }}>
                                <CardActionArea onClick={feature.event} >
                                    <CardMedia sx={{ opacity: .8 }}
                                        component="img"
                                        height="140"
                                        image={feature.image}
                                        alt={`${feature.title} Image`}
                                    />
                                    <CardContent sx={{height:"19em"}}>
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
                            <Card key={feature.id} sx={{ width: "21em", height: "19em", marginRight: "3em" }}>
                                <CardActionArea onClick={feature.event}>
                                    <CardMedia sx={{ opacity: .8 }}
                                        component="img"
                                        height="140"
                                        image={feature.image}
                                        alt={`${feature.title} Image`}
                                    />
                                    <CardContent sx={{height:"15em"}}>
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
                            <Card key={feature.id} sx={{ width: "21em", height: "19em", marginRight: "3em" }}>
                                <CardActionArea onClick={feature.event}>
                                    <CardMedia sx={{ opacity: .8 }}
                                        component="img"
                                        height="140"
                                        image={feature.image}
                                        alt={`${feature.title} Image`}
                                    />
                                    <CardContent sx={{height:"15em"}}>
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
        </>
    )
}