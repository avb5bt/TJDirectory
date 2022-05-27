import './App.css';
import { Link, Outlet} from "react-router-dom"
import Banner from './components/banner';
import { Button } from '@mui/material';
import { Container } from '@mui/system';

// add styling to the links 
// embed the links differently 
// access class page/teacher dashboard through class dashboard 

function App() {
  return (
       <div className='App'>
         <Banner/>
         <div className='container'>
         <div className='navbar'>
          <Button component={Link} 
          to="/teacher-directory" 
          variant="outlined" 
          style={{
            borderRadius: 35,
            backgroundColor: "#FFFFFF"}}>
          Teacher Directory</Button>
          </div>
          <div className='navbar'>
          <Button component={Link} 
          to="/student-directory" 
          variant="outlined" 
          style={{
            borderRadius: 35,
            backgroundColor: "#FFFFFF"}}>
          Student Directory</Button>
          </div>
          <div className='navbar'>
          <Button component={Link} 
          to="/school-calendar" 
          variant="outlined" 
          color="primary"
          style={{
            borderRadius: 35,
            backgroundColor: "#FFFFFF"}}>
          School Calendar</Button>
          </div>
          <div className='navbar'>
          <Button component={Link} 
          to="/class-dashboard" 
          variant="outlined" 
          style={{
            borderRadius: 35,
            backgroundColor: "#FFFFFF"}}>
          Class Dashboard</Button>
          </div>
          </div>
        <Outlet/>
      </div>
   );

}

export default App;
