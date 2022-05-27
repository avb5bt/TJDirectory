// overall dashboard of all classes, so each link goes to a specific class page
import {collection, getDocs} from 'firebase/firestore'
import { db } from './firebaseSetup'
import { useState, useEffect, useRef} from "react"
import { FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import { useParams} from "react-router-dom";
import { query, where } from "firebase/firestore";
import { writeBatch, doc, deleteDoc } from "firebase/firestore"; 

function ClassDashboard() {
    const [classes, setClasses] = useState([])
    const {id} = useParams()
    const [classTeacher, setclassTeacher] = useState('')
    const classTeacherRef = useRef('')

    useEffect(() => {
        const classes = []
        getDocs(collection(db, "Teacher"))
        .then((allInfo) => {
            allInfo.forEach((doc) =>
                classes.push({...doc.data()})
            )
        setClasses(classes)
        console.log(classes)})
    }, [db])


    const [displayInfo, setDisplayInfo]=useState([]);
    const lastFieldRef = useRef(null);
    const mathGradeRef = useRef(null);
    const scienceGradeRef = useRef(null);
    const historyGradeRef = useRef(null);
    const englishGradeRef = useRef(null);
    const [student, setStudent]=useState();
    const [studentID, setStudentID]=useState();
    const [avgMath, setAvgMath] = useState(0);
    const [avgEng, setAvgEng] = useState(0);
    const [avgHist, setAvgHist] = useState(0);
    const [avgSci, setAvgSci] = useState(0);

    const Data=(props) => {
        return (
            <div className='studentDirectory'>
            
                <td>{props.property}</td>
                
            </div>
        )
    }

    const getClass=()=>{
        const displayInfo=[];
        getDocs(collection(db, "Student"))
        .then((allInfo) => {
            allInfo.forEach((doc) =>{
                if(doc.data().teacher === classTeacher){//TODO: change this once we attach a teacher
                    //console.log("entered");
                    displayInfo.push({...doc.data()})
                }
                
            })
        setDisplayInfo(displayInfo)})
            averageMath();
            averageEng();
            averageHist();
            averageSci();
    }

    const getStudent=async(last)=>{
        // Create a query against the collection.
        console.log("2a: "+last);
        const studentRef = collection(db, "Student");
  
        const q =query(studentRef, where("last", "==", last));
          
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
           doc.data();
           setStudent(doc.id);
        });
      }
      const averageMath = async()=>{
        let sum = 0;
        let counter = 0;
        displayInfo.map((student) => {
          console.log(student.score.math)
          sum += student.score.math;
          counter++;
        })
        
        setAvgMath(parseInt(sum/counter))
  
      }
      const averageEng = async()=>{
        let sum = 0;
        let counter = 0;
        displayInfo.map((student) => {
          sum += student.score.english;
          counter++;
        })
        
        setAvgEng(parseInt(sum/counter))
  
      }
      const averageHist = async()=>{
        let sum = 0;
        let counter = 0;
        displayInfo.map((student) => {
          sum += student.score.history;
          counter++;
        })
        
        setAvgHist(parseInt(sum/counter))
  
      }
      const averageSci = async()=>{
        let sum = 0;
        let counter = 0;
        displayInfo.map((student) => {
          sum += student.score.science;
          counter++;
        })
        
        setAvgSci(parseInt(sum/counter))
  
      }

      const changeGrade=async(e)=>{
        e.preventDefault();
  
        console.log("1: "+lastFieldRef.current.value);
        getStudent(lastFieldRef.current.value)
          
        console.log("2: "+student);
          const batch = writeBatch(db);
          
          const sfRef = await doc(db, "Student", student);
          batch.update(sfRef, {
            "score.math": mathGradeRef.current.value,
            "score.english": englishGradeRef.current.value,
            "score.history": historyGradeRef.current.value,
            "score.science": scienceGradeRef.current.value,
          }); 
          await batch.commit()
  
          getDocs(collection(db, "Student")).then((allDocs) => {allDocs.forEach((doc) => console.log(doc.data()))});
          
          lastFieldRef.current.value="";
          mathGradeRef.current.value="";
          englishGradeRef.current.value="";
          historyGradeRef.current.value="";
          scienceGradeRef.current.value="";
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
  
    return (
        <div>
        <h2>Class Dashboard</h2>
            <p>
            <FormControl required sx = {{m: 0.5, minWidth: 150}}>
                <InputLabel> Class Teacher</InputLabel>
                <Select
                ref = {classTeacherRef}
                >
            {classes.map((classes) => (
                <MenuItem value = {classes.last} onClick = { () => {
                    setclassTeacher(classes.last)
                    getClass()
                }}> {classes.last} </MenuItem>
              ))} 
                </Select>
            </FormControl>
            </p>

            <div>
        <h2>Class Page</h2>
        <table className="rosterTable">
            <caption>Class Roster</caption>
          <thead>
            <tr>
              <td> </td>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Birthdate</th>
              <th scope="col">Gender</th>
              <th scope="col">Grade Level</th>
              <th scope="col">Math</th>
              <th scope="col">English</th>
              <th scope="col">History</th>
              <th scope="col">Science</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"></th>
              <td>
              {displayInfo.map((student) => (
                <Data property={student.first} />
              ))}
              </td>
              <td>
              {displayInfo.map((student) => (
                <Data property={student.last} />
              ))}
              </td>
              <td>
              {displayInfo.map((student) => (
                <Data property={student.birth} />
              ))}
              </td>
              <td>
              {displayInfo.map((student) => (
                <Data property={student.gender} />
              ))}
              </td>
              <td>
              {displayInfo.map((student) => (
                <Data property={student.grade} />
              ))}
              </td>
              <td>
              {displayInfo.map((student) => (
                <Data property={student.score.math} />
              ))}
              </td>
              <td>
              {displayInfo.map((student) => (
                <Data property={student.score.science} />
              ))}
              </td>
              <td>
              {displayInfo.map((student) => (
                <Data property={student.score.history} />
              ))}
              </td>
              <td>
              {displayInfo.map((student) => (
                <Data property={student.score.english} />
              ))}
              </td>
              <td>
              {displayInfo.map((student) => (
                <form onSubmit={(e)=>deleteStudent(e, student)} >
                    <input id="delete" type="submit" name="delete" value="Delete"/>
               </form>
              ))}
              </td> 
            </tr>
          </tbody>
        </table>
        <form onSubmit={changeGrade} >
            <p>
              <TextField 
                required
                variant='outlined'
                label="Last Name"
                inputRef={lastFieldRef}/>
            </p>
            <p>
              <TextField 
                required
                variant='outlined'
                label="Math Grade"
                inputRef={mathGradeRef}/>
            </p>
            <p>
              <TextField 
                required
                variant='outlined'
                label="Science Grade"
                inputRef={scienceGradeRef}/>
            </p>
            <p>
              <TextField 
                required
                variant='outlined'
                label="History Grade"
                inputRef={historyGradeRef}/>
            </p>
            <p>
              <TextField 
                required
                variant='outlined'
                label="English Grade"
                inputRef={englishGradeRef}/>
            </p>
            <Button
            type="submit"
            variant="outlined"
            >
              Submit
            </Button>
        </form>
        <table>
            <caption>Class Grade Averages
            </caption>
        <thead>
            <tr>
              <td> </td>
              <th scope="col">Math</th>
              <th scope="col">English</th>
              <th scope="col">History</th>
              <th scope="col">Science</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"></th>
              <td>
              {avgMath}
              </td>
              <td>
              {avgEng}
              </td>
              <td>
              {avgHist}
              </td>
              <td>
              {avgSci}
              </td>
              </tr>
          </tbody>
        </table>
      </div>
          </div>
    )
}

export default ClassDashboard