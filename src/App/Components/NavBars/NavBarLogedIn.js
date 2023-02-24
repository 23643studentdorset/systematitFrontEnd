import { Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

export default function NavBarLogedIn() {
  const { setAuth } = useAuth();

  const logout = () => {
    setAuth({});
  }

  return (
    <nav className="nav">
      <Button color="textLight"><Link to="/" className="site-title">SystematIT</Link></Button>
      <Box sx={{ p: 2.5 }}>
        <Button color="textLight"><CustomLink to="/services">Services</CustomLink></Button>
        <Button color="textLight"><CustomLink to="/about">About us</CustomLink></Button>
        <Button color="textLight"><CustomLink to="/contact">Contact</CustomLink></Button>
        <Button color="textLight"><CustomLink to="/UserView">Dashboard</CustomLink></Button>
      </Box>
      <Box spacing={2} sx={{ display: 'flex', alignItems: 'center' }}>
        <Button sx={{ marginRight: 1 }} onClick={logout} variant="outlined" color="textLight" size="medium"><CustomLink to="/">Logout</CustomLink></Button>
      </Box>

    </nav>
  )
}

function CustomLink({ to, children, ...props }) {
  return (
    <Link to={to}{...props}>{children}</Link>
  )
}