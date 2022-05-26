import {addDoc, writeBatch, deleteDoc, collection, doc, getDocs, query, where} from 'firebase/firestore'
import { db } from './firebaseSetup'
import { useState, useEffect, useRef} from "react"
import { Timestamp } from 'firebase/firestore'
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


function createData(date, event, description, staff) {
  return {date, event, description, staff};
}

function SchoolCalendar() {
    const [info, setInfo] = useState([])
    const date = useRef(null)
    const desc = useRef(null)
    const staff = useRef(null)
    const event = useRef(null)
    const [calendarID, setCalendarID]=useState();
    const [rows, setRows]=useState([]);

    const Data=(props) => {
        return (
            <div className='CalendarEvent'>
            
                <td>{props.property}</td>
                
            </div>
        )
    }


    useEffect(() => {
        const info = []
        getDocs(collection(db, "Events"))
        .then((allInfo) => {
            allInfo.forEach((doc) =>
                info.push({...doc.data()})
            )
            info.sort((a, b) => {
                return a.date.seconds - b.date.seconds
            })
            setInfo(info)
            createRows(info);
        
        })}, [db])


    const createRows = (info)=>{
      console.log("info2: "+info);
      let array=[];
      info.map((event)=>{
        array.push(createData(new Date(event.date.seconds * 1000).toDateString(), event.event, 
        event.descrip, event.staff));
      })
      setRows(array);
      console.log("ARRAY: "+array);
    //   [
    //   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    //   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    //   createData('Eclair', 262, 16.0, 24, 6.0),
    //   createData('Cupcake', 305, 3.7, 67, 4.3),
    //   createData('Gingerbread', 356, 16.0, 49, 3.9),
    // ]
  }
    const addEvent = (e) => {
        e.preventDefault();

        const x = new Date(date.current.value).getTime() / 1000
        
        const timeStamp = new Timestamp(x, 0)

        const newEvent = {
            date: timeStamp,
            event: event.current.value, 
            descrip: desc.current.value,
            staff: staff.current.value,
        } 
        addDoc(collection(db, "Events"), newEvent)
        .then((docRef) =>{
            setInfo([...info, {id:docRef.id, ...newEvent}])
        })
        .catch((e) => console.error(e))

        date.current.value = null
        event.current.value = null
        desc.current.value = null
        staff.current.value = null
    }

    const deleteEvent = async (e, event) => {
      e.preventDefault();
      const eventRef = collection(db, "Events");
      const q = query(eventRef, where("descrip", "==", event.descrip));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
          doc.data();
          setCalendarID(doc.id);
      });
      deleteDoc(doc(db, "Events", calendarID))
  }
    return (
        <div>
        <h2>School Calendar</h2>
        <form onSubmit={addEvent} >
            <p>
                <label>Date </label>
                <input type="date" ref={date} />
            </p>
            <p>
                <label>Event </label>
                <input type="text" ref={event} />
            </p>
            <p>
                <label>Description </label>
                <input type="text" ref={desc} /></p>
            <p>
                <label>Staff </label>
                <input type="text" ref={staff} />
            </p>
            
            <input type="submit"/>
        </form>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow className="header">
                <TableCell>
                    Date
                </TableCell>
                <TableCell align="right">Event</TableCell>
                <TableCell align="right">Description</TableCell>
                <TableCell align="right">Staff</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.first}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.date}
                  </TableCell>
                  <TableCell align="right">{row.event}</TableCell>
                  <TableCell align="right">{row.description}</TableCell>
                  <TableCell align="right">{row.staff}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </div>
    )
}

export default SchoolCalendar