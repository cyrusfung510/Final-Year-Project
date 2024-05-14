import React from "react";
import defaultProfileImage from "../assets/defaultProfileImage.png";
import { TbCircleCheckFilled } from "react-icons/tb";
import { TbCircleXFilled } from "react-icons/tb";

const QuizSubmittedUnsubmittedList = (props) => {
    const quizAnswer = props.quizCorrectAnswer;
    const listToBeShown = props.submittedUnsubmittedListToBeShown;
    //console.log(listToBeShown); //for testing
    
    return (
        <div className="quizInformationPageQuizSubmittedUnsubmittedStudentListDisplay">
            {
                listToBeShown.map((inspectingStudentObj, idx) =>(

                    <div className="quizInformationPageSubmittedUnsubmittedListStudentInfoContainer" key={inspectingStudentObj.studentUserID}>
                        <div className="quizInformationPageSubmittedUnsubmittedListStudentInformationDisplayContainer">
                            <img src={inspectingStudentObj.studentProfileImage || defaultProfileImage} className="quizInformationPageSubmittedUnsubmittedListStudentProfileImage" alt="profile"/>
                            <div className="quizInformationPageSubmittedUnsubmittedListStudentFullNameIDResponseDateContainer">
                                <p className="quizInformationPageSubmittedUnsubmittedListStudentFullName">
                                    {inspectingStudentObj.studentLastName + ", " + inspectingStudentObj.studentFirstName}
                                </p>
                                <p className="quizInformationPageSubmittedUnsubmittedListStudentID">
                                    ID: {inspectingStudentObj.studentUserID}
                                </p>
                                <p className="quizInformationPageSubmittedUnsubmittedListStudentResponseDate">
                                    Date: {(inspectingStudentObj.studentQuizResponseDate !== "" && inspectingStudentObj.studentQuizResponseOption !== -1)? inspectingStudentObj.studentQuizResponseDate : "Undefined"}
                                </p>
                            </div>
                            {
                                (inspectingStudentObj.studentQuizResponseDate !== "") && (inspectingStudentObj.studentQuizResponseOption !== -1) && (
                                    <div className="quizInformationPageSubmittedUnsubmittedListStudentResponseCorrectness">
                                        {
                                            (inspectingStudentObj.studentQuizResponseOption === quizAnswer) && (
                                                <TbCircleCheckFilled size="20px"/>
                                            )
                                        }
                                        {
                                            (inspectingStudentObj.studentQuizResponseOption !== quizAnswer) && (
                                                <TbCircleXFilled size="20px"/>
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>

                ))
            }
        </div>
    );
}

export default QuizSubmittedUnsubmittedList;