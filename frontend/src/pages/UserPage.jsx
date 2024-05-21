import UserHeader from "../Components/UserHeader"
import { Container, Divider, Flex, Spinner } from '@chakra-ui/react';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ShowToast from './../hooks/ShowToast';
import Post from "../Components/Post";
import { useRecoilState } from 'recoil';
import postsAtom from './../atoms/postsAtom';
import useGetUserProfile from './../hooks/useGetUserProfile';

const UserPage = () => {
    const { user, loading } = useGetUserProfile();
    const { username } = useParams()
    const toast = ShowToast();
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [fetching, setFetching] = useState(true)

    useEffect(() => {

        const getPosts = async () => {
            if (!user) return;
            setFetching(true)
            try {
                const res = await fetch(`/api/posts/user/${username}`);
                const data = await res.json();
                if (data.message) {
                    toast("Error", data.message, "error");
                    return;
                }
                setPosts(data);
            } catch (error) {
                toast("Error", error.message, "error");
                setPosts([]);
            } finally {
                setFetching(false);
            }
        }
        getPosts();
    }, [username, toast, setPosts, user]);

    if (!user && loading) {
        return (
            <Flex justifyContent={"center"}>
                <Spinner size="xl" />
            </Flex>
        )
    }
    if (!user && !loading) return <h1>User not found</h1>;

    return (
        <Container maxW={"620px"} px="0">
            <UserHeader user={user} />
            {!fetching && posts.length === 0 && (
                <Flex justify={"center"}>
                    <h1>Create Some Posts</h1>
                </Flex>
            )}
            {fetching && (
                <Flex justify={"center"}>
                    <Spinner size={"xl"} />
                </Flex>
            )}

            {posts.map((post) => (
                <Flex key={post._id} flexDirection="column">
                    <Divider />
                    <Post post={post} postedBy={post.postBy} />
                </Flex>
            ))}
        </Container>
    )
}

export default UserPage