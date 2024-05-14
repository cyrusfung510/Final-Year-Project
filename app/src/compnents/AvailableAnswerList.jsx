import React from "react";

const AvailableAnswerList = (props) => {
    const availableAnswers = props.availableAnswerObjList;
    const updateResponse = props.updateStudentResponse;
    const studentResponse = props.studentResponse;
    const isOverDue = props.isOverDue;
    // console.log('studentResponse', studentResponse)
    return (
      <div className="quizQuestionPageQuizAvailableAnswerDescriptionListDisplay">
        {availableAnswers.map((availableAnswerElement, idx) => (
          <div
            className="quizQuestionPageAvailableAnswerDescriptionDisplayContainer"
            key={availableAnswerElement.optionKey}
          >
            <input
              className="quizQuestionPageAvailableAnswerSelectRadio"
              type="radio"
              id={idx}
              name="availableAnswerSet"
              value={availableAnswerElement.optionDescription}
              onChange={(e) =>
                updateResponse(availableAnswerElement.optionDescription)
              }
              checked={
                studentResponse.length > 0
                  ? studentResponse[0]?.quizAnswer ===
                    availableAnswerElement.optionDescription
                  : undefined
              }

              disabled={
                ((studentResponse.length > 0 || isOverDue) &&
                studentResponse[0]?.quizAnswer !=
                  availableAnswerElement.optionDescription) 
              }
            />
            <label
              className="quizQuestionPageAvailableAnswerDescriptionDisplay"
              htmlFor={idx}
            >
              {availableAnswerElement.optionDescription}
            </label>
          </div>
        ))}
      </div>
    );
}

export default AvailableAnswerList;