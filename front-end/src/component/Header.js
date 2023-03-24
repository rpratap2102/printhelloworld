import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { UserContext } from "../App";

function Header() {
  const { user, setUser } = useContext(UserContext);

  const Logout = () => {
    setUser("");
  };
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Your Buddy</Navbar.Brand>

          {user && (
            <div className="d-flex">
              <p className="m-2 text-lg text-light">{user}</p>
              <Link to="/login">
                <Button onClick={Logout}>LogOut</Button>
              </Link>
            </div>
          )}
          {user == null && (
            <Link to="/login">
              <Button>SIGN IN</Button>
            </Link>
          )}
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
