import React from "react";
import UnjoinedChatGroup from "./UnjoinedChatGroup";

const UnjoinedChatGroupList = (props) => {

    const chatRooms = props.toBeDisplayedUnjoinedChatGroupList;
    const selectUnjoinedGroup = props.selectUnjoinedChatGroup;

    return (
        <div className="unjoinedChatGroupList">
            {
                chatRooms.map((chatRoom, idx) => {
                    return (
                        <UnjoinedChatGroup groupName={chatRoom.chatRoomName} groupID={chatRoom.chatRoomId} groupImage={chatRoom.chatRoomImage} selectGroup={selectUnjoinedGroup} key={chatRoom.chatRoomId}/>
                    );
                })
            }
        </div>
    );
}

export default UnjoinedChatGroupList;