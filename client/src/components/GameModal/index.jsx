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
} from "mdb-react-ui-kit";
import { Formik, Form } from "formik";
import { Col, Container, Row } from "react-bootstrap";
import * as Yup from "yup";
import GameMode from "./GameMode";

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
                    <GameMode
                      selectedCountryNamesLength={selectedCountryNamesLength}
                    />
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
                            disabled={
                              !formikProps.values.toggleBorders ||
                              ["2", "3", "4"].includes(
                                formikProps.values.gameMode
                              )
                            }
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
                            disabled={["3", "4"].includes(
                              formikProps.values.gameMode
                            )}
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
                            disabled={formikProps.values.gameMode === "4"}
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
