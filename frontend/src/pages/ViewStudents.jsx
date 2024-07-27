import axios from 'axios';
import React, { useEffect, useState } from 'react';

// Sample data
const stu = [
    { id: 1, name: 's1', year: '2nd', section: 'A' },
    { id: 2, name: 's2', year: '3rd', section: 'B' },
    { id: 3, name: 's3', year: '1st', section: 'C' },
];

const StudentTable = () => {
    const [studentDetails, setStudentDetails] = useState({})

    useEffect(async () => {
        const data = await axios.get('http://localhost:4000/admin/viewStudent', {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                console.log(res.data.data)
                setStudentDetails(res.data.data)
            })
            .catch(err => {
                console.log(err.response)
            })
    }, [])
    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Student Details</h1>
            <table style={styles.table}>
                <thead>
                    <tr>
                        {['ID', 'Name', 'Year', 'Section', 'Actions'].map((header) => (
                            <th style={styles.th} key={header}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {

                        Object.keys(studentDetails).map((index) => (
                            <tr key={studentDetails[index].regNo} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                                <td style={styles.td}>{studentDetails[index].regNo}</td>
                                <td style={styles.td}>{studentDetails[index].name}</td>
                                <td style={styles.td}>{studentDetails[index].currYear}</td>
                                <td style={styles.td}>{studentDetails[index].currSection}</td>
                                <td style={styles.td1} colSpan={2}>
                                    <button style={styles.button}>view History</button>
                                    {/* <button style={styles.button}>view Details</button> */}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        margin: '20px auto',
        maxWidth: '900px',
        backgroundColor: '#ffffff',
        border: '1px solid #ddd',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    heading: {
        fontSize: '28px',
        marginBottom: '20px',
        color: '#333',
        textAlign: 'center',
        fontFamily: "'Roboto', sans-serif"
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px'
    },
    th: {
        border: '1px solid #ddd',
        padding: '12px',
        textAlign: 'left',
        backgroundImage: 'linear-gradient(to right, #0066cc, #0099ff)',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: '16px',
        position: 'sticky',
        top: '0',
        zIndex: '1'
    },
    td: {
        border: '1px solid #ddd',
        padding: '12px',
        textAlign: 'left',
        color: '#555',
        fontSize: '14px',
        transition: 'background-color 0.3s'
    },
    td: {
        border: '1px solid #ddd',
        padding: '12px',
        textAlign: 'left',
        color: '#555',
        fontSize: '14px',
        transition: 'background-color 0.3s'

    },
    evenRow: {
        backgroundColor: '#f9f9f9',
        transition: 'background-color 0.3s',
    },
    oddRow: {
        backgroundColor: '#ffffff',
        transition: 'background-color 0.3s',
    },
    rowHover: {
        cursor: 'pointer',
        ':hover': {
            backgroundColor: '#e9ecef'
        }
    },
    button: {
        padding: '8px 12px',
        border: 'none',
        backgroundColor: '#0066cc',
        color: '#fff',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        // marginLeft: '5pt'
    },
};

export default StudentTable;
