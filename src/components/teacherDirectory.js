import {addDoc, writeBatch, deleteDoc, collection, doc, getDocs, query, where} from 'firebase/firestore'
import { db, firebaseConfig } from './firebaseSetup'
import { useState, useEffect, useRef} from "react"

function TeacherDirectory() {
    const [info, setInfo] = useState([])
    const birthFieldRef = useRef(null);
    const firstFieldRef = useRef(null);
    const lastFieldRef = useRef(null);
    const genderFieldRef = useRef(null);
    const gradeFieldRef = useRef(null);
    const [teacherID, setTeacherID]=useState();

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
            <ul>
                <li>
                    <label>Birth </label>
                    <input type="text" ref={birthFieldRef} />
                </li>
                <li>
                    <label>First Name </label>
                    <input type="text" ref={firstFieldRef} /></li>
                <li>
                    <label>Last Name </label>
                    <input type="text" ref={lastFieldRef} />
                </li>
                <li>
                    <label>Gender </label>
                    <input type="text" ref={genderFieldRef} />
                </li>
                <li>
                    <label>Grade </label>
                    <input type="text" ref={gradeFieldRef} />
                </li>
                <input type="submit"/>
            </ul>
        </form>
        <table>
          <caption>Teacher Directory</caption>
          <thead>
            <tr>
              <td> </td>
              <th scope="col">First | </th>
              <th scope="col">Last | </th>
              <th scope="col">Birthday | </th>
              <th scope="col">Gender | </th>
              <th scope="col">Grade Level | </th>
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
                <form onSubmit={(e)=>deleteTeacher(e, teacher)} >
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

export default TeacherDirectory