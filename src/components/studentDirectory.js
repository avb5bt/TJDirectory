import { MenuItem, TextField, Select, FormControl, InputLabel, Button} from '@mui/material';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {addDoc, writeBatch, deleteDoc, collection, doc, getDocs, query, where} from 'firebase/firestore'
import { db, firebaseConfig } from './firebaseSetup'
import { useState, useEffect, useRef} from "react"
import '../styling/directory.css'
import { Link } from "react-router-dom"


function StudentDirectory() {
    const [info, setInfo] = useState([])
    const birthFieldRef = useRef(null);
    const firstFieldRef = useRef(null);
    const lastFieldRef = useRef(null);
    const genderFieldRef = useRef(null);
    const gradeFieldRef = useRef(null);
    const mathFieldRef = useRef(null);
    const englishFieldRef = useRef(null);
    const historyFieldRef = useRef(null);
    const scienceFieldRef = useRef(null);
    const teacherFieldRef = useRef(null);
    const [classes, setClasses] = useState([])
    const [classTeacher, setclassTeacher] = useState('')
    const [studentID, setStudentID]=useState();

    const Data=(props) => {
        return (
            <div className='studentDirectory'>
                <td>{props.property}</td>
            </div>
        )
    }

    useEffect(() => {
        const info = []
        getDocs(collection(db, "Student"))
        .then((allInfo) => {
            allInfo.forEach((doc) =>
                info.push({...doc.data()})
            )
        setInfo(info)})
    })

    const addStudent = (e) => {
        e.preventDefault();

        const newStudent = {
            birth: birthFieldRef.current.value,
            first: firstFieldRef.current.value,
            last: lastFieldRef.current.value,
            gender: genderFieldRef.current.value,
            grade: gradeFieldRef.current.value,
            score: {
              math: parseFloat(mathFieldRef.current.value),
              english: parseFloat(englishFieldRef.current.value),
              history: parseFloat(historyFieldRef.current.value),
              science: parseFloat(scienceFieldRef.current.value)
            },
            teacher: teacherFieldRef.current.value
        } 

        console.log(newStudent)

        addDoc(collection(db, "Student"), newStudent)
        .then((docRef) => {
            setInfo([...info, {id:docRef.id, ...newStudent}])
        })
        .catch((e) => console.error(e))

        birthFieldRef.current.value = ""
        firstFieldRef.current.value = ""
        lastFieldRef.current.value = ""
        genderFieldRef.current.value = ""
        mathFieldRef.current.value = 0
        englishFieldRef.current.value = 0
        historyFieldRef.current.value = 0
        scienceFieldRef.vurrent.value = 0
        teacherFieldRef.current.value= ""
    }

    const [selectedDate, setSelectedDate] = useState()
    const handleDateChange=(date) => {
      setSelectedDate(date)
    }

    const deleteStudent = async (e, student) => {
        e.preventDefault();
        const studentRef = collection(db, "Student");
        const q = query(studentRef, where("last", "==", student.last));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            doc.data();
            setStudentID(doc.id);
        });
        deleteDoc(doc(db, "Student", studentID))
    }

      useEffect(() => {
          const classes = []
          getDocs(collection(db, "Classes"))
          .then((allInfo) => {
              allInfo.forEach((doc) =>
                  classes.push({...doc.data()})
              )
          setClasses(classes)
          console.log(classes)})
      }, [db])
  
    
    return (
      <div className="directory">
        <div className="directoryColumn">
          <h2>Student Directory</h2>
          <form onSubmit={addStudent}>
            <p>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                format="MM/dd/yyyy"
                label="Birthdate"
                required
                value={selectedDate}
                onChange={handleDateChange}
                inputRef={birthFieldRef}
                />
              </MuiPickersUtilsProvider>
            </p>
            <p>
              <TextField 
              required
              variant='outlined'
              label="First Name"
              inputRef={firstFieldRef}/>
            </p>
            <p>
              <TextField 
                required
                variant='outlined'
                label="Last Name"
                inputRef={lastFieldRef}/>
            </p>
            <p>
              <FormControl required sx={{ m: 0.5, minWidth: 150 }}>
                <InputLabel id="test-select-label">Gender</InputLabel>
                <Select
                  variant='outlined'
                  labelId="test-select-label"
                  label="Label"
                  inputRef={genderFieldRef}>
                  <MenuItem value={'Female'}>Female</MenuItem>
                  <MenuItem value={'Male'}>Male</MenuItem>
                  <MenuItem value={'Prefer not to say'}>Prefer not to say</MenuItem>
                </Select>
              </FormControl>
            </p>
            <p>
              <FormControl required sx={{ m: 0.5, minWidth: 150 }}>
                <InputLabel id="test-select-label">Grade Level</InputLabel>
                <Select
                  variant='outlined'
                  labelId="test-select-label"
                  label="Label"
                  inputRef={gradeFieldRef}>
                  <MenuItem value={'K'}>Kindergarten</MenuItem>
                  <MenuItem value={'1st'}>1st</MenuItem>
                  <MenuItem value={'2nd'}>2nd</MenuItem>
                  <MenuItem value={'3rd'}>3rd</MenuItem>
                  <MenuItem value={'4th'}>4th</MenuItem>
                  <MenuItem value={'5th'}>5th</MenuItem>
                  <MenuItem value={'6th'}>6th</MenuItem>
                </Select>
              </FormControl>
            </p>
            <p>
              <TextField 
              variant="outlined"
              label="Math Score"
              required
              inputRef={mathFieldRef} />
              <TextField 
              variant="outlined"
              label="English Score"
              required
              inputRef={englishFieldRef} />
            </p>
            <p>
              <TextField
              variant="outlined"
              label="History Score" 
              required
              inputRef={historyFieldRef}/>
              <TextField
              variant="outlined"
              label="Science Score" 
              required
              inputRef={scienceFieldRef}/>
            </p>
            <p>
              <FormControl required sx={{ m: 0.5, minWidth: 150 }}>
                <InputLabel id="test-select-label">Teacher</InputLabel>
                <Select
                  variant='outlined'
                  labelId="test-select-label"
                  label="Label"
                  inputRef={teacherFieldRef}>

                  {classes.map((classes) => (
                    <MenuItem value = {classes.teacher} onClick = { () => {
                        setclassTeacher(classes.teacher)
                    }}> {classes.teacher} </MenuItem>))}
                </Select>
              </FormControl>
            </p>
            <Button
            type="submit"
            variant="outlined">
              Add Student
            </Button>
        </form>
      </div>

      <div className='directoryColumn'>
      <table>
          <thead>
            <tr>
              <td> </td>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Birthdate</th>
              <th scope="col">Gender</th>
              <th scope="col">Grade Level</th>
              <th scope="col">Teacher</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"></th>
              <td>
              {info.map((student) => (
                <Data property={student.first} />
              ))}
              </td>
              <td>
              {info.map((student) => (
                <Data property={student.last} />
              ))}
              </td>
              <td>
              {info.map((student) => (
                <Data property={student.birth} />
              ))}
              </td>
              <td>
              {info.map((student) => (
                <Data property={student.gender} />
              ))}
              </td>
              <td>
              {info.map((student) => (
                <Data property={student.grade} />
              ))}
              </td>
              <td>
              {info.map((student) => (
                <Data property={student.teacher} />
              ))}
              </td>
              <td>
              {info.map((student) => (
                <form onSubmit={(e)=>deleteStudent(e, student)} >
                    <input id="delete" type="submit" name="delete" value="Delete"/>
               </form>
              ))}
              </td> 
            </tr>
          </tbody>
        </table>
        <Button component={Link} to="/edit-student" variant="outlined" color="primary">
          Edit Student Directory</Button>
      </div>
        
      </div>
    );
}

export default StudentDirectory 