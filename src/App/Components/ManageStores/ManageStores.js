import { useState } from 'react'
import { Divider, Typography, Button, Box, Card, CardActionArea, CardContent, CardMedia } from "@mui/material"
import Delete from "../../images/Delete.jpg"
import Update from "../../images/Update.jpg"
import Create from "../../images/Create.jpg"
import CreateStore from './CreateStore'
import UpdateStore from './UpdateStore'
import DeleteStore from './DeleteStore'

const ManageStores = () => {
    const [displayCreate, setDisplayCreate] = useState(false)
    const [displayUpdate, setDisplayUpdate] = useState(false)
    const [displayDelete, setDisplayDelete] = useState(false)
    const [displayOptions, setDisplayOptions] = useState(true)

    const handleDysplayOptions = () => {
        setDisplayOptions(true)
        setDisplayCreate(false)
        setDisplayUpdate(false)
        setDisplayDelete(false)
    }
    return (
        <Box sx={{ width: "45rem", }}>
            <Box sx={{ textAlign: "center" }}>
                <Divider variant="middle" />
                <Button sx={{ color: "textDark.main" }} onClick={handleDysplayOptions}><h2>Manage Stores</h2></Button>

            </Box>
            {displayOptions ?
                <Box display={"flex"}>
                    <Card sx={{ width: "17rem", height: "12rem", marginRight: "2rem" }}>
                        <CardActionArea onClick={() => {
                            setDisplayCreate(true);
                            setDisplayOptions(false)
                        }}>
                            <CardMedia sx={{ opacity: .8 }}
                                component="img"
                                height="90"
                                image={Create}
                                alt={`Image`}
                            />
                            <CardContent sx={{ height: "19rem" }}>
                                <Typography gutterBottom variant="h6" component="div">
                                    Create a new store
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Enables the user to add a new store to the system
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    <Card sx={{ width: "17rem", height: "12rem", marginRight: "2rem" }}>
                    <CardActionArea onClick={() => {
                            setDisplayUpdate(true);
                            setDisplayOptions(false)
                        }}>
                            <CardMedia sx={{ opacity: .8 }}
                                component="img"
                                height="90"
                                image={Update}
                                alt={`Image`}
                            />
                            <CardContent sx={{ height: "19rem" }}>
                                <Typography gutterBottom variant="h6" component="div">
                                    Update store
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Enables the user to change store details in the system
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    <Card sx={{ width: "17rem", height: "12rem" }}>
                        <CardActionArea onClick={() => {
                            setDisplayDelete(true);
                            setDisplayOptions(false)
                        }}>
                            <CardMedia sx={{ opacity: .8 }}
                                component="img"
                                height="90"
                                image={Delete}
                                alt={`Image`}
                            />
                            <CardContent sx={{ height: "19rem" }}>
                                <Typography gutterBottom variant="h6" component="div">
                                    Delete store
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Enables the user to Delete the store in the system
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>

                </Box> : null}
            <Box sx={{ display: "flex", justifyContent: 'center' }}>

                {displayCreate ? <CreateStore /> : null}
                {displayUpdate ? <UpdateStore /> : null}
                {displayDelete ? <DeleteStore /> : null}
            </Box>

        </Box>
    )
}

export default ManageStores