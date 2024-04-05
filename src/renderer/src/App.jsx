
import { HashRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

//importing pages and components
import Index from "./pages/index";
import Home from "./pages/teamleader/home";
import Sidemenu from "./components/sidemenu";
import Sidemenu_small from "./components/sidemenu_small";
import Addgroup from "./pages/teamleader/addgroup";

//teamleader pages and components
import Home_teamleader from "./pages/teamleader/home_teamleader";
import Prevwork_teamleader from "./pages/teamleader/prevwork_teamleader";
import Currwork_teamleader from "./pages/teamleader/currwork_teamleader";
import Newproject_teamleader from "./pages/teamleader/newproject_teamleader";
import Portal_teamleader from "./pages/teamleader/portal_teamleader";
import Addleaderinfo_teamleader from "./pages/teamleader/addleaderinfo_teamleader";
// import Newteam_teamleader from "./pages/teamleader/newteam_teamleader";
// import Sidemenu_teamleader from "./components/teamleader/sidemenu_teamleader";
// import Minimenu_teamleader from "./components/teamleader/minimenu_teamleader";

//importing css styles
import "./App.css";
import './assets/css/global.css';
import './assets/css/main.css';
import './assets/css/sidemenu.css';
import './assets/css/sidemenu_small.css';
import './assets/css/teamleader/buttons_teamleader.css';


//teamleader css styles




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

      {/* <div className="sidemenu">
        <Sidemenu />
      </div> */}

      {/* <div className="sidemenu_small">
        <Sidemenu_small />
      </div> */}

      {/* .main-content for margin/padding left to make room for sidebar */}
      <div className="main-content">

        <div className="content">

          <div className="">
            <Routes>
              <Route path="/" element={<Index />} />
            </Routes>
          </div>

          <div className="route-layout">
            <Routes>
              <Route path="/home_teamleader" element={<Home_teamleader />} />
            </Routes>
          </div>

          <div className="route-layout">
            <Routes>
              <Route path="/prevwork_teamleader" element={<Prevwork_teamleader />} />
            </Routes>
          </div>

          <div className="route-layout">
            <Routes>
              <Route path="/currwork_teamleader" element={<Currwork_teamleader />} />
            </Routes>
          </div>

          <div className="route-layout">
            <Routes>
              <Route path="/newproject_teamleader" element={<Newproject_teamleader />} />
            </Routes>
          </div>

          <div className="route-layout">
            <Routes>
              <Route path="/portal_teamleader/:project_id" element={<Portal_teamleader />} />
            </Routes>
          </div>

          <div className="route-layout">
            <Routes>
              <Route path="/addleaderinfo_teamleader" element={<Addleaderinfo_teamleader />} />
            </Routes>
          </div>

          {/* <div className="route-layout">
            <Routes>
              <Route path="/newteam_teamleader" element={<Newteam_teamleader />} />
            </Routes>
          </div> */}

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
