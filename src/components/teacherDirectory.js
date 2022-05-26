import {addDoc, writeBatch, deleteDoc, collection, doc, getDocs, query, where} from 'firebase/firestore'
import { db, firebaseConfig } from './firebaseSetup'
import { useState, useEffect, useRef} from "react"
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(first, last, birth, gender, grade) {
  return { first, last, birth, gender, grade };
}

function TeacherDirectory() {
    const [info, setInfo] = useState([])
    const birthFieldRef = useRef(null);
    const firstFieldRef = useRef(null);
    const lastFieldRef = useRef(null);
    const genderFieldRef = useRef(null);
    const gradeFieldRef = useRef(null);
    const [teacherID, setTeacherID]=useState();
    const [rows, setRows]=useState([]);

    const Data=(props) => {
        return (
            <div className='teacherDirectory'>
            
                <td>{props.property}</td>
                
            </div>
        )
    }

    useEffect(() => {
        const info = []
        getDocs(collection(db, "Teacher"))
        .then((allInfo) => {
            allInfo.forEach((doc) =>
                info.push({...doc.data()})
            )
        setInfo(info)
        createRows(info);
      })
    }, [db])

    const createRows = (info)=>{
      console.log("info2: "+info);
      let array=[];
      info.map((student)=>{
        console.log("attempt: "+student.first);
        array.push(createData(student.first, student.last, student.birth, student.gender, student.grade));
      })
      setRows(array);
      console.log("ARRAY: "+array);
    //   [
    //   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    //   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    //   createData('Eclair', 262, 16.0, 24, 6.0),
    //   createData('Cupcake', 305, 3.7, 67, 4.3),
    //   createData('Gingerbread', 356, 16.0, 49, 3.9),
    // ]
  }

    const addTeacher = (e) => {
        e.preventDefault();

        const newTeacher = {
            birth: birthFieldRef.current.value,
            first: firstFieldRef.current.value,
            last: lastFieldRef.current.value,
            gender: genderFieldRef.current.value,
            grade: gradeFieldRef.current.value,

        } 
        console.log(newTeacher)
        addDoc(collection(db, "Teacher"), newTeacher)
        .then((docRef) =>{
            setInfo([...info, {id:docRef.id, ...newTeacher}])
        })
        .catch((e) => console.error(e))

        birthFieldRef.current.value = ""
        firstFieldRef.current.value = ""
        lastFieldRef.current.value = ""
        genderFieldRef.current.value = ""
        gradeFieldRef.current.value = ""
    }
    
    const deleteTeacher = async (e, teacher) => {
        e.preventDefault();
        const teacherRef = collection(db, "Teacher");
        const q = query(teacherRef, where("last", "==", teacher.last));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            doc.data();
            setTeacherID(doc.id);
        });
        deleteDoc(doc(db, "Teacher", teacherID))
    }

    return (
      <div>
        <h2>Teacher Directory</h2>
        <form onSubmit={addTeacher} >
            <p>
                <label>Birthdate </label>
                <input type="date" ref={birthFieldRef} required/>
            </p>     
            <p>
                <label>First Name </label>
                <input type="text" ref={firstFieldRef} required/>
            </p>
            <p>
                <label>Last Name </label>
                <input type="text" ref={lastFieldRef} required/>
            </p>
            <p>
                <label>Gender </label>
                <select ref={genderFieldRef} required>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
            </p>
            <p>
                <label>Grade Taught </label>
                <select ref={gradeFieldRef} required>
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="3rd">3rd</option>
                  <option value="4th">4th</option>
                  <option value="5th">5th</option>
                  <option value="6th">6th</option>
                </select>
            </p>
                <input type="submit"/>
        </form>
        <div text-align = 'center'>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow className="header">
                <TableCell>
                    First
                </TableCell>
                <TableCell align="right">Last</TableCell>
                <TableCell align="right">Birthday</TableCell>
                <TableCell align="right">Gender</TableCell>
                <TableCell align="right">Grade Taught</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.first}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.first}
                  </TableCell>
                  <TableCell align="right">{row.last}</TableCell>
                  <TableCell align="right">{row.birth}</TableCell>
                  <TableCell align="right">{row.gender}</TableCell>
                  <TableCell align="right">{row.grade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </div>
      </div>
    );
}

export default TeacherDirectory