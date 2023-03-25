import React, { useContext, useState } from "react";
import { UserContext } from "../App";
import { redirect } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { CheckCircleOutlined } from "@ant-design/icons";

function RegisterForm() {
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
      redirect("/");
      console.log("User registered successfully!");
    } else {
      console.error("Error registering user");
    }
  };

  return (
    // <Container>
    //   <h3 className="text-center item-center">Register</h3>
    //   <Form onSubmit={handleSubmit}>
    //     <Form.Group controlId="formBasicEmail">
    //       <Form.Label>Username</Form.Label>
    //       <Form.Control
    //         className="mb-3"
    //         type="text"
    //         placeholder="Enter username"
    //         value={username}
    //         onChange={handleUsernameChange}
    //       />
    //     </Form.Group>

    //     <Form.Group controlId="formBasicPassword">
    //       <Form.Label>Password</Form.Label>
    //       <Form.Control
    //         className="mb-3"
    //         type="password"
    //         placeholder="Password"
    //         value={password}
    //         onChange={handlePasswordChange}
    //       />
    //     </Form.Group>

    //     <Button variant="primary" type="submit">
    //       Submit
    //     </Button>
    //   </Form>
    // </Container>
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
                  <p>Please fill out this form to register</p>
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
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control form-control-lg mt-3 mb-3"
                        placeholder="Confirm Password"
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

export default RegisterForm;
