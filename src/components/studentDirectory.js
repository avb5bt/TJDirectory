import {collection, getDocs} from 'firebase/firestore'
import { db, firebaseConfig } from './firebaseSetup'

function studentDirectory() {
    getDocs(collection(db, "Student"))
    .then((allDocs) => {allDocs.forEach((doc) => console.log(doc.data()))})
    
    return (
        <h2>Student Directory</h2> 
    )
}

export default studentDirectory