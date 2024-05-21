import { Box, Flex, Grid, GridItem, IconButton, Icon, Image, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useColorMode, useColorModeValue, Link, Divider } from "@chakra-ui/react"
import { TbMenuDeep } from "react-icons/tb";
import { GrHomeRounded } from "react-icons/gr";
import { FiSearch } from "react-icons/fi";
import { FaRegUser, FaRegHeart } from "react-icons/fa6";
import { useRecoilState } from 'recoil';
import userAtom from './../atoms/userAtom';
import ShowToast from './../hooks/ShowToast';
import { Navigate, Link as RouterLink } from "react-router-dom";
import CreatePost from "./CreatePost";
import { BsFillChatQuoteFill } from "react-icons/bs";

const Header = () => {

    const { colorMode, toggleColorMode } = useColorMode();
    const styleIcon = {
        boxSize: '6',
        color: 'gray.400',
        cursor: 'pointer',
    }
    const styleMenuIcon = {
        bg: useColorModeValue("white", "black"),
        py: '10px'
    }

    const [user, setUser] = useRecoilState(userAtom);
    const toast = ShowToast()
    const handleLogout = async () => {
        <Navigate to={"/"} replace={true} />
        try {
            const res = await fetch("/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json',
                },
            })
            const data = await res.json();
            if (data.error) {
                toast("Error", data.message, "error");
                return;
            }
            localStorage.removeItem("user-miracle");
            setUser(null);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Grid
            templateAreas={`"logo icon menu"`}
            templateRows={'1fr auto 1fr'}
            h={'74px'}
            w={'100%'}
            pos={'relative'}
        >
            <GridItem area={'logo'} mt={6}>
                <Image
                    cursor={"pointer"}
                    alt='logo'
                    w={8}
                    src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
                >
                </Image>
            </GridItem>
            <Flex area={'icon'} justifyContent={'space-between'} mt={6} p={'0 70px'}>
                <Box>
                    {user && (
                        <Link as={RouterLink} to="/">
                            <Icon as={GrHomeRounded} sx={styleIcon} />
                        </Link>
                    )}
                </Box>
                <Box>
                    <Icon as={FiSearch} sx={styleIcon} />
                </Box>
                <CreatePost styleIcon={styleIcon} />
                <Box>
                    <Icon as={FaRegHeart} sx={styleIcon} />
                </Box>
                <Box>
                    {user && (
                        <Link as={RouterLink} to={`/${user.username}`}>
                            <Icon as={FaRegUser} sx={styleIcon} />
                        </Link>
                    )}
                </Box>
            </Flex>
            <GridItem area={'menu'} mt={6} w={'100%'}>
                <Menu
                    bg={useColorModeValue("black", "white")}
                    color={useColorModeValue("white", "black")}
                >
                    <MenuButton
                        as={IconButton}
                        icon={<TbMenuDeep />}
                        aria-label="options"
                        variant='unstyled'
                        pos={'absolute'}
                        right={'0'}
                    />
                    <MenuList
                        pos={"absolute"}
                        borderRadius={"1rem"}
                        right={"-10"}
                        display={'block'}
                        minW={'174px'}
                        p={'0'}
                        bg="none"
                    >
                        <MenuItem onClick={toggleColorMode} borderTopRadius={"1rem"} sx={styleMenuIcon}>
                            Chuyển giao diện
                        </MenuItem>
                        <Divider />
                        <MenuItem sx={styleMenuIcon}>
                            Cài Đặt
                        </MenuItem>
                        <Divider />
                        <MenuItem sx={styleMenuIcon}>
                            Giới thiệu
                        </MenuItem>
                        <Divider />
                        <MenuItem sx={styleMenuIcon}>
                            Báo cáo sự cố
                        </MenuItem>
                        <Divider />
                        <MenuItem borderBottomRadius={"1rem"} sx={styleMenuIcon}
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </MenuItem>
                    </MenuList>
                </Menu>
                <Box>
                    {user && (
                        <Link as={RouterLink} to={`/chat`}>
                            <BsFillChatQuoteFill size={24} />
                        </Link>
                    )}
                </Box>
            </GridItem>
        </Grid>
    )
}

export default Header