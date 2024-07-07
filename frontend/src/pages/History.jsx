import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import image from './th.jpeg';
import axios from 'axios';



const styles = {
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#007bff",
        color: "#ffffff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    logo: {
        display: "flex",
        alignItems: "center",
    },
    logoImage: {
        width: "40px",
        height: "40px",
        marginRight: "10px",
    },
    logoLabel: {
        fontSize: "1.5rem",
        fontWeight: "bold",
    },
    navLinks: {
        display: "flex",
        alignItems: "center",
    },
    button: {
        padding: "10px 15px",
        backgroundColor: "#ffffff",
        color: "#007bff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    footer: {
        textAlign: "center",
        padding: "1rem",
        backgroundColor: "#007bff",
        color: "#ffffff",
    },
};

const Header = () => (
    <header style={styles.header}>
        <div style={styles.logo}>
            <img src={image} alt="Logo" style={styles.logoImage} />
            <span style={styles.logoLabel}>NIEPID</span>
        </div>
    </header>
);

const Footer = () => (
    <footer style={styles.footer}>&copy; 2024 Student History Portal</footer>
);

const StudentReport = ({ data }) => {
    const [selectedYear, setSelectedYear] = useState(data.yearReport[0].year);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedComments, setUpdatedComments] = useState({
        yearComment: '',
        yearPersonalComment: '',
        yearOccupationalComment: '',
        yearRecreationalComment: '',
        yearAcademicComment: '',
        yearSocialComment: ''
    });

    const handleYearChange = (e) => {
        if (e.target.textContent.length > 4) {
            return;
        }
        const year = e.target.textContent
        setSelectedYear(year);
        setIsEditing(false);
    };

    const getYearData = (year) => {
        return data.yearReport.find((yr) => yr.year === year);
    };

    const selectedYearData = getYearData(selectedYear);

    const calculateAverages = () => {
        const topics = ['personalPercent', 'academicPercent', 'occupationalPercent', 'recreationalPercent', 'socialPercent'];
        const averages = topics.reduce((acc, topic) => {
            acc[topic] = selectedYearData.termReport.reduce((sum, term) => sum + term.report[topic], 0) / selectedYearData.termReport.length;
            return acc;
        }, {});
        return averages;
    };

    const averages = calculateAverages();

    const chartData = {
        labels: ['Personal', 'Academic', 'Occupational', 'Recreational', 'Social'],
        datasets: [
            {
                label: 'Term 1',
                data: [
                    selectedYearData.termReport[0].report.personalPercent,
                    selectedYearData.termReport[0].report.academicPercent,
                    selectedYearData.termReport[0].report.occupationalPercent,
                    selectedYearData.termReport[0].report.recreationalPercent,
                    selectedYearData.termReport[0].report.socialPercent,
                ],
                backgroundColor: '#87ceeb',
                barPercentage: 1,
                categoryPercentage: 0.5,
            },
            {
                label: 'Term 2',
                data: [
                    selectedYearData.termReport[1].report.personalPercent,
                    selectedYearData.termReport[1].report.academicPercent,
                    selectedYearData.termReport[1].report.occupationalPercent,
                    selectedYearData.termReport[1].report.recreationalPercent,
                    selectedYearData.termReport[1].report.socialPercent,
                ],
                backgroundColor: '#4682b4 ',
                barPercentage: 1,
                categoryPercentage: 0.5,
            },
            {
                label: 'Term 3',
                data: [
                    selectedYearData.termReport[2].report.personalPercent,
                    selectedYearData.termReport[2].report.academicPercent,
                    selectedYearData.termReport[2].report.occupationalPercent,
                    selectedYearData.termReport[2].report.recreationalPercent,
                    selectedYearData.termReport[2].report.socialPercent,
                ],
                backgroundColor: '#035096',
                barPercentage: 1,
                categoryPercentage: 0.5,
            },
            {
                label: 'Term 4',
                data: [
                    selectedYearData.termReport[3].report.personalPercent,
                    selectedYearData.termReport[3].report.academicPercent,
                    selectedYearData.termReport[3].report.occupationalPercent,
                    selectedYearData.termReport[3].report.recreationalPercent,
                    selectedYearData.termReport[3].report.socialPercent,
                ],
                backgroundColor: '#45b1e8 ',
                barPercentage: 1,
                categoryPercentage: 0.5,
            },
            {
                label: 'Average',
                data: [
                    averages.personalPercent,
                    averages.academicPercent,
                    averages.occupationalPercent,
                    averages.recreationalPercent,
                    averages.socialPercent,
                ],
                backgroundColor: '#000080',
                barPercentage: 0.5,
                categoryPercentage: 1,
            },
        ],
    };

    const options = {
        indexAxis: 'x',
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: selectedYear + ' Year Performance',
            },
        },
        scales: {
            x: {
                stacked: false,
                beginAtZero: true,
            },
            y: {
                stacked: false,
            },
        },
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setUpdatedComments({
            yearComment: selectedYearData.yearComment,
            yearPersonalComment: selectedYearData.yearPersonalComment,
            yearOccupationalComment: selectedYearData.yearOccupationalComment,
            yearRecreationalComment: selectedYearData.yearRecreationalComment,
            yearAcademicComment: selectedYearData.yearAcademicComment,
            yearSocialComment: selectedYearData.yearSocialComment,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedComments((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = () => {
        //update the data in the backend
        Object.assign(selectedYearData, updatedComments);
        setIsEditing(false);
    };

    return (
        <div style={{ margin: '0px', fontFamily: 'Arial, sans-serif' }}>
            <Header />
            <style>
                {`
                    .student-info, .year-selector {
                        margin-bottom: 20px;
                    }

                    .year-selector button {
                        margin-right: 10px;
                        padding: 5px 10px;
                        cursor: pointer;
                        background-color: #007BFF;
                        color: white;
                        border: none;
                        border-radius: 3px;
                    }

                    .year-selector button:hover {
                        background-color: #0056b3;
                    }

                    .chart-container {
                        margin-bottom: 50px;
                    }

                    .year-details, .term-details {
                        margin-bottom: 20px;
                    }

                    .term-details .term-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 10px;
                        background-color: #f0f0f0;
                        margin-bottom: 10px;
                        border-radius: 5px;
                    }

                    .term-details h3 {
                        margin-bottom: 10px;
                    }

                    .edit-form input {
                        display: block;
                        width: 100%;
                        margin-bottom: 10px;
                        padding: 8px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                    }

                    .edit-form button {
                        padding: 10px 15px;
                        cursor: pointer;
                        background-color: #28a745;
                        color: white;
                        border: none;
                        border-radius: 5px;
                    }
                `}
            </style>
            <h1>Student Report</h1>
            <div className="student-info">
                <p><strong>Reg No:</strong> {data.regNo}</p>
                <p><strong>Name:</strong> {data.name}</p>
                <p><strong>Current Year:</strong> {data.currYear}</p>
                <p><strong>Class ID:</strong> {data.classId}</p>
                <p><strong>Select the year to view the history:</strong></p>
            </div>
            <div className="year-selector">
                {data.yearReport.map((year) => (
                    <button key={year.year} onClick={(e) => handleYearChange(e)}>
                        {/* {year.year} */}
                        {year.termReport.length == 4 ? year.year : year.year + " is not completed"}
                        {/* {year.termReport.length == 4 ? console.log(year.termReport.length) : console.log(year.termReport.length)} */}
                    </button>
                ))}
            </div>
            <div className="chart-container">
                <Bar data={chartData} options={options} />
            </div>
            <div>
                <h3>Averages for {selectedYear} year</h3>
                <p><strong>Personal:</strong> {averages.personalPercent.toFixed(2)}%</p>
                <p><strong>Academic:</strong> {averages.academicPercent.toFixed(2)}%</p>
                <p><strong>Occupational:</strong> {averages.occupationalPercent.toFixed(2)}%</p>
                <p><strong>Recreational:</strong> {averages.recreationalPercent.toFixed(2)}%</p>
                <p><strong>Social:</strong> {averages.socialPercent.toFixed(2)}%</p>
            </div>
            <div className="year-details">
                <h2>{selectedYear} Report</h2>
                {isEditing ? (
                    <div className="edit-form">
                        <input
                            type="text"
                            name="yearComment"
                            value={updatedComments.yearComment}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="yearPersonalComment"
                            value={updatedComments.yearPersonalComment}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="yearOccupationalComment"
                            value={updatedComments.yearOccupationalComment}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="yearRecreationalComment"
                            value={updatedComments.yearRecreationalComment}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="yearAcademicComment"
                            value={updatedComments.yearAcademicComment}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="yearSocialComment"
                            value={updatedComments.yearSocialComment}
                            onChange={handleInputChange}
                        />
                        <button onClick={handleSaveClick}>Save</button>
                    </div>
                ) : (
                    <div>
                        <p><strong>Year Comment:</strong> {selectedYearData.yearComment}</p>
                        <p><strong>Personal Comment:</strong> {selectedYearData.yearPersonalComment}</p>
                        <p><strong>Occupational Comment:</strong> {selectedYearData.yearOccupationalComment}</p>
                        <p><strong>Recreational Comment:</strong> {selectedYearData.yearRecreationalComment}</p>
                        <p><strong>Academic Comment:</strong> {selectedYearData.yearAcademicComment}</p>
                        <p><strong>Social Comment:</strong> {selectedYearData.yearSocialComment}</p>
                        <button onClick={handleEditClick}>Edit</button>
                    </div>
                )}
            </div>
            <div className="term-details">
                {selectedYearData.termReport.map((term) => (
                    <div key={term.term}>
                        <h3>{term.term} Comments</h3>
                        <div className="term-row">
                            <p><strong>Term Comment:</strong> {term.termComment}</p>
                        </div>
                        <div className="term-row">
                            <p><strong>Personal Comment:</strong> {term.personalComment}</p>
                            <p><strong>Personal Percentage:</strong> {term.report.personalPercent}%</p>
                        </div>
                        <div className="term-row">
                            <p><strong>Occupational Comment:</strong> {term.occupationalComment}</p>
                            <p><strong>Occupational Percentage:</strong> {term.report.occupationalPercent}%</p>
                        </div>
                        <div className="term-row">
                            <p><strong>Recreational Comment:</strong> {term.recreationalComment}</p>
                            <p><strong>Recreational Percentage:</strong> {term.report.recreationalPercent}%</p>
                        </div>
                        <div className="term-row">
                            <p><strong>Academic Comment:</strong> {term.academicComment}</p>
                            <p><strong>Academic Percentage:</strong> {term.report.academicPercent}%</p>
                        </div>
                        <div className="term-row">
                            <p><strong>Social Comment:</strong> {term.socialComment}</p>
                            <p><strong>Social Percentage:</strong> {term.report.socialPercent}%</p>
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </div>

    );
};


const sampleData = {
    regNo: '12345',
    name: 'John Doe',
    currYear: '2',
    currTerm: 'I',
    classId: 'preprimary_3',
    yearReport: [
        {
            year: '3',
            yearComment: 'Good performance overall.',
            yearPersonalComment: 'Improved in self-management.',
            yearOccupationalComment: 'Excellent work in practical assignments.',
            yearRecreationalComment: 'Active participation in sports.',
            yearAcademicComment: 'Top grades in all subjects.',
            yearSocialComment: 'Well-behaved and cooperative.',
            termReport: [
                {
                    term: 'Term 1',
                    report: {
                        personalPercent: 85,
                        socialPercent: 90,
                        academicPercent: 95,
                        occupationalPercent: 80,
                        recreationalPercent: 70,
                        mode: 'A+',
                    },
                    termComment: 'Good start to the year.',
                    personalComment: 'Needs to be more organized.',
                    occupationalComment: 'Keep up the good work.',
                    recreationalComment: 'Participates well in activities.',
                    academicComment: 'Excellent results.',
                    socialComment: 'Very sociable.',
                },
                {
                    term: 'Term 2',
                    report: {
                        personalPercent: 88,
                        socialPercent: 85,
                        academicPercent: 92,
                        occupationalPercent: 78,
                        recreationalPercent: 75,
                        mode: 'A',
                        percent: 79,
                    },
                    termComment: 'Steady progress.',
                    personalComment: 'Shows improvement in organization.',
                    occupationalComment: 'Consistent performance.',
                    recreationalComment: 'Engaged in sports.',
                    academicComment: 'Very good results.',
                    socialComment: 'Friendly and cooperative.',
                },
                {
                    term: 'Term 3',
                    report: {
                        personalPercent: 90,
                        socialPercent: 88,
                        academicPercent: 94,
                        occupationalPercent: 82,
                        recreationalPercent: 78,
                        mode: 'A',
                        percent: '75',
                    },
                    termComment: 'Continues to excel.',
                    personalComment: 'Very well organized.',
                    occupationalComment: 'Great practical skills.',
                    recreationalComment: 'Active participation.',
                    academicComment: 'Excellent performance.',
                    socialComment: 'Very sociable.',
                },
                {
                    term: 'Term 4',
                    report: {
                        personalPercent: 92,
                        socialPercent: 90,
                        academicPercent: 96,
                        occupationalPercent: 85,
                        recreationalPercent: 80,
                        mode: 'A+',
                        percent: 90,
                    },
                    termComment: 'Outstanding performance.',
                    personalComment: 'Highly organized.',
                    occupationalComment: 'Top-notch skills.',
                    recreationalComment: 'Very active in sports.',
                    academicComment: 'Exceptional results.',
                    socialComment: 'Very friendly.',
                },
            ],
        },
        {
            year: '2',
            yearComment: 'Excellent performance throughout the year.',
            yearPersonalComment: 'Remarkable self-discipline.',
            yearOccupationalComment: 'Outstanding in practical tasks.',
            yearRecreationalComment: 'Highly involved in extracurricular activities.',
            yearAcademicComment: 'Consistently high grades.',
            yearSocialComment: 'Great team player.',
            termReport: [
                {
                    term: 'Term 1',
                    report: {
                        personalPercent: 87,
                        socialPercent: 92,
                        academicPercent: 93,
                        occupationalPercent: 81,
                        recreationalPercent: 75,
                        mode: 'A+',
                        percent: 90,
                    },
                    termComment: 'Strong start.',
                    personalComment: 'Very disciplined.',
                    occupationalComment: 'Excellent practical skills.',
                    recreationalComment: 'Participates actively.',
                    academicComment: 'High achievements.',
                    socialComment: 'Well-mannered.',
                },
                {
                    term: 'Term 2',
                    report: {
                        personalPercent: 89,
                        socialPercent: 90,
                        academicPercent: 94,
                        occupationalPercent: 83,
                        recreationalPercent: 78,
                        mode: 'C',
                        percent: 60,
                    },
                    termComment: 'Consistent performance.',
                    personalComment: 'Maintains discipline.',
                    occupationalComment: 'Keeps up the good work.',
                    recreationalComment: 'Actively participates.',
                    academicComment: 'High achievements.',
                    socialComment: 'Well-mannered.',
                },
                {
                    term: 'Term 3',
                    report: {
                        personalPercent: 91,
                        socialPercent: 88,
                        academicPercent: 96,
                        occupationalPercent: 85,
                        recreationalPercent: 80,
                        mode: 'A',
                        percent: 84,
                    },
                    termComment: 'Outstanding progress.',
                    personalComment: 'Highly organized.',
                    occupationalComment: 'Excellent practical skills.',
                    recreationalComment: 'Very involved.',
                    academicComment: 'Top results.',
                    socialComment: 'Good team player.',
                },
                {
                    term: 'Term 4',
                    report: {
                        personalPercent: 93,
                        socialPercent: 92,
                        academicPercent: 98,
                        occupationalPercent: 88,
                        recreationalPercent: 82,
                        mode: 'A+',
                        percent: 91,
                    },
                    termComment: 'Exceptional results.',
                    personalComment: 'Exceeds expectations.',
                    occupationalComment: 'Top practical skills.',
                    recreationalComment: 'Highly active.',
                    academicComment: 'Excellent results.',
                    socialComment: 'Very cooperative.',
                },
            ],
        },
        {
            year: '1',
            yearComment: 'Great academic year.',
            yearPersonalComment: 'Very well-mannered.',
            yearOccupationalComment: 'Good practical skills.',
            yearRecreationalComment: 'Active in sports and clubs.',
            yearAcademicComment: 'Achieved high grades.',
            yearSocialComment: 'Friendly and helpful.',
            termReport: [
                // {
                //   term: 'Term 1',
                //   report: {
                //     personalPercent: 86,
                //     socialPercent: 89,
                //     academicPercent: 91,
                //     occupationalPercent: 79,
                //     recreationalPercent: 72,
                //     mode: 'A',
                //     percent: 86,
                //   },
                //   termComment: 'Good start.',
                //   personalComment: 'Very organized.',
                //   occupationalComment: 'Good practical application.',
                //   recreationalComment: 'Participates in activities.',
                //   academicComment: 'Good results.',
                //   socialComment: 'Very sociable.',
                // },
                {
                    term: 'Term 2',
                    report: {
                        personalPercent: 88,
                        socialPercent: 87,
                        academicPercent: 93,
                        occupationalPercent: 80,
                        recreationalPercent: 74,
                        mode: 'B+',
                        percent: '72',
                    },
                    termComment: 'Consistent performance.',
                    personalComment: 'Keeps organized.',
                    occupationalComment: 'Good practical work.',
                    recreationalComment: 'Active in sports.',
                    academicComment: 'Very good results.',
                    socialComment: 'Friendly and helpful.',
                },
                {
                    term: 'Term 3',
                    report: {
                        personalPercent: 90,
                        socialPercent: 88,
                        academicPercent: 95,
                        occupationalPercent: 82,
                        recreationalPercent: 77,
                        mode: 'A+',
                        percent: 90,
                    },
                    termComment: 'Strong performance.',
                    personalComment: 'Very disciplined.',
                    occupationalComment: 'Shows great skills.',
                    recreationalComment: 'Highly active.',
                    academicComment: 'Excellent results.',
                    socialComment: 'Very cooperative.',
                },
                {
                    term: 'Term 4',
                    report: {
                        personalPercent: 92,
                        socialPercent: 90,
                        academicPercent: 97,
                        occupationalPercent: 85,
                        recreationalPercent: 80,
                        mode: 'A+',
                        percent: 89,
                    },
                    termComment: 'Exceptional performance.',
                    personalComment: 'Highly organized.',
                    occupationalComment: 'Top skills.',
                    recreationalComment: 'Very active.',
                    academicComment: 'Exceptional results.',
                    socialComment: 'Very friendly.',
                },
            ],
        },
    ],
};


const History = () => {
    const studentId = localStorage.getItem("studentId")

    useEffect(async () => {
        const data = await axios.get("http://localhost:4000/teacher/history", {
            headers: {
                id : studentId,
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        },{withCredentials:true})
        .then(res=>{
            console.log(res)
        })
        .catch(err=>{
            console.log(err)
        })
    })

    return <StudentReport data={sampleData} />;
};

export default History;