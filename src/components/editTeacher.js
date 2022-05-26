import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebaseSetup'
import { useState, useRef} from "react"
import { query, where } from "firebase/firestore";
import { writeBatch, doc } from "firebase/firestore"; 
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
    return (
        <div>
        <h2>Edit Teacher Directory</h2>
        <form onSubmit={changeTeacher} >
            <p>
                <label>Last Name </label>
                <input type="text" ref={lastFieldRef} required/>
            </p>
            <p>
                <label>First Name </label>
                <input type="text" ref={firstFieldRef} required/>
            </p>
            <p>
                <label>Birthdate </label>
                <input type="date" ref={birthFieldRef} required/>
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
        </div>
    )
}

export default EditTeacher