import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";

function RegisterForm() {

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
  
    const response = await fetch(`http://printhelloworldback.azurewebsites.net/api/user?u=${username}&p=${password}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      
    });
  
    if (response.ok) {
      console.log("User registered successfully!");
    } else {
      console.error("Error registering user");
    }
  };

  return (
    <Container> 
        <h3 className='text-center item-center'>Register</h3>
    <Form onSubmit={handleSubmit}>
        
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control className="mb-3"
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={handleUsernameChange}
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control className="mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>

    </Container>
  );
}

export default RegisterForm;
