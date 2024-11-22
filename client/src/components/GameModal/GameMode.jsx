import {} from "formik";
import React, { useEffect } from "react";
import { MDBRange } from "mdb-react-ui-kit";
import { connect, ErrorMessage } from "formik";
import { Form } from "react-bootstrap";
import ValidationsAlerts from "../../shared/components/form/ValidationsAlerts";
import { useTranslation } from "react-i18next";

const GameMode = ({ formik, selectedCountryNamesLength }) => {
  const { t } = useTranslation();

  useEffect(() => {
    switch (formik.values.gameMode) {
      case "1":
        formik.setFieldValue("toggleColors", true);
        formik.setFieldValue("toggleBorders", true);
        formik.setFieldValue("toggleLabels", true);
        formik.setFieldValue("numberOfRounds", 20);
        break;
      case "2":
        formik.setFieldValue("toggleColors", false);
        formik.setFieldValue("toggleBorders", true);
        formik.setFieldValue("toggleLabels", true);
        formik.setFieldValue("numberOfRounds", 20);
        break;
      case "3":
        formik.setFieldValue("toggleColors", false);
        formik.setFieldValue("toggleBorders", false);
        formik.setFieldValue("toggleLabels", true);
        formik.setFieldValue("numberOfRounds", 20);
        break;
      case "4":
        formik.setFieldValue("toggleColors", false);
        formik.setFieldValue("toggleBorders", false);
        formik.setFieldValue("toggleLabels", false);
        formik.setFieldValue("numberOfRounds", 20);
        break;
      case "5":
        formik.setFieldValue("toggleColors", true);
        formik.setFieldValue("toggleBorders", true);
        formik.setFieldValue("toggleLabels", true);
        break;
      default:
        break;
    }
  }, [formik.values.gameMode]);

  return (
    <>
      <h5 className="d-flex justify-content-center mb-3">
        {t("game.game_mode.heading")}
      </h5>
      <Form.Select
        aria-label="Game Mode"
        className="game-mode-select"
        onChange={(e) => formik.setFieldValue("gameMode", e.target.value)}
      >
        <option>{t("game.game_mode.select")}</option>
        <option value={1}>{t("game.game_mode.easy")}</option>
        <option value={2}>{t("game.game_mode.normal")}</option>
        <option value={3}>{t("game.game_mode.hard")}</option>
        <option value={4}>{t("game.game_mode.extrem")}</option>
        <option value={5}>{t("game.game_mode.training")}</option>
      </Form.Select>
      <ErrorMessage component={ValidationsAlerts} name="gameMode" />
      {formik.values.gameMode === "5" && (
        <div className="mt-2 nb-rounds-range">
          <MDBRange
            defaultValue={20}
            id="nbOfRounds"
            min={1}
            max={selectedCountryNamesLength}
            label={t("game.game_mode.nb_of_rounds")}
            onChange={(e) =>
              formik.setFieldValue("numberOfRounds", e.target.value)
            }
          />
        </div>
      )}
    </>
  );
};

export default connect(GameMode);
