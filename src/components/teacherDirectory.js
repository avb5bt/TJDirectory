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
                <p>{props.birth}</p>
                <p>{props.first}</p>
                <p>{props.last}</p>
                <p>{props.gender}</p>
                <p>{props.grade}</p>
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
        {info.map((teacher) => 
            <Data birth={teacher.birth} 
            first={teacher.first} 
            last={teacher.last} 
            gender={teacher.gender} 
            grade={teacher.grade}/>)}
        </div>

    )
}

export default TeacherDirectory