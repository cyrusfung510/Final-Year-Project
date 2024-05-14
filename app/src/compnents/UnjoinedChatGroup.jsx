import React from "react";
import defaultProfileImage from "../assets/defaultProfileImage.png"

const UnjoinedChatGroup = ({groupName, groupID, groupImage, selectGroup}) => {
    return (
        <div className="addNewGroupPageUnjoinedChatGroupContainer">
            <input className="addNewGroupPageUnjoinChatGroupSelectRadio" type="radio" id={groupID} name="availableUnjoinChatGroup" value={groupID} onChange={(e) => selectGroup(e.target.id)}/>
            <img className="addNewGroupPageUnjoinedChatGroupProfileImage" src={groupImage || defaultProfileImage} alt="profile"/>
            <div className="addNewGroupPageUnjoinedChatGroupChatGroupNameChatGroupIDContainer">
                <div className="addNewGroupPageUnjoinedChatGroupChatGroupNameContainer">
                    <label className="addNewGroupPageUnjoinedChatGroupChatGroupName" htmlFor={groupID}>{groupName}</label>
                </div>
                <div className="addNewGroupPageUnjoinedChatGroupChatGroupIDContainer">
                    <label className="addNewGroupPageUnjoinedChatGroupChatGroupID" htmlFor={groupID}>ID: {groupID}</label>
                </div>
            </div>
        </div>
    );
}

export default UnjoinedChatGroup;