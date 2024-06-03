import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { Bars } from "react-loader-spinner";

import "../../assets/css/filetransfer/components_filetransfer.css";

const Loadingbar_filetransfer = ({ uploadProgress }) => {
  //define states
  console.log(uploadProgress);
  return (
    <div className="loadingbar-filetransfer">
      <div className="mt-3">
        Files uploaded: <br></br><b>{uploadProgress && uploadProgress.uploaded}/{uploadProgress && uploadProgress.total}</b>
      </div>
      <div className="tailspin">
        <Bars
          height="30"
          width="40"
          color="red"
          ariaLabel="bars-loading"
          visible={true}
        />
      </div>
    </div>
  );
};

export default Loadingbar_filetransfer;
