import React from 'react';
import './index.css';
import App from './App';
import { render } from "react-dom"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StudentDirectory from './components/studentDirectory';
import TeacherDirectory from './components/teacherDirectory';
import ClassDashboard from './components/classDashboard';
import ClassPage from './components/classPage';
import SchoolCalendar from './components/schoolCalendar';

const rootElement = document.getElementById("root");
render(
<BrowserRouter>
<Routes>
      <Route path="/" element={<App />}>
        <Route path="teacher-directory" element={<TeacherDirectory/>} />
        <Route path="student-directory" element={<StudentDirectory />} />
        <Route path="class-page" element={<ClassPage/>} />
        <Route path="school-calendar" element={<SchoolCalendar/>} />
        <Route path="class-dashboard" element={<ClassDashboard/>} />
      </Route>
    </Routes>
</BrowserRouter>, 
rootElement
);
