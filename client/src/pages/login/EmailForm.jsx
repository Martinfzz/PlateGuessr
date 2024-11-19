import React from "react";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import ValidationsAlerts from "../../shared/components/form/ValidationsAlerts";
import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/userLogin";

const EmailForm = () => {
  const { login, error, isLoading } = useLogin();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Please Enter your password"),
  });

  const handleSubmit = async (values) => {
    const { email, password } = values;

    await login(email, password);
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => handleSubmit(values)}
    >
      {(formikProps) => (
        <Form className="signin-form">
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
              className="btn-play"
              type="submit"
              color="light"
              disabled={isLoading}
            >
              Log in
            </MDBBtn>
          </div>
          {error && <div className="error">{error}</div>}
        </Form>
      )}
    </Formik>
  );
};

export default EmailForm;
