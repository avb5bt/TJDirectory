import './App.css';
import Homepage from './components/homepage';
import { Link, Outlet} from "react-router-dom"
import {Route, BrowserRouter} from "react-router-dom"
import teacherDashboard from './components/teacherDashboard';
import teacherDirectory from './components/teacherDirectory';
import studentDirectory from './components/studentDirectory';
import classPage from './components/classPage';
import schoolCalendar from './components/schoolCalendar';

// add styling to the links 
function App() {
  return (
    <BrowserRouter>
     <main>
       <div className='App'>
       <nav>
        <ul>
          <li><a href="/teacher-directory">Teacher Directory</a></li>
          <li><a href="/student-directory">Student Directory</a></li>
          <li><a href="/class-page">Class Page</a></li>
          <li><a href="/school-calendar">School Calendar</a></li>
          <li><a href="/teacher-dashboard">Teacher Dashboard</a></li>
        </ul>
        </nav>
       <Route exact path="/teacher-directory" component={teacherDirectory} />
       <Route path="/student-directory" component={studentDirectory} />
       <Route path="/class-page" component={classPage} />
       <Route path="/school-calendar" component={schoolCalendar} />
       <Route path="/teacher-dashboard" component={teacherDashboard} />
       </div>
      </main>   
     </BrowserRouter>
   );

}

export default App;
