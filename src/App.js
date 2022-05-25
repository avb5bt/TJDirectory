import './App.css';
import { Link, Outlet} from "react-router-dom"
import Banner from './components/banner';

// add styling to the links 
// embed the links differently 
// access class page/teacher dashboard through class dashboard 

function App() {
  return (
       <div className='App'>
        <nav>
          <Banner />
          <Link to="/teacher-directory">Teacher Directory</Link> |{" "}
          <Link to="/student-directory">Student Directory</Link> |{" "}
          <Link to="/class-page">Class Page</Link> |{" "}
          <Link to="/school-calendar">School Calendar</Link> |{" "}
          <Link to='/class-dashboard'>Class Dashboard</Link>
        </nav>
        <Outlet/>
      </div>
   );

}

export default App;
