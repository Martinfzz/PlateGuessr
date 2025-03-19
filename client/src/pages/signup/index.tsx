import React, { useContext, useState } from "react";
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
import Logo from "../../components/Logo";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../Theme";
import { useGoogleLogin } from "@react-oauth/google";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";

const SignUp = () => {
  const { t } = useTranslation();
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const { theme } = useContext(ThemeContext);
  const { googleAuth } = useGoogleAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      console.log("Google Login Success");
      googleAuth(code);
    },
    onError: () => {
      console.log("Login Failed");
    },
    flow: "auth-code",
  });

  return (
    <>
      <Logo className="logo-container" />

      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "90vh" }}
      >
        <div className="d-flex text-center">
          <Col>
            <h1 className="text-color">{t("pages.signup.title_1")}</h1>
            <h2 className="my-4 yellow">{t("pages.signup.title_2")}</h2>
            <Col>
              <MDBBtn
                onClick={() => googleLogin()}
                rounded
                className="m-2"
                style={{
                  backgroundColor: "#dd4b39",
                  textTransform: "none",
                  minWidth: "350px",
                  height: "3rem",
                  boxShadow: "none",
                }}
              >
                <FontAwesomeIcon icon={faGoogle} className="h6 mb-0" />
                <span className="ms-2 h6">{t("pages.login.google")}</span>
              </MDBBtn>
            </Col>
            <Col>
              <MDBBtn
                disabled
                rounded
                className="m-2"
                color={theme === "dark-theme" ? "light" : "dark"}
                style={{
                  textTransform: "none",
                  minWidth: "350px",
                  height: "3rem",
                  boxShadow: "none",
                }}
                data-testid="apple-button"
              >
                <FontAwesomeIcon icon={faApple} className="h6 mb-0" />{" "}
                <span className="ms-2 h6">{t("pages.login.apple")}</span>
              </MDBBtn>
            </Col>
            <Col>
              <MDBBtn
                disabled
                rounded
                className="m-2"
                style={{
                  backgroundColor: "#3b5998",
                  textTransform: "none",
                  minWidth: "350px",
                  height: "3rem",
                  boxShadow: "none",
                }}
              >
                <FontAwesomeIcon icon={faFacebook} className="h6 mb-0" />{" "}
                <span className="ms-2 h6">{t("pages.login.facebook")}</span>
              </MDBBtn>
            </Col>
            <Col>
              <MDBBtn
                outline
                rounded
                className="mt-2 mb-4"
                color={theme === "dark-theme" ? "light" : "dark"}
                style={{
                  textTransform: "none",
                  minWidth: "350px",
                  height: "3rem",
                }}
                onClick={() => setShowEmailModal(true)}
                data-testid="email-button"
              >
                <span className="h6">{t("pages.signup.email")}</span>
              </MDBBtn>
            </Col>
            <Link
              to={"/login"}
              className="text-muted text-decoration-underline"
            >
              {t("pages.signup.account")}
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
    </>
  );
};

export default SignUp;
