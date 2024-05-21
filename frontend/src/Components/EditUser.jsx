import {
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    Center,
} from '@chakra-ui/react'
import { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import userAtom from './../atoms/userAtom';
import usePreviewImg from './../hooks/usePreviewImg';
import ShowToast from './../hooks/ShowToast';


function EditUser() {
    const [user, setUser] = useRecoilState(userAtom);
    const [inputs, setInputs] = useState({
        name: user.name,
        bio: user.bio,
    });
    const toast = ShowToast();
    const fileRef = useRef(null);
    const [loading, setLoading] = useState(false)
    const { handleImageChange, imgUrl, selectedFile } = usePreviewImg()

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('name', inputs.name);
        formData.append('bio', inputs.bio);
        if (selectedFile) {
            formData.append('file', selectedFile);
        }
        setLoading(true)
        try {
            const res = await fetch(`/api/users/update/${user._id}`, {
                method: "PUT",
                // headers: {
                //     "Content-Type": "application/json",
                // },
                body: formData
            })
            const data = await res.json();
            if (data.message) {
                toast("Error", data.message, "error");
                return;
            }
            toast("Success", data.success, "success");
            setUser(data);
            localStorage.setItem("user-miracle", JSON.stringify(data));
            onClose();
        } catch (error) {
            toast("Error", error, "error");
        } finally {
            setLoading(false)
        }
    }

    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <Button
                onClick={onOpen}
                w={'100%'}
                borderRadius={"10px"}
                border={"1px solid #616161"}
                h={"36px"}
                alignItems={"center"}
                cursor={"pointer"}
                fontWeight={'500'}
                bgColor={'transparent'}
                variant={'none'}
            >
                Edit your profile
            </Button>

            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg={"none"} border={"none"} boxShadow="none" maxW={"620px"}>
                    <form onSubmit={handleSubmit} w="620px">
                        <Flex
                            align={'center'}
                            justify={'center'}
                            w="100%"
                        >
                            <Stack
                                spacing={4}
                                w={'full'}
                                maxW={'520px'}
                                bg={useColorModeValue('white', 'rgb(16,16,16)')}
                                rounded={'xl'}
                                boxShadow={'lg'}
                                p={6}
                                my={12}>
                                <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                                    User Profile Edit
                                </Heading>
                                <FormControl id="userName">
                                    <Stack direction={['column', 'row']} spacing={6}>
                                        <Center>
                                            <Avatar size="xl" boxShadow={"md"} src={imgUrl || user.profilePic} />
                                        </Center>
                                        <Center w="full">
                                            <Button w="full"
                                                onClick={() => fileRef.current.click()}
                                            >Change Avatar</Button>
                                            <Input type={"file"} hidden ref={fileRef}
                                                onChange={handleImageChange}
                                            />
                                        </Center>
                                    </Stack>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Display name</FormLabel>
                                    <Input
                                        value={inputs.name}
                                        onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                                        placeholder="Your full name"
                                        _placeholder={{ color: 'gray.500' }}
                                        type="text"
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Bio</FormLabel>
                                    <Input
                                        value={inputs.bio}
                                        onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
                                        placeholder="Your bio"
                                        _placeholder={{ color: 'gray.500' }}
                                        type="text"
                                    />
                                </FormControl>
                                <Stack spacing={6} direction={['column', 'row']}>
                                    <Button
                                        bg={'red.400'}
                                        color={'white'}
                                        w="full"
                                        _hover={{
                                            bg: 'red.500',
                                        }}
                                        onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button
                                        bg={'green.400'}
                                        color={'white'}
                                        w="full"
                                        _hover={{
                                            bg: 'green.500',
                                        }}
                                        type='submit'
                                        isLoading={loading}>
                                        Submit
                                    </Button>
                                </Stack>
                            </Stack>
                        </Flex>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}

export default EditUser