import React, { ComponentType, useContext } from "react";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import ValidationsAlerts from "../../shared/components/form/ValidationsAlerts";
import { Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../Theme";
import Navbar from "../../components/Navbar";
import { useResetPassword } from "../../hooks/useResetPassword";
import { CustomSpinner } from "../../shared/components";
import Alerts from "../../components/Alerts";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

const ResetPassword = () => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { resetPassword, error, success, isLoading } = useResetPassword();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("validations.invalid_email"))
      .required(t("validations.required")),
  });

  const handleOnSubmit = (values: { email: string }) => {
    resetPassword(values.email);
  };

  return (
    <>
      <Navbar logo />

      <div className="d-flex mt-5 justify-content-center">
        {isLoading && <CustomSpinner center />}

        {success && (
          <Col className="d-flex flex-column justify-content-center text-center text-color">
            <h2 data-testid="reset-password-success-title">
              {t("pages.reset_password.success.title")}
            </h2>
            <p data-testid="reset-password-success-message">
              {t("pages.reset_password.success.message")}
            </p>
          </Col>
        )}

        {!isLoading && !success && (
          <div>
            {error && (
              <Alerts color="danger" icon={faCircleExclamation}>
                {t(error)}
              </Alerts>
            )}
            <Col>
              <h2
                className="d-flex justify-content-center text-color"
                data-testid="reset-password-heading"
              >
                {t("pages.reset_password.heading")}
              </h2>

              <Formik
                initialValues={{ email: "" }}
                validationSchema={validationSchema}
                onSubmit={(values) => handleOnSubmit(values)}
              >
                {(formikProps) => (
                  <Form className="signup-form">
                    <MDBInput
                      label={t("app_common.email")}
                      id="email"
                      type="email"
                      className="mt-4"
                      placeholder=""
                      defaultValue=""
                      contrast={theme === "dark-theme"}
                      onChange={(e) =>
                        formikProps.setFieldValue("email", e.target.value)
                      }
                      data-testid="email-input"
                    />
                    <ErrorMessage
                      component={ValidationsAlerts as ComponentType}
                      name="email"
                      className="mb-4"
                    />
                    <div className="d-flex justify-content-center text-center">
                      <MDBBtn
                        rounded
                        className="btn-signup mt-4"
                        type="submit"
                        color="light"
                        data-testid="reset-password-button"
                      >
                        {t("pages.reset_password.heading")}
                      </MDBBtn>
                    </div>
                  </Form>
                )}
              </Formik>
            </Col>
          </div>
        )}
      </div>
    </>
  );
};

export default ResetPassword;
