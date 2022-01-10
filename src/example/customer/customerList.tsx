import React from 'react'
import './index.css'
const Index = (props) => {
    const {customers} = props
    return (
        <>
        {customers.map((i) => {
            return (<div key={i.id} className='list-item'>
                <span>{i.username}</span>
                <span>{i.phone}</span>
            </div>)
        })}
        </>
    )
};
export default Index
