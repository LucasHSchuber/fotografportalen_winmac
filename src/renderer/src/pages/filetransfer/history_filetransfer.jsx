import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import uploadedfile_black from "../../assets/images/uploadedfile_black.png";

import Sidemenu_filetransfer from "../../components/filetransfer/sidemenu_filetransfer";

import "../../assets/css/filetransfer/main_filetransfer.css";
import "../../assets/css/filetransfer/buttons_filetransfer.css";

function History_filetransfer() {
  // Define states

  return (
    <div className="filetransfer-wrapper">
      <div className="header">
        <h4>
          <img
            className="title-img"
            src={uploadedfile_black}
            alt="uploadedfile_black"
          />{" "}
          History
        </h4>
        <p>This is your history of uploaded files and projects</p>
      </div>

      <Sidemenu_filetransfer />
    </div>
  );
}
export default History_filetransfer;
