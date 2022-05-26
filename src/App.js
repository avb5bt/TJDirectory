import './App.css';
import { Link, Outlet} from "react-router-dom"
import Banner from './components/banner';
import { Button } from '@mui/material';

// add styling to the links 
// embed the links differently 
// access class page/teacher dashboard through class dashboard 

function App() {
  return (
       <div className='App'>
         <Banner/>
          <Button component={Link} 
          to="/teacher-directory" 
          variant="outlined" 
          color="primary">
          Teacher Directory</Button>

          <Button component={Link} 
          to="/student-directory" 
          variant="outlined" 
          color="primary">
          Student Directory</Button>

          <Button component={Link} 
          to="/class-page" 
          variant="outlined" 
          color="primary">
          Class Page</Button>

          <Button component={Link} 
          to="/school-calendar" 
          variant="outlined" 
          color="primary">
          School Calendar</Button>

          <Button component={Link} 
          to="/class-dashboard" 
          variant="outlined" 
          color="primary">
          Class Dashboard</Button>
        <Outlet/>
      </div>
   );

}

export default App;
