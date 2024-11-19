import React from "react";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import ValidationsAlerts from "../../shared/components/form/ValidationsAlerts";
import { useSignup } from "../../hooks/useSignup";
import Alerts from "../../components/Alerts";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

const EmailForm = () => {
  const { signup, error, isLoading } = useSignup();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Please Enter your password")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    passwordConfirmation: Yup.string()
      .required("Please retype your password.")
      .oneOf([Yup.ref("password")], "Your passwords do not match."),
  });

  const handleSubmit = async (values) => {
    const { email, password, passwordConfirmation } = values;

    await signup(email, password, passwordConfirmation);
  };

  return (
    <Formik
      initialValues={{ email: "", password: "", passwordConfirmation: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => handleSubmit(values)}
    >
      {(formikProps) => (
        <Form className="signup-form">
          {error && (
            <Alerts color="danger" icon={faCircleExclamation}>
              {error}
            </Alerts>
          )}
          <MDBInput
            label="Email"
            id="email"
            type="email"
            onChange={(e) => formikProps.setFieldValue("email", e.target.value)}
          />
          <ErrorMessage
            component={ValidationsAlerts}
            name="email"
            className="mb-4"
          />

          <MDBInput
            label="Password"
            id="password"
            type="password"
            className="mt-4 "
            onChange={(e) =>
              formikProps.setFieldValue("password", e.target.value)
            }
          />
          <ErrorMessage
            component={ValidationsAlerts}
            name="password"
            className="mb-4"
          />

          <MDBInput
            label="Password confirmation"
            id="passwordConfirmation"
            type="password"
            className="mt-4"
            onChange={(e) =>
              formikProps.setFieldValue("passwordConfirmation", e.target.value)
            }
          />
          <ErrorMessage
            component={ValidationsAlerts}
            name="passwordConfirmation"
            className="mb-4"
          />

          <div className="d-flex justify-content-center text-center mt-4">
            <MDBBtn
              rounded
              className="btn-play"
              type="submit"
              color="light"
              disabled={isLoading}
            >
              Sign in
            </MDBBtn>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EmailForm;
