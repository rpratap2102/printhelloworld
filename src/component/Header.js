import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { UserContext } from "../App";
import { UserOutlined } from "@ant-design/icons";

function Header() {
  const { user, setUser } = useContext(UserContext);

  const Logout = () => {
    setUser("");
  };
  return (
    <>
      {/* <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Your Buddy</Navbar.Brand>

          {user.name && (
            <div className="d-flex">
              <p className="m-2 text-lg text-light">{user.name}</p>
              <Link to="/login">
                <Button onClick={Logout}>LogOut</Button>
              </Link>
            </div>
          )}
          {user.name == null && (
            <Link to="/login">
              <Button>SIGN IN</Button>
            </Link>
          )}
        </Container>
      </Navbar> */}
      <nav
        className="navbar navbar-expand-sm bg-dark navbar-dark fixed-top"
        id="main-nav"
      >
        <div className="container">
          <span className="navbar-brand">CheerUp</span>
          <button
            className="navbar-toggler"
            data-toggle="collapse"
            data-target="#navbarCollapse"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav">
              {!user.name && (
                <>
                  <Link to="/login" className="nav-text">
                    Login
                  </Link>
                  <Link to="/register" className="nav-text">
                    Register
                  </Link>
                </>
              )}
              {user.name && (
                <>
                  <Link to="/" className="nav-text">
                    ChatBot
                  </Link>
                  <Link to="/login" className="nav-text">
                    Logout
                  </Link>
                </>
              )}
            </ul>
          </div>
          {user.name && (
            <>
              <span className="float-right">
                <UserOutlined
                  style={{
                    fontSize: "1.6em",
                    marginRight: "8px",
                    paddingTop: "5px",
                  }}
                />
                {user.name || "Jay Jha"}
              </span>
            </>
          )}
        </div>
      </nav>
    </>
  );
}

export default Header;
