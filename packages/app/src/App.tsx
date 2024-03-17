import { MainPage } from "./pages/MainPage";
import "./styles.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
} from "react-router-dom";
import { useLocation } from "react-use";
import styled from "styled-components";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const NavSection = () => {
  const { pathname } = useLocation();

  return (
    <Nav>
      <Logo to={"/"}>Suatheby's</Logo>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <ConnectButton />
      </div>
    </Nav>
  );
};

const App = () => {
  return (
    <Router>
      <div>
        <NavSection />

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route element={<>Not found</>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

const Logo = styled(Link)`
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-decoration: none;
  font-size: 1.2rem;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 12px;
`;
