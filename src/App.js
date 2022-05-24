import './App.css';
import Homepage from './components/homepage';
import { Link, Outlet} from "react-router-dom"
import {Route, BrowserRouter} from "react-router-dom"
import teacherDashboard from './components/teacherDashboard';
import teacherDirectory from './components/teacherDirectory';
import studentDirectory from './components/studentDirectory';
import classPage from './components/classPage';
import schoolCalendar from './components/schoolCalendar';
import classDashboard from './components/classDashboard';
import Banner from './components/banner';

// add styling to the links 
// embed the links differently 
// access class page/teacher dashboard through class dashboard 

function App() {
  return (
    <BrowserRouter>
     <main>
       <div className='App'>
       <nav>
         <Banner />
        <a href="/teacher-directory">Teacher Directory</a> |{" "}
        <a href="/student-directory">Student Directory</a> |{" "}
        <a href="/class-page">Class Page</a> |{" "}
        <a href="/school-calendar">School Calendar</a> |{" "}
        <a href="/teacher-dashboard">Teacher Dashboard</a> |{" "}
        <a href='/class-dashboard'>Class Dashboard</a>
      </nav>
       <Route exact path="/teacher-directory" component={teacherDirectory} />
       <Route path="/student-directory" component={studentDirectory} />
       <Route path="/class-page" component={classPage} />
       <Route path="/school-calendar" component={schoolCalendar} />
       <Route path="/teacher-dashboard" component={teacherDashboard} />
       <Route path="/class-dashboard" component={classDashboard} />
       </div>
      </main>   
     </BrowserRouter>
   );

}

export default App;
