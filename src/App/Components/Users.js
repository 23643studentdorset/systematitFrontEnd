import { useState, useEffect } from "react"
//import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import axios from "../../Api/axios"
import useAuth from "../../hooks/useAuth"
import jwt_decode from "jwt-decode";

const Users = () => {
    const [users, setUsers] = useState([])
    //const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    useEffect(() => {
        let isMountet = true
        const controller = new AbortController();

        const getUsers = async () =>{
            try {
                /*
                const response = await axiosPrivate.get("/api/User", {
                    signal: controller.signal
                });
                */
                //console.log(auth)

                const response = await axios.get("/api/User", {
                    signal:controller.signal,
                    headers:{
                        'Content-Type': 'application/json', 
                        'Access-Control-Allow-Origin':'https://localhost:3000',
                        'Authorization' : `Bearer ${auth.accessToken}`
                    }
                })
                const decoded = jwt_decode(auth.accessToken)                
                console.log(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"])
                console.log(response?.data)
                isMountet && setUsers(response?.data)
            } catch (err) {
                console.log(err)
            }
        }
        getUsers();
        return () => {
            isMountet = false
            controller.abort()
        }
    }, [])
    return (
        <article>
            <h2>Users List</h2>
            {users?.length ? (
                <ul>
                    {users.map((users, i) => <li key={i}>{users?.
                    firstName}</li>)}
                </ul>
            ) : <p>No users to display</p>
            }
        </article>
    )
}

export default Users