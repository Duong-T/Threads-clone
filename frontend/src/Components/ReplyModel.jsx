import { Flex, Avatar, Box, Text } from "@chakra-ui/react"
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Media from "../hooks/Media";
import ShowToast from "../hooks/ShowToast";
import Actions from './Actions';
import ActionsReply from './ActionsReply';
import { BsThreeDots } from 'react-icons/bs';

const ReplyModel = ({ content, userId, isPost }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const toast = ShowToast()

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/profile/${userId}`)
                const data = await res.json();
                if (data.message) {
                    toast("Error", data.message, "error")
                    return;
                }
                setUser(data)
            } catch (error) {
                toast("Error", error.message, "error")
            }
        }
        getUser();
    }, [content])

    return (
        <Link to={`/${user?.username}/${isPost ? "post" : "reply"}/${content._id}`}>
            <Flex gap={3} mb={0} pt={0}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar size="md" name={user?.username}
                        src={user?.profilePic}
                        padding="2px" />
                    <Box w='2px' h="full" bg='gray.light' mt={2}></Box>
                </Flex>
                <Flex flex={1} flexDirection="column" gap={2}>
                    <Flex justifyContent={"space-between"} w="full">
                        <Flex w={"full"} alignItems={"center"}>
                            <Text fontSize={"md"} fontWeight={"bold"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/${user.username}`)
                                }}>
                                {user?.username}
                            </Text>
                        </Flex>
                        <Flex gap={4} alignItems={"center"}>
                            <Text fontSize={"sm"} whiteSpace="nowrap" color={"gray.light"} paddingRight="10px">
                                {formatDistanceToNow(new Date(content.createdAt))}
                            </Text>
                            <BsThreeDots />
                        </Flex>
                    </Flex>
                    <Text fontSize={"md"}>{content.text}</Text>
                    {content.media && <Media media={content.media} />}
                    {isPost ? <Actions post={content} userPost={user} /> : <ActionsReply reply={content} userReply={user} />}
                </Flex>
            </Flex>
        </Link>
    )
}

export default ReplyModel