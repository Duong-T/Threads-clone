import { Avatar, AvatarBadge, Flex, Icon, Stack, Text, useColorModeValue, WrapItem } from '@chakra-ui/react';
import { useRecoilValue, useRecoilState } from 'recoil';
import userAtom from './../atoms/userAtom';
import { BsCheck2All } from "react-icons/bs"
import { selectedConversationAtom } from '../atoms/messagesAtom';
import { useColorMode } from '@chakra-ui/react';

const Conversation = ({ conversation, isOnline }) => {
    const colorMode = useColorMode()
    const user = conversation.participants[0];
    const currentUser = useRecoilValue(userAtom);
    const lastMessage = conversation.lastMessage;
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
    return (
        <Flex
            gap={4}
            alignItems={"center"}
            p={"1"}
            _hover={{
                cursor: "pointer",
                bg: useColorModeValue("gray.600", "gray.dark"),
                color: "white"
            }}
            borderRadius="md"
            onClick={() => setSelectedConversation({
                _id: conversation._id,
                userId: user._id,
                userProfilePic: user.profilePic,
                username: user.username,
                mock: conversation.mock,
            })}
            bg={selectedConversation?._id === conversation._id ?
                (colorMode === "light" ? "gray.400" : "gray.dark") : ""
            }
        >
            <WrapItem>
                <Avatar size={{
                    base: "xs",
                    sm: "sm",
                    md: "md"
                }} src={user.profilePic}>
                    {isOnline ? <AvatarBadge boxSize="1em" bg={'green.500'} /> : ""}
                </Avatar>
            </WrapItem>

            <Stack direction={"column"} fontSize="sm">
                <Text fontWeight={"700"} display={"flex"} alignItems="center">
                    {user.username}
                </Text>
                <Text fontSize={"xs"} display={"flex"} alignItems="center" gap={1}>
                    {currentUser._id === lastMessage.sender
                        ? (<Icon color={lastMessage.seen ? "blue.400" : ""}>
                            <BsCheck2All size={16} />
                        </Icon>)
                        : ""}
                    {lastMessage.text.length > 19
                        ? lastMessage.text.substring(0, 18) + "..."
                        : lastMessage.text}
                </Text>
            </Stack>
        </Flex>
    )
}

export default Conversation