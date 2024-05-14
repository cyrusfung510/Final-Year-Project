import React, { useContext } from "react";
import { useState, useEffect } from "react";
import QuizFigureUploadedList from "../compnents/QuizFigureUploadedList";
import QuizOptionDefineList from "../compnents/QuizOptionDefineList";
import QuizTopicDefineList from "../compnents/QuizTopicDefineList";
import dropDownIcon from "../assets/dropDownIcon.png";
import { useHistory } from "react-router-dom";
import { HistoryContext } from "../providers/HistoryProvider";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import { useCreateQuiz } from "../../services/mutation";
import { LuCalendarDays } from "react-icons/lu";
import moment from "moment";

const CreateQuiz = () => {
  const [uploadedFigureObjArray, setUploadedFigureObjArray] = useState([
    { figureFileObj: "", figureKey: Date.now() },
  ]);
  const [defaultOptionObjArray, setDefaultOptionObjArray] = useState([
    { optionDescription: "", optionKey: Date.now() },
    { optionDescription: "", optionKey: Date.now() + 1 },
  ]);
  const [defaultTopicObjArray, setDefaultTopicObjArray] = useState([
    { topicDescription: "", topicKey: Date.now() },
  ]);
  const [extraTopicObjArray, setExtraTopicObjArray] = useState([]);
  const [allTopicObjArray, setAllTopicObjArray] = useState([]);
  const [extraOptionObjArray, setExtraOptionObjArray] = useState([]);
  const [allOptionObjArray, setAllOptionObjArray] = useState([]);
  const [answerSelectMenuActivation, setAnswerSelectMenuActivation] =
    useState(false);
  const [answerSelectMenuButtonText, setAnswerSelectMenuButtonText] = useState(
    "Choose an option for answer"
  );
  const history = useContext(HistoryContext);
  const location = useLocation();
  const { roomId } = location.state;
  const [addDeleteQuizFigureButtonText, setAddDeleteQuizFigureButtonText] =
    useState("Add");
  const [expiryDateTimeValue, setExpiryDateTimeValue] = useState(
    moment().add(10, "minutes")
  );

  const handleQuestionInputTextAreaAutoResize = (e) => {
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const uploadQuizFigurePopUpWindow = () => {
    document.getElementById("quizCreateImageUploadSelector").click();
  };

  const handleAddDeleteQuizFigureRequest = () => {
    if (addDeleteQuizFigureButtonText === "Add") {
      uploadQuizFigurePopUpWindow();
    } else if (addDeleteQuizFigureButtonText === "Delete") {
      setUploadedFigureObjArray([{ figureFileObj: "", figureKey: Date.now() }]);
      setAddDeleteQuizFigureButtonText("Add");
    }
  };

  const handleUploadedImage = (figureChosen) => {
    //allow teacher upload multiple figures
    /*
        const FigureWithKeyObj = {figureFileObj: figureChosen, figureKey: Date.now()};
        let tempUploadedFigureObjArray = uploadedFigureObjArray.slice();
        tempUploadedFigureObjArray.push(FigureWithKeyObj);    //allow teacher upload multiple figures
        setUploadedFigureObjArray(tempUploadedFigureObjArray);
        */

    const reader = new FileReader();
    reader.readAsDataURL(figureChosen);
    reader.onload = () => {
      const FigureWithKeyObj = {
        figureFileObj: reader.result,
        figureKey: Date.now(),
      };
      let tempUploadedFigureObjArray = uploadedFigureObjArray.slice();
      tempUploadedFigureObjArray[0] = FigureWithKeyObj;
      setUploadedFigureObjArray(tempUploadedFigureObjArray);
    };

    setAddDeleteQuizFigureButtonText("Delete");
  };

  /*
    const handleDeleteUploadedFigure = (toBeDeletedFigureKey) => {
        const newUploadedFigureObjArray = uploadedFigureObjArray.filter((uploadedFigure) => uploadedFigure.figureKey !== toBeDeletedFigureKey);
        setUploadedFigureObjArray(newUploadedFigureObjArray);
    }
    */

  const addExtraTopic = () => {
    const TopicWithKeyObj = { topicDescription: "", topicKey: Date.now() };
    let tempTopicDescriptionObjArray = extraTopicObjArray.slice();
    tempTopicDescriptionObjArray.push(TopicWithKeyObj);
    setExtraTopicObjArray(tempTopicDescriptionObjArray);
  };

  const handleDeleteAddedTopic = (toBeDeletedTopicKey) => {
    const newAddedTopicObjArray = extraTopicObjArray.filter(
      (addedTopic) => addedTopic.topicKey !== toBeDeletedTopicKey
    );
    setExtraTopicObjArray(newAddedTopicObjArray);
  };

  const handleUpdateTopicObjArray = (e, topicKeyConcerned, arrayConcerned) => {
    if (arrayConcerned === "default") {
      const targetTopicObjIdx = defaultTopicObjArray.findIndex(
        (inspectingTopicObject) => {
          return inspectingTopicObject.topicKey === topicKeyConcerned;
        }
      );
      const tempDefaultTopicObjArray = defaultTopicObjArray.slice();
      tempDefaultTopicObjArray[targetTopicObjIdx].topicDescription =
        e.target.value;
      setDefaultTopicObjArray(tempDefaultTopicObjArray);
    } else if (arrayConcerned === "extra") {
      const targetTopicObjIdx = extraTopicObjArray.findIndex(
        (inspectingTopicObject) => {
          return inspectingTopicObject.topicKey === topicKeyConcerned;
        }
      );
      const tempExtraTopicObjArray = extraTopicObjArray.slice();
      tempExtraTopicObjArray[targetTopicObjIdx].topicDescription =
        e.target.value;
      setExtraTopicObjArray(tempExtraTopicObjArray);
    }
  };

  const addExtraOption = () => {
    const OptionWithKeyObj = { optionDescription: "", optionKey: Date.now() };
    let tempOptionDescriptionObjArray = extraOptionObjArray.slice();
    tempOptionDescriptionObjArray.push(OptionWithKeyObj);
    setExtraOptionObjArray(tempOptionDescriptionObjArray);
    setAnswerSelectMenuButtonText("Choose an option for answer"); //set the button text when option is added
  };

  const handleDeleteAddedOption = (toBeDeletedOptionKey) => {
    const newAddedOptionObjArray = extraOptionObjArray.filter(
      (addedOption) => addedOption.optionKey !== toBeDeletedOptionKey
    );
    setExtraOptionObjArray(newAddedOptionObjArray);
    setAnswerSelectMenuButtonText("Choose an option for answer"); //set the button text when option is deleted
  };

  const handleSelectAnswer = (selectedOption) => {
    setAnswerSelectMenuActivation(false); //close the answer select drop down menu
    setAnswerSelectMenuButtonText(
      allOptionObjArray[selectedOption - 1].optionDescription
    ); //set the button text when option is selected
    console.log(selectedOption); //for testing
    //to be implemented
    //...
  };

  const handleUpdateOptionObjArray = (
    e,
    optionKeyConcerned,
    arrayConcerned
  ) => {
    if (arrayConcerned === "default") {
      const targetOptionObjIdx = defaultOptionObjArray.findIndex(
        (inspectingOptionObject) => {
          return inspectingOptionObject.optionKey === optionKeyConcerned;
        }
      );
      const tempDefaultOptionObjArray = defaultOptionObjArray.slice();
      tempDefaultOptionObjArray[targetOptionObjIdx].optionDescription =
        e.target.value;
      setDefaultOptionObjArray(tempDefaultOptionObjArray);
    } else if (arrayConcerned === "extra") {
      const targetOptionObjIdx = extraOptionObjArray.findIndex(
        (inspectingOptionObject) => {
          return inspectingOptionObject.optionKey === optionKeyConcerned;
        }
      );
      const tempExtraOptionObjArray = extraOptionObjArray.slice();
      tempExtraOptionObjArray[targetOptionObjIdx].optionDescription =
        e.target.value;
      setExtraOptionObjArray(tempExtraOptionObjArray);
    }
  };

  /*
    function fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
    */

  const createQuizMutation = useCreateQuiz(history);

  const handleCreateQuiz = async () => {
    // console.log(allTopicObjArray, document.querySelector('.createQuizPageQuestionInput').value, uploadedFigureObjArray, allOptionObjArray, answerSelectMenuButtonText);
    //const base64Img = (uploadedFigureObjArray.map((figureObj) => figureObj.figureFileObj)[0]) == undefined   ? "" :  await fileToBase64(uploadedFigureObjArray.map((figureObj) => figureObj.figureFileObj)[0]);
    createQuizMutation.mutate({
      chatRoomId: roomId,
      quizTopics: allTopicObjArray.map((topicObj) => topicObj.topicDescription),
      quizQuestion: document.querySelector(".createQuizPageQuestionInput")
        .value,
      quizOptions: allOptionObjArray.map(
        (optionObj) => optionObj.optionDescription
      ),
      quizModelAnswer: answerSelectMenuButtonText,
      quizImage: uploadedFigureObjArray[0].figureFileObj,
      quizEndDate: expiryDateTimeValue,
    });
  };

  const selectExpiryDateTimePopUpWindow = () => {
    document.getElementById("createQuizExpiryDateTime").min = new Date()
      .toISOString()
      .split(".")[0];
    document.getElementById("createQuizExpiryDateTime").showPicker();
  };

  const handlePickedExpiryDateTime = (pickedExpiryDateTime) => {
    setExpiryDateTimeValue(pickedExpiryDateTime);
  };

  useEffect(() => {
    setAllOptionObjArray(defaultOptionObjArray.concat(extraOptionObjArray));
    setAllTopicObjArray(defaultTopicObjArray.concat(extraTopicObjArray));
  }, [extraOptionObjArray, extraTopicObjArray]);

  return (
    <div className="m-auto w-80 p-3 test">
      <div className="createQuizPageQuizCreateLabelCreateCancelButtonContainer">
        <button
          className="createQuizPageCancelButton"
          onClick={(e) => history.goBack()}
        >
          Cancel
        </button>
        <p className="createQuizPageQuizCreateLabel">Quiz Create</p>
        <button onClick={handleCreateQuiz} className="createQuizPageSaveButton">
          Create
        </button>
      </div>
      <br />

      <div className="createQuizPageTopicInputSectionContainer">
        <div className="createQuizPageTopicInputLabelContainer">
          <div className="createQuizPageTopicLabelContainer">
            <p className="createQuizPageTopicInputLabel">Related Topics</p>
          </div>
          <p
            className="createQuizPageAddTopicLabel"
            onClick={() => addExtraTopic()}
          >
            Add
          </p>
        </div>
        <QuizTopicDefineList
          defaultTopicList={defaultTopicObjArray}
          extraTopicList={extraTopicObjArray}
          deleteAddedTopic={handleDeleteAddedTopic}
          updateTopicObject={handleUpdateTopicObjArray}
        />
      </div>

      <div className="createQuizPageQuestionInputSectionContainer">
        <div className="createQuizPageQuestionInputLabelContainer">
          <div className="createQuizPageQuestionLabelContainer">
            <p className="createQuizPageQuestionInputLabel">Question</p>
          </div>
        </div>
        <div className="createQuizPageQuestionInputContainer">
          <textarea
            className="createQuizPageQuestionInput"
            onKeyUp={(e) => handleQuestionInputTextAreaAutoResize(e)}
          />
        </div>
      </div>

      <div className="createQuizPageFigureUploadSectionContainer">
        <div className="createQuizPageFigureUploadLabelContainer">
          <div className="createQuizPageFigureLabelContainer">
            <p className="createQuizPageFigureUploadLabel">Figure</p>
          </div>
          <p
            className="createQuizPageAddFigureLabel"
            onClick={() => handleAddDeleteQuizFigureRequest()}
          >
            {addDeleteQuizFigureButtonText}
          </p>
          <input
            type="file"
            className="createQuizPageChooseImage"
            id="quizCreateImageUploadSelector"
            accept="image/*"
            onChange={(e) => handleUploadedImage(e.target.files[0])}
          ></input>
        </div>
        <QuizFigureUploadedList figureList={uploadedFigureObjArray} />
      </div>

      {/*
          <div className="createQuizPageOptionDefineSectionContainer">
            <div className="createQuizPageOptionDefineLabelContainer">
              <div className="createQuizPageOptionLabelContainer">
                <p className="createQuizPageOptionDefineLabel">Options</p>
              </div>
              <p className="createQuizPageAddOptionLabel" onClick={() => addExtraOption()}>Add</p>
            </div>
            <QuizOptionDefineList defaultOptionList={defaultOptionObjArray} extraOptionList={extraOptionObjArray} deleteAddedOption={handleDeleteAddedOption} updateOptionObject={handleUpdateOptionObjArray}/>

            <br />
        */}

      <div className="createQuizPageOptionDefineSectionContainer">
        <div className="createQuizPageOptionDefineLabelContainer">
          <div className="createQuizPageOptionLabelContainer">
            <p className="createQuizPageOptionDefineLabel">Options</p>
          </div>
          <p
            className="createQuizPageAddOptionLabel"
            onClick={() => addExtraOption()}
          >
            Add
          </p>
        </div>
        <QuizOptionDefineList
          defaultOptionList={defaultOptionObjArray}
          extraOptionList={extraOptionObjArray}
          deleteAddedOption={handleDeleteAddedOption}
          updateOptionObject={handleUpdateOptionObjArray}
        />

        <br />

        <div className="createQuizAnswerSelectDropDownMenuContainer">
          <button
            className="createQuizAnswerSelectDropDownMenuButton"
            onClick={(e) =>
              setAnswerSelectMenuActivation(!answerSelectMenuActivation)
            }
          >
            {answerSelectMenuButtonText}
            <img src={dropDownIcon} className="dropDownMenuIcon" />
          </button>
          {answerSelectMenuActivation && (
            <div className="createQuizAnswerSelectDropDownMenuContent">
              {allOptionObjArray.map((optionElement, index) => (
                <div
                  id={index + 1}
                  className="createQuizAnswerSelectDropDownMenuItem"
                  key={optionElement.optionKey}
                  onClick={(e) => handleSelectAnswer(e.target.id)}
                >
                  {optionElement.optionDescription}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="createQuizPageExpiryDateTimeSelectSectionContainer">
        <div className="createQuizPageExpiryDateTimeSelectLabelContainer">
          <div className="createQuizPageExpiryDateTimeLabelContainer">
            <p className="createQuizPageExpiryDateTimeSelectLabel">
              Expiry Date and Time
            </p>
          </div>
        </div>
        <div className="createQuizPageExpiryDateTimeSelectContainer">
          <p className="createQuizPageExpiryDateTimeDisplay">
            {moment(expiryDateTimeValue).format("YYYY-MM-DD")} (
            {moment(expiryDateTimeValue).format("HH:mm:ss")})
          </p>
          <div
            className="createQuizPageExpiryDateTimeCalendarIconContainer"
            onClick={() => selectExpiryDateTimePopUpWindow()}
          >
            <LuCalendarDays />
          </div>
          <input
            type="datetime-local"
            id="createQuizExpiryDateTime"
            className="createQuizExpiryDateTimeSelector"
            onChange={(e) => handlePickedExpiryDateTime(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
