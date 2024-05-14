import moment from "moment";
import React, { useEffect, useState } from "react";
import JoinedQuizGroup from "./JoinedQuizGroup";

const JoinedQuizGroupList = (props) => {
  const quizRooms = props.toBeDisplayedQuizRoomList;
  //console.log(quizRooms);  //for testing

  return (
    <div className="joinedQuizGroupList">
      {quizRooms.map((quizRoom) => {
        const date = quizRoom.quizRoomSentDate !== null? moment(quizRoom.quizRoomSentDate).fromNow() : "Undefined Quiz Date";

        return (
          <JoinedQuizGroup
            groupName={quizRoom.quizRoomName}
            groupId={quizRoom.quizRoomId}
            groupImage={quizRoom.quizRoomImage}
            date={date}
            key={quizRoom.quizRoomId}
          />
        );
      })}
    </div>
  );
};

export default JoinedQuizGroupList;
