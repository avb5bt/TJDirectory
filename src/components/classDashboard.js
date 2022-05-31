// overall dashboard of all classes, so each link goes to a specific class page
import {collection, getDocs} from 'firebase/firestore'
import { db } from './firebaseSetup'
import { useState, useEffect, useRef} from "react"
import { FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import { useParams} from "react-router-dom";
import { query, where } from "firebase/firestore";
import { writeBatch, doc, deleteDoc, orderBy } from "firebase/firestore"; 
import "../styling/dashboard.css"

function ClassDashboard() {
    const [classes, setClasses] = useState([])
    let classTeacher = ''
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

/*
Consider grouping const definitions together by using a "," and removing the const of the next variable.
*/
/*
I'm not in love with this use of refs. Refs in practice are not used very often. This ref could be a useState.
*/
    const [displayInfo, setDisplayInfo]=useState([]),
          lastFieldRef = useRef(null),
          mathGradeRef = useRef(null),
          scienceGradeRef = useRef(null);
    const historyGradeRef = useRef(null);
    const englishGradeRef = useRef(null);
    const [student, setStudent]=useState();
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
        let studentRef = collection(db, "Student")
        getDocs(query(studentRef, orderBy('last')))
        .then((allInfo) => {
            allInfo.forEach((doc) =>{
                if(doc.data().teacher === classTeacher){//TODO: change this once we attach a teacher
                    //console.log("entered");
                    displayInfo.push({...doc.data()})
                }
                
            })
        setDisplayInfo(displayInfo)})

    }

    useEffect(() => {
      averageMath();
      averageEng();
      averageHist();
      averageSci();
    })

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

//What was the reasoning for using async here?
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

      //Avoid writing code that has while loop vibes.
      //Look into calculating sum using sumBy in the lodash package.
      //Lodash offers many functions that simplify common javascript logic.
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
  
    return (
        <div className='classDashboard'>
        <h1>Class Dashboard</h1>
            <p>
            <FormControl required sx = {{m: 0.5, minWidth: 150}}>
                <InputLabel id="test-select-label"> Class Teacher</InputLabel>
                <Select
                variant="outlined"
                labelId='test-select-label'
                label="Label"
                ref = {classTeacherRef}
                >
            {classes.map((classes) => (
                <MenuItem value = {classes.last} onClick = { () => {
                    classTeacher = classes.last
                    getClass()
                }}> {classes.last} </MenuItem>
              ))} 
                </Select>
            </FormControl>
            </p>

            <div>
       {/*Consider using an MUI table because it provides many baked in features for sorting/filtering.
       It will also make your code cleaner.*/}
        <table className="rosterTable">
            <caption>Class Roster</caption>
          <thead>
            <tr>
              <td> </td>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Birthdate</th>
              <th scope="col">Gender</th>
              <th scope="col">Grade</th>
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
            </tr>
          </tbody>
        </table>

        <table className='gradesTable'>
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
        
        <form onSubmit={changeGrade} >
          <h2>Enter Grades</h2>
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
              Submit Grades
            </Button>
        </form>
       
      </div>
          </div>
    )
}

export default ClassDashboard
