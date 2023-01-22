import NavBarNotLogedIn from './App/Components/NavBars/NavBarNotLogedIn';
import About from './App/Components/Pages/About';
import Contact from './App/Components/Pages/Contact';
import Home from './App/Components/Pages/Home';
import {Route, Routes} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import ProtectedRoutes from './App/Components/Pages/ProtectedRoutes/ProtectedRoutes';
import UserView from './App/Components/Pages/ProtectedRoutes/UserView';
import NotFound from './App/errors/NotFound';
import Login from './App/Components/Login/Login';
import Register from './App/Components/Register/Register'
import Services from './App/Components/Pages/Services';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1e88e5',
    },
    secondary: {
      main: '#e53935',
    },
    textLight:{
      main: '#CCCCCC',
    },
    textDark:{
      main: '#333333',
    }
  },
});
function App() {
    return (
      <ThemeProvider theme ={theme}>
        <NavBarNotLogedIn />
        <div className="container">
          <Routes>
            <Route exact path ="/" element={<Home />}/>
            <Route exact path="/about" element={<About />} />
            <Route exact path="/contact" element={<Contact />} />
            <Route exact path="/services" element={<Services />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />}/>
            <Route element={<ProtectedRoutes />}>
              <Route exact path="/userview" element={<UserView />} />
            </Route>
          </Routes>
        </div>       
      </ThemeProvider>    
  )  
}

export default App

