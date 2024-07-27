import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Details() {

    const [student, setStudent] = useState({})
    const id = localStorage.getItem("studentId")
    const role = localStorage.getItem("role")
    useEffect(async () => {
        if (role === 'principle') {
            const response = await axios.get("http://localhost:4000/principle/detail", {
                headers: {
                    id: id,
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
                .catch(err => {
                    console.log(err.response)
                })
            // console.log(response.data.data)
            setStudent(response.data.data)
        } else if (role === 'admin') {
            const response = await axios.get("http://localhost:4000/admin/detail", {
                headers: {
                    id: id,
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
                .catch(err => {
                    console.log(err.response)
                })
            // console.log(response.data.data)
            setStudent(response.data.data)
        }
    }, [])
    return (
        <div>Details</div>
    )
}

export default Details