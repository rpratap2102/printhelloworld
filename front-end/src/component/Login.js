import React, { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

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
    <div className="container">
      <h3 className="text-center item-center">Log In</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>Email or Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email or username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <Form.Check
            type="checkbox"
            label="Remember me"
            checked={rememberMe}
            onChange={handleRememberMeChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Log In
        </Button>

        <p className="text-blue-600">
          <Link to="/register" smooth="true" offset={-100} duration={500}>
            Create Account
          </Link>
        </p>
      </Form>
    </div>
  );
}

export default LoginPage;
