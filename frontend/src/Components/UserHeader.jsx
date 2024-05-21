import { Avatar, Box, Flex, Text, VStack, Link, Button } from "@chakra-ui/react"
import { SiInstagram } from "react-icons/si";
import EditUser from "./EditUser";
import { useRecoilValue } from 'recoil';
import userAtom from './../atoms/userAtom';
import { useState } from "react";
import ShowToast from './../hooks/ShowToast';

const UserHeader = ({ user }) => {
    const currentUser = useRecoilValue(userAtom);
    const [following, setFollowing] = useState(user.followers.includes(currentUser._id));
    const toast = ShowToast();
    const [updating, setUpdating] = useState(false);

    const handleFollow = async () => {
        if (!currentUser) {
            toast("Error", "Please login to follow", "error");
            return;
        }
        setUpdating(true);
        try {
            const res = await fetch(`/api/users/follow/${user._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const data = res.json();
            if (data.error) {
                toast("Error", data.message, "error");
                return;
            }
            if (following) {
                toast("Success", `Unfollowed ${user.name}`, "success");
                user.followers.pop();
            } else {
                toast("Success", `Followed ${user.name}`, "success");
                user.followers.push(currentUser._id);
            }
            setFollowing(!following);
        } catch (error) {
            toast("Error", error, "error");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <VStack gap={4} alignItems={'start'} pt='24px'>
            <Flex gap={4} justifyContent={"space-between"} w={"full"}>
                <Box>
                    <Text fontSize={"2xl"} fontWeight={"bold"}>
                        {user.name}
                    </Text>
                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"sm"}>{user.username}</Text>
                        <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
                            threads.net
                        </Text>
                    </Flex>
                </Box>
                <Box>
                    {user.profilePic && (
                        <Avatar
                            name={user.name}
                            src={user.profilePic}
                            size={{
                                base: "md",
                                md: "xl"
                            }} />
                    )}
                    {!user.profilePic && (
                        <Avatar
                            name={user.name}
                            src="https://bit.ly/broken-link"
                            size={{
                                base: "md",
                                md: "xl"
                            }} />
                    )}

                </Box>
            </Flex>
            <Text>
                {user.bio}
            </Text>
            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"}>{user.followers.length} Followers</Text>
                    <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
                    <Link color={"gray.light"}>Instagram.com</Link>
                </Flex>
                <Flex>
                    <Box className="icon-container">
                        <SiInstagram size={24} cursor={"pointer"} />
                    </Box>
                </Flex>
            </Flex>

            {currentUser._id === user._id && (
                <Flex justify={"center"} w={"full"}>
                    <EditUser />
                </Flex>
            )}
            {currentUser._id !== user._id && (
                <Button size="sm"
                    onClick={handleFollow}
                    isLoading={updating}
                >
                    {following ? "Unfollow" : "Follow"}
                </Button>
            )}

            <Flex w={'full'}>
                <Flex flex={1} borderBottom={"1.5px solid"} justifyContent={"center"} pb="3" cursor={"pointer"}>
                    <Text fontWeight={"500"}>Thread</Text>
                </Flex>
                <Flex flex={1} borderBottom={"1.5px solid gray"} color={"gray.light"} justifyContent={"center"} pb="3" cursor={"pointer"}>
                    <Text fontWeight={"500"}>Replies</Text>
                </Flex>
            </Flex>
        </VStack>
    )
}


export default UserHeader