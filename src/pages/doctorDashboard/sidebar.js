import React, { useState } from "react";
import doctor_img from "../../assets/img/doctor-profile-img.jpg";
import { Link } from "react-router-dom";
import { Calendar } from "react-feather";
import { Nav } from "react-bootstrap";
import { callPutApi } from "../../_service";
import { STORAGE } from "../../constants";
import { getLocalStorage, setLocalStorage } from "../../helpers/storage";
import { toastMessage } from "../../config/toast";

const DoctorSidebar = ({ doctorDetails }) => {
  const { firstName, lastName, achievement, designation, availability } =
    doctorDetails?.profile;

  const [isAvailability, setAvailability] = useState(availability || false);

  const handleUpdate = async (isAvl) => {
    setAvailability(isAvl);
    try {
      const verifyResponse = await callPutApi(`/doctor/${doctorDetails?._id}`, {
        availability: isAvl,
      });

      if (!verifyResponse.status) throw new Error(verifyResponse.message);
      toastMessage("success", "You availability is updated now");
      const userProfile = getLocalStorage(STORAGE.USER_KEY);
      let profile = userProfile.profile;

      let updatedStorage = {
        ...userProfile,
        profile: {
          ...profile,
          availability: isAvl,
        },
      };

      setLocalStorage(STORAGE.USER_KEY, updatedStorage);
    } catch (error) {
      setAvailability(!isAvl);
      toastMessage("error", "Availability update process failed!");
    }
  };

  return (
    <div>
      <div className="profile-sidebar doctor-sidebar profile-sidebar-new">
        <div className="widget-profile pro-widget-content">
          <div className="profile-info-widget">
            <Link to="#" className="booking-doc-img">
              <img
                src={doctorDetails?.coverImage || doctor_img}
                alt="User Image"
              />
            </Link>
            <div className="profile-det-info">
              <h3>
                <a href="#">
                  Dr {`${firstName || ""} ${lastName || ""}` || ""}
                </a>
              </h3>
              <div className="patient-details">
                <h5 className="mb-0">{achievement || ""}</h5>
              </div>
              <span className="badge doctor-role-badge">
                <i className="fa-solid fa-circle"></i>
                {designation || ""}
              </span>
            </div>
          </div>
        </div>
        <div className="doctor-available-head">
          <div className="input-block input-block-new">
            <label className="form-label">
              Availability <span className="text-danger">*</span>
            </label>
            <select
              className="select form-control"
              value={isAvailability ? "I am Available Now" : "Not Available"}
              onChange={(e) => {
                handleUpdate(e.target.value === "I am Available Now");
              }}
            >
              <option value="I am Available Now">I am Available Now</option>
              <option value="Not Available">Not Available</option>
            </select>
          </div>
        </div>
        <div className="dashboard-widget">
          <Nav variant="pills" className="flex-column dashboard-menu">
            <Nav.Item>
              <Nav.Link eventKey="first">
                {" "}
                <i className="fa-solid fa-shapes"></i> Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second">
                {" "}
                <Calendar /> Requests
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="third">
                {" "}
                <i className="fa-solid fa-user-injured"></i> My Patients
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="fourth">
                {" "}
                <Calendar /> Appointments
              </Nav.Link>
            </Nav.Item>
            {/* 
                                            <Nav.Item>
                                                <Nav.Link eventKey="fifth">  <MessageCircle /> Message</Nav.Link>
                                            </Nav.Item> */}
            <Nav.Item>
              <Nav.Link eventKey="fifth">
                {" "}
                <i className="fa-solid fa-user-pen"></i> Profile Settings{" "}
              </Nav.Link>
            </Nav.Item>
            {/* <Nav.Item>
              <Nav.Link eventKey="six">
                <LogOut /> Logout{" "}
              </Nav.Link>
            </Nav.Item> */}
          </Nav>
        </div>
      </div>
    </div>
  );
};

export default DoctorSidebar;