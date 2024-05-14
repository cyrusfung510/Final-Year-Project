import React, { useContext } from "react";
import { HistoryContext } from "../../providers/HistoryProvider";

const QuizBox = ({quizId,quizName, quizDate, quizTopic, groupImage, groupName, roomId}) => {
  const history = useContext(HistoryContext);

  return (
    <div className="flex my-3 max-w-xl mx-auto justify-center">
      <a
        onClick={() =>
          history.push("/quizQuestion", {
            quizId,
            quizName,
            groupImage,
            groupName,
            roomId,
          })
        }
        className="block w-80 p-3 bg-white border rounded shadow hover:bg-gray-100 hover:cursor-pointer  dark:border-gray-300 dark:hover:border-lightblue"
      >
        <div className="flex">
          <p className="my-auto mx-4 font-bold tracking-tight text-gray-950 dark:text-white ">
            {quizName}
          </p>
          <div>
            <p className="mx-4 font-normal text-gray-950 text-sm">
              Date: {quizDate}
            </p>
            <p className="mx-4 font-normal text-gray-950 text-sm ">
              Topic:{" "}
              {quizTopic.map((topic, index) => (
                <React.Fragment key={index}>
                  {topic}
                  {index < quizTopic.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
      </a>
    </div>
  );
};

export default QuizBox;
