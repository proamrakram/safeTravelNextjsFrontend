import React, { useMemo, useState } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  ProgressBar,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPlane,
  faFileAlt,
  faCrown,
  faCheckCircle,
  faHotel,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import "./Registration.css";
import { useTranslation } from "react-i18next";

const RTL_LANGS = new Set(["ar", "he"]);
const normalizeLang = (lng) => (lng || "en").split("-")[0];

const PACKAGES = [
  {
    id: "Economic",
    price: "$1000",
    color: "#10b981",
    icon: faPlane,
    nameKey: "registration.packages.economic.name",
    descKey: "registration.packages.economic.desc",
    featuresKey: "registration.packages.economic.features",
  },
  {
    id: "Comfortable",
    price: "$2000",
    color: "#3b82f6",
    icon: faHotel,
    nameKey: "registration.packages.comfortable.name",
    descKey: "registration.packages.comfortable.desc",
    featuresKey: "registration.packages.comfortable.features",
  },
  {
    id: "VIP",
    price: "$4000+",
    color: "#FFB84D",
    icon: faCrown,
    nameKey: "registration.packages.vip.name",
    descKey: "registration.packages.vip.desc",
    featuresKey: "registration.packages.vip.features",
  },
];

// استخدم الدومين من ملف .env إذا موجود
// يدعم: REACT_APP_API_URL أو API_URL أو VITE_API_URL (لـ Vite)
const ENV_API_DOMAIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const API_URL = `${ENV_API_DOMAIN.replace(/\/$/, "")}/api/registrations`;

