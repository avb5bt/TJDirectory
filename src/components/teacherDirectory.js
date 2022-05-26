import {addDoc, collection, getDocs} from 'firebase/firestore'
import { db } from './firebaseSetup'
import { useState, useEffect, useRef} from "react"

function TeacherDirectory() {
    const [info, setInfo] = useState([])
    const birthFieldRef = useRef(null);
    const firstFieldRef = useRef(null);
    const lastFieldRef = useRef(null);
    const genderFieldRef = useRef(null);
    const gradeFieldRef = useRef(null);

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

        birthFieldRef.current.value = ""
        firstFieldRef.current.value = ""
        lastFieldRef.current.value = ""
        genderFieldRef.current.value = ""
        gradeFieldRef.current.value = ""
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
        <h2>Teacher Directory</h2>
        <form onSubmit={addTeacher} >
            <p>
                <label>Birthdate </label>
                <input type="date" ref={birthFieldRef} />
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
        <table>
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
              
            </tr>
          </tbody>
        </table>
      </div>
    );
}

export default TeacherDirectory