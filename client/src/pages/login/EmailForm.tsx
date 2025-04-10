import React, { ComponentType, FC, useContext } from "react";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import ValidationsAlerts from "../../shared/components/form/ValidationsAlerts";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../Theme";

interface EmailFormProps {
  isLoading: boolean;
  handleSubmit: (e: { email: string; password: string }) => void;
}

const EmailForm: FC<EmailFormProps> = ({ isLoading, handleSubmit }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("validations.invalid_email"))
      .required(t("validations.required")),
    password: Yup.string().required(t("validations.required")),
  });

  return (
    <div data-testid="login-form">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {(formikProps) => (
          <Form className="signup-form">
            <MDBInput
              label={t("app_common.email")}
              id="email"
              type="email"
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

            <MDBInput
              label={t("app_common.password")}
              id="password"
              type="password"
              className="mt-4"
              placeholder=""
              defaultValue=""
              contrast={theme === "dark-theme"}
              onChange={(e) =>
                formikProps.setFieldValue("password", e.target.value)
              }
              data-testid="password-input"
            />
            <ErrorMessage
              component={ValidationsAlerts as ComponentType}
              name="password"
              className="mb-4 text-align-start"
            />

            <div className="d-flex justify-content-between text-center mt-4">
              <Link
                to={"/reset-password"}
                className="text-muted text-decoration-underline"
                data-testid="forgot-password-link"
              >
                {t("pages.login.forgot_password")}
              </Link>
              <MDBBtn
                rounded
                className="btn-signup"
                type="submit"
                color="light"
                disabled={isLoading}
                data-testid="login-button"
              >
                {t("app_common.login")}
              </MDBBtn>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EmailForm;
