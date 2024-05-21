import { Avatar, Flex, Text } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil';
import { selectedConversationAtom } from '../atoms/messagesAtom';
import userAtom from './../atoms/userAtom';

const Message = ({ ownMessage, message }) => {
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const user = useRecoilValue(userAtom);
    return (
        <>
            {ownMessage ? (
                <Flex
                    gap={2}
                    alignSelf={"flex-end"}
                >
                    {message.text && (
                        <Flex bg={message.seen ? "blue.400" : "gray.500"} maxW={"350px"} p={1} borderRadius={"md"}>
                            <Text color={"white"}>{message.text}</Text>
                        </Flex>
                    )}
                    {message.media && (
                        <Flex mt={5} w={"200px"}>
                            <Image
                                src={" "}
                                alt='Message image'
                                borderRadius={4}
                            />
                        </Flex>
                    )}
                    <Avatar src={user.profilePic} w={"7"} h={"7"} />
                </Flex>
            )
                : (
                    <Flex
                        gap={2}
                    >
                        <Avatar src={selectedConversation.userProfilePic} w={"7"} h={"7"} />
                        <Text
                            maxW={"350px"}
                            bg={"gray.400"}
                            p={1}
                            borderRadius={"md"}
                            color={"black"}
                        >
                            {message.text}
                        </Text>

                    </Flex>
                )}

        </>
    )
}

export default Message