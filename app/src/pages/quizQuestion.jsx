import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import dropDownIcon from "../assets/dropDownIcon.png";
import QuizFigureUploadedList from "../compnents/QuizFigureUploadedList";
import QuizTopicDefineList from "../compnents/QuizTopicDefineList";
import QuizOptionDefineList from "../compnents/QuizOptionDefineList";
import AvailableAnswerList from "../compnents/AvailableAnswerList";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { useGetQuizQuestion } from "../../services/queries";
import { HistoryContext } from "../providers/HistoryProvider";
import { useUpdateQuiz, useSubmitQuizAnswer } from "../../services/mutation";
import { useAuth } from "../providers/AuthProvider";
import Countdown from "react-countdown";
import { toast } from "react-toastify";
import { LuCalendarDays } from "react-icons/lu";
import moment from "moment";

const QuizQuestion = () => {
  const location = useLocation();
  const { quizId, quizName, roomId, groupImage, groupName } = location.state;
  const history = useContext(HistoryContext);
  const { data, isLoading, isError } = useGetQuizQuestion(quizId);
  const [expiryDateTimeValue, setExpiryDateTimeValue] = useState(
    data?.quiz[0].end_date
  );
  
  const userIdentity = data?.role; //role of the user
  const isSubmitted = data?.quiz[0].studentQuizResponses.length > 0;
  const isOverDue = Date.now() > Date.parse(data?.quiz[0].quizEndDate);
  //console.log(data); //for testing
  //const userIdentity = "student"; //for testing

  const updateQuizMutation = useUpdateQuiz(history); //for updating quiz
  const submitQuizAnswerMutation = useSubmitQuizAnswer(
    history,
    roomId,
    groupImage,
    groupName
  );

  const [uploadedFigureObjArray, setUploadedFigureObjArray] = useState([
    { figureFileObj: "", figureKey: Date.now() },
  ]); //fetch from database
  const [defaultTopicObjArray, setDefaultTopicObjArray] = useState([]); //fetch from database, follow this object structure
  const [extraTopicObjArray, setExtraTopicObjArray] = useState([]); //fetch from database
  const [allTopicObjArray, setAllTopicObjArray] = useState([]);
  const [defaultOptionObjArray, setDefaultOptionObjArray] = useState([]); //fetch from database, follow this object structure
  const [extraOptionObjArray, setExtraOptionObjArray] = useState([]); //fetch from database
  const [allOptionObjArray, setAllOptionObjArray] = useState([]);
  const [answerSelectMenuActivation, setAnswerSelectMenuActivation] =
    useState(false);
  const [answerSelectMenuButtonText, setAnswerSelectMenuButtonText] = useState("Choose an option for answer");
  const [responseSelectedByStudent, setResponseSelectedByStudent] =
    useState(null);
  const [addDeleteQuizFigureButtonText, setAddDeleteQuizFigureButtonText] =
    useState("");

  useEffect(() => {
    if (data) {
      setDefaultTopicObjArray([
        { topicDescription: data.quiz[0].quizTopics[0], topicKey: Date.now() },
      ]);

      setExtraTopicObjArray(
        data.quiz[0].quizTopics.slice(1).map((topic, index) => {
          return { topicDescription: topic, topicKey: Date.now() };
        })
      );

      setDefaultOptionObjArray(
        data.quiz[0].quizOptions
          .slice(0, 2)
          .map((inspectingOptionDescription, index) => {
            return {
              optionDescription: inspectingOptionDescription,
              optionKey: index,
            };
          })
      );

      setExtraOptionObjArray(
        data.quiz[0].quizOptions
          .slice(2)
          .map((inspectingOptionDescription, index) => {
            return {
              optionDescription: inspectingOptionDescription,
              optionKey: index + 2,
            };
          })
      );

      setAddDeleteQuizFigureButtonText(
        data.quiz[0].quizImage === "" ? "Add" : "Delete"
      );

      //setAnswerSelectMenuButtonText(data.quiz[0].quizModelAnswer);

      setUploadedFigureObjArray([
        { figureFileObj: data.quiz[0].quizImage, figureKey: Date.now() },
      ]);

      if (userIdentity === "teacher") {
        document.querySelector(".quizQuestionPageQuestionUpdate").value =
          data.quiz[0].quizQuestion;
      } else if (userIdentity === "student") {
        document.querySelector(".quizQuestionPageQuestionDisplay").innerText =
          data.quiz[0].quizQuestion;
      }
    }
  }, [data]);

  const handleQuestionInputTextAreaAutoResize = (e) => {
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const uploadQuizFigurePopUpWindow = () => {
    document.getElementById("quizQuestionImageUploadSelector").click();
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
        tempUploadedFigureObjArray.push(FigureWithKeyObj);
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

  const handleSubmit = (e) => {
    // console.log(quizId, responseSelectedByStudent);
    submitQuizAnswerMutation.mutate({
      quizId,
      quizAnswer: responseSelectedByStudent,
    });
  };

  const handleUpdate = (e) => {
    updateQuizMutation.mutate({
      quizId,
      quizTopics: allTopicObjArray.map((topicObj) => topicObj.topicDescription),
      quizOptions: allOptionObjArray.map(
        (optionObj) => optionObj.optionDescription
      ),
      quizModelAnswer: answerSelectMenuButtonText,
      quizQuestion: document.querySelector(".quizQuestionPageQuestionUpdate")
        .value,
      quizImage: uploadedFigureObjArray[0].figureFileObj,
      quizEndDate: expiryDateTimeValue,
    });
  };

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

  const handleSelectAnswer = (selectedOption) => {
    setAnswerSelectMenuActivation(false); //close the answer select drop down menu
    setAnswerSelectMenuButtonText(
      allOptionObjArray[selectedOption - 1].optionDescription
    ); //set the button text when option is selected
    console.log(selectedOption); //for testing
    //to be implemented
    //...
  };

  const handleStudentResponse = (selectedOption) => {
    setResponseSelectedByStudent(selectedOption);
  };

  useEffect(() => {
    setAllOptionObjArray(defaultOptionObjArray.concat(extraOptionObjArray));
    setAllTopicObjArray(defaultTopicObjArray.concat(extraTopicObjArray));
  }, [extraOptionObjArray, extraTopicObjArray]);

  const selectExpiryDateTimePopUpWindow = () => {
    document.getElementById("quizQuestionExpiryDateTime").min = new Date().toISOString().split(".")[0];
    document.getElementById("quizQuestionExpiryDateTime").showPicker();
  };

  const handlePickedExpiryDateTime = (pickedExpiryDateTime) => {
    setExpiryDateTimeValue(pickedExpiryDateTime);
  };

  return (
    <div className="w-80 m-auto p-3 test">
      <div className="quizQuestionPageQuizNumberLabelUpdateSubmitCancelButtonContainer">
        <button
          onClick={() =>
            history.push(`/quiz/${roomId}`, {
              groupImage,
              quizName,
              groupName,
            })
          }
          className="quizQuestionPageCancelButton"
        >
          Cancel
        </button>
        <p className="quizQuestionPageQuizNumberLabel">{quizName}</p>
        {userIdentity === "student" && (
          <button
            className="quizQuestionPageSubmitButton"
            onClick={(e) => handleSubmit(e)}
          >
            Submit
          </button>
        )}
        {userIdentity === "teacher" && (
          <button
            className="quizQuestionPageUpdateButton"
            onClick={(e) => handleUpdate(e)}
          >
            Update
          </button>
        )}
      </div>
      <br />

      {
        /* section for teacher to update quiz related topics */
        userIdentity === "teacher" && (
          <div className="quizQuestionPageTopicInputSectionContainer">
            <div className="quizQuestionPageTopicInputLabelContainer">
              <div className="quizQuestionPageTopicLabelContainer">
                <p className="quizQuestionPageTopicInputLabel">Related Topics</p>
                {
                  /* notify teacher they can make some update to this section */
                  userIdentity === "teacher" && <CiEdit />
                }
              </div>
              <p className="quizQuestionPageAddTopicLabel" onClick={() => addExtraTopic()}>Add</p>
            </div>
            <QuizTopicDefineList defaultTopicList={defaultTopicObjArray} extraTopicList={extraTopicObjArray} deleteAddedTopic={handleDeleteAddedTopic} updateTopicObject={handleUpdateTopicObjArray}/>
          </div>
        )
      }

      {
        !(isSubmitted || isOverDue) && userIdentity == "student" && (
          <div className="quizQuestionPageRemainingTimeDisplaySectionContainer">
            <div className="quizQuestionPageRemainingTimeDisplayLabelContainer">
              <div className="quizQuestionPageRemainingTimeLabelContainer">
                <p className="quizQuestionPageRemainingTimeDisplayLabel">Remaining Time</p>
              </div>
            </div>
            <div className="quizQuestionPageRemainingTimeDisplayContainer">
              <Countdown className="quizQuestionPageRemainingTimeDisplay" onComplete={() => {toast.error("Quiz has ended"); history.push(`/quiz/${roomId}`, {groupImage, quizName, groupName,});}} date={Date.parse(data?.quiz[0].quizEndDate)}/>
            </div>
          </div>
        )
      }

      <div className="quizQuestionPageQuestionDisplayUpdateSectionContainer">
        <div className="quizQuestionPageQuestionDisplayUpdateLabelContainer">
          <div className="quizQuestionPageQuestionLabelContainer">
            <p className="quizQuestionPageQuestionDisplayUpdateLabel">Question</p>
            {
              /* notify teacher they can make some update to this section */
              userIdentity === "teacher" && <CiEdit />
            }
          </div>
        </div>
        <div className="quizQuestionPageQuestionDisplayUpdateContainer">
          {
            /* section for teacher to update quiz question */
            userIdentity === "teacher" && (
              <textarea className="quizQuestionPageQuestionUpdate" onKeyUp={(e) => handleQuestionInputTextAreaAutoResize(e)}/>
            )
          }
          {
            /* section for student to preview quiz question */
            userIdentity === "student" && (
              <p className="quizQuestionPageQuestionDisplay"></p>
            )
          }
        </div>
        {userIdentity === "student" && uploadedFigureObjArray.length !== 0 && (
          <br />
        )}
        {
          /* section for student to preview quiz question figure */
          userIdentity === "student" &&
            uploadedFigureObjArray.map((figureObj, idx) => {
              /*
                            const reader = new FileReader();
                            reader.readAsDataURL(figureObj.figureFileObj);
                            reader.onload = () => {
                                document.getElementById(`quizQuestionPageQuizQuestionFigure${idx}`).setAttribute("src", reader.result);
                            }
                            */
              return (
                <div className="quizQuestionPageQuizQuestionFigureContainer" key={idx}>
                  <img id={`quizQuestionPageQuizQuestionFigure${idx}`} className="quizQuestionPageQuizQuestionFigure" key={idx} src={figureObj.figureFileObj}/>
                </div>
              );
            })
        }
      </div>

      {
        /* section for teacher to update quiz question figure list */
        userIdentity === "teacher" && (
          <div className="quizQuestionPageFigureUploadSectionContainer">
            <div className="quizQuestionPageFigureUploadLabelContainer">
              <div className="quizQuestionPageFigureLabelContainer">
                <p className="quizQuestionPageFigureUploadLabel">Figure</p>
                {
                  /* notify teacher they can make some update to this section */
                  userIdentity === "teacher" && <CiEdit />
                }
              </div>
              <p className="quizQuestionPageAddDeleteFigureLabel" onClick={() => handleAddDeleteQuizFigureRequest()}>{addDeleteQuizFigureButtonText}</p>
              <input type="file" className="quizQuestionPageChooseImage" id="quizQuestionImageUploadSelector" accept="image/*" onChange={(e) => handleUploadedImage(e.target.files[0])}></input>
            </div>
            <QuizFigureUploadedList figureList={uploadedFigureObjArray} />
          </div>
        )
      }

      {
        /* section for teacher to update quiz option list */
        userIdentity === "teacher" && (
          <div className="quizQuestionPageOptionDefineSectionContainer">
            <div className="quizQuestionPageOptionDefineLabelContainer">
              <div className="quizQuestionPageOptionLabelContainer">
                <p className="quizQuestionPageOptionDefineLabel">Options</p>
                {
                  /* notify teacher they can make some update to this section */
                  userIdentity === "teacher" && <CiEdit />
                }
              </div>
              <p className="quizQuestionPageAddOptionLabel" onClick={() => addExtraOption()}>Add</p>
            </div>
            <QuizOptionDefineList defaultOptionList={defaultOptionObjArray} extraOptionList={extraOptionObjArray} deleteAddedOption={handleDeleteAddedOption} updateOptionObject={handleUpdateOptionObjArray}/>

            <br />

            <div className="quizQuestionAnswerSelectDropDownMenuContainer">
              <button className="quizQuestionAnswerSelectDropDownMenuButton" onClick={(e) =>setAnswerSelectMenuActivation(!answerSelectMenuActivation)}>
                {answerSelectMenuButtonText}
                <img src={dropDownIcon} className="dropDownMenuIcon" />
              </button>
              {answerSelectMenuActivation && (
                <div className="quizQuestionAnswerSelectDropDownMenuContent">
                  {allOptionObjArray.map((optionElement, index) => (
                    <div
                      id={index + 1}
                      className="quizQuestionAnswerSelectDropDownMenuItem"
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
        )
      }

      {
        /* section for student to select their quiz answer */
        userIdentity === "student" && (
          <div className="quizQuestionPageResponseInputSectionContainer">
            <div className="quizQuestionPageResponseInputLabelContainer">
              <div className="quizQuestionPageResponseLabelContainer">
                <p className="quizQuestionPageResponseInputLabel">Response</p>
              </div>
            </div>
            <AvailableAnswerList availableAnswerObjList={allOptionObjArray} updateStudentResponse={handleStudentResponse} studentResponse={data?.quiz[0].studentQuizResponses} isOverDue={isOverDue}/>
            {
              isSubmitted && !isOverDue && userIdentity == "student" && (
                <div className="quizQuestionPageQuizSubmittedLabelContainer">
                  <p className="quizQuestionPageQuizSubmittedLabel">
                    *Quiz has been submitted
                  </p>
                </div>
              )
            }
            {
              isOverDue && userIdentity == "student" && (
                <div className="quizQuestionPageQuizSubmittedLabelContainer">
                  <p className="quizQuestionPageQuizSubmittedLabel">
                    *Answer : {data?.quiz[0]?.quizModelAnswer}
                  </p>
                </div>
              )
            }    
          </div>
        )
      }



      {/*
      {
        isSubmitted && !isOverDue && userIdentity == "student" && (
          <div className="quizQuestionPageQuizSubmittedLabelContainer">
            <p className="quizQuestionPageQuizSubmittedLabel">
              Quiz has been submitted
            </p>
          </div>
        )
      }
      {
        isOverDue && userIdentity == "student" && (
          <div className="quizQuestionPageQuizSubmittedLabelContainer">
            <p className="quizQuestionPageQuizSubmittedLabel">
              Answer : {data?.quiz[0]?.quizModelAnswer}
            </p>
          </div>
        )
      }
      */}





      {
        (userIdentity === "teacher") && (
          <div className="quizQuestionPageExpiryDateTimeSelectSectionContainer">
            <div className="quizQuestionPageExpiryDateTimeSelectLabelContainer">
              <div className="quizQuestionPageExpiryDateTimeLabelContainer">
                <p className="quizQuestionPageExpiryDateTimeSelectLabel">Expiry Date and Time</p>
              </div>
            </div>
            <div className="quizQuestionPageExpiryDateTimeSelectContainer">
              <p className="quizQuestionPageExpiryDateTimeDisplay">{moment(expiryDateTimeValue).format("YYYY-MM-DD")} ({moment(expiryDateTimeValue).format("HH:mm:ss")})</p>
              <div className="quizQuestionPageExpiryDateTimeCalendarIconContainer" onClick={() => selectExpiryDateTimePopUpWindow()}>
                <LuCalendarDays />
              </div>
              <input type="datetime-local" id="quizQuestionExpiryDateTime" className="quizQuestionExpiryDateTimeSelector" onChange={(e) => handlePickedExpiryDateTime(e.target.value)}/>
            </div>
          </div>
        )
      }

      {
        (userIdentity === "teacher") && (
          <div className="quizQuestionPageQuestionInformationDirectSectionContainer">
            <div className="quizQuestionPageQuestionInformationDirectLabelContainer">
              <div className="quizQuestionPageQuestionInformationLabelContainer">
                <p className="quizQuestionPageQuestionInformationDirectLabel">Question Information</p>
              </div>
            </div>
            <div className="quizQuestionPageQuestionInformationDirectContainer">
              <button onClick={() => history.push(`quizInformation/${quizId}`)} className="quizQuestionPageQuestionInformationDirect">Get Question Information</button>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default QuizQuestion;
