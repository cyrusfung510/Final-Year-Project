import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createQuiz,
  updateQuiz,
  submitQuizAnswer,
  createChatRoom,
  joinPublicChatRoom,
  updateChatRoomInformation,
  updateRegistrationToken,
  leaveChatRoom,
} from "./api";
import { toast } from "react-toastify";

export function useCreateQuiz(history) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (quizData) => createQuiz(quizData),
    onSuccess: async (data, variables, context) => {
      if (data.status == 201) {
        queryClient.invalidateQueries("getQuiz");
        toast.success(data.message);
        history.goBack();
      } else {
        const err = await data.json();
        if (err.error) {
          toast.error(err.error);
          return;
        }
        const errorMsg = err
          .map((error) => error.message)
          .flat()
          .join("\n");
        toast.error(errorMsg);
      }
    },
    onError: (error, variables, context) => {
      console.log(error, variables, context);
    },
  });
}

export function useUpdateQuiz(history) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (quizData) => updateQuiz(quizData),
    onSuccess: async (data, variables, context) => {
      if (data.status == 200) {
        queryClient.invalidateQueries("quizQuestion");
        history.goBack();
        toast.success("Quiz updated successfully");
      } else {
        const err = await data.json();
        if (err.error) {
          toast.error(err.error);
          return;
        }
        const errorMsg = err
          .map((error) => error.message)
          .flat()
          .join("\n");
        toast.error(errorMsg);
      }
    },
  });
}

export function useSubmitQuizAnswer(
  history,
  roomId,
  groupImage,
  quizName,
  groupName
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (quizData) => submitQuizAnswer(quizData),
    onSuccess: async (data, variables, context) => {
      if (data.ok) {
        toast.success("Quiz submitted successfully");
        queryClient.invalidateQueries("quizRoom");
        history.push(`/quiz/${roomId}`, {
          groupImage,
          quizName,
          groupName,
        });
      } else {
        const response = await data.json();
        console.log(response);
        toast.error(`${response.message}`);
        return;
      }
    },
  });
}

export function useCreateNewChatGroup(history) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (chatRoomData) => createChatRoom(chatRoomData),
    onSuccess: async (data, variables, context) => {
      if (data.ok) {
        toast.success("Chat Group Created Successfully");
        history.push("/");
        //   queryClient.invalidateQueries("getChatRooms");
      } else {
        const response = await data.json();
        toast.error(`${response.error}`);
        return;
      }
    },
    onError: (error, variables, context) => {
      toast.error("Failed to create chat group");
    },
  });
}

export function useJoinPublicChatRoom(history) {
  return useMutation({
    mutationFn: async (chatRoomId) => joinPublicChatRoom(chatRoomId),
    onSuccess: async (data, variables, context) => {
      if (data.ok) {
        toast.success("Chat Group Joined Successfully");
        history.push("/");
      } else {
        const response = await data.json();
        toast.error(`${response.error}`);
        return;
      }
    },
  });
}

export function useUpdateChatRoomInformation(history) {
  return useMutation({
    mutationFn: async (chatRoomData) => updateChatRoomInformation(chatRoomData),
    onSuccess: async (data, variables, context) => {
      if (data.ok) {
        history.goBack();
        toast.success("Updated successfully");
      } else {
        const error = await res.json();
        toast.error(`${error.error}"`);
        return;
      }
    },
    onError: (error, variables, context) => {
      toast.error("Failed to update");
    },
  });
}

export function useUpdateRegistrationToken() {
  return useMutation({
    mutationFn: async (token) => updateRegistrationToken(token),
  });
}

export function useLeaveChatRoom(history) { 
  return useMutation({
    mutationFn: async (chatRoomId) => leaveChatRoom(chatRoomId),
    onSuccess: async (data, variables, context) => {
      if (data.ok) {
        // toast.success("Chat Group Left Successfully");
        history.push("/");
      } else {
        const response = await data.json();
        toast.error(`${response.error}`);
        return;
      }
    },
  })
}