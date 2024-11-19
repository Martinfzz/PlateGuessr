import React, { useState } from "react";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MDBBtn } from "mdb-react-ui-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGoogle,
  faApple,
} from "@fortawesome/free-brands-svg-icons";
import EmailModal from "./EmailModal";

const SignIn = () => {
  const [showEmailModal, setShowEmailModal] = useState(false);

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100%" }}
    >
      <div className="d-flex text-center">
        <Col>
          <h1>Get started</h1>
          <h2 className="my-4">Choose sign-up method</h2>
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
              className="m-2"
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
          <Col>
            <MDBBtn
              outline
              rounded
              className="mt-2 mb-4"
              color="dark"
              style={{
                textTransform: "none",
                minWidth: "350px",
                height: "3rem",
              }}
              onClick={() => setShowEmailModal(true)}
            >
              <span className="h6">Continue with Email</span>
            </MDBBtn>
          </Col>
          <Link to={"/login"} className="text-muted text-decoration-underline">
            Already have an account?
          </Link>
        </Col>
      </div>

      {showEmailModal && (
        <EmailModal
          showEmailModal={showEmailModal}
          setShowEmailModal={() => setShowEmailModal(false)}
        />
      )}
    </div>
  );
};

export default SignIn;
