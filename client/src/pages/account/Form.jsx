import React, { useEffect } from "react";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import ValidationsAlerts from "../../shared/components/form/ValidationsAlerts";
import { Col, Row } from "react-bootstrap";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useUpdateUser } from "../../hooks/useUpdateUser";
import { notifyError, notifySuccess } from "../../shared/helpers/toasts/Toasts";

const AccountForm = () => {
  const { updateUser, error, isLoading, success } = useUpdateUser();
  const { user } = useAuthContext();

  const handleSubmit = async (values) => {
    const { username, currentPassword, password } = values;

    await updateUser(username, currentPassword, password);
  };

  useEffect(() => {
    if (error) {
      notifyError("Something went wrong");
    } else if (success) {
      notifySuccess("Profile updated");
    }
  }, [error, success]);

  const validationSchema = Yup.object().shape({
    password: Yup.string().matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  });

  return (
    <div className="signup-form" style={{ width: "240px" }}>
      {user && (
        <Formik
          initialValues={{
            username: user.username,
            currentPassword: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSubmit(values)}
        >
          {(formikProps) => (
            <Form>
              <MDBInput
                label="Nickname"
                id="username"
                type="text"
                placeholder=""
                defaultValue={user.username}
                onChange={(e) =>
                  formikProps.setFieldValue("username", e.target.value)
                }
              />
              <ErrorMessage
                component={ValidationsAlerts}
                name="username"
                className="mb-4"
              />

              <div className="divider-container text-muted my-4">
                <div className="divider-border" />
                <span className="divider-content">Change password</span>
                <div className="divider-border" />
              </div>

              <MDBInput
                label="Current password"
                id="current-password"
                type="password"
                className="mt-4"
                placeholder=""
                onChange={(e) =>
                  formikProps.setFieldValue("currentPassword", e.target.value)
                }
              />
              <ErrorMessage
                component={ValidationsAlerts}
                name="currentPassword"
                className="mb-4 text-align-start"
              />
              <Row>
                <Col>
                  <MDBInput
                    label="New password"
                    id="password"
                    type="password"
                    className="mt-4"
                    placeholder=""
                    onChange={(e) =>
                      formikProps.setFieldValue("password", e.target.value)
                    }
                  />
                  {formikProps.values.password && (
                    <ErrorMessage
                      component={ValidationsAlerts}
                      name="password"
                      className="mb-4 text-align-start"
                    />
                  )}
                </Col>
              </Row>

              <div className="d-flex justify-content-center text-center mt-4">
                <MDBBtn
                  rounded
                  className="btn-signup"
                  type="submit"
                  color="light"
                  disabled={isLoading || !formikProps.dirty}
                >
                  Save changes
                </MDBBtn>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default AccountForm;
