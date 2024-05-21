import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShowToast from './ShowToast';

const useGetUserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { username } = useParams();
    const toast = ShowToast();

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/profile/${username}`);
                const data = await res.json();
                if (data.message) {
                    toast("Error", data.message, "error");
                    return;
                }
                // if (data.isFrozen) {
                //     setUser(null);
                //     return;
                // }
                setUser(data);
            } catch (error) {
                toast("Error", error.message, "error");
            } finally {
                setLoading(false);
            }
        };
        getUser();
    }, [username, toast]);

    return { loading, user };
};

export default useGetUserProfile;