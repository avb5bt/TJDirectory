import {collection, getDocs} from 'firebase/firestore'
import { db } from './firebaseSetup'
import { useState, useEffect } from "react"

function TeacherDirectory() {
    const [info, setInfo] = useState([])

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
    
    return (
      <div>
        <h2>Teacher Directory</h2>

        <table>
          <caption>Teacher Directory</caption>
          <thead>
            <tr>
              <td> </td>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Birthday</th>
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