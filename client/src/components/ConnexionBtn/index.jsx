import { MDBBtn } from "mdb-react-ui-kit";
import React from "react";
import { Link } from "react-router-dom";

const ConnexionBtn = () => {
  return (
    <>
      <Link to={"/login"}>
        <MDBBtn
          rounded
          className="mt-3 me-3 btn-login"
          type="submit"
          color="light"
        >
          Log In
        </MDBBtn>
      </Link>
      <Link to={"/signup"}>
        <MDBBtn
          rounded
          className="mt-3 me-3 btn-signup"
          type="submit"
          color="light"
        >
          Sign Up
        </MDBBtn>
      </Link>
    </>
  );
};

export default ConnexionBtn;
