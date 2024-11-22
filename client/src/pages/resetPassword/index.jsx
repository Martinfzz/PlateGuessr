import React from "react";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import ValidationsAlerts from "../../shared/components/form/ValidationsAlerts";
import { Col } from "react-bootstrap";
import ConnexionBtn from "../../components/ConnexionBtn";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("validations.invalid_email"))
      .required(t("validations.required")),
  });

  return (
    <>
      <div className="d-flex justify-content-end">
        <ConnexionBtn />
      </div>
      <div className="d-flex mt-5 justify-content-center">
        <div>
          <Col>
            <h2 className="d-flex justify-content-center">
              {t("pages.reset_password.heading")}
            </h2>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={validationSchema}
              onSubmit={(values) => console.log(values)}
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
                      {t("pages.reset_password.heading")}
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
