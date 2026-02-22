import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

export default function Navbar() {
  const { token, logout, role } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        {role === "admin" ? (<NavLink className="navbar-brand fw-bold text-primary" to="/createJob">
          JobPortal
        </NavLink>) : (<NavLink className="navbar-brand fw-bold text-primary" to="/">
          JobPortal
        </NavLink>)}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {token ? (
              <>
                {role === "admin" ? (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/partOf">
                        Create Category for jobs
                      </NavLink>
                    </li> {/*
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/admin">
                        Admin Panel
                      </NavLink>
                    </li>*/}
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/createJob">
                        Create New Job
                      </NavLink>
                    </li>


                    <li className="nav-item">
                      <NavLink className="nav-link" to="/changeApp">
                        Change Status
                      </NavLink>
                    </li>




                  </>
                ) : (

                  <>



                    <li className="nav-item">
                      <NavLink className="nav-link" to="/home">
                        Home
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/applicated">
                        Aplicated
                      </NavLink>
                    </li>

                    <li className="nav-item">
                      <NavLink className="nav-link" to="/later">
                        Liked
                      </NavLink>
                    </li>



                  </>
                )}
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">
                    Profile
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-primary ms-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
