import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import axios from "../../Api/axios"
import jwt_decode from "jwt-decode";
import Column from './KanbanBoard/Column';

export default function Kanban() {
    const [tasks, setTasks] = useState([]);
    const { auth } = useAuth();
    let userId
    auth ? userId = jwt_decode(auth.accessToken).UserId : userId = null




    useEffect(() => {
        let isMountet = true
        const controller = new AbortController();

        const getTaskFromUser = async () => {
            try {
                /*
                const response = await axiosPrivate.get("/api/User", {
                    signal: controller.signal
                });
                */
                //console.log(auth)

                const response = await axios.get(`/api/Kanban/UserId?userId=${userId}`, {
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'https://localhost:3000',
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                })
                //console.log(response?.data)
                isMountet && setTasks(response?.data)
                console.log(tasks)
            } catch (err) {
                console.log(err)
            }
        }
        getTaskFromUser();
        return () => {
            isMountet = false
            controller.abort()
        }
    }, [])

    const mockData = [
        {
            title: 'To Do',
            tasks: ['Task 1', 'Task 2', 'Task 3', 'Task 4'],
            color: 'orange',
            input: '',
        },
        {
            title: 'In progress',
            tasks: ['Task 5', 'Task 6'],
            color: 'purple',
            input: '',
        },
        {
            title: 'Done',
            tasks: ['Task 7', 'Task 8', 'Task 9'],
            color: 'green',
            input: '',
        },
        {
            title: 'Cancelled',
            tasks: ['Task 7', 'Task 8', 'Task 9'],
            color: 'green',
            input: '',
        },
        {
            title: 'Blocked',
            tasks: ['Task 7', 'Task 8', 'Task 9'],
            color: 'green',
            input: '',
        }

    ]

    const getColumnSection = () => (
        <div className="columns">
            <Column
                itemList={mockData[0].tasks}
                colTitle={mockData[0].title}
                color={mockData[0].color}
            />
            <Column
                itemList={mockData[1].tasks}
                colTitle={mockData[1].title}
                color={mockData[1].color}
            />
            <Column
                itemList={mockData[2].tasks}
                colTitle={mockData[2].title}
                color={mockData[2].color}
            />
             <Column
                itemList={mockData[3].tasks}
                colTitle={mockData[3].title}
                color={mockData[3].color}
            />
             <Column
                itemList={mockData[3].tasks}
                colTitle={mockData[3].title}
                color={mockData[3].color}
            />
        </div>
    );
    return (
        <>
            <h1>Kanban Board</h1>
            {getColumnSection()}
        </>
    )
};