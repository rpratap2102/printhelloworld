import React, { useContext ,useState} from 'react';
import { Button, Form } from 'react-bootstrap';
import {Link} from 'react-router-dom'
import { UserContext } from '../App';

function LoginPage() {
const {  setUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
    const response = await fetch(`http://printhelloworldback.azurewebsites.net/api/user?u=${username}&p=${password}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    if (response.ok) {
        setUser(username)
        console.log("Login successfully!");
      } else {
        console.error("Error ");
      }
    
  };

  return (
    <div className="container">
        <h3 className='text-center item-center'>Log In</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>Email or Username</Form.Label>
          <Form.Control type="text" placeholder="Enter email or username" value={username} onChange={handleUsernameChange} />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
          <Form.Check type="checkbox" label="Remember me" checked={rememberMe} onChange={handleRememberMeChange} />
          
        </Form.Group>

        <Button variant="primary" type="submit">
          Log In
        </Button>
        
        <p className='text-blue-600' ><Link to="/register" smooth={true} offset={-100} duration={500}>Create Account</Link></p>
      </Form>
    </div>
  );
}

export default LoginPage;