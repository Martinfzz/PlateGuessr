import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API, loadingTypes } from "../../shared/helpers";
import { CustomSpinner } from "../../shared/components";
import { MDBBtn, MDBBtnGroup } from "mdb-react-ui-kit";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar";
import { Col, Row } from "react-bootstrap";
import { toAbsoluteUrl } from "../../helpers";
import { FilterMatchMode } from "primereact/api";
import { ThemeContext } from "../../Theme";

const User = () => {
  const { t } = useTranslation();
  let params = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(loadingTypes.none);
  const [data, setData] = useState(null);
  const [countries, setCountries] = useState({});
  const [scores, setScores] = useState([]);
  const [filters, setFilters] = useState({
    country_name_lang: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [gameMode, setGameMode] = useState("1");

  const getScores = (gameMode) => {
    const countryScores = [];
    for (const [, value] of Object.entries(data.country)) {
      const filteredCountry = countries.find(
        (e) => e.id === Number(value.country_id)
      );
      value.scores[gameMode] &&
        countryScores.push({
          country_id: value.country_id,
          country_name: filteredCountry.name,
          country_name_lang: t(`countries.names.${filteredCountry.name}`),
          ...value.scores[gameMode],
        });
    }
    setScores(countryScores);
  };

  const getUser = async () => {
    setLoading(loadingTypes.index);
    await API.get(`/api/user/${params.id}`)
      .then((res) => {
        setData(res.data.data);
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
    getUser();
    getCountriesInfos();
  }, []);

  const getCountriesInfos = async () => {
    setLoading(loadingTypes.index);

    const countriesFile = await import(
      "../../assets/metadata/json/countries.json"
    );

    setCountries(countriesFile.countries);
    setLoading(loadingTypes.none);
  };

  useEffect(() => {
    if (data !== null && Object.keys(countries).length !== 0) {
      getScores("1");
    }
  }, [data, countries]);

  const handleOnGameModeClick = (gameMode) => {
    getScores(gameMode);
    setGameMode(gameMode);
  };

  const countryBodyTemplate = (rowData) => {
    return (
      <div className="flex align-items-center gap-2">
        <Link to={`/country/${rowData.country_id}`} className="stats-link">
          <img
            className="rounded-1 me-2"
            style={{ height: "20px" }}
            src={toAbsoluteUrl(`/media/flags/${rowData.country_name}.svg`)}
            alt="country flag"
          />
          {rowData.country_name_lang}
        </Link>
      </div>
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["country_name_lang"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder={t("pages.stats.seach_by_country")}
          />
        </IconField>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <>
      <Navbar logo={true} />
      {loading || data === null ? (
        <CustomSpinner center />
      ) : (
        <>
          <h2 className="d-flex justify-content-center mt-3 mb-5 text-color">
            {data.username}
          </h2>

          <h3 className="d-flex justify-content-center mb-4 text-color">
            {t("pages.stats.scores")}
          </h3>

          <Row style={{ width: "100%" }}>
            <Col lg={2} xl={3}></Col>
            <Col lg={8} xl={6} className="px-5">
              <Row className="mb-4 d-flex justify-content-center">
                <MDBBtnGroup shadow="0" aria-label="game modes">
                  <MDBBtn
                    color={theme === "dark-theme" ? "light" : "dark"}
                    outline
                    className={gameMode === "1" ? "stats-btn-active" : ""}
                    onClick={() => handleOnGameModeClick("1")}
                  >
                    {t("game.game_mode.easy")}
                  </MDBBtn>
                  <MDBBtn
                    color={theme === "dark-theme" ? "light" : "dark"}
                    outline
                    className={gameMode === "2" ? "stats-btn-active" : ""}
                    onClick={() => handleOnGameModeClick("2")}
                  >
                    {t("game.game_mode.normal")}
                  </MDBBtn>
                  <MDBBtn
                    color={theme === "dark-theme" ? "light" : "dark"}
                    outline
                    className={gameMode === "3" ? "stats-btn-active" : ""}
                    onClick={() => handleOnGameModeClick("3")}
                  >
                    {t("game.game_mode.hard")}
                  </MDBBtn>
                  <MDBBtn
                    color={theme === "dark-theme" ? "light" : "dark"}
                    outline
                    className={gameMode === "4" ? "stats-btn-active" : ""}
                    onClick={() => handleOnGameModeClick("4")}
                  >
                    {t("game.game_mode.extrem")}
                  </MDBBtn>
                </MDBBtnGroup>
              </Row>

              <Row>
                <div>
                  <DataTable
                    value={scores}
                    removableSort
                    paginator
                    rows={10}
                    header={header}
                    filters={filters}
                    loading={loading}
                    stripedRows
                    emptyMessage={t("pages.stats.no_data")}
                  >
                    <Column
                      field="country_name_lang"
                      filterField="country_name_lang"
                      header={t("pages.stats.country")}
                      sortable
                      style={{ width: "40%" }}
                      body={countryBodyTemplate}
                    ></Column>
                    <Column
                      field="best_score"
                      header={t("pages.stats.best_score")}
                      sortable
                      style={{ width: "20%" }}
                      className="text-center"
                    ></Column>
                    <Column
                      field="average_score"
                      header={t("pages.country.average_score")}
                      sortable
                      style={{ width: "20%" }}
                      className="text-center"
                    ></Column>
                    <Column
                      field="games_played"
                      header={t("pages.country.games_played")}
                      sortable
                      style={{ width: "20%" }}
                      className="text-center"
                    ></Column>
                  </DataTable>
                </div>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default User;
