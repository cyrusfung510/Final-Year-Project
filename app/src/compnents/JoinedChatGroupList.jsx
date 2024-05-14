import React, { useEffect, useState } from "react";
import JoinedChatGroup from "./JoinedChatGroup";
import moment from "moment";

const JoinedChatGroupList = (props) => {
  const chatRooms = props.toBeDisplayedChatRoomList;
  //console.log(chatRooms.map(_=>moment(_.chatRoomSentDate).fromNow()));
  return (
    <div className="joinedChatGroupList" >
      {chatRooms.map((chatRoom) => {
        const date = chatRoom.chatRoomSentDate !== ""? moment(chatRoom.chatRoomSentDate).fromNow() : moment(chatRoom.chatRoomCreatedAt).format("DD-MM-YYYY");
        
        return (
          <JoinedChatGroup
            groupName={chatRoom.chatRoomName}
            date={date}
            groupImage={chatRoom.chatRoomImage}
            groupId={chatRoom.chatRoomId}
            key={chatRoom.chatRoomId}
            unseenMessageNumber={chatRoom.unseenMessageNumber}
          />
        );
      })}
    </div>
  );
};

export default JoinedChatGroupList;
