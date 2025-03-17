import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import "./EditProfile.css";
import { BankLoginContext } from "../../contexts/BankLoginContext";

function EditProfile() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(BankLoginContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoaded, setFormLoaded] = useState(false);
  const password = watch("password");

  useEffect(() => {
    async function fetchBloodBank() {
      if (!currentUser?.id) return;
      try {
        const res = await fetch(`http://localhost:3000/bbRegistrations/${currentUser.id}`);
        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();
        setCurrentUser(data);

        // Set form values
        Object.keys(data).forEach((key) => setValue(key, data[key]));

        setFormLoaded(true); // Mark form as loaded
      } catch (error) {
        console.error("Error fetching blood bank data:", error);
      }
    }
    fetchBloodBank();
  }, [currentUser?.id, setValue]);

  async function onSave(updatedDetails) {
    if (!currentUser?.id) return;

    try {
      const res = await fetch(`http://localhost:3000/bbRegistrations/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updatedDetails, id: currentUser.id })
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setCurrentUser(updatedUser);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function goToDashboard() {
    closeModal();
    navigate("/bbDash");
  }

  function viewProfile() {
    closeModal();
    navigate("/viewProfile");
  }

  if (!formLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className="edit-profile pb-3">
      <div className="fs-2 ms-4 mt-2 back" onClick={goToDashboard}>
        <IoArrowBackCircleSharp />
      </div>
      <div className="edit-container">
        <h1><FaRegEdit /> Update Blood Bank Profile</h1>
        <form className="mx-auto mt-5 mb-5 fs-5 bg-light" onSubmit={handleSubmit(onSave)}>
          
          <div className="mb-3">
            <label className="form-label">Blood Bank Name</label>
            <input type="text" className="form-control" {...register("name")} />
          </div>

          <div className="mb-3">
            <label className="form-label">Contact Person</label>
            <input type="text" className="form-control" {...register("contactPerson", { required: true })} />
            {errors.contactPerson && <p className="text-danger">*Required</p>}
          </div>

          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input type="tel" className="form-control" {...register("phone", {
              required: true,
              pattern: { value: /^[1-9]{1}[0-9]{9}$/, message: "Invalid phone number" }
            })} />
            {errors.phone && <p className="text-danger">{errors.phone.message || "*Required"}</p>}
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" {...register("email", {
              required: true,
              pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Invalid email address" }
            })} />
            {errors.email && <p className="text-danger">{errors.email.message || "*Required"}</p>}
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input type="text" className="form-control" {...register("address", { required: true })} />
            {errors.address && <p className="text-danger">*Required</p>}
          </div>

          <div className="mb-3">
            <label className="form-label">City</label>
            <input type="text" className="form-control" {...register("city", { required: true })} />
            {errors.city && <p className="text-danger">*Required</p>}
          </div>

          <div className="mb-3">
            <label className="form-label">State</label>
            <input type="text" className="form-control" {...register("state", { required: true })} />
            {errors.state && <p className="text-danger">*Required</p>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" {...register("password", { required: true })} />
            {errors.password && <p className="text-danger">*Required</p>}
          </div>

          <div className="button-container mt-4">
            <button type="submit" className="btn btn-secondary fs-5">Save Changes</button>
          </div>
        </form>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-content">
              <h5>Profile Updated Successfully!</h5>
              <button className="btn btn-secondary mt-3" onClick={goToDashboard}>
                <MdDashboard /> Back to Dashboard
              </button>
              <button className='btn btn-secondary mt-3' onClick={viewProfile}><MdOutlineRemoveRedEye /> View Profile</button>
              <button className="btn btn-primary mt-3" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProfile;
