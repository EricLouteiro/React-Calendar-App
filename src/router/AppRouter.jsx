import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CalendarScreen } from "../components/calendar/CalendarScreen";
import { LoginScreen } from "../components/login/LoginScreen";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/" element={<CalendarScreen />} />
        <Route path="/*" element={<CalendarScreen />} />
      </Routes>
    </BrowserRouter>
  );
};
