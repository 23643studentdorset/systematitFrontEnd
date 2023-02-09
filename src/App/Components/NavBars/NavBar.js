import { useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import NavBarLogedIn from "./NavBarLogedIn";
import NavBarNotLogedIn from "./NavBarNotLogedIn";

export default function NavBar() {
    const { auth } = useAuth();

    useEffect(() => {
        //console.log("auth changed", auth);
    }, [auth]);

    return (
        <>
            
            {Object.keys(auth).length === 0 ? <NavBarNotLogedIn /> : <NavBarLogedIn />}
        </>
    );
}