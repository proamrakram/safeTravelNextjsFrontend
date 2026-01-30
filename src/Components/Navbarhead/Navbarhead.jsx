import React, { useMemo, useState } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import "./Navbar.css";
import { useTranslation } from "react-i18next";

const RTL_LANGS = new Set(["ar", "he"]);

function normalizeLang(lng) {
  return (lng || "en").split("-")[0];
}

const Navbarhead = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const handleLinkClick = () => setExpanded(false);

  const { t, i18n } = useTranslation();

  const currentLang = useMemo(() => normalizeLang(i18n.language), [i18n.language]);
  const isRtl = RTL_LANGS.has(currentLang);

  const handleChangeLanguage = async (lng) => {
    await i18n.changeLanguage(lng);
    setExpanded(false); // يسكر المنيو على الموبايل بعد الاختيار
  };

  return (
    <Navbar
      className="navbarhead"
      expand="lg"
      sticky="top"
      expanded={expanded}
      onToggle={(isExpanded) => setExpanded(isExpanded)}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="logo-brand"
          onClick={handleLinkClick}
        >
          <FaShieldAlt className="logo-icon" />
          {t("app.name")}
        </Navbar.Brand>

        <Navbar.Toggle className="custom-toggler" />

        <Navbar.Collapse>
          <Nav className={`${isRtl ? "me-auto" : "ms-auto"} align-items-center`}>
            <Nav.Link
              as={Link}
              to="/"
              className={`nav-custom-link ${location.pathname === "/" ? "active" : ""}`}
              onClick={handleLinkClick}
            >
              {t("nav.home")}
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/survey"
              className={`nav-custom-link ${location.pathname === "/survey" ? "active" : ""}`}
              onClick={handleLinkClick}
            >
              {t("nav.survey")}
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/payment"
              className={`nav-custom-link ${location.pathname === "/payment" ? "active" : ""}`}
              onClick={handleLinkClick}
            >
              {t("nav.payment")}
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/faqs"
              className={`nav-custom-link ${location.pathname === "/faqs" ? "active" : ""}`}
              onClick={handleLinkClick}
            >
              {t("nav.faqs")}
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/contact"
              className={`nav-contact-btn ${location.pathname === "/contact" ? "active" : ""}`}
              onClick={handleLinkClick}
            >
              {t("nav.contact")}
            </Nav.Link>

            {/* Language Switcher */}

            <NavDropdown
              align={isRtl ? "start" : "end"}
              title={`${t("nav.language")}: ${currentLang.toUpperCase()}`}
              id="nav-lang-dropdown"
              className="ms-2"
            >
              <NavDropdown.Item
                active={currentLang === "en"}
                onClick={() => handleChangeLanguage("en")}
              >
                English (EN)
              </NavDropdown.Item>

              <NavDropdown.Item
                active={currentLang === "ar"}
                onClick={() => handleChangeLanguage("ar")}
              >
                العربية (AR)
              </NavDropdown.Item>

              <NavDropdown.Item
                active={currentLang === "he"}
                onClick={() => handleChangeLanguage("he")}
              >
                עברית (HE)
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navbarhead;
