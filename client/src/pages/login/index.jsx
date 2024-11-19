import React from "react";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MDBBtn } from "mdb-react-ui-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGoogle,
  faApple,
} from "@fortawesome/free-brands-svg-icons";
import EmailForm from "./EmailForm";

const LogIn = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100%" }}
    >
      <div>
        <Col>
          <EmailForm />
          <div className="d-flex text-center">
            <Col>
              <div className="divider-container text-muted my-4">
                <div className="divider-border" />
                <span className="divider-content">or continue with</span>
                <div className="divider-border" />
              </div>
              <Col>
                <MDBBtn
                  rounded
                  className="m-2"
                  style={{
                    backgroundColor: "#dd4b39",
                    textTransform: "none",
                    minWidth: "350px",
                    height: "3rem",
                  }}
                >
                  <FontAwesomeIcon icon={faGoogle} className="h6 mb-0" />
                  <span className="ms-2 h6">Continue with Google</span>
                </MDBBtn>
              </Col>
              <Col>
                <MDBBtn
                  rounded
                  className="m-2"
                  color="dark"
                  style={{
                    textTransform: "none",
                    minWidth: "350px",
                    height: "3rem",
                  }}
                >
                  <FontAwesomeIcon icon={faApple} className="h6 mb-0" />{" "}
                  <span className="ms-2 h6">Continue with Apple</span>
                </MDBBtn>
              </Col>
              <Col>
                <MDBBtn
                  rounded
                  className="m-2 mb-4"
                  style={{
                    backgroundColor: "#3b5998",
                    textTransform: "none",
                    minWidth: "350px",
                    height: "3rem",
                  }}
                >
                  <FontAwesomeIcon icon={faFacebook} className="h6 mb-0" />{" "}
                  <span className="ms-2 h6">Continue with Facebook</span>
                </MDBBtn>
              </Col>
              <Link
                to={"/signin"}
                className="text-muted text-decoration-underline"
              >
                Create an account
              </Link>
            </Col>
          </div>
        </Col>
      </div>
    </div>
  );
};

export default LogIn;
