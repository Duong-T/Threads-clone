import { Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { IoSendSharp } from 'react-icons/io5'
import { useState } from 'react';
import ShowToast from './../hooks/ShowToast';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { selectedConversationAtom } from '../atoms/messagesAtom';
import { conversationsAtom } from './../atoms/messagesAtom';

const MessageInput = ({ setMessages }) => {
    const [messageText, setMessageText] = useState("");
    const toast = ShowToast();
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const setConversations = useSetRecoilState(conversationsAtom)

    const handleSendMessages = async (e) => {
        e.preventDefault();
        if (!messageText) return;

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: messageText,
                    recipientId: selectedConversation.userId,
                })
            })
            const data = await res.json();
            if (data.error) {
                toast("Error", data.error, "error")
                return;
            }
            setMessages((messages) => [...messages, data]);

            setConversations(prevConvs => {
                const updatedConversations = prevConvs.map(conversation => {
                    if (conversation._id === selectedConversation._id) {
                        return {
                            ...conversation,
                            lastMessage: {
                                text: messageText,
                                sender: data.sender
                            }
                        }
                    }
                    return conversation;
                })
                return updatedConversations;
            })
            setMessageText("")

        } catch (error) {
            toast("Error", error.message, "error")
        }
    }

    return (
        <form onSubmit={handleSendMessages}>
            <InputGroup>
                <Input
                    w={"full"}
                    placeholder='Type a message'
                    onChange={(e) => setMessageText(e.target.value)}
                    value={messageText}
                />
                <InputRightElement onClick={handleSendMessages} cursor={"pointer"}>
                    <IoSendSharp />
                </InputRightElement>
            </InputGroup>
        </form>
    )
}

export default MessageInput