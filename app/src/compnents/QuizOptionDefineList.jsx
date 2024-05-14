import React from "react";
import { MdDelete } from "react-icons/md";

const QuizOptionDefineList = (props) => {
    const defaultOptions = props.defaultOptionList;
    const extraOptions = props.extraOptionList;
    const deleteOption = props.deleteAddedOption;
    const updateOptionObj = props.updateOptionObject;
    //console.log(defaultOptions);  //for testing
    //console.log(extraOptions);  //for testing

    return (
        <div className="createQuizQuizQuestionPageQuizOptionDescriptionListInput">
            {/* for default option */}
            {
                defaultOptions.map((defaultOptionElement) => (
                    <div className="createQuizQuizQuestionPageDefaultQuizOptionDescriptionInputContainer" key={defaultOptionElement.optionKey}>
                        <input type="text" className="createQuizQuizQuestionPageQuizOptionDescriptionInput" onChange={(e) => updateOptionObj(e, defaultOptionElement.optionKey, "default")} value={defaultOptionElement.optionDescription}/>
                    </div>
                ))
            }
            {/* for extra option */}
            {
                extraOptions.map((extraOptionElement) => (
                    <div className="createQuizQuizQuestionPageExtraQuizOptionDescriptionInputContainer" key={extraOptionElement.optionKey}>
                        <input type="text" className="createQuizQuizQuestionPageQuizOptionDescriptionInput" onChange={(e) => updateOptionObj(e, extraOptionElement.optionKey, "extra")} value={extraOptionElement.optionDescription}/>
                        <div className="createQuizQuizQuestionPageQuizOptionDescriptionDeleteIconContainer" onClick={() => deleteOption(extraOptionElement.optionKey)}>
                            <MdDelete />
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default QuizOptionDefineList;