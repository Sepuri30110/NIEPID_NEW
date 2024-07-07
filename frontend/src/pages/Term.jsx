import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image from './th.jpeg';
import axios from 'axios';
import Box from '@mui/material/Box';
import { styled, alpha } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

const Term = () => {
  const navigate = useNavigate();
  // let student;
  const [sections, setSections] = useState([])
  const [years, setYears] = useState([])
  const [terms, setTerms] = useState([])

  useEffect(async () => {
    localStorage.removeItem("term");
    localStorage.removeItem("year");
    localStorage.removeItem("section");
    const id = localStorage.getItem("studentId")
    await axios.get("http://localhost:4000/teacher/getStudentbyId", {
      headers: {
        id: id,
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    }, { withCredentials: true })
      .then(res => {
        const student = res.data
        localStorage.setItem("currTerm",student.currTerm)
        localStorage.setItem("currYear",student.currYear)
        localStorage.setItem("currSection",student.currSection)
        if (student.section.length == 1) {
          const sec = ['preprimary']
          setSections(sec)
        }
        else if (student.section.length == 2) {
          // console.log("2")
          const sec = ['preprimary', 'primary']
          setSections(sec)
        }
        else {
          sections = []
        }
        // console.log(sections)

      })
      .catch(err => {
        console.log("Errrrrrrr", err.response)
      })

  }, []);

  const handleNavigate = (term) => {
    localStorage.setItem("term", term);
    navigate('/teacher/eval');
  };

  const handleSection = async (section) => {
    console.log(section)
    setYears([])
    localStorage.setItem("section", section)
    const id = localStorage.getItem("studentId")
    await axios.get("http://localhost:4000/teacher/getStudentbyId", {
      headers: {
        id: id,
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    }, { withCredentials: true })
      .then(res => {
        console.log(res)
        let i;
        let y = [];
        const data = res.data
        for (let index = 0; index < data.section.length; index++) {
          if (data.section[index].sec === section) {
            i = index;
            break
          }
        }
        if (data.section[i].yearReport.length == 1)
          y = ['1']
        else if (data.section[i].yearReport.length == 2)
          y = ['1', '2']
        else if (data.section[i].yearReport.length == 3)
          y = ['1', '2', '3']
        else {
          y = []
        }
        setYears(y)
        console.log(sections)

      })
      .catch(err => {
        console.log("Errrrrrrr", err.response)
      })
  }

  const handleYear = async (year) => {
    setTerms([])
    localStorage.setItem("year", year)
    const id = localStorage.getItem("studentId")
    await axios.get("http://localhost:4000/teacher/getStudentbyId", {
      headers: {
        id: id,
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    }, { withCredentials: true })
      .then(res => {
        const section = localStorage.getItem("section")
        const data = res.data
        let i, j;
        let t = [];
        for (let index = 0; index < data.section.length; index++) {
          if (data.section[index].sec == section) {
            i = index;
            break
          }
        }

        for (let index = 0; index < data.section[i].yearReport.length; index++) {
          if (data.section[i].yearReport[index].year == year) {
            j = index;
            break
          }
        }

        if (data.section[i].yearReport[j].termReport.length == 1)
          t = ['Entry']
        else if (data.section[i].yearReport[j].termReport.length == 2)
          t = ['Entry', 'I']
        else if (data.section[i].yearReport[j].termReport.length == 3)
          t = ['Entry', 'I', 'II']
        else if (data.section[i].yearReport[j].termReport.length == 4)
          t = ['Entry', 'I', 'II', 'III']
        else {
          t = []
        }
        setTerms(t)

      })
    // .catch(err => {
    //   console.log("Errrrrrrr", err.response)
    // })

  }

  // const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  //   color:
  //     theme.palette.mode === 'light'
  //       ? theme.palette.grey[800]
  //       : theme.palette.grey[200],

  //   [`& .${treeItemClasses.content}`]: {
  //     borderRadius: theme.spacing(0.5),
  //     padding: theme.spacing(0.5, 1),
  //     margin: theme.spacing(0.2, 0),
  //     [`& .${treeItemClasses.label}`]: {
  //       fontSize: '0.8rem',
  //       fontWeight: 500,
  //     },
  //   },
  //   [`& .${treeItemClasses.iconContainer}`]: {
  //     borderRadius: '50%',
  //     backgroundColor:
  //       theme.palette.mode === 'light'
  //         ? alpha(theme.palette.primary.main, 0.25)
  //         : theme.palette.primary.dark,
  //     color: theme.palette.mode === 'dark' && theme.palette.primary.contrastText,
  //     padding: theme.spacing(0, 1.2),
  //   },
  //   [`& .${treeItemClasses.groupTransition}`]: {
  //     marginLeft: 15,
  //     paddingLeft: 18,
  //     borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  //   },
  // }));

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <img src={image} alt="Logo" style={styles.logoImage} />
          <span style={styles.logoLabel}>NIEPID</span>
        </div>
        <button
          onClick={() => navigate('/teacher')}
          style={styles.button}
        >
          Back
        </button>
      </header>

      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Terms</h1>
      </div>

      <div style={styles.buttonContainerBox}>
        <div style={styles.buttonContainer}>
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => { handleSection(section) }}
              style={styles.termButton}
            >
              {section}
            </button>
          ))}
        </div>

        <div style={styles.buttonContainer}>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => { handleYear(year) }}
              style={styles.termButton}
            >
              Year {year}
            </button>
          ))}
        </div>

        <div style={styles.buttonContainer}>
          {terms.map((term) => (
            <button
              key={term}
              onClick={() => handleNavigate(term)}
              style={styles.termButton}
            >
              Term {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // return (
  //   <Box sx={{ minHeight: 352, minWidth: 250 }}>
  //     <SimpleTreeView defaultExpandedItems={['grid']}>
  //       {
  //         sections.map((sec) => {
  //           return (
  //             <CustomTreeItem itemId="grid" label={sec} >
  //               {
  //                 years.map((year)=>{
  //                   return(
  //                     <CustomTreeItem itemId="grid" label={year}>
  //                     </CustomTreeItem>
  //                   )
  //                 })
  //               }
  //               <CustomTreeItem itemId="grid-community" label="@mui/x-data-grid" />
  //               <CustomTreeItem itemId="grid-pro" label="@mui/x-data-grid-pro" />
  //               <CustomTreeItem itemId="grid-premium" label="@mui/x-data-grid-premium" />
  //             </CustomTreeItem>
  //           )
  //         })
  //       }
  //     </SimpleTreeView>
  //   </Box>
  // );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f0f8ff',
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
  button: {
    padding: '0.8rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    // padding: '2rem',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '3rem',
    color: '#333333',
    marginBottom: '1rem',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '5rem',
    padding: '2rem',
  },
  buttonContainerBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: '5rem',
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
};

export default Term;