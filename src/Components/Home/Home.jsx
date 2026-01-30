import React from "react";
import { Container } from "react-bootstrap";
import "./Home.css";

const Home = () => {
  return (
    <section className="home">
      {/* اختياري: لو بدك محتوى */}
      <div className="home-overlay" />
      <Container className="home-content">
        {/* حط عنوان/زر لاحقًا */}
      </Container>
    </section>
  );
};

export default Home;
