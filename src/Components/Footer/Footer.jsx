import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Footer.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="footer-luxury">
      <div className="footer-top-accent"></div>

      <Container>
        <Row className="py-5 gy-4">
          <Col lg={4} md={12}>
            <h5 className="footer-brand">{t("app.name")}</h5>
            <p className="footer-description">{t("footer.desc")}</p>
          </Col>

          <Col lg={2} md={4} sm={6} className="offset-lg-1">
            <h5 className="footer-heading">{t("footer.navTitle")}</h5>
            <ul className="footer-links-list">
              <li><Link to="/">{t("footer.links.home")}</Link></li>
              <li><Link to="/survey">{t("footer.links.survey")}</Link></li>
              <li><Link to="/payment">{t("footer.links.payment")}</Link></li>
              <li><Link to="/faqs">{t("footer.links.faqs")}</Link></li>
              <li><Link to="/contact">{t("footer.links.contact")}</Link></li>
            </ul>
          </Col>

          <Col lg={2} md={4} sm={6}>
            <h5 className="footer-heading">{t("footer.supportTitle")}</h5>
            <ul className="footer-links-list">
              <li><a href="#faq">{t("footer.supportLinks.faqsCenter")}</a></li>
              <li><a href="#terms">{t("footer.supportLinks.terms")}</a></li>
              <li><a href="#privacy">{t("footer.supportLinks.privacy")}</a></li>
              <li><a href="#contact">{t("footer.supportLinks.emergency")}</a></li>
            </ul>
          </Col>

          <Col lg={3} md={4}>
            <h5 className="footer-heading">{t("footer.support247")}</h5>
            <p className="footer-description small">{t("footer.supportDesc")}</p>

            <div className="footer-btn-wrapper mt-3">
              <Link to="/contact" className="footer-action-btn">
                {t("footer.contactSpecialist")}
              </Link>
            </div>
          </Col>
        </Row>

        <div className="footer-divider"></div>

        <Row className="py-4 align-items-center">
          <Col md={6} className="text-center text-md-start">
            <p className="copyright-text">
              {t("footer.copyright1", { year })} <span>{t("app.name")}</span>. {t("footer.crafted")}
            </p>
          </Col>

          <Col md={6} className="text-center text-md-end mt-3 mt-md-0">
            <div className="payment-badges">
              <span className="badge-text">{t("footer.securePaymentsVia")}</span>
              <div className="badge-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
