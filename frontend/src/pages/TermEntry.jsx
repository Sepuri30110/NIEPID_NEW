import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image from './th.jpeg';
import axios from 'axios';

const Front = () => {
    const navigate = useNavigate();

    const id = localStorage.getItem("studentId");
    const year = localStorage.getItem("year");
    const section = localStorage.getItem("section");

    const [oldComments, setOldComments] = useState(["", "", "", "", "", ""]);
    const [comments, setComments] = useState(["", "", "", "", "", ""]);
    const [terms, setTerms] = useState([]);

    const [evaluationComplete, setEvaluationComplete] = useState(false);

    const navigateTo = (path) => {
        navigate(path);
    };

    const Header = () => (
        <header style={styles.header}>
            <div style={styles.logo}>
                <img src={image} alt="Logo" style={styles.logoImage} />
                <span style={styles.logoLabel}>NIEPID</span>
            </div>
            <nav style={styles.navLinks}>
                <button onClick={() => navigateTo('/teacher/term')} style={styles.backButton}>
                    Back
                </button>
            </nav>
        </header>
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:4000/teacher/getStudentbyId", {
                    headers: {
                        id: id,
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = res.data;
                // console.log(res)
                const sectionData = data.section.find(s => s.sec === section);
                const yearData = sectionData.yearReport.find(y => y.year === year);

                if (yearData.termReport.length == 4)
                    if (yearData.termReport[3].evaluated.personal)
                        if (yearData.termReport[3].evaluated.social)
                            if (yearData.termReport[3].evaluated.academic)
                                if (yearData.termReport[3].evaluated.occupational)
                                    if (yearData.termReport[3].evaluated.recreational)
                                        setEvaluationComplete(true);


                // yearData.termReport.forEach(term => {
                //     if (term.comment.termComment.trim() !== "") {
                //         const newOldComments = [...oldComments];
                //         newOldComments[term.term - 1] = term.comment.termComment;
                //         setOldComments(newOldComments);
                //     }
                // });

                let index = 0
                yearData.termReport.map(year => {
                    if (year.comment.termComment.trim() !== "") {
                        const newOldComments = [...oldComments];
                        newOldComments[index] = year.comment.termComment;
                        setOldComments(newOldComments)
                    }
                })

                // console.log(yearData.termReport.length)

                const t = []
                yearData.termReport.map(term => {
                    t.push(term.term)
                })
                console.log(t)
                setTerms(t)
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [id, section, year]);

    const saveTerm = (val) => {
        localStorage.setItem("term", val)
    }

    const handleSubmit = async () => {
        try {
            await axios.post("http://localhost:4000/teacher/yearTypeComment", {
                id: id,
                section: section,
                year: year,
                comments: comments
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then(res => {
                    console.log(res.data)
                })
        } catch (err) {
            console.log(err.response);
        }
    };

    const handleCommentsChange = (index) => (event) => {
        const newComments = [...comments];
        newComments[index] = event.target.value;
        setComments(newComments);
    };

    return (
        <div style={styles.pageContainer}>
            <Header />

            <main style={styles.main}>
                <h1 style={styles.heading}>Functional Assessment Checklist for Programming</h1>
                <h1 style={styles.subHeading}>{section.toUpperCase()} -- Year {year}</h1>
                <div style={styles.buttonContainer}>
                    {
                        terms.map(term => (
                            <button key={term} onClick={() => {
                                localStorage.setItem("term", term)
                                navigate('/teacher/eval')
                            }} style={styles.termButton}>Term{term}</button>
                        ))
                    }
                </div>
            </main>

            <label>Enter your comments for year</label>
            <textarea
                name="comments1"
                value={comments[0]}
                onChange={handleCommentsChange(0)}
                style={styles.textArea}
                placeholder={oldComments[0] || "Enter your comments for year"}
                disabled={!evaluationComplete}
            />

            <label>Enter your comments for personal</label>
            <textarea
                name="comments2"
                value={comments[1]}
                onChange={handleCommentsChange(1)}
                style={styles.textArea}
                placeholder={oldComments[1] || "Enter your comments for personal"}
                disabled={!evaluationComplete}
            />

            <label>Enter your comments for occupational</label>
            <textarea
                name="comments3"
                value={comments[2]}
                onChange={handleCommentsChange(2)}
                style={styles.textArea}
                placeholder={oldComments[2] || "Enter your comments for occupational"}
                disabled={!evaluationComplete}
            />

            <label>Enter your comments for academic</label>
            <textarea
                name="comments4"
                value={comments[3]}
                onChange={handleCommentsChange(3)}
                style={styles.textArea}
                placeholder={oldComments[3] || "Enter your comments for academic"}
                disabled={!evaluationComplete}
            />

            <label>Enter your comments for social</label>
            <textarea
                name="comments5"
                value={comments[4]}
                onChange={handleCommentsChange(4)}
                style={styles.textArea}
                placeholder={oldComments[4] || "Enter your comments for social"}
                disabled={!evaluationComplete}
            />

            <label>Enter your comments for recreational</label>
            <textarea
                name="comments6"
                value={comments[5]}
                onChange={handleCommentsChange(5)}
                style={styles.textArea}
                placeholder={oldComments[5] || "Enter your comments for recreational"}
                disabled={!evaluationComplete}
            />

            <button id="submit" style={styles.submitButton} onClick={handleSubmit} disabled={!evaluationComplete}>
                Submit
            </button>

            <footer style={styles.footer}>
                <p style={styles.footerText}>&copy; 2024 Functional Assessment. All rights reserved.</p>
            </footer>
        </div>
    );
};

const styles = {
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f0f0',
        color: '#333',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#007bff',
        color: '#ffffff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
    },
    logoImage: {
        width: '40px',
        height: '40px',
        marginRight: '0.5rem',
    },
    logoLabel: {
        fontSize: '1.5rem',
    },
    main: {
        flex: '1',
        padding: '2rem',
        textAlign: 'center',
    },
    termButton: {
        padding: '0.8rem 1.5rem',
        fontSize: '1rem',
        backgroundColor: '#007bff',
        color: '#ffffff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    heading: {
        fontSize: '28px',
        margin: '0',
        marginBottom: '1rem',
    },
    subHeading: {
        fontSize: '18px',
        margin: '0',
        marginBottom: '1rem',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
    },
    button: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '4px',
        transition: 'background-color 0.3s ease',
    },
    submitButton: {
        padding: '12px 25px',
        marginBottom: '10px',
        alignSelf: 'center',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'background-color 0.3s ease, transform 0.3s ease',
        '&:hover': {
            backgroundColor: '#0056b3',
            transform: 'translateY(-3px)',
        },
        '&:active': {
            transform: 'translateY(1px)',
        },
        '&:disabled': {
            backgroundColor: '#cccccc',
            cursor: 'not-allowed',
        },
    },
    textArea: {
        width: '80%',
        height: '100px',
        margin: '10px auto',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ddd',
    },
    footer: {
        textAlign: 'center',
        padding: '1rem',
        backgroundColor: '#007bff',
        color: 'white',
    },
    footerText: {
        margin: '0',
    },
};

export default Front;