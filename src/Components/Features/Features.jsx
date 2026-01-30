import React, { useMemo } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import img1 from "../../assets/img/pay-img.png";
import img2 from "../../assets/img/q1.png";
import "./Features.css";
import { useTranslation } from "react-i18next";

const RTL_LANGS = new Set(["ar", "he"]);
const normalizeLang = (lng) => (lng || "en").split("-")[0];

const FeaturesSection = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const currentLang = useMemo(
    () => normalizeLang(i18n.language),
    [i18n.language]
  );
  const isRtl = RTL_LANGS.has(currentLang);

  return (
    <section className={`features-wrapper ${isRtl ? "is-rtl" : "is-ltr"}`}>
      <Container>
        <Row className="justify-content-center g-4">
          <Col xs={12} md={6} lg={5}>
            <Card
              className="feature-card h-100"
              onClick={() => navigate("/faqs")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate("/faqs")}
            >
              <Card.Body className="feature-body">
                <div className="feature-img-container">
                  <img
                    src={img2}
                    alt={t("features.faqAlt")}
                    className="feature-img"
                  />
                </div>
                <h5 className="feature-title">{t("features.faqTitle")}</h5>
                <span className="feature-link">{t("features.faqLink")}</span>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={5}>
            <Card
              className="feature-card h-100"
              onClick={() => navigate("/payment")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate("/payment")}
            >
              <Card.Body className="feature-body">
                <div className="feature-img-container">
                  <img
                    src={img1}
                    alt={t("features.paymentAlt")}
                    className="feature-img"
                  />
                </div>
                <h5 className="feature-title">{t("features.paymentTitle")}</h5>
                <span className="feature-link">{t("features.paymentLink")}</span>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FeaturesSection;
