import React, { useEffect, useRef, useState } from "react";
import defaultProflileImage from "../../assets/defaultProfileImage.png";
import { useInView } from "react-intersection-observer";
import moment from "moment";
import { useAuth } from "../../providers/AuthProvider";
import { saveAs } from "file-saver";
import pdfIcon from "../../assets/pdfIcon.png";
import docxIcon from "../../assets/docxIcon.png";
import pptIcon from "../../assets/pptIcon.png";
import zipIcon from "../../assets/zipIcon.png";
import txtIcon from "../../assets/txtIcon.png";

const Message = ({
  id,
  index,
  unseenIndex,
  messageFrom,
  name,
  message,
  messageType,
  isSender,
  profileImage,
  sentDate,
  addMessageId,
  messageStatus,
}) => {
  let messageContent;
  let messagepadding =
    messageType.startsWith("image") || messageType.startsWith("application")
      ? " "
      : "px-4 py-2";

  const fileTypes = {
    "application/pdf": "PDF",
    "application/msword": "Word",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "Word",
    "application/vnd.ms-excel": "Excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      "Excel",
    "application/vnd.ms-powerpoint": "Powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "Powerpoint",
    "application/x-zip-compressed": "Zip",
    "text/plain": "Text",
  };

  const fileTypesToSvg = {
    "application/pdf": pdfIcon,
    "application/msword": docxIcon,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      docxIcon,
    "application/vnd.ms-powerpoint": pptIcon,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      pptIcon,
    "application/x-zip-compressed": zipIcon,
    "text/plain": txtIcon,
  };

  const { user } = useAuth();
  const myRef = useRef();
  const { ref, inView } = useInView();
  const [fileSize, setFileSize] = useState();

  const setRefs = (node) => {
    if (node) {
      ref(node);
      myRef.current = node;
    }
  };
  useEffect(() => {
    if (messageType.startsWith("application")) {
      getFileSize(message);
    }
  }, []);

  const downloadFile = async (url, filename) => {
    const response = await fetch(url);
    const blob = await response.blob();
    // saveAs(blob, filename);
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;

    link.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );

    // Remove the link after downloading
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
      link.remove();
    }, 100);
  };
  const getFileSize = async (url) => {
    const response = await fetch(url, {
      method: "HEAD",
    });
    const size = response.headers.get("content-length");
    setFileSize(size);
  };

  useEffect(() => {
    if (inView) {
      console.log("in view", message, messageFrom, messageStatus, id);
      if (
        messageFrom != user?._id &&
        !messageStatus.map((_) => _.userId).includes(user?._id)
      ) {
        // if the message is not from the user and the message has not been read by the user
        addMessageId(id);
      }
    }
    // myRef.current?.scrollIntoView({behavior: "smooth"})
    // console.log("index and unseenIndex",index, unseenIndex)
    // if (index === unseenIndex){
    // console.log('scrolling to', message, messageFrom, messageStatus, id);
    // myRef.current?.scrollIntoView({behavior: "smooth"})
    // }
  }, [inView]);

  if (messageType.startsWith("image")) {
    messageContent = (
      <div className="group relative my-2.5 bg-white">
        <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
          <button
            data-tooltip-target="download-image"
            className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50"
            onClick={() => downloadFile(message, message.match(/_(.*?)\?/)[1])}
          >
            <svg
              className="w-5 h-5 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 18"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
              />
            </svg>
          </button>
          <div
            id="download-image"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
          >
            Download image
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
        <img src={message} className="rounded-lg w-40" />
      </div>
    );
  } else if (messageType.startsWith("application") || messageType.startsWith('text/plain')) {
    messageContent = (
      <div className={`flex items-start my-2.5 ${isSender ? "border-darkblue":"border-gray-50"} border  rounded-xl p-2`}>
        <div className="me-2">
          <span
            className={`flex items-center gap-2 text-sm font-medium ${
              isSender ? "text-gray-900" : "text-gray-50"
            } pb-2`}
          >
            <img src={fileTypesToSvg[messageType]} className="w-4 h-4" />
            {decodeURIComponent(message.match(/_(.*?)\?/)[1])}
          </span>
          <span
            className={`flex text-xs font-normal ${
              isSender ? "text-gray-500" : "text-gray-50"
            } gap-2`}
          >
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              class="self-center"
              width="3"
              height="4"
              viewBox="0 0 3 4"
              fill="none"
            >
              <circle cx="1.5" cy="2" r="1.5" fill="#6B7280" />
            </svg> */}
            {fileSize && fileSize > 1000000
              ? (fileSize / 1000000).toFixed(2) + "MB"
              : fileSize
              ? (fileSize / 1000).toFixed(2) + "KB"
              : "File"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="self-center"
              width="3"
              height="4"
              viewBox="0 0 3 4"
              fill="none"
            >
              <circle cx="1.5" cy="2" r="1.5" fill={isSender ? "#132c3e": "#fff"} />
            </svg>
            {fileTypes[messageType] || "File"}
          </span>
        </div>
        <div className="inline-flex self-center items-center">
          <button
            className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900  rounded-full hover:border-0 "
            type="button"
            onClick={() =>
              downloadFile(
                message,
                decodeURIComponent(message.match(/_(.*?)\?/)[1])
              )
            }
          >
            <svg
              className={`w-4 h-4 ${isSender ? "text-gray-900" : "text-gray-50"}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
              <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
            </svg>
          </button>
        </div>
      </div>
    );
  } else {
    messageContent = isSender ? (
      <span className="text-darkblue  break-all">{message}</span>
    ) : (
      <span className="text-[#ffffff] break-all">{message}</span>
    );
  }

  if (!isSender) {
    return (
      <div ref={setRefs} className="chat-message max-w-sm mx-auto my-3">
        <div className="flex items-end">
          <div className="flex flex-col text-xs max-w-xs mx-2 order-2 items-start ">
            <span className="text-[8px] break-all font-thin">
              {moment(sentDate).utcOffset(8).format("HH:mm")}
            </span>
            <div className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-700">
              {messageContent}
            </div>
            {/* <div className="flex space-x-2"> */}
            <span className="text-[8px] break-all"> {name}</span>
            {/* </div> */}
          </div>
          <img
            className="w-6 h-6 rounded-full order-1"
            src={profileImage || defaultProflileImage}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div ref={ref} className="flex justify-end my-3 max-w-sm mx-auto">
      <div className="flex items-end justify-end">
        <div className="flex flex-col  text-xs max-w-xs mx-2 order-1 items-end">
        <span className="text-[8px] break-all font-thin">
          {moment(sentDate).utcOffset(8).format("HH:mm")}
        </span>
        {messageType === "text" ? (
          <div
          className={`${messagepadding} rounded-lg inline-block bg-lightblue rounded-br-none`}
          >
          {messageContent}
          </div>
        ) : (
          <div className={`${messagepadding} rounded-lg inline-block`}>
          {messageContent}
          </div>
        )}
        </div>
      </div>
      </div>
    );
  }
};

export default Message;
