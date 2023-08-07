import React, { useState } from "react";
import { Link } from "react-router-dom";
import SignUpForm from "./SignupForm";
import LoginForm from "./LoginForm";
import { authService } from "../utils/auth";

const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [isActive, setIsActive] = useState(false); 

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowModal(true);

  };

  const toggleHamburger = () => {   // <- Here's the new toggleHamburger function
    setIsActive(!isActive);
  }

  return (
    <>
      <nav className="navbar has-background-info" role="navigation" aria-label="main navigation">
        <div className="container">
          <div className="navbar-item">
            <Link to="/" className="button hover is-success is-medium is-rounded">

              Home
            </Link>
            <button className={`navbar-burger ${isActive ? "is-active" : ""}`} aria-label="menu" aria-expanded="false" onClick={toggleHamburger}>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </button>
          </div>
          <div className={`navbar-menu ${isActive ? "is-active" : ""}`}>
            <div className="navbar-end">
              <Link to="/search-cards" className="navbar-item button hover is-success is-medium is-rounded">Search For Calms</Link>
              {authService.loggedIn() ? (
                <>
                  <Link to="/saved" className="navbar-item button hover is-success is-medium is-rounded">See Your Calms</Link>
                  <Link to="/play" className="navbar-item button hover is-success is-medium is-rounded">Play</Link>
                  <button className="navbar-item button hover is-success is-medium is-rounded" onClick={authService.logout}>Logout</button>
                </>
              ) : (
                <button className="navbar-item button hover is-success is-medium is-rounded" onClick={() => setShowModal(true)}>Login/Sign Up</button>

              )}
            </div>
          </div>
        </div>
      </nav>
      
      <div className={`modal ${showModal ? "is-active" : ""}`}>
        <div className="modal-background" onClick={() => setShowModal(false)}></div>
        <div className="modal-content">
          <div className="tabs">
            <ul>
              <li className="is-active">
                <a onClick={() => {
                  document.getElementById("signup-section").style.display="none"
                  document.getElementById("login-section").style.display="block"

                }}>Login</a>
              </li>
              <li className="is-active">
                <a onClick={() => {
                    document.getElementById("signup-section").style.display="block"
                    document.getElementById("login-section").style.display="none"

                }}>Sign Up</a>
              </li>
            </ul>
          </div>
          <div id="login-section" className="tabs-content">
            <div className="tab-pane is-active">
              <LoginForm handleModalClose={() => setShowModal(false)} />
            </div>

          </div>
          <div style={{display:"none"}} id="signup-section" className="tabs-content">
            <div className="tab-pane is-active">
              <SignUpForm handleModalClose={() => setShowModal(false)} />
            </div>
          </div>
        </div>
        <button className="modal-close is-large" aria-label="close" onClick={() => setShowModal(false)}></button>
      </div>
      {/* <div className={`modal ${showModal ? "is-active" : ""}`}>
        <div className="modal-background" onClick={() => setShowModal(false)}></div>
        <div className="modal-content">
          <div className="tabs">
            <ul>
              <li className="is-active">
                <a onClick={() => setShowModal(true)}>Login</a>
              </li>
              <li className="is-active">
                <a onClick={() => setShowModal(true)}>Sign Up</a>
              </li>
            </ul>
          </div>
          <div className="tabs-content">
            <div className="tab-pane is-active">
              <SignUpForm handleModalClose={() => setShowModal(false)} />
            </div>
          </div>
          
        </div>
        <button className="modal-close is-large" aria-label="close" onClick={() => setShowModal(false)}></button>
      </div> */}
    </>
  );
};

export default AppNavbar;
