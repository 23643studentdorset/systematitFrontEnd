import { Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function NavBarNotLogedIn(props){
  
  return (
  <nav className="nav">
    <Button color="textLight"><Link to="/" className="site-title">SystematIT</Link></Button>
    <Box sx={{p:2.5}}>
      <Button color="textLight"><CustomLink to="/about">About</CustomLink></Button>
      <Button color ="textLight"><CustomLink to="/contact">Contact</CustomLink></Button>
    </Box>     
    <Box sx={{ p: 2.5}}>
      <Button variant="outlined" color= "textLight" size="medium" onClick={() => {}} >Login</Button>
    </Box>
    
  </nav>
  )
}

function CustomLink({to, children,...props}){
  return (
    <Link to={to}{...props}>{children}</Link>    
  )
}