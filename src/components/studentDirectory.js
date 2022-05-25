import {collection, getDocs} from 'firebase/firestore'
import { db } from './firebaseSetup'
import { useState, useEffect } from "react"

function StudentDirectory() {
    const [info, setInfo] = useState([])

    const Data=(props) => {
        return (
            <div className='studentDirectory'>
                <p>{props.first}</p>
                <p>{props.last}</p>
                <p>{props.birth}</p>
                <p>{props.gender}</p>
                <p>{props.grade}</p>
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
    
    return (
        <div>
        <h2>Student Directory</h2> 
        {info.map((student) => 
            <Data first={student.first} 
            last={student.last} 
            birth={student.birth} 
            gender={student.gender} 
            grade={student.grade}/>)}
        </div>
        
    )
}

export default StudentDirectory