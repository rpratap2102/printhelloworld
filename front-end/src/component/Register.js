import React, { useState } from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import LoadingSpinner from "./Spinner";
import { useNavigate} from "react-router-dom";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };
  const handleSubmit = async (event) => {
    if (username === "" || password === "" || confirmPassword === "") {
      alert("Enter the complete registration detail");
      return;
    }
     if (password !== confirmPassword){
      alert("Password and confirm password does not match")
      return
    }
    setIsLoading(true)
    const response = await fetch(
      `https://printhelloworldback.azurewebsites.net/api/user?u=${username}&p=${password}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      navigate('/')
      console.log("User registered successfully!");
    } else {
      console.error("Error registering user");
    }
    setIsLoading(false)
  };

  return (
    <header id="home-section">
      <div className="dark-overlay">
        <div className="home-inner container">
          <div className="row">
            <div className="col-lg-8 d-none d-lg-block">
              <h1 className="display-4">
                Find <strong>joy</strong> in every click CheerUp is your online
                <strong> happy place</strong>
              </h1>
              <div className="d-flex">
                <div className="p-4 align-self-start">
                  <CheckCircleOutlined
                    style={{ fontSize: "1.5rem", marginRight: "-2rem" }}
                  />
                </div>
                <div className="p-4 align-self-end">
                  Happiness can be found even in the darkest of times, if one
                  only remembers to turn on the light!
                </div>
              </div>

              <div className="d-flex">
                <div className="p-4 align-self-start">
                  <CheckCircleOutlined
                    style={{ fontSize: "1.5rem", marginRight: "-2rem" }}
                  />
                </div>
                <div className="p-4 align-self-end">
                  Happiness is not something ready-made. It comes from your own
                  actions.!
                </div>
              </div>

              <div className="d-flex">
                <div className="p-4 align-self-start">
                  <CheckCircleOutlined
                    style={{ fontSize: "1.5rem", marginRight: "-2rem" }}
                  />
                </div>
                <div className="p-4 align-self-end">
                  The happiness of your life depends upon the quality of your
                  thoughts!
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card bg-primary text-center card-form">
                <div className="card-body">
                  <h3 className="mt-2">Sign Up Today</h3>
                  <p>Please fill out the registration form</p>
                  <form>
                  {isLoading ? (
                      <LoadingSpinner />
                    ) : (<div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control form-control-lg mt-4 mb-3"
                        placeholder="Username"
                        value={username}
                        onChange={handleUsernameChange}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control form-control-lg mt-3 mb-3"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control form-control-lg mt-3 mb-3"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                      />
                    </div>
                    </div>)}
                    <input
                      type="submit"
                      value="Submit"
                      className="btn btn-outline-light btn-block mt-4 mb-2"
                      onClick={handleSubmit}
                      disabled= {isLoading}
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default RegisterForm;
