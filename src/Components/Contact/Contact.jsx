import React, { useMemo, useState } from "react";
import { Container, Row, Col, Form, Button, Spinner, Alert } from "react-bootstrap";
import { FaTelegramPlane, FaPaperPlane, FaClock, FaShieldAlt } from "react-icons/fa";
import "./Contact.css";
import { useTranslation } from "react-i18next";

const RTL_LANGS = new Set(["ar", "he"]);
const normalizeLang = (lng) => (lng || "en").split("-")[0];

// استخدم الدومين من ملف .env إذا متوفر (CRA uses REACT_APP_ prefix)
const ENV_API_DOMAIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const API_URL = `${ENV_API_DOMAIN.replace(/\/+$/g, "")}/api/contact-messages`;

const Contact = () => {
  const { t, i18n } = useTranslation();

  const currentLang = useMemo(() => normalizeLang(i18n.language), [i18n.language]);
  const isRtl = RTL_LANGS.has(currentLang);

  const [formData, setFormData] = useState({ name: "", message: "" });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Laravel 422 errors
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setSuccess("");
    setError("");

    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // امسح خطأ هذا الحقل فقط
    setFieldErrors((prev) => {
      if (!prev?.[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const err = (key) => (Array.isArray(fieldErrors?.[key]) ? fieldErrors[key][0] : "");
  const hasErr = (key) => !!err(key);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setSuccess("");
    setError("");
    setFieldErrors({});

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          message: formData.message,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Laravel validation errors
        if (res.status === 422 && json?.errors) {
          setFieldErrors(json.errors);
          setError(t("contact.alertFail") || "Please check required fields.");
          return;
        }

        throw new Error(json?.message || t("contact.alertFail") || "Something went wrong.");
      }

      setSuccess(t("contact.alertSuccess") || "Sent successfully.");
      setFormData({ name: "", message: "" });
    } catch (e2) {
      setError(e2?.message || t("contact.alertFail") || "Failed to send.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`contact-page ${isRtl ? "is-rtl" : "is-ltr"}`} dir={isRtl ? "rtl" : "ltr"}>
      <Container>
        <Row className="contact-wrapper g-0">
          {/* FORM SIDE */}
          <Col
            lg={7}
            className={`d-flex flex-column justify-content-center ${isRtl ? "order-2 order-lg-2" : "order-2 order-lg-1"
              }`}
          >
            <div className="contact-form-container">
              <div className="status-tag mb-3">
                <span className="dot pulse"></span> {t("contact.status")}
              </div>

              <h2 className="contact-title">{t("contact.title")}</h2>
              <p className="contact-subtitle">{t("contact.subtitle")}</p>

              <Form onSubmit={handleSubmit} className="mt-4">
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form.Group className="mb-3">
                  <Form.Label className="form-custom-label">{t("contact.fullName")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder={t("contact.namePlaceholder")}
                    value={formData.name}
                    onChange={handleChange}
                    className="custom-input"
                    isInvalid={hasErr("name")}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">{err("name")}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-custom-label">{t("contact.details")}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    placeholder={t("contact.messagePlaceholder")}
                    value={formData.message}
                    onChange={handleChange}
                    className="custom-input no-resize"
                    isInvalid={hasErr("message")}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">{err("message")}</Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" className="contact-submit-btn w-100 py-3" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner size="sm" className={isRtl ? "ms-2" : "me-2"} />
                      {t("contact.sending") ?? "Sending..."}
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className={isRtl ? "ms-2" : "me-2"} />
                      {t("contact.submit")}
                    </>
                  )}
                </Button>
              </Form>
            </div>
          </Col>

          {/* SIDEBAR SIDE */}
          <Col lg={5} className={`${isRtl ? "order-1 order-lg-1" : "order-1 order-lg-2"}`}>
            <div className="contact-info-sidebar h-100">
              <div className="sidebar-overlay"></div>

              <div className="info-content-wrapper">
                <div className="telegram-icon-circle">
                  <FaTelegramPlane size={42} />
                </div>

                <h3 className="fw-bold">{t("contact.sidebarTitle")}</h3>
                <p className="px-lg-4 text-light-50">{t("contact.sidebarDesc")}</p>

                <div className="trust-pills my-4">
                  <div className="trust-pill">
                    <FaShieldAlt /> {t("contact.secured")}
                  </div>
                  <div className="trust-pill">
                    <FaClock /> {t("contact.support24h")}
                  </div>
                </div>

                <a
                  href="https://t.me/YourUsername"
                  target="_blank"
                  rel="noreferrer"
                  className="telegram-action-btn"
                >
                  {t("contact.openTelegram")}
                </a>

                <div className="support-meta mt-5">
                  <small>
                    {t("contact.avgResponse")} <strong>{t("contact.avgResponseValue")}</strong>
                  </small>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
