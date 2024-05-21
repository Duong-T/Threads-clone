import { Flex, Spinner, Container } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Post from '../Components/Post';
import ShowToast from './../hooks/ShowToast';
import { useRecoilState } from 'recoil';
import feedPostsAtom from './../atoms/feedPostAtom';

const HomePage = () => {
    const toast = ShowToast();
    const [posts, setPosts] = useRecoilState(feedPostsAtom);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getFeedPosts = async () => {
            setLoading(true);
            setPosts([]);
            try {
                const res = await fetch("/api/posts/feed");
                const data = await res.json();
                if (data.message) {
                    toast("Error", data.message, "error");
                    return;
                }

                setPosts(data)
            } catch (error) {
                toast("Error", error.message, "error");
            } finally {
                setLoading(false)
            }
        }
        getFeedPosts();
    }, [toast, setPosts]);

    return (
        <Container p={"0"} maxW={"620px"}>
            {!loading && posts.length === 0 && (
                <Flex justify={"center"}>
                    <h1>Follow some users to see the feed</h1>
                </Flex>
            )}
            {loading && (
                <Flex justify={"center"}>
                    <Spinner size={"xl"} />
                </Flex>
            )}

            {posts.map((post) => (
                <Post key={post._id} post={post} postedBy={post.postBy} />
            ))}
        </Container>
    )
}

export default HomePage