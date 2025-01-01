import React, { useState } from "react";
import { Button, Col, Form, Modal, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import user_img from "../../assets/img/profile-06.jpg";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { toastMessage } from "../../config/toast";
import { callPostApi } from "../../_service";
import useGetMountData from "../../helpers/getDataHook";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { Key } from "react-feather";


function formatDate(dateString) {
  const date = new Date(dateString);

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return date.toLocaleDateString("en-GB", options);
}


// Validation schema with Yup
const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  file: yup
    .mixed()
    .required("File is required")
    .test("fileSize", "File size is too large", (value) => {
      return value && value[0]?.size <= 2 * 1024 * 1024; // 2MB limit
    }),
});

const Dashboard = ({ data, appointmentData   }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("appointments");
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  const userProfileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;


  
  const handleModelShow=()=>setShowModal(true);
  const handleModelClose=()=>setShowModal(false);

  const handleTabClick = (tab, event) => {
    event.preventDefault();
    setActiveTab(tab);
  };
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const {
      data: Reports,
    } = useGetMountData(
      `/patient/medical/${userProfileId}`
    );

 


  const onSubmit = async (values) => {
    try {
      

      // Step 1: Upload the file
      const file = values.file[0];
      const uploadedFile = await callPostApi(`/user/upload-file`, { file });
      if (!uploadedFile.status) throw new Error(uploadedFile.message);

      // Step 2: Prepare the updated data
      const updatedData = {
        name: values.name,
        attachment: uploadedFile?.data?.file,
        description: values.description,
      };

      // Step 3: Send the data to the API
      const verifyResponse = await callPostApi(`/patient/medical/${userProfileId}`, updatedData);
      if (!verifyResponse.status) throw new Error(verifyResponse.message);

      // Step 4: Notify success and refresh data
      toastMessage("success", "Report is added successfully.");

      setShowModal(false)
    } catch (error) {
      toastMessage("error", error.message || "Report adding process failed!");
    } finally {
      setShowModal(false)
    }
  };
  const renderButton = () => {
    switch (activeTab) {
      case "appointments":
        return (
          <button
            onClick={() => navigate("/doctorlist")}
            className="btn btn-primary"
          >
            Book Appointment
          </button>
        );
      case "medicalRecords":
        return (
          <Button onClick={handleModelShow} className="btn btn-secondary bg-blue-500 text-white">

            Add Medical Record
          </Button>
        );
      case "prescriptions":
        return (
          <button
            onClick={() => console.log("Prescription")}
            className="btn btn-success"
          >
            Request Prescription
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <>
    <Tab.Pane eventKey="first">
      <div className="dashboard-header">
        <h3>Dashboard</h3>
      </div>

      <Col lg="12" xl="12" className="d-flex">
        <div className="dashboard-card w-100">
          <div className="dashboard-card-head">
            <div className="header-title">
              <h5>Reports</h5>
            </div>
            <a href="javascript:void(0);">
              <img
                src={data?.coverImage ?? user_img}
                className="avatar dropdown-avatar"
                alt="Img"
              />
              &nbsp; &nbsp;{data?.profile?.firstName}
            </a>
          </div>
          <div className="dashboard-card-body">
            <div className="account-detail-table">
              <nav className=" relative patient-dash-tab border-0 pb-0 mb-3 mt-3">
                <ul className="nav nav-tabs-bottom" role="tablist">
                  <li className="nav-item" role="presentation">
                    <a
                      className={`nav-link ${
                        activeTab === "appointments" ? "active" : ""
                      }`}
                      href="#appoint-tab"
                      onClick={(event) => handleTabClick("appointments", event)}
                    >
                      Appointments
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className={`nav-link ${
                        activeTab === "medicalRecords" ? "active" : ""
                      }`}
                      href="#medical-tab"
                      onClick={(event) =>
                        handleTabClick("medicalRecords", event)
                      }
                    >
                      Medical Records
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className={`nav-link ${
                        activeTab === "prescriptions" ? "active" : ""
                      }`}
                      href="#prsc-tab"
                      onClick={(event) =>
                        handleTabClick("prescriptions", event)
                      }
                    >
                      Prescriptions
                    </a>
                  </li>
                  <div className="d-flex absolute top-0 right-0">
                    {renderButton()}
                  </div>
                </ul>
              </nav>

              {/* Conditional rendering of tab content */}
              <div className="tab-content pt-0">
                {activeTab === "appointments" && (
                  <div
                    id="appoint-tab"
                    className="tab-pane fade show active"
                    role="tabpanel"
                  >
                    <div className="custom-new-table">
                      <div className="table-responsive">
                        <table className="table table-hover table-center mb-0">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Test Name</th>
                              <th>Date</th>
                              <th>Referred By</th>
                              <th>Amount</th>
                              <th>Comments</th>
                              <th>Status</th>
                              <th></th>
                            </tr>
                          </thead>
                          {appointmentData?.map((el, index) => {
                            return (
                              <tbody key={index}>
                                <tr>
                                  <td>
                                    <a href="javascript:void(0);">
                                      <span className="text-blue">
                                        RE-{el?._id.slice(-3)}
                                      </span>
                                    </a>
                                  </td>
                                  <td>Electro cardiography</td>
                                  <td>{formatDate(el?.date)}</td>
                                  <td>Edalin Hendry</td>
                                  <td>$300</td>
                                  <td>Good take rest</td>
                                  <td>
                                    <span className="badge badge-success-bg">
                                      Normal
                                    </span>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <a
                                        href="#"
                                        className="account-action me-2"
                                      >
                                        <i className="fa-solid fa-prescription"></i>
                                      </a>
                                      <a href="#" className="account-action">
                                        <i className="fa-solid fa-file-invoice-dollar"></i>
                                      </a>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            );
                          })}
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "medicalRecords" && (
                  <div
                    id="medical-tab"
                    className="tab-pane fade show active"
                    role="tabpanel"
                  >
                    <div className="custom-table">
                    <div className="overflow-x-auto">
  <table className="min-w-full table-auto border-collapse border border-gray-200">
    {/* Table Header */}
    <thead className="bg-gray-100">
      <tr>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border border-gray-200">
          Name
        </th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border border-gray-200">
          Description
        </th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border border-gray-200">
          Attachment
        </th>
      </tr>
    </thead>

    {/* Table Body */}
    <tbody>
      {Reports.map((item, index) => (
        <tr
          key={index}
          className={` hover:bg-gray-100`}
        >
          <td className="px-4 py-2 text-sm text-gray-800 border border-gray-200">
            {item.name}
          </td>
          <td className="px-4 py-2 text-sm text-gray-800 border border-gray-200">
            {item.description}
          </td>
          <td className="px-4 py-2 text-sm text-blue-600 border border-gray-200">
            {item.attachment ? (
              <a href={item.attachment} className="hover:underline">
                View Attachment
              </a>
            ) : (
              "No attachment"
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
                    </div>
                  </div>
                )}

                {activeTab === "prescriptions" && (
                  <div
                    id="prsc-tab"
                    className="tab-pane fade show active"
                    role="tabpanel"
                  >
                    <div className="custom-table">
                      <div className="table-responsive">
                        <table className="table table-center mb-0">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Name</th>
                              <th>Created Date</th>
                              <th>Prescribed By</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="text-blue-600">
                                <a
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#view_prescription"
                                >
                                  #PR-123
                                </a>
                              </td>
                              <td>
                                <a
                                  href="javascript:void(0);"
                                  className="lab-icon prescription"
                                >
                                  <span>
                                    <i className="fa-solid fa-prescription"></i>
                                  </span>
                                  Prescription
                                </a>
                              </td>
                              <td>24 Mar 2024, 10:30 AM</td>
                              <td>
                                <h2 className="table-avatar">
                                  <a href="#" className="avatar avatar-sm me-2">
                                    <img
                                      className="avatar-img rounded-3"
                                      src={user_img}
                                      alt="User Image"
                                    />
                                  </a>
                                  <a href="#">Edalin Hendry</a>
                                </h2>
                              </td>
                              <td>
                                <div className="action-item">
                                  <a href="javascript:void(0);">
                                    <i className="fa-solid fa-download"></i>
                                  </a>
                                  <a href="javascript:void(0);">
                                    <i className="fa-solid fa-trash-can"></i>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Tab.Pane>
     {/* Modal for adding medical record */}
     <Modal show={showModal} onHide={handleModelClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Add Medical Record</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          {/* Name Field */}
          <Form.Group className="mb-3" controlId="formRecordName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter record name"
              {...register("name")}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
          </Form.Group>

          {/* Description Field */}
          <Form.Group className="mb-3" controlId="formRecordDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter description"
              {...register("description")}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description?.message}
            </Form.Control.Feedback>
          </Form.Group>

          {/* File Upload Field */}
          <Form.Group className="mb-3" controlId="formFile">
            <Form.Label>Attach File</Form.Label>
            <Form.Control
              type="file"
              {...register("file")}
              isInvalid={!!errors.file}
            />
            <Form.Control.Feedback type="invalid">{errors.file?.message}</Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModelClose} >
            Close
          </Button>
          <Button variant="primary" type="submit" >
           Save medicalRecords
          </Button>
        </Modal.Footer>
      </Form>
     
     
    </Modal>
   </>
  );
};

export default Dashboard;
