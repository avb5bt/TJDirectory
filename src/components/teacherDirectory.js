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
import { Link } from "react-router-dom"
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { Stack } from '@mui/material';

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
      setInfo(info)})
    }, [db])

  

    const addTeacher = (e) => {
      e.preventDefault();
      const newTeacher = {
          birth: birthFieldRef.current.value,
          first: firstFieldRef.current.value,
          last: lastFieldRef.current.value,
          gender: genderFieldRef.current.value,
          grade: gradeFieldRef.current.value,

      } 
      
      addDoc(collection(db, "Teacher"), newTeacher)
      .then((docRef) =>{
          setInfo([...info, {id:docRef.id, ...newTeacher}])
      })
      .catch((e) => console.error(e))

      birthFieldRef.current.value = " "
      firstFieldRef.current.value = " "
      lastFieldRef.current.value = " "
      genderFieldRef.current.value = " "
      gradeFieldRef.current.value = " "
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

    const [selectedDate, setSelectedDate] = useState()
    const handleDateChange=(date) => {
      setSelectedDate(date)
    }

    return (
      <div className="directory">
        <div className="directoryColumn">
        <h2>New Teacher Form</h2>
        <form onSubmit={addTeacher} >
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
                <InputLabel id="test-select-label">Grade Taught</InputLabel>
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
            <Button
            type="submit"
            variant="outlined">
              Add Teacher
            </Button>
        </form>
      </div>

        <div className="directoryColumn">
          <h2>Teacher Directory</h2>
        <table className='directoryTable'>
          <thead>
            <tr>
              <td> </td>
              <th scope="col">First  </th>
              <th scope="col">Last  </th>
              <th scope="col">Birthdate  </th>
              <th scope="col">Gender  </th>
              <th scope="col">Grade Taught  </th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"></th>
              <td>
              {info.map((teacher) => (
                <Data property={teacher.first} />
              ))}
              </td>
              <td>
              {info.map((teacher) => (
                <Data property={teacher.last} />
              ))}
              </td>
              <td>
              {info.map((teacher) => (
                <Data property={teacher.birth} />
              ))}
              </td>
              <td>
              {info.map((teacher) => (
                <Data property={teacher.gender} />
              ))}
              </td>
              <td>
              {info.map((teacher) => (
                <Data property={teacher.grade} />
              ))}
              </td>
            <td>
              {info.map((teacher) => (
              //   <form onSubmit={(e)=>deleteTeacher(e, teacher)} >
              //       <input id="delete" type="submit" name="delete" value="Delete"/>
              //  </form>
              <Stack direction = 'column' spacing ={1}>
              <IconButton size='small' onClick={(e) => deleteTeacher(e, teacher)} aria-label="delete">
              <DeleteIcon />
            </IconButton>
            </Stack>
               
               
               
              ))}
              </td> 
            </tr>
          </tbody>
        </table>
        <Button component={Link} to="/edit-teacher" variant="outlined" color="primary">
          Edit Teacher Directory</Button>
        </div>
      </div>
    );
}

export default TeacherDirectory