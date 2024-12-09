import React from "react";
import user_img from "../../assets/img/doctor-profile-img.jpg";
import useGetMountData from "../../helpers/getDataHook";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { getDateFormate, getIdLastDigits } from "../../helpers/utils";
import NotFound from "../../components/common/notFound";

const Requests = () => {
  const userProfileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;

  const {
    data: Appointments,
    loading,
    getAllData,
  } = useGetMountData(
    `/doctor/appointment/${userProfileId}?status=Pending&time=today`
  );

  const getByFilter = async (filter) => {
    console.log(filter, "filterrr");
    await getAllData(
      `/doctor/appointment/${userProfileId}?status=Pending&time=${filter}`
    );
  };

  const handleUpdate = async (isAvl) => {
    // setAvailability(isAvl);
    // try {
    //   const verifyResponse = await callPutApi(`/doctor/${doctorDetails?._id}`, {
    //     availability: isAvl,
    //   });

    //   if (!verifyResponse.status) throw new Error(verifyResponse.message);
    //   toastMessage("success", "You availability is updated now");
    //   const userProfile = getLocalStorage(STORAGE.USER_KEY);
    //   let profile = userProfile.profile;

    //   let updatedStorage = {
    //     ...userProfile,
    //     profile: {
    //       ...profile,
    //       availability: isAvl,
    //     },
    //   };

    //   setLocalStorage(STORAGE.USER_KEY, updatedStorage);
    // } catch (error) {
    //   setAvailability(!isAvl);
    //   toastMessage("error", "Availability update process failed!");
    // }
  };

  return (
    <div>
      <div class="dashboard-header">
        <h3>Requests</h3>
        <ul>
          <li>
            <div class="dropdown header-dropdown">
              <select
                className="select form-control"
                // value={filter}
                onChange={(e) => {
                  getByFilter(e.target.value);
                }}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </li>
        </ul>
      </div>
      <NotFound
        loading={loading}
        isData={Appointments?.length > 0}
        message="No appointments found."
      />
      {!loading &&
        Appointments &&
        Appointments?.map((it, index) => {
          return (
            <div class="appointment-wrap">
              <ul>
                <li>
                  <div class="patinet-information">
                    <a href="#">
                      <img
                        src={it?.patientId?.coverImage || user_img}
                        alt="User Image"
                      />
                    </a>
                    <div class="patient-info">
                      <p>#{getIdLastDigits(it?._id)}</p>
                      <h6>
                        <a href="#">
                          {" "}
                          {it?.appointmentPersonName ||
                            it?.patientId?.firstName}
                        </a>
                        {/* <span class="badge new-tag">New</span> */}
                      </h6>
                    </div>
                  </div>
                </li>
                <li class="appointment-info">
                  <p>
                    <i class="fa-solid fa-clock"></i>
                    {`${getDateFormate(it?.date)} ${it?.time}`}
                  </p>
                  <p class="md-text">General Visit</p>
                </li>
                <li class="appointment-type">
                  <p class="md-text">Type of Appointment</p>
                  <p>
                    <i class="fa-solid fa-video text-blue"></i>{" "}
                    {it?.appointmentType || "General"}
                  </p>
                </li>
                <li>
                  <ul class="request-action">
                    <li>
                      <a
                        onClick={() => handleUpdate(true)}
                        href="#"
                        class="accept-link"
                        data-bs-toggle="modal"
                        data-bs-target="#accept_appointment"
                      >
                        <i class="fa-solid fa-check"></i>Accept
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => handleUpdate(false)}
                        href="#"
                        class="reject-link"
                        data-bs-toggle="modal"
                        data-bs-target="#cancel_appointment"
                      >
                        <i class="fa-solid fa-xmark"></i>Reject
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          );
        })}
    </div>
  );
};

export default Requests;