import {useQuery} from "@tanstack/react-query"
import { getQuiz, getChatRooms, getChatRoomInformation , getQuizRoom, getQuizQuestion, getQuizInformation, getPublicChatRooms,getRegistrationToken} from "./api"


export function useGetQuiz(roomId){
    return useQuery({
        queryKey:['getQuiz'],
        queryFn:()=>getQuiz(roomId),
    })
}
export function useGetChatRooms(){
    return useQuery({
        queryKey:["chatRooms"],
        queryFn:()=>getChatRooms(),
    })
}

export function useGetQuizRoom(){
    return useQuery({
        queryKey:["quizRoom"],
        queryFn:()=>getQuizRoom(),
    })
}

export function useGetQuizQuestion(quizId){
    return useQuery({
        queryKey:["quizQuestion"],
        queryFn:()=>getQuizQuestion(quizId),
    })
}

export function useGetQuizInformation(quizId){
    return useQuery({
        queryKey:["quizInformation"],
        queryFn:()=>getQuizInformation(quizId),
    })
}

export function useGetPublicChatRooms(){
    return useQuery({
        queryKey:["publicChatRooms"],
        queryFn:()=>getPublicChatRooms(),
    })
}


export function useGetChatRoomInformation(chatRoomId){
    return useQuery({
        queryKey:["chatRoomInformation"],
        queryFn:()=>getChatRoomInformation(chatRoomId),
    })
}

export function useGetRegistrationToken(){
    return useQuery({
        queryKey:["registrationToken"],
        queryFn:()=>getRegistrationToken(),
    })
}