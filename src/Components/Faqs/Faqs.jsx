import React, { useMemo } from "react";
import { Accordion, Container, Row, Col } from "react-bootstrap";
import {
  FaQuestionCircle,
  FaShieldAlt,
  FaPlaneDeparture,
  FaUserCheck,
  FaWallet,
  FaEdit,
} from "react-icons/fa";
import "./Faqs.css";
import { useTranslation } from "react-i18next";

const RTL_LANGS = new Set(["ar", "he"]);
const normalizeLang = (lng) => (lng || "en").split("-")[0];

const Faqs = () => {
  const { t, i18n } = useTranslation();

  const currentLang = useMemo(
    () => normalizeLang(i18n.language),
    [i18n.language]
  );
  const isRtl = RTL_LANGS.has(currentLang);

  return (
    <section className={`faq-wrapper ${isRtl ? "is-rtl" : "is-ltr"}`}>
      <Container>
        <div className="faq-header text-center mb-5">
          <h2 className="faq-main-title">{t("faqs.title")}</h2>
          <p className="faq-subtitle">{t("faqs.subtitle")}</p>
          <div className="title-underline"></div>
        </div>

        <Row className="gy-4">
          <Col lg={6}>
            <Accordion
              defaultActiveKey="0"
              flush
              className="custom-faq-accordion"
            >
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <FaPlaneDeparture className="faq-icon-lead" />
                  {t("faqs.q1")}
                </Accordion.Header>
                <Accordion.Body>{t("faqs.a1")}</Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  <FaUserCheck className="faq-icon-lead" />
                  {t("faqs.q2")}
                </Accordion.Header>
                <Accordion.Body>{t("faqs.a2")}</Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  <FaQuestionCircle className="faq-icon-lead" />
                  {t("faqs.q3")}
                </Accordion.Header>
                <Accordion.Body>{t("faqs.a3")}</Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>

          <Col lg={6}>
            <Accordion flush className="custom-faq-accordion">
              <Accordion.Item eventKey="6">
                <Accordion.Header>
                  <FaEdit className="faq-icon-lead" />
                  {t("faqs.q4")}
                </Accordion.Header>
                <Accordion.Body>{t("faqs.a4")}</Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="7">
                <Accordion.Header>
                  <FaShieldAlt className="faq-icon-lead" />
                  {t("faqs.q5")}
                </Accordion.Header>
                <Accordion.Body>{t("faqs.a5")}</Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="8">
                <Accordion.Header>
                  <FaWallet className="faq-icon-lead" />
                  {t("faqs.q6")}
                </Accordion.Header>
                <Accordion.Body>{t("faqs.a6")}</Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Faqs;
