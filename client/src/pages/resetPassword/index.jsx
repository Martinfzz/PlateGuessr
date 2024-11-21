import React from "react";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import ValidationsAlerts from "../../shared/components/form/ValidationsAlerts";
import { Col } from "react-bootstrap";
import ConnexionBtn from "../../components/ConnexionBtn";

const ResetPassword = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  return (
    <>
      <ConnexionBtn />
      <div className="d-flex mt-5 justify-content-center">
        <div>
          <Col>
            <h2 className="d-flex justify-content-center">Reset password</h2>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={validationSchema}
              onSubmit={(values) => console.log(values)}
            >
              {(formikProps) => (
                <Form className="signup-form">
                  <MDBInput
                    label="Email"
                    id="email"
                    type="email"
                    className="mt-4"
                    placeholder=""
                    defaultValue=""
                    onChange={(e) =>
                      formikProps.setFieldValue("email", e.target.value)
                    }
                  />
                  <ErrorMessage
                    component={ValidationsAlerts}
                    name="email"
                    className="mb-4"
                  />
                  <div className="d-flex justify-content-center text-center">
                    <MDBBtn
                      rounded
                      className="btn-signup mt-4"
                      type="submit"
                      color="light"
                    >
                      Reset password
                    </MDBBtn>
                  </div>
                </Form>
              )}
            </Formik>
          </Col>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
