import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { API, loadingTypes } from "../../shared/helpers";
import { CustomSpinner } from "../../shared/components";
import {
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBBtn,
  MDBBtnGroup,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar";
import { Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faGamepad } from "@fortawesome/free-solid-svg-icons";

const Country = () => {
  const { t } = useTranslation();
  let params = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(loadingTypes.none);
  const [data, setData] = useState(null);
  const [country, setCountry] = useState(null);
  const [scores, setScores] = useState([]);
  const [userCountryScore, setUserCountryScore] = useState([]);
  const [userScore, setUserScore] = useState([]);

  const getUserCountryScore = async () => {
    setLoading(loadingTypes.index);
    await API.get(`/api/user/country/${data._id}?token=${user.token}`)
      .then((res) => {
        setUserCountryScore(res.data.data);
        setUserScore(res.data.data.scores["1"] ?? []);
      })
      .catch((error) => {
        console.log(error);
        if (error.status === 404) {
          navigate("/");
        }
      });
    setLoading(loadingTypes.none);
  };

  const getCountry = async () => {
    setLoading(loadingTypes.index);
    await API.get(`/api/country/${params.id}`)
      .then((res) => {
        setData(res.data.data);
        setScores(res.data.data.game_modes["1"].top_scores);
      })
      .catch((error) => {
        console.log(error);
        if (error.status === 404) {
          navigate("/");
        }
      });
    setLoading(loadingTypes.none);
  };

  useEffect(() => {
    getCountry();
  }, []);

  const getCountryInfos = async () => {
    setLoading(loadingTypes.index);

    const countriesFile = await import(
      "../../assets/metadata/json/countries.json"
    );
    const filteredCountry = countriesFile.countries.find(
      (e) => e.id === data?.country_id
    );
    setCountry(filteredCountry);
    setLoading(loadingTypes.none);
  };

  useEffect(() => {
    if (data !== null) {
      if (user) getUserCountryScore();
      getCountryInfos();
    }
  }, [data]);

  const handleOnGameModeClick = (gameMode) => {
    setScores(data.game_modes?.[gameMode]?.top_scores ?? []);
    if (user) setUserScore(userCountryScore.scores[gameMode] ?? []);
  };

  return (
    <>
      <Navbar />
      {loading || data === null || country === null ? (
        <CustomSpinner center />
      ) : (
        <>
          <h2 className="d-flex justify-content-center mt-3 mb-5">
            {t(`countries.names.${country.name}`)}
          </h2>
          <Row style={{ width: "100%" }}>
            <Col xxl={4} lg={3}></Col>
            <Col
              className="d-flex justify-content-center mb-5"
              xxl={2}
              lg={3}
              md={12}
            >
              <div className="country-img">
                <img alt="country flag" src={`/images/${country.name}.jpg`} />
              </div>
            </Col>
            <Col
              className="d-flex justify-content-center align-items-center mb-3 ms-xxl-5 ms-lg-3"
              xxl={2}
              lg={3}
            >
              <Row>
                <Col className="d-flex justify-content-center align-items-center mb-3">
                  <MDBCard style={{ width: "300px" }}>
                    <MDBCardBody className=" py-3">
                      <MDBCardText className="d-flex justify-content-start">
                        <span
                          className="my-0 d-flex align-items-center justify-content-center"
                          style={{ width: "50px", fontSize: "40px" }}
                        >
                          <FontAwesomeIcon icon={faChartSimple} />
                        </span>
                        <span className="ms-3 d-flex align-items-center">
                          {t("pages.country.average_score")} -{" "}
                          {Math.floor(data.average_score)}
                        </span>
                      </MDBCardText>
                    </MDBCardBody>
                  </MDBCard>
                </Col>
                <Col className="d-flex justify-content-center align-items-center mb-3">
                  <MDBCard style={{ width: "300px" }}>
                    <MDBCardBody className=" py-3">
                      <MDBCardText className="d-flex justify-content-start">
                        <span
                          className="my-0 d-flex align-items-center justify-content-center"
                          style={{ width: "50px", fontSize: "40px" }}
                        >
                          <FontAwesomeIcon icon={faGamepad} />
                        </span>
                        <span className="ms-3 d-flex align-items-center">
                          {data.games_played}{" "}
                          {t("pages.country.games_played").toLowerCase()}
                        </span>
                      </MDBCardText>
                    </MDBCardBody>
                  </MDBCard>
                </Col>
              </Row>
            </Col>
          </Row>

          <h3 className="d-flex justify-content-center mb-4">
            {t("pages.country.best_scores")}
          </h3>

          <Row style={{ width: "100%" }}>
            <Col lg={2} xl={3}></Col>
            <Col lg={8} xl={6} className="px-5">
              <Row className="mb-5 d-flex justify-content-center">
                <MDBBtnGroup shadow="0" aria-label="Basic example">
                  <MDBBtn
                    color="dark"
                    outline
                    onClick={() => handleOnGameModeClick("1")}
                  >
                    {t("game.game_mode.easy")}
                  </MDBBtn>
                  <MDBBtn
                    color="dark"
                    outline
                    onClick={() => handleOnGameModeClick("2")}
                  >
                    {t("game.game_mode.normal")}
                  </MDBBtn>
                  <MDBBtn
                    color="dark"
                    outline
                    onClick={() => handleOnGameModeClick("3")}
                  >
                    {t("game.game_mode.hard")}
                  </MDBBtn>
                  <MDBBtn
                    color="dark"
                    outline
                    onClick={() => handleOnGameModeClick("4")}
                  >
                    {t("game.game_mode.extrem")}
                  </MDBBtn>
                </MDBBtnGroup>
              </Row>
              <Row className="d-flex text-center">
                {userScore && Object.keys(userScore).length !== 0 ? (
                  <p>
                    {t("pages.country.your_best_score")} -{" "}
                    {userScore.best_score}
                  </p>
                ) : (
                  <p>{t("pages.country.no_mode_played")}</p>
                )}
              </Row>
              <Row>
                <MDBTable>
                  <MDBTableHead>
                    <tr>
                      <th scope="col"></th>
                      <th scope="col" className="w-100"></th>
                      <th scope="col" className="text-center">
                        {t("game.score")}
                      </th>
                    </tr>
                  </MDBTableHead>
                  {scores.length > 0 &&
                    scores.map((score, index) => {
                      return (
                        <MDBTableBody key={index}>
                          <tr>
                            <th scope="col" className="text-center">
                              {index + 1}
                            </th>
                            <th scope="col">
                              {score.deleted ? (
                                score.username
                              ) : (
                                <Link
                                  to={`/user/${score.user_id}`}
                                  className="stats-link"
                                >
                                  {score.username}
                                </Link>
                              )}
                            </th>
                            <th scope="col" className="text-center">
                              {score.score}
                            </th>
                          </tr>
                        </MDBTableBody>
                      );
                    })}
                </MDBTable>
                {scores.length <= 0 && (
                  <div className="d-flex justify-content-center">
                    <p>{t("pages.country.no_score")}</p>
                  </div>
                )}
              </Row>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default Country;
