import { useRecoilValue } from 'recoil';
import userAtom from './../atoms/userAtom';
import {
    Input,
    CloseButton,
    Flex,
    Box,
    Avatar,
    Text,
    Textarea,
    Image,
    Button,
    Spinner,
    useColorModeValue,
    Icon
} from '@chakra-ui/react';
import ResizeTextarea from "react-textarea-autosize";
import { IoImagesOutline } from "react-icons/io5";
import { AiOutlineFileGif } from "react-icons/ai";
import { HiHashtag } from "react-icons/hi";
import { CgMenuLeftAlt } from "react-icons/cg";
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mulipleFile from './../hooks/mulipleFile';
import { useEffect } from 'react';

const Create = ({ handleCreate, loading, setText, text, setFile }) => {
    const user = useRecoilValue(userAtom)
    const MAX_CHAR = 1000;
    const fileRef = useRef();
    const navigate = useNavigate();
    const style = {
        boxSize: '7',
        cursor: 'pointer',
        paddingRight: '10px',
        color: useColorModeValue("gray.500", "gray.light")
    }
    const { handleSelectedFile, handleDeleteFile, previewFile, selectedFile } = mulipleFile();
    useEffect(() => {
        if (selectedFile) {
            setFile(selectedFile)
        } else {
            return;
        }
    }, [selectedFile])
    const handleTextChange = (e) => {
        const inputText = e.target.value;

        if (inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR);
            setText(truncatedText);
        } else {
            setText(inputText);
        }
    }

    return (
        <>
            <Flex
                gap={3}
                mb={4}
                pb={5}
                pt={2}
            >
                <Flex flexDirection={"column"} alignItems={"center"} paddingLeft="15px">
                    <Avatar size='md' name={user?.username} src={user.profilePic}
                        padding={"2px"} />
                    <Box w='2px' h={"full"} bg='gray.light' my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                        <Avatar
                            size='xs'
                            name={user?.username}
                            src={user.profilePic}
                            position={"absolute"}
                            top={"0px"}
                            left='12px'
                            padding={"2px"}
                        />
                        <Text position={"absolute"} w={"300px"} pl="58px">
                            Add to thread
                        </Text>
                    </Box>
                </Flex>

                <Flex flex={1} flexDirection={"column"}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text
                                id={user._id}
                                fontSize={"md"}
                                fontWeight={"500"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/${user.username}`);
                                }}
                            >
                                {user?.username}
                            </Text>
                        </Flex>
                    </Flex>
                    <Textarea
                        id={user._id}
                        minH={"unset"}
                        placeholder="what's new?"
                        variant={"unstyled"}
                        maxW={"500px"}
                        overflow="hidden"
                        resize={"none"}
                        paddingTop={"-5px"}
                        fontWeight={"400"}
                        as={ResizeTextarea}
                        onChange={handleTextChange}
                        value={text}
                    />
                    <Flex flexDirection={"row"} overflowX={"scroll"}
                        sx={
                            {
                                '::-webkit-scrollbar': {
                                    display: 'none'
                                }
                            }
                        }
                        maxW={"480px"}
                    // m="12px 0"
                    >
                        {previewFile && previewFile.map((item, index) => {
                            return (
                                <Flex name={item.name} flexShrink="0" key={index} paddingRight={"6px"}
                                    maxH={"272px"}
                                    maxW={"204px"}
                                    position="relative"
                                    alignItems={"center"}
                                    justifyContent="center">
                                    {item.type.includes("video") ?
                                        <Box
                                            as='video'
                                            // controls
                                            loop
                                            src={item.file}
                                            autoPlay
                                            objectFit='contain'
                                            sx={{
                                                aspectRatio: "9 / 16"
                                            }}
                                            w={"100%"}
                                        />
                                        :
                                        <Image
                                            src={item.file}
                                            sx={{
                                                aspectRatio: "9 / 16"
                                            }}
                                        />
                                    }
                                    <CloseButton bg={"gray.800"}
                                        position="absolute"
                                        top={2}
                                        right={2}
                                        borderRadius="full"
                                        filter={"opacity(60%)"}
                                        size="sm"
                                        cursor={"pointer"}
                                        onClick={() => handleDeleteFile(item)}
                                    />
                                </Flex>
                            )
                        })}
                    </Flex>
                    <Flex flexDirection={"row"}>
                        <Box>
                            <Input
                                type={'file'}
                                hidden
                                ref={fileRef}
                                multiple={true}
                                onChange={handleSelectedFile} />
                            <Icon as={IoImagesOutline} sx={style}
                                onClick={() => fileRef.current.click()} />
                        </Box>
                        <Box>
                            <Icon as={AiOutlineFileGif} sx={style} />
                        </Box>
                        <Box >
                            <Icon as={HiHashtag} sx={style} />
                        </Box>
                        <Box >
                            <Icon as={CgMenuLeftAlt} sx={style} />
                        </Box>
                    </Flex>
                </Flex>
            </Flex>
            <Flex h={"82px"} justifyContent={"space-between"}
                alignItems={"center"} p={"0 1rem"}>
                <Box>
                    <Text>
                        Your followers can reply & quote
                    </Text>
                </Box>
                <Button isLoading={loading}
                    spinner={<Spinner size="md" color='white' />}
                    onClick={handleCreate}
                >Post</Button>
            </Flex>
        </>
    )
}

export default Create