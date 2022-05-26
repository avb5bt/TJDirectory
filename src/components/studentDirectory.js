import {addDoc, writeBatch, deleteDoc, collection, doc, getDocs, query, where} from 'firebase/firestore'
import { db, firebaseConfig } from './firebaseSetup'
import { useState, useEffect, useRef} from "react"
import { MenuItem, TextField, Select, FormControl, InputLabel} from '@mui/material';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

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
    }, [db])

    const addStudent = (e) => {
        e.preventDefault();

        const newStudent = {
            birth: birthFieldRef.current.value,
            first: firstFieldRef.current.value,
            last: lastFieldRef.current.value,
            gender: genderFieldRef.current.value,
            grade: gradeFieldRef.current.value,
            score: {
              math: mathFieldRef.current.value,
              english: englishFieldRef.current.value,
              history: historyFieldRef.current.value,
              science: scienceFieldRef.current.value
            },
            teacher: teacherFieldRef.current.value


        } 

        addDoc(collection(db, "Student"), newStudent)
        .then((docRef) => {
            setInfo([...info, {id:docRef.id, ...newStudent}])
        })
        .catch((e) => console.error(e))

        birthFieldRef.current.value = ""
        firstFieldRef.current.value = ""
        lastFieldRef.current.value = ""
        genderFieldRef.current.value = ""
        mathFieldRef.current.value = ""
        englishFieldRef.current.value = ""
        historyFieldRef.current.value = ""
        scienceFieldRef.current.value = ""
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
    // function deletePost({id: birth, first, last, gender, grade}){
    //     const channelId = useSelector(selectChannelId)

    //     const deleteTeacher = () => {
    //         return db.collection('channels')
    //             .doc(channelId)
    //             .collection('posts')
    //             .doc(birth)
    //             .delete()
    //             .then(
    //                 ()=>{
    //                     console.log("teacher removed");
    //                 },
    //                 (error) =>{
    //                     console.error("error removing teacher: ", error);
    //                 }
    //             );
                
    //     }
    // }
    
    return (
      <div>
        <h2>Student Directory</h2>
        <form onSubmit={addStudent}>
          <p>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
              format="MM/dd/yyyy"
              label="Birthdate"
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
              <InputLabel>Gender</InputLabel>
              <Select
                variant='outlined'
                inputRef={genderFieldRef}>
                <MenuItem value={'Female'}>Female</MenuItem>
                <MenuItem value={'Male'}>Male</MenuItem>
                <MenuItem value={'Prefer not to say'}>Prefer not to say</MenuItem>
              </Select>
            </FormControl>
          </p>
          <p>
            <FormControl required sx={{ m: 0.5, minWidth: 150 }}>
              <InputLabel>Grade Level</InputLabel>
              <Select
                variant='outlined'
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
            <input type="submit"/>
        </form>

        <table>
          <thead>
            <tr>
              <td> </td>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Birthdate</th>
              <th scope="col">Gender</th>
              <th scope="col">Grade Level</th>
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
      </div>
    );
}

export default StudentDirectory