
import { HashRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";


import Index from "./pages/index";
import Home from "./pages/home";
import Header from "./pages/header";
import Sidemenu from "./components/sidemenu";
import Addgroup from "./pages/addgroup";

//importing css style
import "./App.css";
import './assets/css/global.css';
import './assets/css/header.css';
import './assets/css/main.css';
import './assets/css/sidemenu.css';


function App() {
  // useEffect(() => {
  //   const script = document.createElement('script');

  //   script.src = new URL('./assets/promise.js', import.meta.url).href
  //   script.async = true;

  //   document.body.appendChild(script);

  //   return () => {
  //     document.body.removeChild(script);
  //   }
  // })
  return (
    <HashRouter >

      <div className="sidemenu">
        <Sidemenu />
      </div>

      {/* .main-content for margin/padding left to make room for sidebar */}
      <div className="main-content">

        <div>
          <Header />
        </div>

        <div className="content">

          <div className="route-layout">
            <Routes>
              <Route path="/" element={<Index />} />
            </Routes>
          </div>

          <div className="route-layout">
            <Routes>
              <Route path="/home" element={<Home />} />
            </Routes>
          </div>

          <div className="route-layout">
            <Routes>
              <Route path="/addgroup" element={<Addgroup />} />
            </Routes>
          </div>

        </div>

      </div>



    </HashRouter >
  );
}

export default App;
