import {
    Modal,
    ModalOverlay,
    ModalContent,
    useDisclosure,
    Icon,
    useColorModeValue,
} from '@chakra-ui/react'
import { RiEditBoxLine } from "react-icons/ri";
import { useRecoilValue, useRecoilState } from 'recoil';
import userAtom from './../atoms/userAtom';
import { useState } from 'react';
import ShowToast from './../hooks/ShowToast';
import Create from './Create';
import postsAtom from './../atoms/postsAtom';
import { useLocation } from 'react-router-dom';

const CreatePost = ({ styleIcon }) => {
    const [postText, setPostText] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const user = useRecoilValue(userAtom);
    const toast = ShowToast();
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState([])
    const [posts, setPosts] = useRecoilState(postsAtom);
    const location = useLocation();

    const handleCreatePost = async (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append("postBy", user._id);
        formData.append("text", postText);
        if (file) {
            file.map((item) => {
                formData.append("file", item);
            })
        }
        setLoading(true)
        try {
            const res = await fetch("/api/posts/create", {
                method: 'POST',
                body: formData
            })
            const data = await res.json();
            if (data.message) {
                toast("Error", data.message, "error")
                return;
            }
            toast("Success", "Post created successfully", "success")
            if (location.pathname === `/${user.username}`) {
                setPosts([data, ...posts]);
            }
            onClose()
            setPostText("")
            setFile([])
        } catch (error) {
            toast("Error", error, "error")
        } finally {
            setLoading(false)
        }
    }

    if (!user) return null;

    return (
        <>
            <Icon onClick={onOpen} as={RiEditBoxLine} sx={styleIcon} />

            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent
                    bg={useColorModeValue("white", "rgba(24, 24, 24, 255)")}
                    color={useColorModeValue("black", "white")}
                    maxW={"620px"}
                    borderRadius="15px"
                    pt={5}>
                    <Create
                        handleCreate={handleCreatePost}
                        loading={loading}
                        setText={setPostText}
                        text={postText}
                        setFile={setFile} />
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreatePost