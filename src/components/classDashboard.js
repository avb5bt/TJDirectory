// overall dashboard of all classes, so each link goes to a specific class page
import {addDoc, collection, getDocs} from 'firebase/firestore'
import { db } from './firebaseSetup'
import { useState, useEffect, useRef} from "react"
import { Button, FormControl, getFabUtilityClass, InputLabel, Select } from '@mui/material';
import { Link, Outlet, useParams} from "react-router-dom";
import ClassPage from './classPage';
import { Menu } from '@mui/material';
import { MenuItem } from '@mui/material';

function ClassDashboard() {
    const [classes, setClasses] = useState([])
    const {id} = useParams()
    const [classTeacher, setclassTeacher] = useState('')
    const classTeacherRef = useRef('')

    

    useEffect(() => {
        const classes = []
        getDocs(collection(db, "Classes"))
        .then((allInfo) => {
            allInfo.forEach((doc) =>
                classes.push({...doc.data()})
            )
        setClasses(classes)
        console.log(classes)})
    }, [db])

    const handleSubmit = () => {
        console.log(classTeacher)
    }


    return (
        <div>
        <h2>Class Dashboard</h2>
            <p>
            <FormControl required sx = {{m: 0.5, minWidth: 150}}>
                <InputLabel> Class Teacher</InputLabel>
                <Select
                ref = {classTeacherRef}
                >
            {classes.map((classes) => (
                <MenuItem value = {classes.teacher} onClick = { () => {
                    setclassTeacher(classes.teacher)
                }}> {classes.teacher} </MenuItem>
              ))}
                    
                </Select>
            </FormControl>
            </p>
            <ClassPage classTeacher = {classTeacher}></ClassPage>
          </div>
    )
}

export default ClassDashboard