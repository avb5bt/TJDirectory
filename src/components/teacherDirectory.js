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
                <label>Grade Taught </label>
                <select ref={gradeFieldRef} required>
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="3rd">3rd</option>
                  <option value="4th">4th</option>
                  <option value="5th">5th</option>
                  <option value="6th">6th</option>
                </select>
            </p>
                <input type="submit"/>
        </form>
        <div text-align = 'center'>
        <table>
          <thead>
            <tr>
              <td> </td>
              <th scope="col">First  </th>
              <th scope="col">Last  </th>
              <th scope="col">Birthday  </th>
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
                <form onSubmit={(e)=>deleteTeacher(e, teacher)} >
                    <input id="delete" type="submit" name="delete" value="Delete"/>
               </form>
              ))}
              </td> 
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    );
}

export default TeacherDirectory