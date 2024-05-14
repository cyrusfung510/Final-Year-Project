import React from "react";
import { MdDelete } from "react-icons/md";

const QuizFigureUploadedList = (props) => {
    const allFigures = props.figureList;
    //const deleteFigure = props.deleteUploadedFigure;
    
    return (
        <div className="createQuizQuizQuestionPageUploadedFigureListDisplay">
            {
                allFigures.map((figureElement) => {
                    
                    {/* ******** old version, used for display the name of uploaded figures ********

                    <div className="createQuizQuizQuestionPageUploadedFigureDisplayContainer" key={figureElement.figureKey}>
                        <p className="createQuizQuizQuestionPageUploadedFigureDisplay">{figureElement.figureFileObj.name}</p>
                        <div className="createQuizQuizQuestionPageUploadedFigureDeleteIconContainer" onClick={() => deleteFigure(figureElement.figureKey)}>
                            <MdDelete />
                        </div>
                    </div>

                    */}



                    return (
                        <div className="createQuizQuizQuestionPageUploadedFigureDisplayContainer" key={figureElement.figureKey}>
                            <img src={figureElement.figureFileObj} className="createQuizQuizQuestionPageUploadedFigureDisplay"/>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default QuizFigureUploadedList;