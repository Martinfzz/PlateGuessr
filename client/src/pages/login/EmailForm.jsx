import React from "react";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import ValidationsAlerts from "../../shared/components/form/ValidationsAlerts";
import { Link } from "react-router-dom";

const EmailForm = ({ isLoading, handleSubmit }) => {
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Please Enter your password"),
  });

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => handleSubmit(values)}
    >
      {(formikProps) => (
        <Form className="signup-form">
          <MDBInput
            label="Email"
            id="email"
            type="email"
            placeholder=""
            defaultValue=""
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
            className="mt-4"
            placeholder=""
            defaultValue=""
            onChange={(e) =>
              formikProps.setFieldValue("password", e.target.value)
            }
          />
          <ErrorMessage
            component={ValidationsAlerts}
            name="password"
            className="mb-4 text-align-start"
          />

          <div className="d-flex justify-content-between text-center mt-4">
            <Link
              to={"/reset-password"}
              className="text-muted text-decoration-underline"
            >
              Forgot your password?
            </Link>
            <MDBBtn
              rounded
              className="btn-signup"
              type="submit"
              color="light"
              disabled={isLoading}
            >
              Log in
            </MDBBtn>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EmailForm;
