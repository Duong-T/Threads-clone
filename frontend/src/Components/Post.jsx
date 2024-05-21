import { Avatar, Image, Box, Flex, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Actions from './Actions';
import ShowToast from './../hooks/ShowToast';
import { formatDistanceToNow } from 'date-fns';
import Media from "../hooks/Media";
import Options from './Options';

const Post = ({ post, postedBy }) => {
    const [user, setUser] = useState(null)
    const toast = ShowToast();
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch("/api/users/profile/" + postedBy)
                const data = await res.json()
                if (data.message) {
                    toast("Error", data.message, "error");
                    return;
                }
                setUser(data);
            } catch (error) {
                toast("Error", error.message, "error")
                setUser(null);
            }
        }
        getUser();
    }, [postedBy, toast])

    if (!user) return null;
    return (
        <Link to={`/${user.username}/post/${post._id}`}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar size='md' name={user?.name} src={user?.profilePic}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(`/${user.username}`)
                        }}
                    />
                    <Box w='2px' h={"full"} bg='gray.light' my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                        {post.replies.length === 0 &&
                            <Text textAlign={"center"}>🥱</Text>}
                        {post.replies[0] && (
                            <Avatar
                                size='xs'
                                name='John doe'
                                src='https://bit.ly/dan-abramov'
                                position={"absolute"}
                                top={"0px"}
                                left='15px'
                                padding={"2px"}
                            />
                        )}
                        {post.replies[1] && (
                            <Avatar
                                size='xs'
                                name='John doe'
                                src='https://bit.ly/sage-adebayo'
                                position={"absolute"}
                                bottom={"0px"}
                                right='-5px'
                                padding={"2px"}
                            />
                        )}

                        {/* <Avatar
                            size='xs'
                            name='John doe'
                            src='https://bit.ly/prosper-baba'
                            position={"absolute"}
                            bottom={"0px"}
                            left='4px'
                            padding={"2px"}
                        /> */}
                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
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
                            <Text fontSize={"sm"} whiteSpace="nowrap" color={"gray.light"}>
                                {formatDistanceToNow(new Date(post.createdAt))}
                            </Text>
                            <Options isPost={true} id={post._id} By={postedBy} />
                        </Flex>
                    </Flex>

                    <Text fontSize={"md"}>{post.text}</Text>
                    <Media media={post.media} />
                    <Flex gap={3} my={0}>
                        <Actions post={post} userPost={user} />
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    );
};

export default Post;