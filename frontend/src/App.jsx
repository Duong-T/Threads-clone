import { Button, Container } from "@chakra-ui/react"
import { Navigate, Route, Routes } from "react-router-dom"
import Header from "./Components/Header"
import PostPage from "./pages/PostPage"
import UserPage from "./pages/UserPage"
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import { useRecoilValue } from 'recoil';
import userAtom from "./atoms/userAtom"
import ReplyPage from './pages/ReplyPage';
import ChatPage from './pages/ChatPage';

function App() {
  const user = useRecoilValue(userAtom);

  return (
    <Container maxW="1230px">
      <Header />
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />

        <Route path="/:username" element={user ? <UserPage /> : <Navigate to="/" />} />
        <Route path="/:username/post/:pId" element={<PostPage />} />
        <Route path="/:username/reply/:rId" element={<ReplyPage />} />
        <Route path="/chat" element={user ? <ChatPage /> : <Navigate to={"/auth"} />} />
      </Routes>
    </Container>
  )
}

export default App
