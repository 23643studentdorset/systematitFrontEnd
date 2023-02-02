import React from 'react'

function Item({ data, color }) {
    return (
        <div className="item" style={{borderTop: `4px solid ${color}` }}>
            {data}
        </div>
    )
}

export default Item;