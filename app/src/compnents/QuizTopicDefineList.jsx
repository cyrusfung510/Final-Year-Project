import React from "react";
import { MdDelete } from "react-icons/md";

const QuizTopicDefineList = (props) => {
    const defaultTopic = props.defaultTopicList;
    const extraTopic = props.extraTopicList;
    const deleteTopic = props.deleteAddedTopic;
    const updateTopicObj = props.updateTopicObject;

    return (
        <div className="createQuizQuizQuestionPageQuizTopicDescriptionListInput">
            {/* for default topic */}
            {
                defaultTopic.map((defaultTopicElement) => (
                    <div className="createQuizQuizQuestionPageDefaultQuizTopicDescriptionInputContainer" key={defaultTopicElement.topicKey}>
                        <input value={defaultTopic[0].topicDescription} type="text" className="createQuizQuizQuestionPageQuizTopicDescriptionInput" onChange={(e) => updateTopicObj(e, defaultTopicElement.topicKey, "default")}/>
                    </div>
                ))
            }
            {/* for extra topic */}
            {
                extraTopic.map((extraTopicElement) => (
                    <div className="createQuizQuizQuestionPageExtraQuizTopicDescriptionInputContainer" key={extraTopicElement.topicKey}>
                        <input value={extraTopicElement.topicDescription} type="text" className="createQuizQuizQuestionPageQuizTopicDescriptionInput" onChange={(e) => updateTopicObj(e, extraTopicElement.topicKey, "extra")}/>
                        <div className="createQuizQuizQuestionPageQuizTopicDescriptionDeleteIconContainer" onClick={() => deleteTopic(extraTopicElement.topicKey)}>
                            <MdDelete />
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default QuizTopicDefineList;