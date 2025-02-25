
import { HashRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

//importing pages and components
//Home
import Index from "./pages/index";
import Settings from "./pages/settings";
import Account from "./pages/account";
import Knowledgebase from "./pages/knowledgebase"
import Faq from "./pages/faq";
import Login_window from "./pages/login_window";
import UpdateApplication_window from "./pages/updateApplication_window";
import Register_window from "./pages/register_window";
//Workspace
import Home_teamleader from "./pages/teamleader/home_teamleader";
import Prevwork_teamleader from "./pages/teamleader/prevwork_teamleader";
import Currwork_teamleader from "./pages/teamleader/currwork_teamleader";
import Newproject_teamleader from "./pages/teamleader/newproject_teamleader";
import Portal_teamleader from "./pages/teamleader/portal_teamleader";
import Addleaderinfo_teamleader from "./pages/teamleader/addleaderinfo_teamleader";
import Newteam_teamleader from "./pages/teamleader/newteam_teamleader";
import Calendarsale_teamleader from "./pages/teamleader/calendarsale_teamleader";
import Yescalendarsale_teamleader from "./pages/teamleader/yescalendarsale_teamleader";
//Filetransfer
import Home_filetransfer from "./pages/filetransfer/home_filetransfer";
import History_filetransfer from "./pages/filetransfer/history_filetransfer";
//Backuptransfer
import Home_backuptransfer from "./pages/backuptransfer/home_backuptransfer";
import History_backuptransfer from "./pages/backuptransfer/history_backuptransfer";
//Timereport
import Home_timereport from "./pages/timereport/home_timereport";

//importing css styles
import "./App.css";
import './assets/css/global.css';
import './assets/css/main.css';
import './assets/css/components.css';
import './assets/css/buttons.css';
import './assets/css/sidemenu.css';
import './assets/css/sidemenu_small.css';
import './assets/css/teamleader/buttons_teamleader.css';



function App() {
  return (
    <HashRouter >

      {/* FOTOGRAFPORTALEN */}
      <div className="main-content">
        <div className="content">

          <div className="">
            <Routes><Route path="/" element={<Index />} /> </Routes>
          </div>

          <div className="">
            <Routes><Route path="/settings" element={<Settings />} /></Routes>
          </div>

          <div className="">
            <Routes><Route path="/account" element={<Account />} /></Routes>
          </div>

          <div className="">
            <Routes><Route path="/knowledgebase" element={<Knowledgebase />} /></Routes>
          </div>

          <div className="">
            <Routes><Route path="/faq" element={<Faq />} /></Routes>
          </div>

        </div>
      </div>

      <div className="">
        <Routes><Route path="/updateapplication_window" element={<UpdateApplication_window />} /></Routes>
      </div>

      <div className="">
        <Routes><Route path="/login_window" element={<Login_window />} /></Routes>
      </div>

      <div className="">
        <Routes><Route path="/register_window" element={<Register_window />} /></Routes>
      </div>


      {/* TEAMELADER */}
      {/* .main-content for margin/padding left to make room for sidebar */}
      <div className="main-content">
        <div className="content">

          <div className="route-layout">
            <Routes> <Route path="/home_teamleader" element={<Home_teamleader />} /></Routes>
          </div>

          <div className="route-layout">
            <Routes><Route path="/prevwork_teamleader" element={<Prevwork_teamleader />} /></Routes>
          </div>

          <div className="route-layout">
            <Routes><Route path="/currwork_teamleader" element={<Currwork_teamleader />} /> </Routes>
          </div>

          <div className="route-layout">
            <Routes><Route path="/newproject_teamleader" element={<Newproject_teamleader />} /></Routes>
          </div>

          <div className="route-layout">
            <Routes><Route path="/portal_teamleader/:project_id" element={<Portal_teamleader />} /></Routes>
          </div>

          <div className="route-layout">
            <Routes><Route path="/addleaderinfo_teamleader" element={<Addleaderinfo_teamleader />} /></Routes>
          </div>

          <div className="route-layout">
            <Routes><Route path="/newteam_teamleader" element={<Newteam_teamleader />} /></Routes>
          </div>

          <div className="route-layout">
            <Routes><Route path="/calendarsale_teamleader" element={<Calendarsale_teamleader />} /></Routes>
          </div>

          <div className="route-layout">
            <Routes><Route path="/yescalendarsale_teamleader" element={<Yescalendarsale_teamleader />} /></Routes>
          </div>

        </div>
      </div>

      {/* FILETRANSFER */}
        {/* .main-content for margin/padding left to make room for sidebar */}
        <div className="main-content">
          <div className="content">

            <div className="route-layout">
              <Routes> <Route path="/home_filetransfer" element={<Home_filetransfer />} /></Routes>
            </div>

            <div className="route-layout">
              <Routes> <Route path="/history_filetransfer" element={<History_filetransfer />} /></Routes>
            </div>

          </div>
        </div>

        {/* BACKUPTRANSFER */}
        {/* .main-content for margin/padding left to make room for sidebar */}
        <div className="main-content">
          <div className="content">

            <div className="route-layout">
              <Routes> <Route path="/home_backuptransfer" element={<Home_backuptransfer />} /></Routes>
            </div>

            <div className="route-layout">
              <Routes> <Route path="/history_backuptransfer" element={<History_backuptransfer />} /></Routes>
            </div>

          </div>
        </div>


      {/* TIME REPORT */}
        {/* .main-content for margin/padding left to make room for sidebar */}
        <div className="main-content">
          <div className="content">

            <div className="route-layout">
              <Routes> <Route path="/home_timereport" element={<Home_timereport />} /></Routes>
            </div>

          </div>
        </div>

    </HashRouter >
  );
}

export default App;
