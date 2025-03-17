import React, { useEffect, useContext } from 'react';
import './BBLogin.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BankLoginContext } from '../../contexts/BankLoginContext';
import { MdEmail } from "react-icons/md";
import { IoLockClosed } from "react-icons/io5";

function BBLogin() {
  let { loginUser, userLoginStatus, currentUser, err } = useContext(BankLoginContext);
  const { register, handleSubmit } = useForm();
  let navigate = useNavigate(); // Ensure navigate is inside a component

  async function onBBLogin(bankCred) {
    loginUser(bankCred, navigate); // Pass navigate as an argument
  }

  useEffect(() => {
    if (userLoginStatus === true && currentUser) {
      localStorage.setItem("bloodBankId", currentUser.id);
      navigate('/bbDash', { replace: true });
    }
  }, [userLoginStatus, currentUser, navigate]);

  return (
    <div className="bblogin">
      <div className="blob"></div>
      <div className="main1">
        <div className="login">
          <form onSubmit={handleSubmit(onBBLogin)}>
            <h2 className='login-h2'>Login</h2>
            {err && <p className="error-message">{err}</p>}
            <div className="input-box">
              <span className="icon"><MdEmail /></span>
              <input type="email" {...register("email", { required: true })} required />
              <label htmlFor='email'>Email</label>
            </div>
            <div className="input-box">
              <span className="icon"><IoLockClosed /></span>
              <input type="password" {...register("password", { required: true })} required />
              <label htmlFor='pass'>Password</label>
            </div>
            <div className="remember-forgot">
              <label><input type="checkbox" />Remember me</label>
              <Link className='forgot'>Forgot Password</Link>
            </div>
            <button className='bblogin-btn' type="submit">Login</button>
            <div className="register-link">
              <p className='login-p'>Don't have an account? <Link className='regis_link' to="/bbRegister">Register</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BBLogin;
