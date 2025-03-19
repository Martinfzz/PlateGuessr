import React, { ComponentType, useContext } from "react";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import ValidationsAlerts from "../../shared/components/form/ValidationsAlerts";
import { Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../Theme";
import Navbar from "../../components/Navbar";
import { CustomSpinner } from "../../shared/components";
import Alerts from "../../components/Alerts";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { useSetPassword } from "../../hooks/useSetPassword";

const SetPassword = () => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { token } = useParams();
  const { setPassword, error, isLoading } = useSetPassword();

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required(t("validations.required"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        t("validations.password_validation")
      ),
    passwordConfirmation: Yup.string()
      .required(t("validations.required"))
      .oneOf([Yup.ref("password")], t("validations.password_match")),
  });

  const handleOnSubmit = (values: {
    password: string;
    passwordConfirmation: string;
  }) => {
    setPassword(values.password, values.passwordConfirmation, token || "");
  };

  return (
    <>
      <Navbar logo />

      <div className="d-flex mt-5 justify-content-center">
        {isLoading && <CustomSpinner center />}

        {!isLoading && (
          <div>
            {error && (
              <Alerts color="danger" icon={faCircleExclamation}>
                {t(error)}
              </Alerts>
            )}
            <Col>
              <h2 className="d-flex justify-content-center text-color">
                {t("pages.set_password.heading")}
              </h2>

              <Formik
                initialValues={{ password: "", passwordConfirmation: "" }}
                validationSchema={validationSchema}
                onSubmit={(values) => handleOnSubmit(values)}
              >
                {(formikProps) => (
                  <Form className="signup-form">
                    <MDBInput
                      label={t("pages.set_password.new_password")}
                      id="password"
                      type="password"
                      className="mt-4"
                      placeholder=""
                      defaultValue=""
                      contrast={theme === "dark-theme"}
                      onChange={(e) =>
                        formikProps.setFieldValue("password", e.target.value)
                      }
                    />
                    <ErrorMessage
                      component={ValidationsAlerts as ComponentType}
                      name="password"
                      className="mb-4"
                    />

                    <MDBInput
                      label={t("pages.set_password.repeat_password")}
                      id="passwordConfirmation"
                      type="password"
                      className="mt-4"
                      placeholder=""
                      defaultValue=""
                      contrast={theme === "dark-theme"}
                      onChange={(e) =>
                        formikProps.setFieldValue(
                          "passwordConfirmation",
                          e.target.value
                        )
                      }
                    />
                    <ErrorMessage
                      component={ValidationsAlerts as ComponentType}
                      name="passwordConfirmation"
                      className="mb-4"
                    />

                    <div className="d-flex justify-content-center text-center">
                      <MDBBtn
                        rounded
                        className="btn-signup mt-4"
                        type="submit"
                        color="light"
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

export default SetPassword;
