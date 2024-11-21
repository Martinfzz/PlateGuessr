import React from "react";
import ConnexionBtn from "../ConnexionBtn";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import {
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBBadge,
  MDBBtn,
} from "mdb-react-ui-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

const Navbar = ({ page }) => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  return (
    <>
      <Row className="pt-3 m-0 d-flex justify-content-between">
        {page && (
          <>
            <Col className="d-flex justify-content-start">
              <Link to={"/"}>
                <MDBBtn className="btn-back">
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  <span className="hidden-text">Go Back</span>
                </MDBBtn>
              </Link>
            </Col>
            <Col className="d-flex justify-content-center align-items-center">
              <MDBBadge
                className="page-badge d-flex justify-content-center align-items-center"
                color=""
              >
                {page}
              </MDBBadge>
            </Col>
          </>
        )}
        <Col className="d-flex justify-content-end">
          <div className="position-absolute">
            {user && (
              <MDBDropdown className="user-dropdown">
                <MDBDropdownToggle>
                  <FontAwesomeIcon icon={faUser} className="me-2" />{" "}
                  <span className="hidden-username">{user.username}</span>
                </MDBDropdownToggle>
                <MDBDropdownMenu dark>
                  <Link to={"/me/settings"}>
                    <MDBDropdownItem link>Account</MDBDropdownItem>
                  </Link>
                  <MDBDropdownItem link onClick={handleClick}>
                    <span className="red">Log out</span>
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            )}
            {!user && <ConnexionBtn />}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Navbar;
