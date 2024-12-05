import React, { FC } from "react";
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
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { GameOptions, PopupInfo } from "shared.types";

interface GameModalProps {
  showGameModal: boolean;
  setShowGameModal: () => void;
  handleNewGame: (arg0: GameOptions) => void;
  selectedCountryNamesLength: number;
}

interface GameState {
  game: {
    popupInfo: PopupInfo;
  };
}

const GameModal: FC<GameModalProps> = ({
  showGameModal,
  setShowGameModal,
  handleNewGame,
  selectedCountryNamesLength,
}) => {
  const { t } = useTranslation();
  const { popupInfo } = useSelector((state: GameState) => state.game);

  const validationSchema = Yup.object().shape({
    gameMode: Yup.number()
      .transform((_, val) => (isNaN(Number(val)) ? null : Number(val)))
      .required(t("validations.required")),
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
              <MDBModalDialog centered>
                <MDBModalContent className="game-modal">
                  <MDBModalHeader>
                    <img
                      width="100%"
                      className="mapboxgl-popup-img"
                      alt="country flag"
                      src={`/images/${popupInfo.name.toLowerCase()}.jpg`}
                    />
                  </MDBModalHeader>
                  <MDBModalBody>
                    <Row className="d-flex justify-content-center">
                      <Col></Col>
                      <Col>
                        <h3 className="d-flex justify-content-center mb-3">
                          {t(`countries.names.${popupInfo.name.toLowerCase()}`)}
                        </h3>
                      </Col>
                      <Col>
                        <Col>
                          <Row>
                            <h4 className="d-flex justify-content-end mb-0">
                              <Link
                                to={`/country/${popupInfo.countryId}`}
                                className="stats-link"
                              >
                                <FontAwesomeIcon icon={faChartSimple} />
                              </Link>
                            </h4>
                          </Row>
                          <Row>
                            <h6
                              className="d-flex justify-content-end"
                              style={{ fontSize: "9px" }}
                            >
                              {t("pages.stats.stats")}
                            </h6>
                          </Row>
                        </Col>
                      </Col>
                    </Row>

                    <p>{t("game.country_description")}</p>
                    <GameMode
                      formik={formikProps}
                      selectedCountryNamesLength={selectedCountryNamesLength}
                    />
                  </MDBModalBody>
                  <MDBModalFooter>
                    <Container>
                      <Row>
                        <Col className="d-flex justify-content-center">
                          <MDBSwitch
                            id="toggleColors"
                            label={t("game.colors")}
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
                            label={t("game.borders")}
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
                            label={t("game.labels")}
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
                            {t("app_common.play")}
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
