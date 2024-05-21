import { SearchIcon } from '@chakra-ui/icons'
import { Button, Container, Flex, Input, Text, Box, SkeletonCircle, Skeleton } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/react';
import Conversation from '../Components/Conversation';
import { GiConversation } from "react-icons/gi"
import MessageContainer from './../Components/MessageContainer';
import { useEffect, useState } from 'react';
import ShowToast from './../hooks/ShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import { conversationsAtom, selectedConversationAtom } from './../atoms/messagesAtom';
import userAtom from './../atoms/userAtom';
import { useSocket } from '../context/SocketContext';

const ChatPage = () => {
    const toast = ShowToast();
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [conversations, setConversations] = useRecoilState(conversationsAtom)
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
    const [searchText, setSearchText] = useState("");
    const [searchingUser, setSearchingUser] = useState(false)
    const currentUser = useRecoilValue(userAtom);
    const { socket, onlineUsers } = useSocket();

    useEffect(() => {
        socket?.on("messagesSeen", ({ conversationId }) => [
            setConversations(prev => {
                const updatedConversation = prev.map(conversation => {
                    if (conversation._id === conversationId) {
                        return {
                            ...conversation,
                            lastMessage: {
                                ...conversation.lastMessage,
                                seen: true
                            }
                        }
                    }
                    return conversation
                })
                return updatedConversation
            })
        ])
    }, [socket, setConversations])

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await fetch("/api/messages/conversations");
                const data = await res.json();
                if (data.error) {
                    toast("Error", data.error, "error")
                    return
                }
                setConversations(data);
            } catch (error) {
                toast("Error", error.message, "error")
            } finally {
                setLoadingConversations(false)
            }
        }
        getConversations();
    }, [toast, setConversations])

    const handleConversationSearch = async (e) => {
        e.preventDefault();
        setSearchingUser(true);
        try {
            const res = await (fetch(`/api/users/profile/${searchText}`));
            const searchedUser = await res.json();
            if (searchedUser.error) {
                toast("Error", searchedUser.error, "error")
                return;
            }

            const messagingYourSelf = searchedUser._id === currentUser._id;
            if (messagingYourSelf) {
                toast("Error", "You can not messing yoursefl", "error")
                return;
            }

            const conversationAlreadyExits = conversations.find((conversation) => conversation.participants[0]._id === searchedUser._id);
            if (conversationAlreadyExits) {
                setSelectedConversation({
                    _id: conversationAlreadyExits._id,
                    userId: searchedUser._id,
                    userProfilePic: searchedUser.profilePic
                });
                return;
            }

            const mockConversation = {
                mock: true,
                lastMessage: {
                    text: "",
                    sender: ""
                },
                _id: Date.now(),
                participants: [
                    {
                        _id: searchedUser._id,
                        username: searchedUser.username,
                        profilePic: searchedUser.profilePic,
                    }
                ]
            }
            setConversations((prevConvs) => [mockConversation, ...prevConvs])
        } catch (error) {
            toast("Error", error.message, "error")
        } finally {
            setSearchingUser(false)
        }
    }

    return (
        <Container maxW={"750px"} p={0}>
            <Box w={{
                base: "100%",
                md: "80%",
                lg: "750px"
            }}>
                <Flex gap={4} flexDirection={{
                    base: "column",
                    md: "row"
                }}
                    maxW={{
                        sm: "400px",
                        md: "full"
                    }}
                    mx={"auto"}
                >
                    <Flex flex={30}
                        gap={2}
                        flexDirection={"column"}
                        maxW={{
                            sm: "250px",
                            md: "full"
                        }}
                        mx={"auto"}
                    >
                        <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}> Your Conversations</Text>
                        <form onSubmit={handleConversationSearch}>
                            <Flex alignItems={"center"} gap={2}>
                                <Input placeholder='Search for a user' onChange={(e) => setSearchText(e.target.value)} />
                                <Button size={"sm"}
                                    onClick={handleConversationSearch}
                                    isLoading={searchingUser}
                                >
                                    <SearchIcon />
                                </Button>
                            </Flex>
                        </form>

                        {loadingConversations &&
                            [0, 1, 2, 3, 4].map((_, i) => (
                                <Flex key={i} gap={4} alignItems={"center"} p="1" borderRadius={"md"}>
                                    <Box>
                                        <SkeletonCircle size={"10"} />
                                    </Box>
                                    <Flex w={"full"} flexDirection={"column"} gap={3}>
                                        <Skeleton h={"10px"} w={"80px"} />
                                        <Skeleton h={"8px"} w={"90%"} />
                                    </Flex>
                                </Flex>
                            ))}
                        {!loadingConversations && (
                            conversations.map((conversation) => (
                                <Conversation key={conversation._id}
                                    isOnline={onlineUsers.includes(conversation.participants[0]._id)}
                                    conversation={conversation} />
                            ))
                        )}
                    </Flex>
                    {!selectedConversation._id && (
                        <Flex
                            flex={70}
                            borderRadius={"md"}
                            p={2}
                            flexDir={"column"}
                            alignItems="center"
                            justifyContent={"center"}
                            height={"400px"}
                        >
                            <GiConversation size={100} />
                            <Text>Select a conversation to start messaging</Text>
                        </Flex>
                    )}

                    {selectedConversation._id && <MessageContainer />}

                </Flex>
            </Box>
        </Container>
    )
}

export default ChatPage