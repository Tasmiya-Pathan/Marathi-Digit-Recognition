import React, { useState } from "react";
import { register } from "../firebaseConfig";
import { getDatabase, ref, set, get } from "firebase/database";
import { BrowserRouter as Router, Routes, Route,Link  } from "react-router-dom";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function NavbarComponent(props) {

  const [registershow, setregistershow] = useState(false);
  const [loginshow, setloginshow] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [registerData, setRegisterData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [registerErrors, setRegisterErrors] = useState({});

  const logout =()=>{
    props.setLoggedStatus(false)
    props.setCurrentAccount("")
    Cookies.remove('userstatus');
    toast.success("Logged out ");
  }

  const handlePhoneNumberChange = (event) => {
    const enteredPhoneNumber = event.target.value;
    setPhoneNumber(enteredPhoneNumber);
    if (enteredPhoneNumber.length !== 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "Phone number must be 10 digits long",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: "" }));
    }
  };

  const handlePasswordChange = (event) => {
    const enteredPassword = event.target.value;
    setPassword(enteredPassword);
    if (enteredPassword.length < 8) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 8 characters long",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }
  };

  const handleLogin = async () => {
    const errors = {};
    if (!phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    } else if (phoneNumber.length !== 10) {
      errors.phoneNumber = "Phone number must be 10 digits long";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    } else {
      const db = getDatabase();
      const userRef = ref(db, "PlantDetectionMRCNN/users/" + phoneNumber);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      if (!userData) {
        toast.error("Login Failed ");
        
        //props.setCurrentlogged(true);
      }
      else{
        if(userData.phoneNumber===phoneNumber && userData.password===password){
          props.setCurrentAccount(phoneNumber);
          props.setColors(userData.colorData) 
          debugger
          props.setfontsized(userData.sizeData)
          props.setLoggedStatus(true);
          setPhoneNumber("")
          Cookies.set('userstatus', true); 
          setPassword("")
          toast.success("Login success ");
          setloginshow(false)
        }
        else{
          toast.error("Login Failed ");
          //props.setLoggedStatus(false);
        }
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleRegister = () => {
    const errors = {};

    if (!registerData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!registerData.phoneNumber || registerData.phoneNumber.length !== 10) {
      errors.phoneNumber = "Phone number must be 10 digits long";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!registerData.email || !emailRegex.test(registerData.email)) {
      errors.email = "Enter a valid email address";
    }

    if (!registerData.password || registerData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    } else {
      register(registerData);
      setRegisterData({
        name: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setRegisterErrors({});
      toast.success('register successful.');
      setregistershow(false)
    }
  };

  return (
    <>
    <nav className="navbar navbar-dark" style={{ backgroundColor: "#051922" }}>
    <a className="navbar-brand" style={{fontSize:"25px",fontWeight:"bold"}}>
    Plant Disease  Detection using Mask R-CNN
    </a>
    <div className="form-inline">
   
      {props.loggedStatus ? (
        <>
          <Link to="/" className="btn btn-outline-success my-2 my-sm- mr-2">
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </Link>
  
          <button
            className="btn btn-outline-danger my-2 my-sm-0"
            onClick={logout}
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </>
      ) : (
        <>
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            onClick={()=>{setloginshow(true)}}
          >
            <i className="fas fa-sign-in-alt"></i> Login
          </button>
          <button
            className="btn btn-outline-success my-2 my-sm-0 ml-2"
            onClick={()=>{setregistershow(true)}}
          >
            <i className="fas fa-user-plus"></i> Register
          </button>
        </>
      )}
    </div>
  </nav>
  
        {loginshow?(
      <div
        className="modal fade show"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{paddingRight:"17px",display:"block"}} aria-modal="true" role="dialog"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Login
              </h5>
              <button
                type="button"
                className="close"
                onClick={()=>{setloginshow(false)}}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="phone-number" className="col-form-label">
                    Phone Number:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone-number"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                  />
                  {errors.phoneNumber && (
                    <div className="text-danger">{errors.phoneNumber}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="password" className="col-form-label">
                    Password:
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  {errors.password && (
                    <div className="text-danger">{errors.password}</div>
                  )}
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={()=>{setloginshow(false)}}
              >
                Close
              </button>
              <button type="button" className="btn btn-success" onClick={handleLogin}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
      ):("")}
      {registershow? (            
      <div className="modal fade show" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" style={{paddingRight:"17px",display:"block"}} aria-modal="true" role="dialog">
    
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="registerModalLabel">
                Register
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
               onClick={()=>{setregistershow(false)}}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="name" className="col-form-label">
                    Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={registerData.name}
                    onChange={handleInputChange}
                  />
                  {registerErrors.name && (
                    <div className="text-danger">{registerErrors.name}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber" className="col-form-label">
                    Phone Number:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={registerData.phoneNumber}
                    onChange={handleInputChange}
                  />
                  {registerErrors.phoneNumber && (
                    <div className="text-danger">
                      {registerErrors.phoneNumber}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="col-form-label">
                    Email:
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleInputChange}
                  />
                  {registerErrors.email && (
                    <div className="text-danger">{registerErrors.email}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="password" className="col-form-label">
                    Password:
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleInputChange}
                  />
                  {registerErrors.password && (
                    <div className="text-danger">{registerErrors.password}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="col-form-label">
                    Confirm Password:
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  {registerErrors.confirmPassword && (
                    <div className="text-danger">
                      {registerErrors.confirmPassword}
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={()=>{setregistershow(false)}}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleRegister}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>):("")}
    </>
  );
}

export default NavbarComponent;
