import { BankLoginContext } from './BankLoginContext';
import { useState, useEffect } from 'react';

function BankLoginStore({ children }) {
  const [userLoginStatus, setUserLoginStatus] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [err, setErr] = useState(null);

  // Function to handle user login (pass navigate as an argument)
  async function loginUser(bankCred, navigate) {
    try {
      const res = await fetch("http://localhost:3000/bbRegistrations");
      const data = await res.json();

      const user = data.find(
        (bank) => bank.email === bankCred.email && bank.password === bankCred.password
      );

      if (user) {
        setUserLoginStatus(true);
        setCurrentUser(user);
        localStorage.setItem("bloodBankUser", JSON.stringify(user));

        if (navigate) navigate("/bbDash"); // Navigate after successful login
      } else {
        setErr("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErr("Something went wrong. Please try again later.");
    }
  }

  // Function to logout user (pass navigate as an argument)
  function logoutUser(navigate) {
    setUserLoginStatus(false);
    setCurrentUser(null);
    localStorage.removeItem("bloodBankUser");

    if (navigate) navigate("/bbLogin");
  }

  // Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("bloodBankUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setUserLoginStatus(true);
    }
  }, []);

  return (
    <BankLoginContext.Provider value={{ userLoginStatus, loginUser, logoutUser, currentUser, setCurrentUser, err }}>
      {children}
    </BankLoginContext.Provider>
  );
}

export default BankLoginStore;
