import { Button, Container, Divider, Paper, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound(){
    return(
        <Container component={Paper} sx={{height:400}}>
            <Typography Color="textDark" gutterBottom variant='h3'>Oops!! - Page not found</Typography>
            <Divider />
            <Button color="textDark" width="20%" component={Link} to='/'>Go back to Home</Button>
       
        </Container>
    )
}