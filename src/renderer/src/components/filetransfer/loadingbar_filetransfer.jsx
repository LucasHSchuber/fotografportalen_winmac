import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { Bars } from "react-loader-spinner";

import "../../assets/css/filetransfer/components_filetransfer.css";

const Loadingbar_teamleader = ({ uploadProgress }) => {
  //define states
  console.log(uploadProgress);
  return (
    <div className="loadingbar-filetransfer">
      <div className="mt-3">
        <b>{uploadProgress && uploadProgress.uploaded}/{uploadProgress && uploadProgress.total} files uploaded</b>
      </div>
      <div className="tailspin">
        {/* <TailSpin
          height="30"
          width="30"
          color="red"
          ariaLabel="tail-spin-loading"
          radius="1"
          visible={true}
        /> */}
        <Bars
          height="50"
          width="50"
          color="red"
          ariaLabel="bars-loading"
          visible={true}
        />
      </div>
    </div>
  );
};

export default Loadingbar_teamleader;
