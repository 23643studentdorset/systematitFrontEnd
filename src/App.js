import NavBarNotLogedIn from './App/Components/NavBars/NavBarNotLogedIn';
import NavBarLogedIn from './App/Components/NavBars/NavBarLogedIn';
import NavBar from './App/Components/NavBars/NavBar';
import About from './App/Components/Pages/About';
import Contact from './App/Components/Pages/Contact';
import {Route, Routes} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import UserView from './App/Components/Pages/ProtectedRoutes/UserView';
import AdminView from './App/Components/Pages/ProtectedRoutes/AdminView';
import ManagerView from './App/Components/Pages/ProtectedRoutes/ManagerView';
import NotFound from './App/errors/NotFound';
import Login from './App/Components/Login/Login';
import Register from './App/Components/Register/Register'
import Services from './App/Components/Pages/Services';
import Layout from './App/Components/Pages/Layout';
import RequiredAuth from './App/Components/Pages/ProtectedRoutes/RequiredAuth';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1e88e5',
    },
    secondary: {
      main: '#e53935',
    },
    textLight:{
      main: '#cccccc',
    },
    textDark:{
      main: '#333333',
    },
    errorBackground:{
      main: '#ff0000',
    },
  }
});
function App() {
    return (
      <ThemeProvider theme = {theme}>
        <NavBar />
        <div className="container">
          <Routes>
            <Route path= "/" element={<Layout />}>
              <Route exact path="about" element={<About />} />
              <Route exact path="contact" element={<Contact />} />
              <Route exact path="services" element={<Services />} />
              <Route exact path="login" element={<Login />} />
              <Route exact path="register" element={<Register />} />              
              <Route path="*" element={<NotFound />}/>
                            
              <Route element={<RequiredAuth allowedRoles = {["Admin", "Manager", "Regular"]}/>}>
                  <Route exact path="AdminView" element={<AdminView />} />
              </Route>
              <Route element={<RequiredAuth allowedRoles = {["Manager", "Regular"]}/>}>
                <Route exact path="ManagerView" element={<ManagerView />} />
              </Route>
              <Route element={<RequiredAuth allowedRoles = {["Regular"]}/>}>
                <Route exact path="userView" element={<UserView />} />
              </Route>

            </Route>
            
          </Routes>
        </div>       
      </ThemeProvider>    
  )  
}

export default App

