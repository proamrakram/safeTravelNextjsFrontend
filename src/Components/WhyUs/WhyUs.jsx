import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaTags, FaHeadset, FaGlobe, FaLock, FaClipboardCheck, FaBriefcase } from "react-icons/fa";
import "./WhyUs.css";
import { useTranslation } from "react-i18next";

const WhyUs = () => {
  const { t } = useTranslation();

  const features = [
    { id: "01", icon: <FaTags /> },
    { id: "02", icon: <FaHeadset /> },
    { id: "03", icon: <FaGlobe /> },
    { id: "04", icon: <FaLock /> },
    { id: "05", icon: <FaClipboardCheck /> },
    { id: "06", icon: <FaBriefcase /> }
  ];

  return (
    <section className="why-us-wrapper">
      <Container>
        <div className="section-header text-center">
          <span className="subtitle">{t("why.subtitle")}</span>
          <h2 className="main-title-premium">
            {t("why.title1")} <span className="highlight">{t("why.highlight")}</span>
          </h2>
          <div className="header-line"></div>
        </div>

        <Row className="g-5 mt-4">
          {features.map((item) => (
            <Col key={item.id} lg={4} md={6}>
              <div className="feature-card-premium">
                <div className="card-index">{item.id}</div>
                <div className="icon-wrapper-premium">{item.icon}</div>
                <h4 className="feature-title">{t(`why.items.${item.id}.title`)}</h4>
                <p className="feature-desc">{t(`why.items.${item.id}.desc`)}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default WhyUs;
