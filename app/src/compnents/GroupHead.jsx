import React from 'react'
import { useContext } from 'react';
import { HistoryContext } from '../providers/HistoryProvider';
import defaultProfileImage from "../assets/defaultProfileImage.png"


const GroupHead = ({ groupName, groupImage, chatRoomId, isChatRoom}) => {
  const history = useContext(HistoryContext);
  const getRoomUrl = ()=> {
      return `/chatroomInformation/${chatRoomId}`

  }

  return (
    <div
      className="p-6 max-w-sm mx-auto shadow-lg flex items-center space-x-4 select-none"
    >
      <button
        type="button"
        className="hover:text-gray-50 border border-gray-800 hover:border-0 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 "
        onClick={() => history.push("/")}
      >
        <svg
          className="rotate-180 w-4 h-4 text-current "
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </button>
      <img 
        onClick={() =>
          history.push(`/chatRoomInformation/${chatRoomId}`, {
            groupName,
            groupImage,
          })
        }
        className="cursor-pointer h-12 w-12 rounded-full"
        src={groupImage || defaultProfileImage}
        alt="profile"
      />
      <div className='cursor-pointer' onClick={() => history.push(`/chatRoomInformation/${chatRoomId}`,{groupName, groupImage})}
      >
        <p className="text-sm">{groupName}</p>
      </div>
    </div>
  );
};

export default GroupHead