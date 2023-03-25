import React, { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { CheckCircleOutlined } from "@ant-design/icons";

function LoginPage() {
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(
      `http://printhelloworldback.azurewebsites.net/api/user?u=${username}&p=${password}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    switch (response.status) {
      case 200:
        const res = await fetch(
          `https://printhelloworldback.azurewebsites.net/api/status?u=${username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.status === 200) {
          let body = await res.json();
          setUser({
            name: username,
            progress: body.progress,
            question: body.q_index,
          });
        } else {
          setUser({ name: username, progress: [], question: 0 });
        }
        console.log("Login successfully!");
        break;
      case 401:
        setPassword("");
        alert("Unauthorized");
        break;
      default:
        console.log("error");
        break;
    }
  };

  return (
    // <div className="container">
    //   <h3 className="text-center item-center">Log In</h3>
    //   <Form onSubmit={handleSubmit}>
    //     <Form.Group controlId="formUsername">
    //       <Form.Label>Email or Username</Form.Label>
    //       <Form.Control
    //         type="text"
    //         placeholder="Enter email or username"
    //         value={username}
    //         onChange={handleUsernameChange}
    //         required
    //       />
    //     </Form.Group>

    //     <Form.Group controlId="formPassword">
    //       <Form.Label>Password</Form.Label>
    //       <Form.Control
    //         type="password"
    //         placeholder="Password"
    //         value={password}
    //         onChange={handlePasswordChange}
    //         required
    //       />
    //       <Form.Check
    //         type="checkbox"
    //         label="Remember me"
    //         checked={rememberMe}
    //         onChange={handleRememberMeChange}
    //       />
    //     </Form.Group>

    //     <Button variant="primary" type="submit">
    //       Log In
    //     </Button>

    //     <p className="text-blue-600">
    //       <Link to="/register" smooth="true" offset={-100} duration={500}>
    //         Create Account
    //       </Link>
    //     </p>
    //   </Form>
    // </div>
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
                  <h3 className="mt-2">Sign In</h3>
                  <p>Please sign in for cheerup</p>
                  <form>
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
                    <input
                      type="submit"
                      value="Submit"
                      className="btn btn-outline-light btn-block mt-4 mb-2"
                      onClick={handleSubmit}
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

export default LoginPage;
