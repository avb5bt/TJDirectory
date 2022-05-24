import {collection, getDocs} from 'firebase/firestore'
import { db, firebaseConfig } from './firebaseSetup'
import { useState, useEffect } from "react"

function TeacherDirectory() {
    const [info, setInfo] = useState([])

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
    
    return (
        <div>
        <h2>Teacher Directory</h2> 
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