const Registration = () => {
  const { t, i18n } = useTranslation();

  const currentLang = useMemo(() => normalizeLang(i18n.language), [i18n.language]);
  const isRtl = RTL_LANGS.has(currentLang);

  const steps = useMemo(
    () => [
      { key: "personal", icon: faUser },
      { key: "travel", icon: faPlane },
      { key: "docs", icon: faFileAlt },
      { key: "package", icon: faCrown },
    ],
    []
  );

  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",

    travelers: 1,
    destination: "",
    stayDuration: "",

    personalPhoto: null,
    passport: null,
    idCard: null,

    familyMembers: [{ name: "", age: "", gender: "" }],
    travelPackage: "",
  });

  const [fileKey, setFileKey] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Laravel field errors: { full_name: [".."], stay_duration: [".."] ... }
  const [fieldErrors, setFieldErrors] = useState({});

  const setField = (field, value) => {
    setError("");
    setSuccess("");

    // امسح أخطاء السيرفر المتعلقة بالحقول الأكثر ارتباطًا
    // (هذا optional، لكن يحسن UX)
    setFieldErrors((prev) => ({ ...prev }));

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateFamilyMember = (index, patch) => {
    setError("");
    setSuccess("");

    setFormData((prev) => {
      const copy = [...prev.familyMembers];
      copy[index] = { ...copy[index], ...patch };
      return { ...prev, familyMembers: copy };
    });
  };

  const fieldToStep = (key) => {
    const step0 = ["full_name", "age", "gender", "email"];
    const step1 = ["destination", "stay_duration", "travelers"];
    const step2 = ["personal_photo", "passport", "id_card", "family_members"];
    const step3 = ["travel_package"];

    if (step0.includes(key)) return 0;
    if (step1.includes(key)) return 1;
    if (step2.includes(key)) return 2;
    if (step3.includes(key)) return 3;
    return 0;
  };

  // تحقق محلي بسيط لنفس متطلبات الخطوات
  const validateStepLocal = () => {
    const errs = {};

    if (currentStep === 0) {
      if (!formData.name.trim()) errs.name = t("registration.errors.fillRequired");
      if (!formData.age) errs.age = t("registration.errors.fillRequired");
      if (!formData.gender) errs.gender = t("registration.errors.fillRequired");
      if (!formData.email.trim()) errs.email = t("registration.errors.fillRequired");
    }

    if (currentStep === 1) {
      if (!formData.destination.trim()) errs.destination = t("registration.errors.fillRequired");
      if (!formData.stayDuration) errs.stayDuration = t("registration.errors.fillRequired");
    }

    if (currentStep === 2) {
      if (!formData.personalPhoto) errs.personalPhoto = t("registration.errors.fillRequired");
      if (!formData.passport) errs.passport = t("registration.errors.fillRequired");
      if (!formData.idCard) errs.idCard = t("registration.errors.fillRequired");
    }

    if (currentStep === 3) {
      if (!formData.travelPackage) errs.travelPackage = t("registration.errors.fillRequired");
    }

    return errs;
  };

  const nextStep = () => {
    const localErrs = validateStepLocal();
    if (Object.keys(localErrs).length === 0) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      setError("");
    } else {
      setError(t("registration.errors.fillRequired"));
    }
  };

  const prevStep = () => {
    setError("");
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      gender: "",
      email: "",

      travelers: 1,
      destination: "",
      stayDuration: "",

      personalPhoto: null,
      passport: null,
      idCard: null,

      familyMembers: [{ name: "", age: "", gender: "" }],
      travelPackage: "",
    });
    setFieldErrors({});
    setError("");
    // setSuccess("");
    setCurrentStep(0);

    // ✅ يعيد تصفير inputs الملفات
    setFileKey((k) => k + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // تحقق محلي أخير في خطوة الباقة قبل الإرسال
    const localErrs = validateStepLocal();
    if (Object.keys(localErrs).length > 0) {
      setError(t("registration.errors.fillRequired"));
      return;
    }

    if (loading) return;

    setLoading(true);
    setError("");
    setSuccess("");
    setFieldErrors({});

    try {
      const fd = new FormData();

      // Registration fields (React -> API)
      fd.append("full_name", formData.name);
      fd.append("age", String(formData.age));
      fd.append("gender", formData.gender);
      fd.append("email", formData.email);

      fd.append("travelers", String(formData.travelers || 1));
      fd.append("destination", formData.destination);
      fd.append("stay_duration", String(formData.stayDuration));
      fd.append("travel_package", formData.travelPackage);

      // Family Members JSON string
      fd.append("family_members", JSON.stringify(formData.familyMembers || []));

      // Documents
      fd.append("personal_photo", formData.personalPhoto);
      fd.append("passport", formData.passport);
      fd.append("id_card", formData.idCard);

      const res = await fetch(API_URL, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        // ✅ Laravel validation errors (422)
        if (res.status === 422 && json?.errors) {
          setFieldErrors(json.errors);

          const firstKey = Object.keys(json.errors)[0];
          if (firstKey) setCurrentStep(fieldToStep(firstKey));

          setError(t("registration.errors.fillRequired"));
          return;
        }

        const msg =
          json?.message ||
          (json?.errors ? Object.values(json.errors).flat().join("\n") : "") ||
          t("registration.errors.submitFail");

        throw new Error(msg);
      }

      setSuccess(t("registration.success.submitted"));
      resetForm();
    } catch (err) {
      setError(err?.message || t("registration.errors.submitFail"));
    } finally {
      setLoading(false);
    }
  };

  // Helpers لربط errors من Laravel مع حقول React
  const err = (key) => (Array.isArray(fieldErrors?.[key]) ? fieldErrors[key][0] : "");
  const hasErr = (key) => !!err(key);

  return (
    <section className="Survey-section" dir={isRtl ? "rtl" : "ltr"}>
      <Container>
        <div className="survey-header text-center mb-5">
          <h2 className="Survey-h2">{t("registration.title")}</h2>
          <p className="survey-subtitle">{t("registration.subtitle")}</p>
        </div>

        <div className="progress-stepper mx-auto">
          <div className="steps-indicators">
            {steps.map((step, index) => (
              <div
                key={step.key}
                className={`step-dot ${index <= currentStep ? "active" : ""}`}
              >
                <div className="dot-number">
                  <FontAwesomeIcon
                    icon={index < currentStep ? faCheckCircle : step.icon}
                  />
                </div>
                <div className="dot-label d-none d-md-block">
                  {t(`registration.steps.${step.key}`)}
                </div>
              </div>
            ))}
          </div>

          <ProgressBar
            now={((currentStep + 1) / steps.length) * 100}
            className="custom-progress"
          />
        </div>

        <Card className="survey-card shadow-sm mx-auto">
          <Card.Body className="p-4 p-md-5">
            <Form onSubmit={handleSubmit}>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success" dismissible onClose={() => setSuccess("")}>{success}</Alert>}

              {/* STEP 0: Personal */}
              {currentStep === 0 && (
                <div className="animate-fade-in">
                  <h4 className="step-inner-title">
                    {t("registration.personal.title")}
                  </h4>

                  <Form.Group className="mb-4">
                    <Form.Label>{t("registration.personal.fullName")}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={t("registration.personal.fullNamePh")}
                      value={formData.name}
                      onChange={(e) => setField("name", e.target.value)}
                      isInvalid={hasErr("full_name")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {err("full_name")}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col md={6} className="mb-4">
                      <Form.Label>{t("registration.personal.age")}</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder={t("registration.personal.agePh")}
                        value={formData.age}
                        onChange={(e) => setField("age", e.target.value)}
                        isInvalid={hasErr("age")}
                      />
                      <Form.Control.Feedback type="invalid">
                        {err("age")}
                      </Form.Control.Feedback>
                    </Col>

                    <Col md={6} className="mb-4">
                      <Form.Label>{t("registration.personal.gender")}</Form.Label>
                      <Form.Select
                        value={formData.gender}
                        onChange={(e) => setField("gender", e.target.value)}
                        isInvalid={hasErr("gender")}
                      >
                        <option value="">
                          {t("registration.personal.genderPh")}
                        </option>
                        <option value="Male">
                          {t("registration.personal.male")}
                        </option>
                        <option value="Female">
                          {t("registration.personal.female")}
                        </option>
                      </Form.Select>
                      {hasErr("gender") && (
                        <div className="invalid-feedback d-block">
                          {err("gender")}
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Form.Group>
                    <Form.Label>{t("registration.personal.email")}</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder={t("registration.personal.emailPh")}
                      value={formData.email}
                      onChange={(e) => setField("email", e.target.value)}
                      isInvalid={hasErr("email")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {err("email")}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              )}

              {/* STEP 1: Travel */}
              {currentStep === 1 && (
                <div className="animate-fade-in">
                  <h4 className="step-inner-title">
                    {t("registration.travel.title")}
                  </h4>

                  <Form.Group className="mb-4">
                    <Form.Label>{t("registration.travel.destination")}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={t("registration.travel.destinationPh")}
                      value={formData.destination}
                      onChange={(e) => setField("destination", e.target.value)}
                      isInvalid={hasErr("destination")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {err("destination")}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>{t("registration.travel.stay")}</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder={t("registration.travel.stayPh")}
                      value={formData.stayDuration}
                      onChange={(e) => setField("stayDuration", e.target.value)}
                      isInvalid={hasErr("stay_duration")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {err("stay_duration")}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>{t("registration.travel.travelers") ?? "Travelers"}</Form.Label>
                    <Form.Control
                      type="number"
                      min={1}
                      value={formData.travelers}
                      onChange={(e) => setField("travelers", e.target.value)}
                      isInvalid={hasErr("travelers")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {err("travelers")}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              )}

              {/* STEP 2: Docs & Family */}
              {currentStep === 2 && (
                <div className="animate-fade-in">
                  <h4 className="step-inner-title">
                    {t("registration.docs.title")}
                  </h4>

                  <Row className="mb-4">
                    <Col md={4}>
                      <Form.Label>{t("registration.docs.photo")}</Form.Label>
                      <Form.Control
                        key={`photo-${fileKey}`}
                        type="file"
                        onChange={(e) =>
                          setField("personalPhoto", e.target.files?.[0] ?? null)
                        }
                        isInvalid={hasErr("personal_photo")}
                      />
                      <Form.Control.Feedback type="invalid">
                        {err("personal_photo")}
                      </Form.Control.Feedback>
                    </Col>

                    <Col md={4}>
                      <Form.Label>{t("registration.docs.passport")}</Form.Label>
                      <Form.Control
                        key={`passport-${fileKey}`}
                        type="file"
                        onChange={(e) => setField("passport", e.target.files?.[0] ?? null)}
                        isInvalid={hasErr("passport")}
                      />
                      <Form.Control.Feedback type="invalid">
                        {err("passport")}
                      </Form.Control.Feedback>
                    </Col>

                    <Col md={4}>
                      <Form.Label>{t("registration.docs.idCard")}</Form.Label>
                      <Form.Control
                        key={`id-${fileKey}`}
                        type="file"
                        onChange={(e) => setField("idCard", e.target.files?.[0] ?? null)}
                        isInvalid={hasErr("id_card")}
                      />
                      <Form.Control.Feedback type="invalid">
                        {err("id_card")}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>

                  <h5 className="mb-3 font-weight-bold">
                    {t("registration.docs.familyTitle")}
                  </h5>

                  {formData.familyMembers.map((m, i) => (
                    <div key={i} className="family-member-row p-3 mb-2">
                      <Row className="g-2">
                        <Col md={6}>
                          <Form.Control
                            placeholder={t("registration.docs.memberNamePh")}
                            value={m.name}
                            onChange={(e) => updateFamilyMember(i, { name: e.target.value })}
                          />
                        </Col>

                        <Col md={3}>
                          <Form.Control
                            type="number"
                            placeholder={t("registration.docs.memberAgePh")}
                            value={m.age}
                            onChange={(e) => updateFamilyMember(i, { age: e.target.value })}
                          />
                        </Col>

                        <Col md={3}>
                          <Form.Select
                            value={m.gender}
                            onChange={(e) => updateFamilyMember(i, { gender: e.target.value })}
                          >
                            <option value="">
                              {t("registration.docs.memberGenderPh")}
                            </option>
                            <option value="Male">{t("registration.docs.maleShort")}</option>
                            <option value="Female">{t("registration.docs.femaleShort")}</option>
                          </Form.Select>
                        </Col>
                      </Row>
                    </div>
                  ))}

                  <Button
                    variant="link"
                    className="add-member-link"
                    onClick={() =>
                      setField("familyMembers", [
                        ...formData.familyMembers,
                        { name: "", age: "", gender: "" },
                      ])
                    }
                    type="button"
                    disabled={loading}
                  >
                    {t("registration.buttons.addMember")}
                  </Button>
                </div>
              )}

              {/* STEP 3: Package */}
              {currentStep === 3 && (
                <div className="animate-fade-in">
                  <h4 className="step-inner-title">{t("registration.packages.title")}</h4>

                  <div className="premium-packages-container">
                    {PACKAGES.map((pkg) => {
                      const selected = formData.travelPackage === pkg.id;
                      const features = t(pkg.featuresKey, { returnObjects: true });

                      return (
                        <div
                          key={pkg.id}
                          className={`tier-card ${selected ? "selected" : ""}`}
                          onClick={() => !loading && setField("travelPackage", pkg.id)}
                          role="button"
                        >
                          <div className="tier-icon" style={{ color: pkg.color }}>
                            <FontAwesomeIcon icon={pkg.icon} />
                          </div>

                          <div className="tier-name">{t(pkg.nameKey)}</div>
                          <div className="tier-price">{pkg.price}</div>

                          <p className="small text-muted">{t(pkg.descKey)}</p>

                          <ul className="list-unstyled small mt-3 package-features">
                            {Array.isArray(features) &&
                              features.map((f, idx) => (
                                <li key={idx} className="package-feature-item">
                                  <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    className={`text-success ${isRtl ? "ms-2" : "me-2"}`}
                                  />
                                  {f}
                                </li>
                              ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>

                  {(hasErr("travel_package") || (!formData.travelPackage && error)) && (
                    <div className="text-danger mt-2 small">
                      {err("travel_package") || t("registration.errors.fillRequired")}
                    </div>
                  )}

                  <div className="info-alert mt-4 d-flex align-items-center">
                    <FontAwesomeIcon
                      icon={faLightbulb}
                      className={`fa-2x text-warning ${isRtl ? "ms-3" : "me-3"}`}
                    />
                    <div>
                      <strong>{t("registration.packages.noteTitle")}</strong>
                      <p className="mb-0 small">{t("registration.packages.noteText")}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="d-flex justify-content-between mt-5">
                <Button
                  className="btn-back-custom"
                  onClick={prevStep}
                  disabled={currentStep === 0 || loading}
                  type="button"
                >
                  {t("registration.buttons.back")}
                </Button>

                {currentStep < 3 ? (
                  <Button
                    className="btn-next-custom"
                    onClick={nextStep}
                    disabled={loading}
                    type="button"
                  >
                    {t("registration.buttons.next")}
                  </Button>
                ) : (
                  <Button className="btn-next-custom" type="submit" disabled={loading}>
                    {loading ? <Spinner size="sm" /> : t("registration.buttons.confirm")}
                  </Button>
                )}
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </section>
  );
};

export default Registration;
