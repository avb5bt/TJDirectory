import {addDoc, collection, getDocs} from 'firebase/firestore'
import { db } from './firebaseSetup'
import { useState, useEffect, useRef} from "react"
import { query, where } from "firebase/firestore";
import { writeBatch, doc } from "firebase/firestore"; 

// includes average class grade and roster
// teacher adds grades in the class page 
// update the teacher field for the student if the teacher is deleted 

function ClassPage() {
    const [displayInfo, setDisplayInfo]=useState([]);
    const lastFieldRef = useRef(null);
    const mathGradeRef = useRef(null);
    const scienceGradeRef = useRef(null);
    const historyGradeRef = useRef(null);
    const englishGradeRef = useRef(null);
    const [student, setStudent]=useState();
    


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

    const changeGrade=async(e)=>{
      e.preventDefault();

      console.log("1: "+lastFieldRef.current.value);
      getStudent(lastFieldRef.current.value)
        
      console.log("2: "+student);
        const batch = writeBatch(db);
        
        // Update the population of 'SF'
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

    // const addStudent = (e) => {
    //     e.preventDefault();

    //     const newGradeInput = {
    //         birth: birthFieldRef.current.value,
    //         first: firstFieldRef.current.value,
    //         last: lastFieldRef.current.value,
    //         gender: genderFieldRef.current.value,
    //         grade: gradeFieldRef.current.value,

    //     } 
    //     addDoc(collection(db, "Student"), newStudent)
    //     .then((docRef) =>{
    //         setDisplayInfo([...displayInfo, {id:docRef.id, ...newStudent}])
    //     })
    //     .catch((e) => console.error(e))

    //     birthFieldRef.current.value = ""
    //     firstFieldRef.current.value = ""
    //     lastFieldRef.current.value = ""
    //     genderFieldRef.current.value = ""
    //     gradeFieldRef.current.value = ""
    // }
    
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
        <form onSubmit={changeGrade} >
            <p>
                <label>Last Name </label>
                <input type="text" ref={lastFieldRef} />
            </p>
            <p>
                <label>Math Grade</label>
                <input type="text" ref={mathGradeRef} />
            </p>
            <p>
                <label>Science Grade </label>
                <input type="text" ref={scienceGradeRef} />
            </p>
            <p>
                <label>History Grade</label>
                <input type="text" ref={historyGradeRef} />
            </p>
            <p>
                <label>English Grade </label>
                <input type="text" ref={englishGradeRef} />
            </p>
                <input type="submit"/>
        </form>
      </div>
    );
}

export default ClassPage