import React from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBSwitch,
  MDBRange,
} from "mdb-react-ui-kit";
import { Formik, Form, ErrorMessage } from "formik";
import { Col, Container, Row, Form as BootstrapForm } from "react-bootstrap";
import * as Yup from "yup";
import ValidationsAlerts from "../../shared/components/form/ValidationsAlerts";

const GameModal = ({
  showGameModal,
  setShowGameModal,
  handleNewGame,
  popupInfo,
  selectedCountryNamesLength,
}) => {
  const validationSchema = Yup.object().shape({
    gameMode: Yup.number()
      .transform((_, val) => (isNaN(Number(val)) ? null : Number(val)))
      .required("Required"),
  });

  return (
    <>
      <Formik
        initialValues={{
          toggleColors: true,
          toggleBorders: true,
          toggleLabels: true,
          color: popupInfo.color,
          gameMode: "",
          numberOfRounds: 20,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleNewGame(values);
        }}
      >
        {(formikProps) => (
          <Form>
            <MDBModal
              tabIndex="-1"
              open={showGameModal}
              onClose={setShowGameModal}
            >
              <MDBModalDialog centered size="l">
                <MDBModalContent>
                  <MDBModalHeader className="new-game-modal-header">
                    <img
                      width="100%"
                      className="mapboxgl-popup-img"
                      alt="country flag"
                      src={`/images/${popupInfo.name.toLowerCase()}.jpg`}
                    />
                  </MDBModalHeader>
                  <MDBModalBody>
                    <h3 className="d-flex justify-content-center mb-3">
                      {popupInfo.name}
                    </h3>
                    <p>
                      Find the answer from the list of territorial identifiers
                      appearing on German number plates and corresponding to
                      boroughs and district towns.
                    </p>
                    <h5 className="d-flex justify-content-center mb-3">
                      Game Mode
                    </h5>
                    <BootstrapForm.Select
                      aria-label="Game Mode"
                      className="game-mode-select"
                      onChange={(e) =>
                        formikProps.setFieldValue("gameMode", e.target.value)
                      }
                    >
                      <option>Select game mode</option>
                      <option value={1}>Normal</option>
                      <option value={2}>Training</option>
                    </BootstrapForm.Select>
                    <ErrorMessage
                      component={ValidationsAlerts}
                      name="gameMode"
                    />
                    {formikProps.values.gameMode === "2" && (
                      <div className="mt-2 nb-rounds-range">
                        <MDBRange
                          defaultValue={20}
                          id="nbOfRounds"
                          min={1}
                          max={selectedCountryNamesLength}
                          label="Number of rounds"
                          onChange={(e) =>
                            formikProps.setFieldValue(
                              "numberOfRounds",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    )}
                  </MDBModalBody>
                  <MDBModalFooter>
                    <Container>
                      <Row>
                        <Col className="d-flex justify-content-center">
                          <MDBSwitch
                            id="toggleColors"
                            label="Colors"
                            checked={formikProps.values.toggleColors}
                            onChange={(e) =>
                              formikProps.setFieldValue(
                                "toggleColors",
                                e.target.checked
                              )
                            }
                            disabled={!formikProps.values.toggleBorders}
                          />
                        </Col>
                        <Col className="d-flex justify-content-center">
                          <MDBSwitch
                            id="toggleBorders"
                            label="Borders"
                            checked={formikProps.values.toggleBorders}
                            onChange={(e) => {
                              formikProps.setFieldValue(
                                "toggleBorders",
                                e.target.checked
                              );
                              formikProps.setFieldValue(
                                "toggleColors",
                                e.target.checked
                              );
                            }}
                          />
                        </Col>
                        <Col className="d-flex justify-content-center">
                          <MDBSwitch
                            id="toggleLabels"
                            label="Labels"
                            checked={formikProps.values.toggleLabels}
                            onChange={(e) =>
                              formikProps.setFieldValue(
                                "toggleLabels",
                                e.target.checked
                              )
                            }
                          />
                        </Col>
                      </Row>
                      <Row className="mt-3 d-flex text-center">
                        <Col>
                          <MDBBtn
                            rounded
                            className="btn-play"
                            type="submit"
                            color="light"
                          >
                            Play
                          </MDBBtn>
                        </Col>
                      </Row>
                    </Container>
                  </MDBModalFooter>
                </MDBModalContent>
              </MDBModalDialog>
            </MDBModal>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default GameModal;
