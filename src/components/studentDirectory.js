import {addDoc, writeBatch, deleteDoc, collection, doc, getDocs, query, where} from 'firebase/firestore'
import { db, firebaseConfig } from './firebaseSetup'
import { useState, useEffect, useRef} from "react"

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
              math: parseFloat(mathFieldRef.current.value),
              english: parseFloat(englishFieldRef.current.value),
              history: parseFloat(historyFieldRef.current.value),
              science: parseFloat(scienceFieldRef.current.value)
            },
            teacher: teacherFieldRef.current.value


        } 
        addDoc(collection(db, "Student"), newStudent)
        .then((docRef) =>{
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
        <form onSubmit={addStudent} >
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
              <label>Grade Level </label>
                <select ref={gradeFieldRef} required>
                  <option value="K">K</option>
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="3rd">3rd</option>
                  <option value="4th">4th</option>
                  <option value="5th">5th</option>
                  <option value="6th">6th</option>
                </select>
            </p>
            <p>
                <label>Teacher </label>
                <input type="text" ref={teacherFieldRef} required/>
            </p>
            <p>
                <label>Math Grade </label>
                <input type="number" ref={mathFieldRef} required/>
            </p>
            <p>
                <label>English Grade </label>
                <input type="number" ref={englishFieldRef} required/>
            </p>
            <p>
                <label>History Grade </label>
                <input type="number" ref={historyFieldRef} required/>
            </p>
            <p>
                <label>Science Grade </label>
                <input type="number" ref={scienceFieldRef} required/>
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