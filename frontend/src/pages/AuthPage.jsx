import React from 'react'
import SignupCard from './../Components/SignupCard';
import { Container } from '@chakra-ui/react';
import LoginCard from './../Components/LoginCard';
import authScreenAtom from './../atoms/authAtom';
import { useRecoilValue } from 'recoil';

const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom);

    return (
        <Container maxW="620px">
            {authScreenState === "login" ? <LoginCard /> : <SignupCard />}
        </Container>
    )
}

export default AuthPage