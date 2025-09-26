import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

// Import pages - Fixed import names
import SessionDetails from "./ScheduleComponents/SessionDetails/SessionDetails"; 
import DisplaySession from "./ScheduleComponents/SessionDisplay/SessionDisplay";
import AddSession from "./ScheduleComponents/AddSession/AddSession";
import UpdateSession from './ScheduleComponents/UpdateSession/UpdateSession';
import InstructorsPage from './ScheduleComponents/AddSession/InstructorsPage';

function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<InstructorsPage />} />
        <Route path="/sessions" element={<SessionDetails />} />
        <Route path="/session/:id" element={<DisplaySession />} /> 
        <Route path="/add-session" element={<AddSession />} />
        <Route path="/update-session/:id" element={<UpdateSession />} />
        <Route path="/instructors" element={<InstructorsPage />} />
      </Routes>
    </Router>
  );
}

export default App;