export const getQuiz = async (roomId) => {
  const res = await fetch("http://localhost:3000/quiz/getQuiz", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({ chatRoomId: roomId }),
  });
  return await res.json();
};

export const getChatRooms = async () => {
  const res = await fetch("http://localhost:3000/chatRoom/getChatRooms", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  });
  return await res.json();
};

export const getQuizRoom = async () => {
  const res = await fetch("http://localhost:3000/quiz/getQuizRoom", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  });
  return await res.json();
};

export const createQuiz = async (quizData) => {
  const res = await fetch("http://localhost:3000/quiz/createQuiz", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(quizData),
  });
  return res;
};

export const updateQuiz = async (quizData) => {
  const res = await fetch("http://localhost:3000/quiz/updateQuiz", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(quizData),
  });
  return res;
};

export const getQuizQuestion = async (quizId) => {
  const res = await fetch(
    "http://localhost:3000/quiz/getQuizQuestion?quizId=" + quizId,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    }
  );
  return await res.json();
};

export const getQuizInformation = async (quizId) => {
  const res = await fetch(
    "http://localhost:3000/quiz/getQuizInformation?quizId=" + quizId,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    }
  );
  return await res.json();
};

export const submitQuizAnswer = async (quizData) => {
  const res = await fetch("http://localhost:3000/quiz/submitQuizAnswer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(quizData),
  });
  return res;
};

export const getPublicChatRooms = async () => {
  const res = await fetch("http://localhost:3000/chatRoom/getPublicChatRooms", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  });
  return await res.json();
};

export const createChatRoom = async (chatRoomData) => {
  const res = await fetch("http://localhost:3000/chatRoom/newChatRoom", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(chatRoomData),
  });
  return res;
};

export const joinPublicChatRoom = async (chatRoomId) => {
  const res = await fetch("http://localhost:3000/chatRoom/joinPublicChatRoom", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({ chatRoomId }),
  });
  return res;
};

export const getChatRoomInformation = async (chatRoomId) => {
  const res = await fetch(
    `http://localhost:3000/chatRoom/getChatRoomInformation?chatRoomId=${chatRoomId}`,
    {
      method: "GET",
      headers: {
        authorization: localStorage.getItem("token"),
      },
    }
  );

  return await res.json();
};

export const updateChatRoomInformation = async (chatRoomData) => {
  const res = await fetch("http://localhost:3000/chatRoom/updateChatRoomInformation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token"),
    },
    body:JSON.stringify(chatRoomData)
  })
  return res
}

export const updateRegistrationToken = async (token) => {
  const res = await fetch("http://localhost:3000/users/updateRegistrationToken",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      authorization:localStorage.getItem("token")
    },
    body:JSON.stringify({token: token})
  })
  return res
}

export const getRegistrationToken = async ()=> {
  const res = await fetch("http://localhost:3000/users/getRegistrationToken",{
    method:"GET",
    headers:{
      authorization:localStorage.getItem("token")
    }
  })
  return await res.json()
}

export const leaveChatRoom = async (chatRoomId) => {
  const res = await fetch("http://localhost:3000/chatRoom/leaveChatRoom",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      authorization:localStorage.getItem("token")
    },
    body:JSON.stringify(chatRoomId)
  })
  return res
}