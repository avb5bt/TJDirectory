import {addDoc, collection, getDocs} from 'firebase/firestore'
import { db } from './firebaseSetup'
import { useState, useEffect, useRef} from "react"
import { Timestamp } from 'firebase/firestore'

function SchoolCalendar() {
    const [info, setInfo] = useState([])
    const date = useRef(null)
    const desc = useRef(null)
    const staff = useRef(null)

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
            console.log('update')
        
        })}, [db])

    const addEvent = (e) => {
        e.preventDefault();

        const x = new Date(date.current.value).getTime() / 1000
        
        const timeStamp = new Timestamp(x, 0)

        const newEvent = {
            date: timeStamp,
            descrip: desc.current.value,
            staff: staff.current.value,
        } 
        addDoc(collection(db, "Events"), newEvent)
        .then((docRef) =>{
            setInfo([...info, {id:docRef.id, ...newEvent}])
        })
        .catch((e) => console.error(e))

        date.current.value = null
        desc.current.value = null
        staff.current.value = null

        forceUpdate()

    }


    return (
        <div>
        <h2>School Calendar</h2>
        <form onSubmit={addEvent} >
            <ul>
                <li>
                    <label>Date </label>
                    <input type="date" ref={date} />
                </li>
                <li>
                    <label>Description </label>
                    <input type="text" ref={desc} /></li>
                <li>
                    <label>Staff </label>
                    <input type="text" ref={staff} />
                </li>
                <input type="submit"/>
            </ul>
        </form>

        <table>
          <caption>Calendar</caption>
          <thead>
            <tr>
              <td> </td>
              <th scope="col">Date</th>
              <th scope="col">Description</th>
              <th scope="col">Staff</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"></th>
              <td>
              {info.map((event) => (
                <Data property={new Date(event.date.seconds * 1000).toDateString()} />
              ))}
              </td>
              <td>
              {info.map((event) => (
                <Data property={event.descrip} />
              ))}
              </td>
              <td>
              {info.map((event) => (
                <Data property={event.staff} />
              ))}
              </td>
            </tr>
          </tbody>
        </table>
        </div>
    )
}

export default SchoolCalendar