import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import FindADoctor from "./pages/FindADoctor/FindADoctor";
import DoctorDetail from "./pages/DoctorDetail/DoctorDetail";
import DoctorAvailability from "./pages/DoctorAvailability/DoctorAvailability";
import ProtectedRoute from "./util/ProtectedRoute.jsx";
import CreateAppointment from "./pages/CreateAppointment/CreateAppointment.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/find-a-doctor" element={<FindADoctor />} />
        {/* <Route path="/create-appointment" element={<CreateAppointment />} /> */}
        <Route
          path="/doctor/my-availability"
          element={
            <ProtectedRoute requireDoctor={true}>
              <DoctorAvailability />
            </ProtectedRoute>
          }
        />
        <Route path="/doctor/:id" element={<DoctorDetail />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
