import React from 'react'
import './index.css'
const Index = (props) => {
    const {customers} = props

    return (
        <>
        {customers.map((i) => {
            return (<div className='list-item'>
                <span>{i.name}</span>
                <span>{i.phone}</span>
            </div>)
        })}
        </>
    )
};
export default Index
