import React, { useMemo } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./JoinUs.css";
import register from "../../assets/img/register (1).png";
import { useTranslation } from "react-i18next";

const RTL_LANGS = new Set(["ar", "he"]);
const normalizeLang = (lng) => (lng || "en").split("-")[0];

const JoinUs = () => {
  const { t, i18n } = useTranslation();

  const currentLang = useMemo(
    () => normalizeLang(i18n.language),
    [i18n.language]
  );

  const isRtl = RTL_LANGS.has(currentLang);

  return (
    <section className={`two-column-cta-wrapper ${isRtl ? "is-rtl" : "is-ltr"}`}>
      <Container className="cta-inner-card shadow-sm">
        <Row className={`align-items-center ${isRtl ? "flex-lg-row-reverse" : ""}`}>

          {/* Image */}
          <Col lg={5} md={12} className="image-col">
            <div className="cta-image-wrapper">
              <img
                src={register}
                alt={t("join.imgAlt")}
                className="cta-image-fluid"
              />
            </div>
          </Col>
          
          {/* Text */}
          <Col lg={7} md={12} className="text-col p-lg-5">
            <h2 className="cta-title">{t("join.title")}</h2>
            <p className="cta-text">{t("join.text")}</p>

            <div className="btn-holder">
              <Button as={Link} to="/survey" className="cta-primary-btn">
                {t("join.btn")}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default JoinUs;
