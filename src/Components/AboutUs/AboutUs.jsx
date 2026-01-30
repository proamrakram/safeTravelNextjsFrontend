import React, { useMemo } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import "./AboutUs.css";
import { useTranslation } from "react-i18next";

const RTL_LANGS = new Set(["ar", "he"]);
const normalizeLang = (lng) => (lng || "en").split("-")[0];

const AboutUs = () => {
  const { t, i18n } = useTranslation();

  const currentLang = useMemo(() => normalizeLang(i18n.language), [i18n.language]);
  const isRtl = RTL_LANGS.has(currentLang);

  const features = useMemo(
    () => [
      {
        icon: "fas fa-shield-alt",
        title: t("about.features.secureTitle", { defaultValue: "Secure & Reliable" }),
        desc: t("about.features.secureDesc", {
          defaultValue: "We follow clear processes to keep your journey smooth and safe.",
        }),
      },
      {
        icon: "fas fa-headset",
        title: t("about.features.supportTitle", { defaultValue: "24/7 Support" }),
        desc: t("about.features.supportDesc", {
          defaultValue: "Our team is always available to assist you before and during travel.",
        }),
      },
      {
        icon: "fas fa-map-marked-alt",
        title: t("about.features.planningTitle", { defaultValue: "Smart Planning" }),
        desc: t("about.features.planningDesc", {
          defaultValue: "From documents to booking details — everything is organized for you.",
        }),
      },
    ],
    [t]
  );

  return (
    <section
      className={`about-luxury-section ${isRtl ? "is-rtl" : "is-ltr"}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="bg-shimmer"></div>

      <Container>
        {/* ✅ قلب الأعمدة على lg فقط عند RTL */}
        <Row className={`align-items-center g-5 ${isRtl ? "flex-lg-row-reverse" : ""}`}>
          {/* Content */}
          <Col lg={6}>
            <div className="about-content">
              <div className="about-badge">
                <span className="badge-dot"></span>
                {t("about.badge")}
              </div>

              <h1 className="about-heading">
                {t("about.headingLine1")}
                <span className="accent-text">{t("about.headingLine2")}</span>
              </h1>

              <p className="about-description">{t("about.p1")}</p>
              <p className="about-description">{t("about.p2")}</p>

              <Card className="about-quote-card">
                <Card.Body>
                  <div className="quote-icon">“</div>
                  <p className="mb-0">{t("about.quote")}</p>
                </Card.Body>
              </Card>

              <div className="btn-group-custom">
                <Button className="about-btn-primary">{t("about.ctaPrimary")}</Button>
                <Button className="about-btn-outline">{t("about.ctaSecondary")}</Button>
              </div>

              {/* ✅ Trust pills صغيرة لتحسين الـ UX */}
              <div className="about-trust-row">
                <Badge pill className="trust-pill">
                  <i className={`fas fa-check-circle ${isRtl ? "ms-2" : "me-2"}`} />
                  {t("about.trust.fast", { defaultValue: "Fast process" })}
                </Badge>

                <Badge pill className="trust-pill">
                  <i className={`fas fa-lock ${isRtl ? "ms-2" : "me-2"}`} />
                  {t("about.trust.secure", { defaultValue: "Secure handling" })}
                </Badge>

                <Badge pill className="trust-pill">
                  <i className={`fas fa-star ${isRtl ? "ms-2" : "me-2"}`} />
                  {t("about.trust.quality", { defaultValue: "High quality" })}
                </Badge>
              </div>
            </div>
          </Col>

          {/* ✅ بدل الفيديو: Side Panel */}
          <Col lg={6}>
            <div className="side-frame-container">
              <Card className="about-side-card">
                <Card.Body>
                  <div className="side-header">
                    <h4 className="side-title">
                      {t("about.side.title", { defaultValue: "Why choose us?" })}
                    </h4>
                    <p className="side-subtitle mb-0">
                      {t("about.side.subtitle", {
                        defaultValue: "A premium experience with clarity and support.",
                      })}
                    </p>
                  </div>

                  <div className="features-grid">
                    {features.map((f, idx) => (
                      <div key={idx} className="feature-item">
                        <div className="feature-icon">
                          <i className={f.icon}></i>
                        </div>
                        <div className="feature-text">
                          <div className="feature-title">{f.title}</div>
                          <div className="feature-desc">{f.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mini-stats">
                    <div className="mini-stat">
                      <div className="mini-stat-num">24/7</div>
                      <div className="mini-stat-label">
                        {t("about.side.stat1", { defaultValue: "Support" })}
                      </div>
                    </div>
                    <div className="mini-stat">
                      <div className="mini-stat-num">3</div>
                      <div className="mini-stat-label">
                        {t("about.side.stat2", { defaultValue: "Packages" })}
                      </div>
                    </div>
                    <div className="mini-stat">
                      <div className="mini-stat-num">100%</div>
                      <div className="mini-stat-label">
                        {t("about.side.stat3", { defaultValue: "Transparency" })}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <div className="side-decoration-box"></div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutUs;
