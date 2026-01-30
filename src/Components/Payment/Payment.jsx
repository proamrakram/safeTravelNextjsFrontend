import React, { useMemo } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { FaCreditCard, FaLock, FaCheckCircle } from "react-icons/fa";
import "./Payment.css";
import { useTranslation } from "react-i18next";

const RTL_LANGS = new Set(["ar", "he"]);
const normalizeLang = (lng) => (lng || "en").split("-")[0];

const Payment = () => {
  const { t, i18n } = useTranslation();

  const currentLang = useMemo(
    () => normalizeLang(i18n.language),
    [i18n.language]
  );
  const isRtl = RTL_LANGS.has(currentLang);

  return (
    <div className={`payment-page-wrapper ${isRtl ? "is-rtl" : "is-ltr"}`}>
      <Container>
        <div className="payment-header text-center mb-5">
          <div className="security-badge mb-3">
            <FaLock className={isRtl ? "ms-2" : "me-2"} />
            {t("payment.secureBadge")}
          </div>

          <h2 className="payment-title">{t("payment.title")}</h2>
          <p className="payment-subtitle">{t("payment.subtitle")}</p>
        </div>

        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="payment-main-card border-0 shadow-lg">
              <Row className="g-0">
                {/* Sidebar */}
                <Col
                  md={4}
                  className={`methods-sidebar p-4 text-center ${isRtl ? "order-1 order-md-2" : "order-1 order-md-1"
                    }`}
                >
                  <h6 className="sidebar-label">{t("payment.methodLabel")}</h6>

                  <div className="method-item active mt-4 justify-content-center">
                    <div className="method-icon-box">
                      <FaCreditCard />
                    </div>

                    <div
                      className={`method-info ${isRtl ? "text-end me-3" : "text-start ms-3"
                        }`}
                    >
                      <h6>{t("payment.methodName")}</h6>
                      <small>{t("payment.methodMeta")}</small>
                    </div>
                  </div>
                </Col>

                {/* Details */}
                <Col
                  md={8}
                  className={`payment-details-area p-5 ${isRtl ? "order-2 order-md-1" : "order-2 order-md-2"
                    }`}
                >
                  <h4 className="method-main-title">
                    {t("payment.cardDetailsTitle")}
                  </h4>

                  <p className="method-desc">{t("payment.cardDetailsDesc")}</p>

                  <div className="benefit-grid mt-4">
                    <div className="benefit-tag">
                      <FaCheckCircle /> {t("payment.benefit1")}
                    </div>
                    <div className="benefit-tag">
                      <FaCheckCircle /> {t("payment.benefit2")}
                    </div>
                    <div className="benefit-tag">
                      <FaCheckCircle /> {t("payment.benefit3")}
                    </div>
                  </div>

                  <Form className="mt-5">
                    <Form.Group className="mb-3">
                      <Form.Label>{t("payment.cardholder")}</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={t("payment.cardholderPh")}
                        className="payment-input"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>{t("payment.cardNumber")}</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={t("payment.cardNumberPh")}
                        className="payment-input payment-input-ltr"
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>{t("payment.expiry")}</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder={t("payment.expiryPh")}
                            className="payment-input payment-input-ltr"
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>{t("payment.cvv")}</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder={t("payment.cvvPh")}
                            className="payment-input payment-input-ltr"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button className="pay-now-btn w-100 py-3 mt-3">
                      {t("payment.payNow")}
                    </Button>
                  </Form>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Payment;
