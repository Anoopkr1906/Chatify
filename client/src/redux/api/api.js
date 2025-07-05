import {createApi , fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { server } from '../../constants/config';


const api = createApi({

    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/` 
    }),

    tagTypes: ["Chat" , "User" , "Message"],

    endpoints: (builder) => ({
        myChats: builder.query({
            query: () => ({
                url: "chat/my",
                credentials: "include",
            }),
            providesTags: ["Chat"],
        }),

        searchUser: builder.query({
            query: (name) => ({
                url: `user/search?name=${name}`,
                credentials: "include",
            }),
            providesTags: ["User"]
        }),


        sendFriendRequest: builder.mutation({
            query: (data) => ({
                url: "user/sendRequest",
                method: "PUT",
                credentials: "include",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),

        getNotifications: builder.query({
            query: () => ({
                url: "user/notification",
                credentials: "include",
            }),
            keepUnusedDataFor: 0 ,
        }),

        acceptFriendRequest: builder.mutation({
            query: (data) => ({
                url: "user/acceptRequest",
                method: "PUT",
                credentials: "include",
                body: data,
            }),
            invalidatesTags: ["Chat"],
        }),

        chatDetails: builder.query({
            query: ({chatId , populate = false}) => {
                let url = `chat/${chatId}`;
                if(populate){
                    url += "?populate=true";
                }

                return {
                    url ,
                    credentials: "include",
                }
            },
            providesTags: ["Chat"]
        }),

        getMessages: builder.query({
            
            query: ({chatId , page}) => ({
                url: `chat/message/${chatId}?page=${page}`,
                credentials: "include",
            }),
            providesTags: ["Message"]

        }),

        sendAttachments: builder.mutation({
            query: (data) => ({
                url: "chat/message",
                method: "POST",
                credentials: "include",
                body: data,
            }),
        }),
        
    })

})


export default api;
export const {useMyChatsQuery , useLazySearchUserQuery , useSendFriendRequestMutation , useGetNotificationsQuery , useAcceptFriendRequestMutation , useChatDetailsQuery , useGetMessagesQuery , useSendAttachmentsMutation} = api;