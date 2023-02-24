import { useLocation, Outlet, Navigate } from "react-router-dom";
import useAuth from '../../../../hooks/useAuth';
import jwt_decode from "jwt-decode";

const RequiredAuth = ({allowedRoles}) => {
    const {auth} = useAuth();
    const location = useLocation();

    const decoded = jwt_decode(auth.accessToken)                
    const roles = []
    roles.push(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"])
    /*
    console.log("Roles:" + roles)
    console.log("allowedRoles:" + allowedRoles)
    const checkRoles = roles?.find(role => role === allowedRoles)
    console.log("checkRoles:" + checkRoles)
    */
    return (
        //&& roles?.find(role => allowedRoles?.includes(role))
        auth?.accessToken
        ? <Outlet/> 
        : <Navigate to ="/login" state={{from: location}} replace/>
    )
};

export default RequiredAuth;



  
        