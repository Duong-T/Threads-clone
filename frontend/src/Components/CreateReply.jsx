import { useRecoilValue, useRecoilState } from 'recoil';
import userAtom from './../atoms/userAtom';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import Media from './../hooks/Media';
import {
    Avatar,
    Flex,
    Modal,
    ModalContent,
    useColorModeValue,
    ModalOverlay,
    Box,
    Text
} from '@chakra-ui/react';
import Create from './Create';
import ShowToast from './../hooks/ShowToast';
import { useNavigate } from 'react-router-dom';
import replyAtom from './../atoms/replyAtom';
import { useParams } from 'react-router-dom';

const CreateReply = ({ onClose, isOpen, post, userPost, setPost, isReply }) => {
    const user = useRecoilValue(userAtom);
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState([]);
    const toast = ShowToast();
    const navigate = useNavigate();
    const [replys, setReplys] = useRecoilState(replyAtom);
    const { pId } = useParams()

    const handleCreateReply = async (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append("replyBy", user._id);
        formData.append("text", replyText);
        if (!isReply) {
            formData.append("postId", post._id);
        }
        if (isReply) {
            formData.append("replyId", post._id);
        }
        if (file) {
            file.map((item) => {
                formData.append("file", item);
            })
        }
        setLoading(true)
        try {
            const res = await fetch("/api/reply/create", {
                method: 'POST',
                body: formData
            })
            const data = await res.json();
            if (data.message) {
                toast("Error", data.message, "error")
                return;
            }
            toast("Success", "Reply created successfully", "success")
            setPost({ ...post, replies: [...post.replies, data._id] })
            if (!isReply && pId === post._id) {
                setReplys([data, ...replys])
            }
            onClose()
            setReplyText("")
            setFile([])
        } catch (error) {
            toast("Error", error, "error")
        } finally {
            setLoading(false)
        }
    }
    if (!user) return null;

    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent
                bg={useColorModeValue("white", "rgba(24, 24, 24, 255)")}
                color={useColorModeValue("black", "white")}
                maxW={"620px"}
                borderRadius={"15px"}>
                <Flex gap={3} mb={0} pt={5}>
                    <Flex flexDirection={"column"} alignItems={"center"} paddingLeft="15px">
                        <Avatar size="md" name={userPost?.username}
                            src={userPost?.profilePic}
                            padding="2px" />
                        <Box w='2px' h="full" bg='gray.light' mt={2}></Box>
                    </Flex>
                    <Flex flex={1} flexDirection="column" gap={2}>
                        <Flex justifyContent={"space-between"} w="full">
                            <Flex w={"full"} alignItems={"center"}>
                                <Text fontSize={"md"} fontWeight={"bold"}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate(`/${userPost.username}`)
                                    }}>
                                    {userPost?.username}
                                </Text>
                            </Flex>
                            <Flex gap={4} alignItems={"center"}>
                                <Text fontSize={"sm"} whiteSpace="nowrap" color={"gray.light"} paddingRight="10px">
                                    {formatDistanceToNow(new Date(post.createdAt))}
                                </Text>
                            </Flex>
                        </Flex>
                        <Text fontSize={"md"}>{post.text}</Text>
                        {post.media && <Media media={post.media} />}

                    </Flex>
                </Flex>
                <Create
                    handleCreate={handleCreateReply}
                    loading={loading}
                    setText={setReplyText}
                    text={replyText}
                    setFile={setFile}
                />
            </ModalContent>
        </Modal>
    )
}

export default CreateReply