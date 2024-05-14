import React, { useContext } from "react";
import defaultProfileImage from "../assets/defaultProfileImage.png";
import { HistoryContext, HistoryProvider } from "../providers/HistoryProvider";

const JoinedChatGroup = ({groupName, date, groupImage, groupId, unseenMessageNumber}) => {
  const history = useContext(HistoryContext);
  
  return (
    <div onClick={()=>history.push(`chatroom/${groupId}`,{groupName, groupImage, unseenMessageNumber})} className="homePageJoinedChatGroupContainer">
      <img className="homePageJoinedChatGroupProfileImage" src={groupImage || defaultProfileImage} alt="profile"/>
      <div className="homePageJoinedChatGroupChatGroupNameLatestMessageDateUnseenMessageNumberContainer">
        <div className="homePageJoinedChatGroupChatGroupNameLatestMessageDateContainer">
          <p className="homePageJoinedChatGroupChatGroupName">{groupName}</p>
          <p className="homePageJoinedChatGroupLatestMessageDate">{date}</p>
        </div>
        {
          (unseenMessageNumber !== 0) && (
            <p className="homePageJoinedChatGroupUnseenMessageNumber">{unseenMessageNumber}</p>
          )
        }
      </div>
    </div>
  );
};

export default JoinedChatGroup;
