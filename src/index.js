import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import PatientDashboard from "./pages/patient/Patient";
import DoctorList from "./pages/doctorList/DoctorList";
import DoctorProfile from "./pages/doctorProfile/DoctorProfile";
import DoctorDashboard from "./pages/doctorDashboard/DoctorDashboard";
import Pharmacy from "./pages/pharmacy/Pharmacy";
import ProductDesc from "./components/pharmacy/ProductDesc";
import Cart from "./components/pharmacy/Cart";
import Checkout from "./components/pharmacy/Checkout";
import VirtualConsultation from "./pages/services/VirtualConsultation";
import DoctorBooking from "./pages/BookingDetail/DoctorBooking";
import OrderSuccess from "./components/pharmacy/OrderSuccess";
import PatientDetails from "./components/doctorBooking/PatientDetails";
import ConsultationType from "./components/doctorBooking/ConsultationType";
import BookingSuccess from "./pages/BookingSuccess/BookingSuccess";
import Career from "./pages/career/Career";
import InvestorRegistration from "./pages/investor/InvestorRegistration";
import Login from "./pages/login/Login";
import DoctorRegister from "./pages/register/DoctorRegister";
import Appointment from "./pages/services/Appointment";
import PrescriptionRefills from "./pages/services/PrescriptionRefills";
import LabTest from "./pages/services/LabTest";
import Diagnostics from "./pages/services/Diagnostics";
import { Provider } from "react-redux";
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/VirtualConsultation"
            element={<VirtualConsultation />}
          />
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/DoctorList" element={<DoctorList />} />
          <Route path="/DoctorProfile" element={<DoctorProfile />} />
          <Route path="/DoctorDashboard" element={<DoctorDashboard />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/ProductDesc" element={<ProductDesc />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/DoctorBooking" element={<DoctorBooking />} />
          <Route path="/OrderSuccess" element={<OrderSuccess />} />
          <Route path="/PatientDetails" element={<PatientDetails />} />
          <Route path="/ConsultationType" element={<ConsultationType />} />
          <Route path="/BookingSuccess" element={<BookingSuccess />} />
          <Route path="/career" element={<Career />} />
          <Route
            path="/InvestorRegistration"
            element={<InvestorRegistration />}
          />
          <Route path="/Login" element={<Login />} />
          <Route path="/DoctorRegister" element={<DoctorRegister />} />
          <Route path="/Appointment" element={<Appointment />} />
          <Route
            path="/PrescriptionRefills"
            element={<PrescriptionRefills />}
          />
          <Route path="/LabTest" element={<LabTest />} />
          <Route path="/Diagnostics" element={<Diagnostics />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
