import React, {useContext, useEffect, useState} from "react";
import GroupHead from "../GroupHead";
import QuizBox from "./QuizBox";
import defaultProfileImage from "../../assets/defaultProfileImage.png";
import { useLocation, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth } from "../../providers/AuthProvider";
import { HistoryContext } from "../../providers/HistoryProvider";
import { useGetQuiz } from "../../../services/queries";
import moment from "moment";

const Quiz = () => {
  const {roomId} = useParams(); 
  const location = useLocation();
  const {groupName, groupImage} = location.state;
  const history = useContext(HistoryContext)
  const {user} = useAuth();
  const {data, isLoading, isError} = useGetQuiz(roomId);
  const [toBedisplayedQuiz, setToBeDisplayedQuiz] = useState();
  const [userIdentity, setUserIdentity] = useState(null);
  
  useEffect(() => {
    setToBeDisplayedQuiz(
      data?.map((inspectingQuizElement, idx) => {
          return {
            quizDate: moment(inspectingQuizElement.sent_date).format("YYYY-MM-DD"),
            quizTopic: inspectingQuizElement.quizTopics,
            quizId: inspectingQuizElement._id,
            groupImage: groupImage,
            groupName: groupName,
            roomId: roomId,
            quizDateCombine: Number(moment(inspectingQuizElement.sent_date).format("YYYYMMDD")  + moment(inspectingQuizElement.sent_date).format("HH:mm:ss").split(":").join(""))
          }
      }).sort((compareObj1, compareObj2) => compareObj2.quizDateCombine - compareObj1.quizDateCombine)
    );

    setUserIdentity(user?.role);
  }, [data, user]);

  console.log(data);  //for testing
  console.log(toBedisplayedQuiz); //for testing

  return (
    <div className="m-auto w-full p-3">
      <GroupHead groupImage={groupImage} groupName={groupName} chatRoomId={roomId}></GroupHead>
      <div className="message-container overflow-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
        {
          toBedisplayedQuiz?.map((quizElement, idx)=>{
            return <QuizBox 
            quizName={`Quiz ${idx+ 1}`}
            quizDate={quizElement.quizDate}
            quizTopic={quizElement.quizTopic}
            quizId={quizElement.quizId}
            key={quizElement.quizId}
            groupImage={quizElement.groupImage}
            groupName={quizElement.groupName}
            roomId = {quizElement.roomId}
            ></QuizBox>
          })
        }

        {/* <QuizBox
          quizName="Quiz 1"
          quizDate={"20-11-2023"}
          quizTopic={["sensor", "location"]}
        ></QuizBox>
        <QuizBox
          quizName="Quiz 2"
          quizDate={"13-11-2023"}
          quizTopic={["concurrency"]}
        ></QuizBox> */}

      </div>

      {
        (userIdentity === "teacher") && (
          <div className="p-3 max-w-sm mx-auto left-0 right-0 bottom-5 absolute flex justify-center select-none">
            <button onClick={() => history.push("/createQuiz", {roomId})} className="bg-[#d7dde0] font-bold rounded-[5px] p-1">New Quiz</button>
          </div>
        )
      }
    </div>
  );
};

export default Quiz;
