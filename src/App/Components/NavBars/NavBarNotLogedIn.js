import { Button, Box } from "@mui/material";
import { Link } from "react-router-dom";


export default function NavBarNotLogedIn() {
  return (
    <nav className="nav">
      <Button color="textLight"><Link to="/" className="site-title">SystematIT</Link></Button>
      <Box sx={{ p: 2.5 }}>
        <Button color="textLight"><CustomLink to="/services">Services</CustomLink></Button>
        <Button color="textLight"><CustomLink to="/about">About us</CustomLink></Button>
        <Button color="textLight"><CustomLink to="/contact">Contact</CustomLink></Button>
      </Box>
      <Box spacing={2} sx={{ display: 'flex', alignItems: 'center' }}>
        <Button sx={{ marginRight: 1 }} variant="outlined" color="textLight" size="medium"><CustomLink to="/login">Login</CustomLink></Button>
        <Button variant="outlined" color="textLight" size="medium"><CustomLink to="/register">Register</CustomLink></Button>
      </Box>

    </nav>
  )
}

function CustomLink({ to, children, ...props }) {
  return (
    <Link to={to}{...props}>{children}</Link>
  )
}