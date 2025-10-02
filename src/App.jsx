// App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Context Provider

// 레이아웃 컴포넌트
import HeaderNavbar from "./components/common/HeaderNavbar";
import Footer from "./components/common/Footer";
// board 컴포넌트
import WalkPath from "./components/board/WalkPath";


function App() {
  return (
    <BrowserRouter>
      {/* <AuthProvider> */}
      <div className="App">
        <HeaderNavbar />
        <Container className="mt-4">
          <Routes>
            <Route path="/walk-paths" element={<WalkPath />} />
          </Routes>
        </Container>
        <Footer />
      </div>
      {/* </AuthProvider> */}
    </BrowserRouter>
  );
}

export default App;
