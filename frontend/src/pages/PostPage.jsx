import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ShowToast from './../hooks/ShowToast';
import {
    Container,
    Flex,
    Text,
    Avatar,
    Spinner,
    Divider
} from '@chakra-ui/react';
import Media from './../hooks/Media';
import Actions from './../Components/Actions';
import { formatDistanceToNow } from 'date-fns';
import { useRecoilState } from 'recoil';
import postsAtom from './../atoms/postsAtom';
import { useNavigate } from 'react-router-dom';
import replyAtom from './../atoms/replyAtom';
import Reply from '../Components/Reply';
import Options from './../Components/Options';

const PostPage = () => {
    const param = useParams();
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [replys, setReplys] = useRecoilState(replyAtom);
    const toast = ShowToast();
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false);
    const [getUser, setGetUser] = useState(false);
    const navigate = useNavigate();

    const post = posts[0];

    useEffect(() => {
        const getPost = async () => {
            setLoading(true);
            setPosts([])
            try {
                const res = await fetch(`/api/posts/${param.pId}`)
                const data = await res.json();
                if (data.message) {
                    toast("Error", data.message, "error")
                    return;
                }
                setPosts([data]);
            } catch (error) {
                toast("Error", error, "error")
            } finally {
                setLoading(false);
            }
        }

        const getUser = async () => {
            setGetUser(true);
            try {
                const res = await fetch(`/api/users/profile/${param.username}`);
                const data = await res.json();
                if (data.message) {
                    toast("Error", data.message, "error")
                    return;
                }
                setUser(data);
            } catch (error) {
                toast("Error", error, "error")
            } finally {
                setGetUser(false)
            }
        }
        const getReply = async () => {
            setReplys([])
            try {
                const res = await fetch(`/api/reply/allreply/${param.pId}`)
                const data = await res.json();
                if (data.message) {
                    toast("Error", data.message, "error")
                    return;
                }
                setReplys(data)
            } catch (error) {
                toast("Error", error, "error")
            }
        }
        getReply();
        getUser();
        getPost();
    }, [toast, param, setPosts, setUser, setReplys])

    if (getUser && loading) {
        return (
            <Flex justifyContent={"center"}>
                <Spinner size={"xl"} />
            </Flex>
        );
    }

    if (!post) return null;

    return (

        <Container maxW={"620px"} p="0">
            {loading && (
                <Flex justify={"center"}>
                    <Spinner size={"xl"} />
                </Flex>
            )}
            {
                <>
                    <Flex>
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
                                {formatDistanceToNow(new Date(post.createdAt))}
                            </Text>
                            <Options />
                        </Flex>
                    </Flex>
                    <Text my={3} fontSize={"md"}>{post.text}</Text>
                    <Media media={post.media} />
                    <Flex gap={3} my={2}>
                        <Actions post={post} userPost={user} />
                    </Flex>

                    {replys.map((reply) => (
                        <Flex key={reply._id} flexDirection="column">
                            <Divider />
                            <Reply reply={reply} replyBy={reply.replyBy} />
                        </Flex>
                    ))}
                </>
            }
        </Container >
    )
}

export default PostPage