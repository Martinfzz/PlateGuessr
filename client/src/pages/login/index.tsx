import React, { useContext } from "react";
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
import Logo from "../../components/Logo";
import Alerts from "../../components/Alerts";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useLogin } from "../../hooks/useLogin";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../Theme";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { useGoogleLogin } from "@react-oauth/google";
import { useResendVerificationEmail } from "../../hooks/useResendVerificationEmail";

const LogIn = () => {
  const { login, error, isLoading, email } = useLogin();
  const { resendVerificationEmail } = useResendVerificationEmail();
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { googleAuth } = useGoogleAuth();

  const handleSubmit = async (values: { email: string; password: string }) => {
    const { email, password } = values;

    await login(email, password);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
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
        <div>
          <Col>
            {error && (
              <>
                <Alerts color="danger" icon={faCircleExclamation}>
                  {t(error)}
                </Alerts>
                {error === "validations.email_not_verified" && (
                  <Alerts color="warning" icon={faCircleExclamation}>
                    <Link
                      to="/login"
                      onClick={() => resendVerificationEmail(email)}
                    >
                      {t("pages.login.resend_verification_email_message")}
                    </Link>
                  </Alerts>
                )}
              </>
            )}
            <EmailForm isLoading={isLoading} handleSubmit={handleSubmit} />
            <div className="d-flex text-center">
              <Col>
                <div className="divider-container text-muted my-4">
                  <div className="divider-border" />
                  <span className="divider-content">
                    {t("pages.login.continue")}
                  </span>
                  <div className="divider-border" />
                </div>
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
                <div className="mt-4">
                  <Link
                    to={"/signup"}
                    className="text-muted text-decoration-underline"
                  >
                    {t("pages.login.create_account")}
                  </Link>
                </div>
              </Col>
            </div>
          </Col>
        </div>
      </div>
    </>
  );
};

export default LogIn;
