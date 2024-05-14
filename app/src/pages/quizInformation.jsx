import React, { useContext } from "react";
import { useState, useEffect } from "react";
import QuizSubmittedUnsubmittedList from "../compnents/QuizSubmittedUnsubmittedList"
import BarChart from "../compnents/BarChart"
import DoughnutChart from "../compnents/DoughnutChart"
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { HistoryContext } from "../providers/HistoryProvider";
import { useGetQuizInformation } from "../../services/queries";
import moment from "moment";
import * as d3 from "d3";
import { color } from "d3";

const QuizInformation = () => {

    const {quizId} = useParams();
    const history = useContext(HistoryContext);
    const {data, isLoading, isError} = useGetQuizInformation(quizId);
    const [correctnessProportionChartDisplay, setCorrectnessProportionChartDisplay] = useState("BarChart"); //control which chart should be shown
    const [choicesProportionChartDisplay, setChoicesProportionChartDisplay] = useState("BarChart"); //controll which chart should be shown
    const [quizCorrectAnswerOptionNumber, setQuizCorrectAnswerOptionNumber] = useState(0);  //indicate which option is the correct answer
    const [showHideListOfSubmitted, setShowHideListOfSubmitted] = useState(false);
    const [showHideListOfSubmittedButtonText, setShowHideListOfSubmittedButtonText] = useState("Show");
    const [showHideListOfUnsubmitted, setShowHideListOfUnsubmitted] = useState(false);
    const [showHideListOfUnsubmittedButtonText, setShowHideListOfUnsubmittedButtonText] = useState("Show");
    const [listOfSubmitted, setListOfSubmitted] = useState([]);
    const [listOfUnsubmitted, setListOfUnsubmitted] = useState([]);
    const [correctnessProportionChartData, setCorrectnessProportionChartData] = useState(
        {
            labels: "", 
            datasets: [
                {
                    data: ""
                }
            ]
        }
    );
    const [choicesProportionChartData, setChoicesProportionChartData] = useState(
        {
            labels: "", 
            datasets: [
                {
                    data: ""
                }
            ]
        }
    );
    
    const handleShowHideListOfSubmitted = () => {
        setShowHideListOfSubmitted(!showHideListOfSubmitted);
        setShowHideListOfSubmittedButtonText((showHideListOfSubmittedButtonText === "Show")? "Hide" : "Show");
    }

    const handleShowHideListOfUnsubmitted = () => {
        setShowHideListOfUnsubmitted(!showHideListOfUnsubmitted);
        setShowHideListOfUnsubmittedButtonText((showHideListOfUnsubmittedButtonText === "Show")? "Hide" : "Show");
    }

    const countNumberOfResponseCorrectness = () => {
        const correctnessNumber = [0, 0];   //idx 0: number of correct, idx 1: number of incorrect

        listOfSubmitted.forEach((inspectingStudentObj, idx) => {
            if (inspectingStudentObj.studentQuizResponseOption === quizCorrectAnswerOptionNumber) {
                correctnessNumber[0] += 1;
            }
            else if (inspectingStudentObj.studentQuizResponseOption !== quizCorrectAnswerOptionNumber) {
                correctnessNumber[1] += 1;
            }
        });

        return correctnessNumber;
    }

    const countNumberOfResponseChoices = () => {
        const choicesNumber = Array(data?.quizInfo.quizOptions.length).fill(0);   //idx 0: number of student select option 1, idx 1: number of student select option 2

        listOfSubmitted.forEach((inspectingStudentObj, idx) => {
            choicesNumber[inspectingStudentObj.studentQuizResponseOption] += 1;
        })

        return choicesNumber;
    }

    const colorListGenerator = (numberOfColor, colorRangeLowerBound, colorRangeUpperBound) => {
        return Array(numberOfColor).fill().map((colorElement, idx) => d3.interpolateWarm(colorRangeLowerBound + idx * (colorRangeUpperBound - colorRangeLowerBound) / (numberOfColor - 1)));
    }

    useEffect(() => {
        if (data) {
            
            setListOfSubmitted(
                data.submittedUsers.filter((inspectingSubmittedUser) => {
                    return (inspectingSubmittedUser.role === "student")
                }).map((inspectingSubmittedStudentObj) => {
                    return {
                        studentFirstName: inspectingSubmittedStudentObj.studentFirstName,
                        studentLastName: inspectingSubmittedStudentObj.studentLastName,
                        studentUserID:  inspectingSubmittedStudentObj.studentUserId,
                        studentProfileImage: inspectingSubmittedStudentObj.studentProfileImage,
                        studentQuizResponseDate: moment(inspectingSubmittedStudentObj.studentQuizResponseDate).format("YYYY-MM-DD") + " (" + moment(inspectingSubmittedStudentObj.studentQuizResponseDate).format("HH:mm:ss") + ")",
                        studentQuizResponseOption: inspectingSubmittedStudentObj.studentQuizResponseOption
                    }
                })
            );

            setListOfUnsubmitted(
                data.unSubmittedUsers.filter((inspectingUnsubmittedUser) => {
                    return (inspectingUnsubmittedUser.role === "student")
                }).map((inspectingUnsubmittedStudentObj) => {
                    return {
                        studentFirstName: inspectingUnsubmittedStudentObj.studentFirstName,
                        studentLastName: inspectingUnsubmittedStudentObj.studentLastName,
                        studentUserID:  inspectingUnsubmittedStudentObj.studentUserId,
                        studentProfileImage: inspectingUnsubmittedStudentObj.studentProfileImage,
                        studentQuizResponseDate: "",
                        studentQuizResponseOption: ""
                    }
                })
            )

            setQuizCorrectAnswerOptionNumber(data.quizInfo.quizModelAnswerIndex);
            
        }
    }, [data]);

    useEffect(() => {
        setCorrectnessProportionChartData(
            {
                labels: ["Correct", "Incorrect"], 
                datasets: [
                    {
                        label: "Number of Student",
                        data: countNumberOfResponseCorrectness(),
                        backgroundColor: colorListGenerator(2, 0, 1),
                    }
                ]
            }
        );

        setChoicesProportionChartData(
            {
                labels: Array(data?.quizInfo.quizOptions.length).fill().map((optionLabelElement, idx) => "Option "  + String(idx + 1)), 
                datasets: [
                    {
                        label: "Number of Student",
                        data: countNumberOfResponseChoices(),
                        backgroundColor: colorListGenerator(data?.quizInfo.quizOptions.length, 0, 1),
                    }
                ]
            }
        )
    }, [listOfSubmitted, listOfUnsubmitted, quizCorrectAnswerOptionNumber]);

    console.log(data);  //for testing

    return (
        <div className="w-80 m-auto p-3 test">
            <div className="quizInformationPageQuizInformationLabelCancelButtonContainer">
                <button onClick={()=>history.goBack()} className="quizInformationPageCancelButton">Cancel</button>
                <p className="quizInformationPageQuizInformationLabel">Quiz Info</p>
            </div>
            <br />

            <div className="quizInformationPageQuizGroupNameDisplaySectionContainer">
                <div className="quizInformationPageQuizGroupNameDisplayLabelContainer">
                    <div className="quizInformationPageQuizGroupNameLabelContainer">
                        <p className="quizInformationPageQuizGroupNameDisplayLabel">Group Name</p>
                    </div>
                </div>
                <div className="quizInformationPageQuizGroupNameDisplayContainer">
                    <p className="quizInformationPageQuizGroupNameDisplay">{data?.quizInfo.chatRoomName}</p>
                </div>
            </div>
            

            <div className="quizInformationPageQuizGroupIDDisplaySectionContainer">
                <div className="quizInformationPageQuizGroupIDDisplayLabelContainer">
                    <div className="quizInformationPageQuizGroupIDLabelContainer">
                        <p className="quizInformationPageQuizGroupIDDisplayLabel">Group ID</p>
                    </div>
                </div>
                <div className="quizInformationPageQuizGroupIDDisplayContainer">
                    <p className="quizInformationPageQuizGroupIDDisplay">{data?.quizInfo._id}</p>
                </div>
            </div>


            <div className="quizInformationPageQuizIDDisplaySectionContainer">
                <div className="quizInformationPageQuizIDDisplayLabelContainer">
                    <div className="quizInformationPageQuizIDLabelContainer">
                        <p className="quizInformationPageQuizIDDisplayLabel">Quiz ID</p>
                    </div>
                </div>
                <div className="quizInformationPageQuizIDDisplayContainer">
                    <p className="quizInformationPageQuizIDDisplay">{quizId}</p>
                </div>
            </div>

            <div className="quizInformationPageNumberOfStudentDisplaySectionNumberOfSubmissionDisplaySectionContainer">
                <div className="quizInformationPageNumberOfStudentDisplaySectionContainer">
                    <div className="quizInformationPageNumberOfStudentDisplayLabelContainer">
                        <div className="quizInformationPageNumberOfStudentLabelContainer">
                            <p className="quizInformationPageNumberOfStudentDisplayLabel">Student Number</p>
                        </div>
                    </div>
                    <div className="quizInformationPageNumberOfStudentDisplayContainer">
                        <p className="quizInformationPageNumberOfStudentDisplay">{listOfSubmitted.length + listOfUnsubmitted.length}</p>
                    </div>
                </div>

                <div className="quizInformationPageNumberOfSubmissionDisplaySectionContainer">
                    <div className="quizInformationPageNumberOfSubmissionDisplayLabelContainer">
                        <div className="quizInformationPageNumberOfSubmissionLabelContainer">
                            <p className="quizInformationPageNumberOfSubmissionDisplayLabel">Submit Number</p>
                        </div>
                    </div>
                    <div className="quizInformationPageNumberOfSubmissionDisplayContainer">
                        <p className="quizInformationPageNumberOfSubmissionDisplay">{listOfSubmitted.length}</p>
                    </div>
                </div>
            </div>




            <div className="quizInformationPageListOfSubmittedDisplaySectionContainer">
                <div className="quizInformationPageListOfSubmittedDisplayLabelContainer">
                    <div className="quizInformationPageListOfSubmittedLabelContainer">
                        <p className="quizInformationPageListOfSubmittedDisplayLabel">List of Submit ({listOfSubmitted.length})</p>
                    </div>
                    <p className="quizInformationPageShowHideListOfSubmittedLabel" onClick={handleShowHideListOfSubmitted}>{showHideListOfSubmittedButtonText}</p>
                </div>
                {
                    (showHideListOfSubmitted === true) && (
                        <QuizSubmittedUnsubmittedList submittedUnsubmittedListToBeShown={listOfSubmitted} quizCorrectAnswer={quizCorrectAnswerOptionNumber}/>
                    )
                }
            </div>


            <div className="quizInformationPageListOfUnsubmittedDisplaySectionContainer">
                <div className="quizInformationPageListOfUnsubmittedDisplayLabelContainer">
                    <div className="quizInformationPageListOfUnsubmittedLabelContainer">
                        <p className="quizInformationPageListOfUnsubmittedDisplayLabel">List of Unsubmit ({listOfUnsubmitted.length})</p>
                    </div>
                    <p className="quizInformationPageShowHideListOfUnsubmittedLabel" onClick={handleShowHideListOfUnsubmitted}>{showHideListOfUnsubmittedButtonText}</p>
                </div>
                {
                    (showHideListOfUnsubmitted === true) && (
                        <QuizSubmittedUnsubmittedList submittedUnsubmittedListToBeShown={listOfUnsubmitted} quizCorrectAnswer={quizCorrectAnswerOptionNumber}/>
                    )
                }
            </div>

            
            
            <div className="quizInformationPageCorrectnessProportionDisplaySectionContainer">
                <div className="quizInformationPageCorrectnessProportionDisplayLabelContainer">
                    <div className="quizInformationPageCorrectnessProportionLabelContainer">
                        <p className="quizInformationPageCorrectnessProportionDisplayLabel">Correctness Proportion</p>
                    </div>
                </div>
                <div className="quizInformationPageCorrectnessProportionChartSelectContainer">
                    <div className="quizInformationPageBarChartSelectButtonContainer">
                        <input className="quizInformationPageBarChartSelectRadio" type="radio" name="correctnessAvailableChart" id="correctnessBarChart" value="BarChart" defaultChecked onChange={(e) => setCorrectnessProportionChartDisplay(e.target.value)}/>
                        <label className="quizInformationPageBarChartLabel" htmlFor="correctnessBarChart">Bar Chart</label>
                    </div>
                    <div className="quizInformationPageDoughnutChartSelectButtonContainer">
                        <input className="quizInformationPageDoughnutChartSelectRadio" type="radio" name="correctnessAvailableChart" id="correctnessDoughnutChart" value="DoughnutChart" onChange={(e) => setCorrectnessProportionChartDisplay(e.target.value)}/>
                        <label className="quizInformationPageDoughnutChartLabel" htmlFor="correctnessDoughnutChart">Doughnut Chart</label>
                    </div>
                </div>
                <br />
                {
                    (correctnessProportionChartDisplay === "BarChart") && (
                        <BarChart chartData={correctnessProportionChartData}/>
                    )
                }
                {
                    (correctnessProportionChartDisplay === "DoughnutChart") && (
                        <DoughnutChart chartData={correctnessProportionChartData}/>
                    )
                }
            </div>



            <div className="quizInformationPageChoicesProportionDisplaySectionContainer">
                <div className="quizInformationPageChoicesProportionDisplayLabelContainer">
                    <div className="quizInformationPageChoicesProportionLabelContainer">
                        <p className="quizInformationPageChoicesProportionDisplayLabel">Choices Proportion</p>
                    </div>
                </div>
                <div className="quizInformationPageChoicesProportionChartSelectContainer">
                    <div className="quizInformationPageBarChartSelectButtonContainer">
                        <input className="quizInformationPageBarChartSelectRadio" type="radio" name="choicesAvailableChart" id="choicesBarChart" value="BarChart" defaultChecked onChange={(e) => setChoicesProportionChartDisplay(e.target.value)}/>
                        <label className="quizInformationPageBarChartLabel" htmlFor="choicesBarChart">Bar Chart</label>
                    </div>
                    <div className="quizInformationPageDoughnutChartSelectButtonContainer">
                        <input className="quizInformationPageDoughnutChartSelectRadio" type="radio" name="choicesAvailableChart" id="choicesDoughnutChart" value="DoughnutChart" onChange={(e) => setChoicesProportionChartDisplay(e.target.value)}/>
                        <label className="quizInformationPageDoughnutChartLabel" htmlFor="choicesDoughnutChart">Doughnut Chart</label>
                    </div>
                </div>
                <br />
                {
                    (choicesProportionChartDisplay === "BarChart") && (
                        <BarChart chartData={choicesProportionChartData}/>
                    )
                }
                {
                    (choicesProportionChartDisplay === "DoughnutChart") && (
                        <DoughnutChart chartData={choicesProportionChartData}/>
                    )
                }
            </div>


        </div>
    );
};

export default QuizInformation;