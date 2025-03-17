import React from 'react'
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import './BBRegister.css'

function BBRegister() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  let navigate = useNavigate();
  const [err, setErr] = useState("");
  const password = watch("password");

  async function onBBRegister(newBank) {
    try {
      let res = await fetch("http://localhost:3000/bbRegistrations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(newBank),
      });
      let data = await res.json();
      if (res.ok) {
        console.log(data)
        navigate("/bbLogin");
      } else {
        setErr(data.message);
      }
    } catch (err) {
      setErr(err.message);
    }
  }

  return (
    <div className="register">
      <div className="child1">
        <h3 className="h3 fw-bold">Join us to save lives! Register your blood bank today.</h3>
        <img src="https://media.istockphoto.com/id/1488086932/vector/a-female-volunteer-donates-blood-in-a-hospital.jpg?s=612x612&w=0&k=20&c=8Ypo7fI0pPzHjVY1Mc3F-9VOFrk_yCu6nH8khzdNQ-E=" alt="Register" />
      </div>
      <div className="child2">
        <p className="mt-3 p fs-5">Already registered? <Link to="/bbLogin">Login</Link> to manage your inventory.</p>
        <h1>Blood Bank Registration</h1>
        {err && <p className="text-danger">{err}</p>}
        <form className="mx-auto mt-3 p-4 mb-5 bg-light" onSubmit={handleSubmit(onBBRegister)}>
          <div className='c1'>
          <div className="mb-3 c2">
            <label className="form-label">Blood Bank Name</label>
            <input type="text" className="form-control" {...register("name", { required: true })} />
            {errors.name && <p className="text-danger">*Required</p>}
          </div>
          <div className="mb-3 c2">
            <label htmlFor="password" className='form-label'>Password</label>
            <input type="password" id='password' className='form-control' {...register("password", { required: true })} />
            {errors.password?.type === 'required' && <p className="text-danger">*Password is required</p>}
          </div>
          </div>
          <div className='c1'>
          <div className="mb-3 c2">
            <label className="form-label">Contact Person</label>
            <input type="text" className="form-control" {...register("contactPerson", { required: true })} />
            {errors.contactPerson && <p className="text-danger">*Required</p>}
          </div>
          <div className="mb-3 c2">
            <label className="form-label">Phone</label>
            <input type="tel" className="form-control" {...register("phone", { required: true, pattern: { value: /^[1-9]{1}[0-9]{9}$/, message: "Invalid phone number" } })} />
            {errors.phone && <p className="text-danger">{errors.phone.message || "*Required"}</p>}
          </div>
          </div>
          <div className='c1'>
          <div className="mb-3 c2">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" {...register("email", { required: true, pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Invalid email address" } })} />
            {errors.email && <p className="text-danger">{errors.email.message || "*Required"}</p>}
          </div>
          <div className="mb-3 c2">
            <label className="form-label">Address</label>
            <input type="text" className="form-control" {...register("address", { required: true })} />
            {errors.address && <p className="text-danger">*Required</p>}
          </div>
          </div>
          <div className='c1'>
          <div className="mb-3 c2">
            <label className="form-label">City</label>
            <input type="text" className="form-control" {...register("city", { required: true })} />
            {errors.city && <p className="text-danger">*Required</p>}
          </div>
          <div className="mb-3 c2">
            <label className="form-label">State</label>
            <input type="text" className="form-control" {...register("state", { required: true })} />
            {errors.state && <p className="text-danger">*Required</p>}
          </div>
          </div>
          <div className="button mt-4">
            <button className="b w-50">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default BBRegister