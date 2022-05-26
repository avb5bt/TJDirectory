import {addDoc, collection, getDocs} from 'firebase/firestore'
import { db } from './firebaseSetup'
import { useState, useEffect, useRef} from "react"
// includes average class grade and roster
// teacher adds grades in the class page 
// update the teacher field for the student if the teacher is deleted 

function ClassPage() {
    const [displayInfo, setDisplayInfo]=useState([]);
    const birthFieldRef = useRef(null);
    const firstFieldRef = useRef(null);
    const lastFieldRef = useRef(null);
    const genderFieldRef = useRef(null);
    const gradeFieldRef = useRef(null);

    const Data=(props) => {
        return (
            <div className='studentDirectory'>
            
                <td>{props.property}</td>
                
            </div>
        )
    }

    useEffect(() => {
        const displayInfo=[];
        getDocs(collection(db, "Student"))
        .then((allInfo) => {
            allInfo.forEach((doc) =>{
                //console.log( doc.data().teacher);
                if(doc.data().teacher==="test"){//TODO: change this once we attach a teacher
                    //console.log("entered");
                    displayInfo.push({...doc.data()})
                }
                
            })
        setDisplayInfo(displayInfo)})
    }, [db])

    const addStudent = (e) => {
        e.preventDefault();

        const newStudent = {
            birth: birthFieldRef.current.value,
            first: firstFieldRef.current.value,
            last: lastFieldRef.current.value,
            gender: genderFieldRef.current.value,
            grade: gradeFieldRef.current.value,

        } 
        addDoc(collection(db, "Student"), newStudent)
        .then((docRef) =>{
            setDisplayInfo([...displayInfo, {id:docRef.id, ...newStudent}])
        })
        .catch((e) => console.error(e))

        birthFieldRef.current.value = ""
        firstFieldRef.current.value = ""
        lastFieldRef.current.value = ""
        genderFieldRef.current.value = ""
        gradeFieldRef.current.value = ""
    }
    
    return (
      <div>
        <h2>Class Page</h2>
        
        <table>
            <caption>Class Roster</caption>
          <thead>
            <tr>
              <td> </td>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Birthdate</th>
              <th scope="col">Gender</th>
              <th scope="col">Grade Level</th>
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
              
            </tr>
          </tbody>
        </table>
        <form onSubmit={addStudent} >
            <p>
                <label>Birthdate </label>
                <input type="text" ref={birthFieldRef} />
            </p>
            <p>
                <label>First Name </label>
                <input type="text" ref={firstFieldRef} />
            </p>
            <p>
                <label>Last Name </label>
                <input type="text" ref={lastFieldRef} />
            </p>
            <p>
                <label>Gender </label>
                <input type="text" ref={genderFieldRef} />
            </p>
            <p>
                <label>Grade </label>
                <input type="text" ref={gradeFieldRef} />
            </p>
                <input type="submit"/>
        </form>
      </div>
    );
}

export default ClassPage