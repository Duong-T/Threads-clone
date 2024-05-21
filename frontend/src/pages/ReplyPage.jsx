import { useParams } from 'react-router-dom'
import { useEffect } from 'react';
import ShowToast from './../hooks/ShowToast';
import { useState } from 'react';
import { Container, Flex, Avatar, Box, Text, Divider } from '@chakra-ui/react';
import ReplyModel from '../Components/ReplyModel';
import { useNavigate } from 'react-router-dom';
import { BsThreeDots } from 'react-icons/bs';
import Media from './../hooks/Media';
import { formatDistanceToNow } from 'date-fns';
import ActionsReply from './../Components/ActionsReply';
import Reply from './../Components/Reply';

const ReplyPage = () => {
    const { rId, username } = useParams();
    const [posts, setPosts] = useState([]);
    const [replys, setReplys] = useState([]);
    const [comment, setComment] = useState([])
    const [anotherReply, setAnotherReply] = useState([]);
    const [user, setUser] = useState();
    const toast = ShowToast();
    const post = posts[0];
    const isPost = true;
    const navigate = useNavigate();

    useEffect(() => {
        const getAllReplys = async () => {
            setPosts([])
            setReplys([])
            try {
                const res = await fetch(`/api/reply/replypage/${rId}`)
                const data = await res.json();
                if (data.message) {
                    toast("Error", data.message, "error")
                    return;
                }
                setPosts(data.post)
                setReplys(data.allReplys)
            } catch (error) {
                toast("Error", error.message, "error")
            }
        }
        const getUser = async () => {
            setUser([])
            try {
                const res = await fetch(`/api/users/profile/${username}`)
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
        const getComment = async () => {
            setComment([])
            try {
                const res = await fetch(`/api/reply/allComment/${rId}`)
                const data = await res.json();
                if (data.message) {
                    toast("Error", data.message, "error")
                    return;
                }
                setComment(data)
            } catch (error) {
                toast("Error", error.message, "error")
            }
        }
        const getAnotherReply = async () => {
            setAnotherReply([])
            try {
                const res = await fetch(`/api/reply/another/${rId}`)
                const data = await res.json();
                if (data.message) {
                    toast("Error", data.message, "error")
                    return;
                }
                if (!data.success) {
                    setAnotherReply(data)
                }
            } catch (error) {
                toast("Error", error.message, "error")
            }
        }
        getUser();
        getAllReplys();
        getComment();
        getAnotherReply();
    }, [rId, setAnotherReply, setComment, setPosts])

    return (
        <Container maxW={"620px"}>
            {post && <ReplyModel content={post} userId={post.postBy} isPost={isPost} />}
            {replys.map((item, index) => (
                <Box key={index} p="0">
                    {item._id !== rId ?
                        <ReplyModel content={item} userId={item.replyBy} isPost={!isPost} />
                        :
                        <Flex flexDirection="column">
                            <Flex pt={"5px"}>
                                <Flex w="full" alignItems={"center"} gap={3}>
                                    <Avatar size='md' name={user?.name} src={user?.profilePic}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate(`/${user.username}`)
                                        }}
                                    />
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
                                        {formatDistanceToNow(new Date(item.createdAt))}
                                    </Text>
                                    <BsThreeDots />
                                </Flex>
                            </Flex>
                            <Text my={3} fontSize={"md"}>{item.text}</Text>
                            <Media media={item.media} />
                            <Flex gap={3} my={2}>
                                <ActionsReply reply={item} userReply={user} />
                            </Flex>
                            {comment.map((reply) => (
                                <Flex key={reply._id} flexDirection="column">
                                    <Divider />
                                    <Reply reply={reply} replyBy={reply.replyBy} />
                                </Flex>
                            ))}
                        </Flex>
                    }
                </Box>
            ))}
            {anotherReply &&
                <Flex flexDirection={"column"}>
                    {anotherReply.map((item, index) => (
                        <Box key={index}>
                            {index === 0 ?
                                <>
                                    <Divider />
                                    <Text pt={"10px"}>
                                        Another replies
                                    </Text>
                                    <Reply reply={item} replyBy={item.replyBy} />
                                </>
                                :
                                <>
                                    <Divider />
                                    <Reply reply={item} replyBy={item.replyBy} />
                                </>
                            }
                        </Box>
                    ))}
                </Flex>
            }
        </Container>
    )
}

export default ReplyPage