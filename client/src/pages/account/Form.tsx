import React, { ComponentType, useContext, useEffect } from "react";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import ValidationsAlerts from "../../shared/components/form/ValidationsAlerts";
import { Col, Row } from "react-bootstrap";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useUpdateUser } from "../../hooks/useUpdateUser";
import { notifyError, notifySuccess } from "../../shared/helpers/toasts/Toasts";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../Theme";

type initialValues = {
  username: string;
  currentPassword: string;
  password: string;
};

const AccountForm = () => {
  const { updateUser, error, isLoading, success } = useUpdateUser();
  const { user } = useAuthContext();
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const handleSubmit = async (values: initialValues) => {
    const { username, currentPassword, password } = values;

    if (user) {
      await updateUser(user.username, username, currentPassword, password);
    }
  };

  useEffect(() => {
    if (error) {
      notifyError(t("notifications.something_went_wrong"));
    } else if (success) {
      notifySuccess(t("notifications.profile_updated"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, success]);

  const validationSchema = Yup.object().shape({
    password: Yup.string().matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      t("validations.password_validation")
    ),
  });

  return (
    <div
      className="signup-form"
      style={{ width: "240px" }}
      data-testid="account-form"
    >
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
                label={t("pages.account.nickname")}
                id="username"
                type="text"
                placeholder=""
                contrast={theme === "dark-theme"}
                defaultValue={user.username}
                onChange={(e) =>
                  formikProps.setFieldValue("username", e.target.value)
                }
              />
              <ErrorMessage
                component={ValidationsAlerts as ComponentType}
                name="username"
                className="mb-4"
              />

              <div className="divider-container text-muted my-4">
                <div className="divider-border" />
                <span className="divider-content">
                  {t("pages.account.change_password")}
                </span>
                <div className="divider-border" />
              </div>

              <MDBInput
                label={t("pages.account.current_password")}
                id="current-password"
                type="password"
                className="mt-4"
                placeholder=""
                contrast={theme === "dark-theme"}
                onChange={(e) =>
                  formikProps.setFieldValue("currentPassword", e.target.value)
                }
              />
              <ErrorMessage
                component={ValidationsAlerts as ComponentType}
                name="currentPassword"
                className="mb-4 text-align-start"
              />
              <Row>
                <Col>
                  <MDBInput
                    label={t("pages.account.new_password")}
                    id="password"
                    type="password"
                    className="mt-4"
                    placeholder=""
                    contrast={theme === "dark-theme"}
                    onChange={(e) =>
                      formikProps.setFieldValue("password", e.target.value)
                    }
                  />
                  {formikProps.values.password && (
                    <ErrorMessage
                      component={ValidationsAlerts as ComponentType}
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
                  {t("pages.account.save_changes")}
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
