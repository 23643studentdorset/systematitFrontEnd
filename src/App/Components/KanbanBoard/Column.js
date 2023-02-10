import React from 'react'
import Item from './Item'

export default function Column({ tasksList, colTitle, color, updateItem}) {

    return (
        <div className="column">
            <header className="columnHeading">
                <h3>
                    {colTitle}
                </h3>
            </header>
            <div>
                {
                    tasksList.map((i, index) => (
                        <Item
                            key={index}
                            task={i}
                            color={color}
                            updateItem={updateItem}                          
                        />
                    ))
                }
            </div>
        </div>
    )
}

