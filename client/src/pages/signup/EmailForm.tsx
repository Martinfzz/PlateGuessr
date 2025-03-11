import React, { ComponentType } from "react";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import ValidationsAlerts from "../../shared/components/form/ValidationsAlerts";
import { useSignup } from "../../hooks/useSignup";
import Alerts from "../../components/Alerts";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const EmailForm = () => {
  const { signup, error, isLoading } = useSignup();
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("validations.invalid_email"))
      .required(t("validations.required")),
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

  const handleSubmit = async (values: {
    email: string;
    password: string;
    passwordConfirmation: string;
  }) => {
    const { email, password, passwordConfirmation } = values;

    await signup(email, password, passwordConfirmation);
  };

  return (
    <div data-testid="signup-form">
      <Formik
        initialValues={{ email: "", password: "", passwordConfirmation: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {(formikProps) => (
          <Form className="signup-form">
            {error && (
              <Alerts color="danger" icon={faCircleExclamation}>
                {t(error)}
              </Alerts>
            )}
            <MDBInput
              label={t("app_common.email")}
              id="email"
              type="email"
              placeholder=""
              defaultValue=""
              onChange={(e) =>
                formikProps.setFieldValue("email", e.target.value)
              }
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
              label={t("pages.signup.password_confirmation")}
              id="passwordConfirmation"
              type="password"
              className="mt-4"
              placeholder=""
              defaultValue=""
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

            <div className="d-flex justify-content-center text-center mt-4">
              <MDBBtn
                rounded
                className="btn-signup"
                type="submit"
                color="light"
                disabled={isLoading}
              >
                {t("app_common.signup")}
              </MDBBtn>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EmailForm;
