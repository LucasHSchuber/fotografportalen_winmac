import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
// import { useNavigate, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";



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
  const [isSelectedSportType3, setIsSelectedSportType3] = useState(false);
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


  // handle sport type PORTRATI OR PORTRAIT + GROUP
  const handleSportType = (SportType) => {
    setSportType(SportType);
    if (SportType === "Sport") {
      setIsSelectedSportType1(true);
      setIsSelectedSportType2(false);
      setIsSelectedSportType3(false);
    } else if (SportType === "Sport_portrait") {
      setIsSelectedSportType1(false);
      setIsSelectedSportType2(true);
      setIsSelectedSportType3(false);
    } else {
      setIsSelectedSportType1(false);
      setIsSelectedSportType2(false);
      setIsSelectedSportType3(true);
    }
    console.log(SportType);
  };


  // CONFIRM SPORT TYPE
  const confirmSportType = () => {
    if (sportType === "") {
      console.log("You must choose a sport type!");
      setErrorSportType("You must choose a sport type");
      return;
    } else {
      handleCloseChooseSportTypeModal();
      let chosenSportType;
      if (sportType === "Sport_portrait") {
        chosenSportType = "Sport_portrait"
      } else {
        chosenSportType = "Sport"
      }
      confirmChooseSportType(chosenSportType);
    }
  };



  return (
    <Modal
      className="mt-5"
      show={showChooseSportTypeModal}
      onHide={handleCloseChooseSportTypeModal}
    >
      <Modal.Body className="mt-3 mb-4">
        <Modal.Title><h5><b>Choose sport photography type</b></h5></Modal.Title>
        {/* <h6 className="mb-3 mt-2">If choosing 'Portrait + Group', calendar sales will be included </h6> */}

        <div className="mt-3">
            <div className="d-flex justify-content-center mb-2">
                <div
                    className={`sport-type-button ${isSelectedSportType2 ? "selected-sporttype" : ""}`}
                    type="button"
                    onClick={() => handleSportType("Sport_portrait")}
                    style={{ width: "8.5em"}}
                >
                    <FontAwesomeIcon icon={faUser} style={{ fontSize: "1.2em" }} />
                    <p className="mt-1" style={{ fontSize: "0.85em" }}>Portrait</p>
                </div>
                <div
                    className={`sport-type-button ${isSelectedSportType3 ? "selected-sporttype" : ""}`}
                    type="button"
                    onClick={() => handleSportType("Sport_group")}
                    style={{ width: "8.5em" }}
                >
                    <FontAwesomeIcon icon={faPeopleGroup} style={{ fontSize: "1.2em" }} />
                    <p className="mt-1" style={{ fontSize: "0.85em" }}>Group</p>
                </div>
                <div
                    className={`sport-type-button ${isSelectedSportType1 ? "selected-sporttype" : ""}`}
                    type="button"
                    onClick={() => handleSportType("Sport")}
                    style={{ width: "8.5em" }}
                >
                    <FontAwesomeIcon icon={faUser} style={{ fontSize: "1.2em" }}/> <b className="mx-2"> + </b>{" "}
                    <FontAwesomeIcon icon={faPeopleGroup} style={{ fontSize: "1.2em" }} />
                    <p className="mt-1" style={{ fontSize: "0.85em" }}>Portrait + Group</p>
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
          <Button 
              className="button standard" onClick={confirmSportType}>
            Start Job
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ChooseSportTypeModal;
