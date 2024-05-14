import React, { useEffect, useRef } from "react";
import { useState } from "react";
import Message from "./Message";
import GroupHead from "../GroupHead";
import { Route, useParams } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import useAuthentication from "../../hooks/useAuth";
import { useRealm } from "../../providers/RealmProvider";
import Picker from "emoji-picker-react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import moment from "moment";
import { useInView } from "react-intersection-observer";

const Chat = () => {
  console.log("chatroom rendered");
  let { chatRoomId } = useParams();
  const location = useLocation();
  const { groupName, groupImage, unseenMessageNumber } = location.state;
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("text");
  const [messages, setMessages] = useState([{}]);
  const [userMapping, setUserMapping] = useState({});
  const [signedUrlsMapping, setSignedUrlsMapping] = useState({});
  const { user } = useAuth();
  const { events } = useRealm();

  const [showPicker, setShowPicker] = useState(false);
  const [isFetched, setisFetched] = useState(false);
  const [fileObject, setFileObject] = useState(null);
  const [isFile, setIsFile] = useState(false);
  const messageEndRef = useRef(null);
  const unseenMessageRef = useRef(null);
  const fileRef = useRef(null);
  const readQueueRef = useRef([]);
  const {ref, inView} = useInView();
  const [unseenIndex, setUnseenIndex] = useState(-1);
  useAuthentication("/login");
  
  const setRefs = (node) => {
    if (node) {
      ref(node);
      messageEndRef.current = node;
    }
  };

    // useEffect(() => {
    //   if (inView) {
    //     console.log("in view msgend");
    //   }
    // }, [inView]);


  const addMessageIdToReadQueue = (id) => {
    readQueueRef.current = [...readQueueRef.current, id];
    console.log("added to read queue", id);
  };

  const clearReadQueue = () => {
    readQueueRef.current = [];
  };

  const updateReadStatus = async () => {
    if (readQueueRef.current.length === 0) return;

    console.log(readQueueRef.current);
    try {
      await fetch("http://localhost:3000/chatRoom/updateMessageStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ messageIds: readQueueRef.current }),
      });
    } catch (err) {
      console.log(err.message);
    } finally {
      clearReadQueue();
    }
  };

  const fetchMessages = async () => {
    const result = await fetch(
      `http://localhost:3000/chatRoom/message/${chatRoomId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    const data = await result.json();
    const updatedMessages = await transformMessages(data["messages"]);
    setMessages(updatedMessages);
    setUserMapping(data["map"]);
    setisFetched(true);
    const allRead =
      updatedMessages
        .filter((_) => _.messageFrom != user?._id)
        .map((_) => _.messageStatus.map((_) => _.userId))
        .flat()
        .map((_) => _ === user?._id)
        .filter(Boolean).length ===
      updatedMessages.filter((_) => _.messageFrom != user?._id).length; // if all messages are read
    // console.log(allRead);
    const unseenIndex = updatedMessages.findIndex(
      (_) =>
        _.messageFrom != user?._id &&
        !_.messageStatus.map((_) => _.userId).includes(user?._id)
    );
    setUnseenIndex(unseenIndex);
    // console.log(unseenIndex,updatedMessages)
    if (allRead) {
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "instant" });
      }, 0);
    } else {
      setTimeout(() => {
        unseenMessageRef.current?.scrollIntoView({ behavior: "instant", block: "center"});
      }, 0);
    }
  };
  const getSignedUrls = async (urls) => {
    const result = await fetch("http://localhost:3000/chatRoom/getSignedUrls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ urls: urls }),
    });
    return await result.json();
  };

  const transformMessages = async (msgArr) => {
    const urls = msgArr
      .filter((_) => _.messageType.startsWith("image") || _.messageType.startsWith('application') || _.messageType== ('text/plain'))
      .map((_) => chatRoomId + "/" + _.messageData);
    const signedUrls = await getSignedUrls(urls);
    setSignedUrlsMapping(signedUrls);
    const updatedMessages = msgArr.map((message) => {
      if (message.messageType.startsWith("image") || message.messageType.startsWith('application') || message.messageType == ('text/plain')) {
        return {
          ...message,
          messageData: signedUrls[chatRoomId + "/" + message.messageData],
        };
      }
      return message;
    });
    return updatedMessages;
  };

  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(updateReadStatus, 1500);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const roomId = events[events.length - 1]?.fullDocument._id.toString();
    if (roomId === chatRoomId && isFetched) {
      const msg = events[events.length - 1]?.fullDocument.messages.map(
        (message) => {
          return {
            messageData: message.messageData,
            messageType: message.messageType,
            messageFrom: message.messageFrom.toString(),
            sentDate: message.sentDate,
            messageStatus: message.messageStatus,
            messageId: message._id.toString(),
          };
        }
      );
      transformMessages(msg).then((updatedMessages) => {
        setMessages(updatedMessages);
      });
      if(inView){
        setTimeout(() => {
          messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 250);
      }
    }
  }, [events]);

  const onEmojiSelect = (emojiObject) => {
    console.log(emojiObject.emoji);
    setMessage(message + emojiObject.emoji);
  };

  const handleSendMessage = async () => {
    console.log("sent message", message);
    if (messageType === "text") {
      try {
        const result = await fetch(
          "http://localhost:3000/chatRoom/newMessage",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify({
              messageData: message,
              messageType: messageType,
              chatRoomId: chatRoomId,
            }),
          }
        );
        setMessage("");
        setTimeout(() => {
          messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 250);
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  return (
    <div className="m-auto w-full p-3">
      <GroupHead chatRoomId = {chatRoomId} groupImage={groupImage} groupName={groupName}></GroupHead>

      <div
        className="message-container overflow-y-auto scroll-smooth"
        style={{ maxHeight: "calc(100vh - 250px)" }}
      >
        {messages.map((message, index) => {
          if (!message.messageData) return;
          const prevMessage = messages[index - 1];
          const showMessageDate =
            index === 0 ||
            !prevMessage ||
            new Date(prevMessage.sentDate).toDateString() !==
              new Date(message.sentDate).toDateString();
          return (
            <>
              {showMessageDate && (
                <>
                  <div className="sticky top-2 text-center z-10  max-w-sm mx-auto my-3 font-thin text-[8px]">
                    <span className="p-2 rounded-lg text-slate-400  border bg-gray-50">
                      {moment().diff(moment(message.sentDate), "days") > 7
                        ? moment(message.sentDate)
                            .utcOffset(8)
                            .format("DD/MM/YYYY")
                        : moment(message.sentDate).fromNow()}
                    </span>
                  </div>
                  <br />
                </>
              )}

              {unseenIndex === index && (
                <>
                  <div
                    ref={unseenMessageRef}
                    className="z-20 text-center max-w-sm mx-auto my-3 font-thin text-xs"
                  >
                    <span className="p-2 rounded-full border border-black">
                      {unseenMessageNumber} unseen messages
                    </span>
                  </div>
                </>
              )}

              <Message
                message={message.messageData}
                name={userMapping[message.messageFrom]?.nickName}
                profileImage={userMapping[message.messageFrom]?.profile_image}
                messageType={message.messageType}
                isSender={message.messageFrom === user?._id}
                sentDate={message.sentDate}
                key={message.messageId}
                id={message.messageId}
                index={index}
                unseenIndex={unseenIndex}
                messageStatus={message.messageStatus}
                messageFrom={message.messageFrom}
                addMessageId={addMessageIdToReadQueue}
              ></Message>
            </>
          );
        })}
        <div ref={setRefs} style={{minHeight:"20px"}} className="max-w-sm mx-auto my-3 min-h-5"></div>

        {isFile && (
          <div ref={fileRef} className="max-w-sm mx-auto my-3">
            <FilePond
              credits={false}
              allowMultiple={false}
              server={{
                process: (
                  fieldName,
                  file,
                  metadata,
                  load,
                  error,
                  progress,
                  abort,
                  transfer,
                  options
                ) => {
                  const formData = new FormData();
                  formData.append(fieldName, file, file.name);
                  formData.append(
                    "data",
                    JSON.stringify({
                      dataType: fileObject.type,
                      messageType: "file",
                      chatRoomId: chatRoomId,
                    })
                  );
                  const request = fetch(
                    "http://localhost:3000/chatRoom/newFile",
                    {
                      method: "POST",
                      body: formData,
                      headers: {
                        Authorization: localStorage.getItem("token"),
                      },
                    }
                  );
                  request
                    .then((response) => response.json())
                    .then((response) => {
                      console.log(response);
                      load(response);
                      setIsFile(false);
                      setFileObject(null);
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                  return {
                    abort: () => {
                      abort();
                    },
                  };
                },
              }}
              onaddfile={(error, fileItem) => {
                if (error) {
                  console.log("Error adding file:", error);
                  return;
                }
                setFileObject(fileItem.file);
                console.log("File added:", fileItem.file);
              }}
            />
          </div>
        )}
      </div>

      <div className="p-3 max-w-sm mx-auto left-0 right-0 bottom-5 absolute">
        {/* <form> */}
        <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 border ">
          {/* <button
              type="button"
              class="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            >
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 18"
              >
                <path
                  fill="currentColor"
                  d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
                />
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
                />
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
                />
              </svg>
              
            </button> */}
          <button
            type="button"
            className="rotate-animation rounded-full  inline-flex justify-center p-2"
            onClick={() => {
              setIsFile(!isFile);
              setTimeout(() => {
                fileRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }, 0);
            }}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 12H18M12 6V18"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className="p-2 text-gray-500 rounded-full cursor-pointer"
            onClick={() => setShowPicker(!showPicker)}
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z"
              />
            </svg>
          </button>

          <textarea
            id="chat"
            rows="1"
            className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300"
            placeholder="Send Message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          ></textarea>

          <button
            onClick={handleSendMessage}
            className="inline-flex justify-center p-2 text-blue-600 cursor-pointer"
          >
            <svg
              className="w-5 h-5 rotate-90 rtl:-rotate-90"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
              viewBox="0 0 18 20"
            >
              <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
            </svg>
          </button>
        </div>
        {showPicker && (
          <div className="flex justify-center  ">
            <Picker height={350} searchDisabled onEmojiClick={onEmojiSelect} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
