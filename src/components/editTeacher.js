import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebaseSetup'
import { useState, useRef} from "react"
import { query, where } from "firebase/firestore";
import { writeBatch, doc } from "firebase/firestore"; 
import { MenuItem, TextField, Select, FormControl, InputLabel, Button} from '@mui/material';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

function EditTeacher() {
    const birthFieldRef = useRef(null);
    const firstFieldRef = useRef(null);
    const lastFieldRef = useRef(null);
    const genderFieldRef = useRef(null);
    const gradeFieldRef = useRef(null);
    const [teacher, setTeacher]=useState();


    const getTeacher=async(last)=>{
        // Create a query against the collection.
        const teacherRef = collection(db, "Teacher");
  
        const q =query(teacherRef, where("last", "==", last));
          
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
           doc.data();
           setTeacher(doc.id);
        });
      }
    const changeTeacher=async(e)=>{
        e.preventDefault();
  
        getTeacher(lastFieldRef.current.value)
          
          const batch = writeBatch(db);
          
          const sfRef = await doc(db, "Teacher", teacher);
          batch.update(sfRef, {
            "birth": birthFieldRef.current.value,
            "first": firstFieldRef.current.value,
            "gender": genderFieldRef.current.value,
            "grade": gradeFieldRef.current.value,
          }); 
          await batch.commit()
  
          getDocs(collection(db, "Teacher")).then((allDocs) => {allDocs.forEach((doc) => console.log(doc.data()))});
          
          lastFieldRef.current.value="";
          birthFieldRef.current.value="";
          firstFieldRef.current.value="";
          genderFieldRef.current.value="";
          gradeFieldRef.current.value="";
    }

    const [selectedDate, setSelectedDate] = useState()
    const handleDateChange=(date) => {
      setSelectedDate(date)
    }

    return (
        <div>
        <h2>Edit Teacher Directory</h2>
        <form onSubmit={changeTeacher} >
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
              Submit Changes
            </Button>
        </form>
        </div>
    )
}

export default EditTeacher