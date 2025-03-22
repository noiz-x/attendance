import { Button, DarkThemeToggle, Footer, Navbar } from "flowbite-react";
import Explore from "./components/Explore.tsx";

function App() {
  return (
    <div id="color">
      <Navbar fluid>
        <Navbar.Brand href="#">Flowbite</Navbar.Brand>
        <Navbar.Collapse>
          <Navbar.Link href="#">Home</Navbar.Link>
          <Navbar.Link href="#">About</Navbar.Link>
          <Navbar.Link href="#">Services</Navbar.Link>
          <Navbar.Link href="#">Contact</Navbar.Link>
        </Navbar.Collapse>
        <div className="flex gap-2">
          <Button className="custom-btn">Login</Button>
          <Button className="custom-btn">Sign up</Button>
          <Navbar.Toggle />
          <DarkThemeToggle id="btn2" />
        </div>
      </Navbar>
      <Explore />
      <Footer container>
        <Footer.Copyright href="#" by="Atsuomi" year={new Date().getFullYear()} />
        <Footer.LinkGroup>
          <Footer.Link href="#">About</Footer.Link>
          <Footer.Link href="#">Privacy Policy</Footer.Link>
          <Footer.Link href="#">Licensing</Footer.Link>
          <Footer.Link href="#">Contact</Footer.Link>
        </Footer.LinkGroup>
      </Footer>
    </div>
  );
}

export default App;
