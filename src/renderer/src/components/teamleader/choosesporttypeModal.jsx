import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";

import running from "../../assets/images/running.png";
import calendar from "../../assets/images/calendar.png";

// import "../../assets/css/teamleader/newprojectModal.css";

const ChooseSportTypeModal = ({
  projectName,
  projectType,
  showChooseSportTypeModal,
  handleCloseChooseSportTypeModal,
  confirmChooseSportType,
}) => {
  //define states
  const [isSelectedSportType1, setIsSelectedSportType1] = useState(false);
  const [isSelectedSportType2, setIsSelectedSportType2] = useState(false);
  const [sportType, setSportType] = useState("");

  const [errorSportType, setErrorSportType] = useState(false);

  //press enter to trigger confirmNewProject method
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Enter" && showChooseSportTypeModal) {
        confirmNewProject();
        event.preventDefault();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showChooseSportTypeModal]);

  const handleSportType = (SportType) => {
    setSportType(SportType);
    if (SportType === "Sport") {
      setIsSelectedSportType1(true);
      setIsSelectedSportType2(false);
    } else {
      setIsSelectedSportType1(false);
      setIsSelectedSportType2(true);
    }
    console.log(SportType);
  };

  const confirmSportType = () => {
    if (sportType === "") {
      console.log("You must choose a sport type!");
      setErrorSportType("You must choose a sport type");
      return;
    } else {
      console.log("Ok");
      handleCloseChooseSportTypeModal();
      confirmChooseSportType(sportType);
    }
  };

  return (
    <Modal
      className="mt-5"
      show={showChooseSportTypeModal}
      onHide={handleCloseChooseSportTypeModal}
    >
      <Modal.Body className="mt-3 mb-4">
        <Modal.Title>
          <h5>
            <b>Choose sport photography type</b>
          </h5>
        </Modal.Title>

        <div className="mt-3">
          <div className="d-flex justify-content-center mb-2">
            <div
              className={`sport-type-button ${isSelectedSportType2 ? "selected-sporttype" : ""}`}
              type="button"
              onClick={() => handleSportType("Sport_portrait")}
              style={{ width: "9em"}}
            >
              {/* <img className="sporttype-img" src={running} alt="running"></img> */}
              <FontAwesomeIcon icon={faUser} style={{ fontSize: "1.2em" }} />
              <p className="mt-1" style={{ fontSize: "0.85em" }}>Portrait</p>
            </div>
            <div
              className={`sport-type-button ${isSelectedSportType1 ? "selected-sporttype" : ""}`}
              type="button"
              onClick={() => handleSportType("Sport")}
              style={{ width: "9em" }}
            >
              {/* <img className="sporttype-img" src={running} alt="running"></img>
                <b className="mx-2" >
                  +
                </b>
                <img className="sporttype-img" src={calendar} alt="calendar"></img> */}
              <FontAwesomeIcon icon={faUser} style={{ fontSize: "1.2em" }}/> <b className="mx-2"> + </b>{" "}
              <FontAwesomeIcon icon={faPeopleGroup} style={{ fontSize: "1.2em" }} />
              <p className="mt-1" style={{ fontSize: "0.85em" }}>Portrait + group</p>
            </div>
          </div>

          {errorSportType && (
            <div className="error">
              <p>{errorSportType}</p>
            </div>
          )}

          <Button
            className="button cancel mr-1"
            onClick={handleCloseChooseSportTypeModal}
          >
            Cancel
          </Button>
          <Button className="button standard" onClick={confirmSportType}>
            Choose
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ChooseSportTypeModal;
