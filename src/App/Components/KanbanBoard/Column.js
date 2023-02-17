import React, { useEffect, useState } from 'react'
import Item from './Item'
import axios from "../../../Api/axios"
import useAuth from '../../../hooks/useAuth';
import jwt_decode from "jwt-decode";

export default function Column({colTitle, color, updateItem, taskChanged}) {
    const [tasks, setTasks] = useState([]);
    const { auth } = useAuth();
    const status = colTitle.replace(/\s+/g, '')
    const [updateColumn, setUpdateColumn] = useState(false)
    let userId
    auth ? userId = jwt_decode(auth.accessToken).UserId : userId = null

    useEffect(() => {
        let isMountet = true
        const controller = new AbortController();

        const getTaskFromUser = async () => {
            try {
                const response = await axios.get(`/api/Kanban/UserId?userId=${userId}&status=${status}`, {
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'https://localhost:3000',
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                })
                console.log(response?.data)
                isMountet && setTasks(response?.data)
                updateItem(false)
                setUpdateColumn(false)
            } catch (err) {
                console.log(err)
            }
        }
        getTaskFromUser();
        return () => {
            isMountet = false
            controller.abort()
        }
    }, [taskChanged, updateColumn])

   

    const renderColumn = (newColumn, oldColumn) => {
        //console.log("newColumn: " + newColumn)
        //console.log("oldColumn: " + oldColumn)
        //console.log("status: " + status)
        if (newColumn === status || oldColumn === status) {
            console.log("updateColumn")
            updateItem(true)
        }
    }

    return (
        <div className="column">
            <header className="columnHeading">
                <h3>
                    {colTitle}
                </h3>
            </header>
            <div>
                {
                    tasks.map((i, index) => (
                        <Item
                            key={index}
                            task={i}
                            color={color}
                            renderColumn={renderColumn}                      
                        />
                    ))
                }
            </div>
        </div>
    )
}

