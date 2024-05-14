import React, { useContext } from "react";
import defaultProfileImage from "../assets/defaultProfileImage.png";
import { HistoryContext } from "../providers/HistoryProvider";
const JoinedQuizGroup = ({groupName, groupId, groupImage, date}) => {
    const history = useContext(HistoryContext)

    return (
      <div onClick={()=> history.push(`/quiz/${groupId}`, {groupName, groupImage})} className="homePageJoinedQuizGroupContainer">
        <img className="homePageJoinedQuizGroupProfileImage" src={groupImage || defaultProfileImage} alt="profile"/>
        <div className="homePageJoinedQuizGroupQuizGroupNameLatestQuestionDateUnseenQuestionNumberContainer">
          <div className="homePageJoinedQuizGroupQuizGroupNameLatestQuestionDateContainer">
            <p className="homePageJoinedQuizGroupQuizGroupName">{groupName}</p>
            <p className="homePageJoinedQuizGroupLatestQuestionDate">{date}</p>
          </div>
        </div>
      </div>
    );
}

export default JoinedQuizGroup;
