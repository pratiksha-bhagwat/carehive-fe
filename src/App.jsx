import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}
