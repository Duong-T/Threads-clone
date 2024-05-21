import { Flex, Box, Image, useDisclosure, Modal, ModalContent, CloseButton } from "@chakra-ui/react"
import { useState, useRef } from 'react';

const Media = ({ media }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [mediaDisplay, setMediaDisplay] = useState("");
    const scrollRef = useRef(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [drag, setDrag] = useState(false);

    const handleClickMedia = (item) => {
        setMediaDisplay(item);
    }
    const handleClose = () => {
        onClose();
        setMediaDisplay("");
    }

    const handleMouseDown = (e) => {
        setDrag(false);
        setIsDown(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft)
    }
    const handleMouseMove = (e) => {
        if (!(e.pageX === scrollLeft)) {
            setDrag(true)
        }
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    }
    const handleMouseLeave = () => {
        setIsDown(false)
        setDrag(false);
    }
    const handleMouseUp = () => {
        if (drag) {
            setIsDown(false)
            setDrag(false)
        } else {
            onOpen();
        }

    }

    return (
        <>
            <Flex flexDirection={"row"} overflowX={"scroll"}
                sx={
                    {
                        '::-webkit-scrollbar': {
                            display: 'none'
                        }
                    }
                }
                maxW={"480px"}
                ref={scrollRef}
                scrollBehavior={"smooth"}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {media && media.map((item, index) => {
                    return (
                        <Flex flexShrink="0" key={index} paddingRight={"6px"}
                            maxH={"280px"}
                            maxW={"210px"}
                            position="relative"
                            alignItems={"center"}
                            justifyContent="center"
                            onClick={(e) => {
                                e.preventDefault();
                                handleClickMedia(item)
                            }}
                        >
                            {item.type === 'video' ?
                                <Box
                                    w={"210px"}
                                    h={"280px"}
                                    as='video'
                                    // controls
                                    src={item.url}
                                    objectFit='cover'
                                    sx={{
                                        aspectRatio: "9 / 16"
                                    }}
                                    cursor="grab"
                                />
                                :
                                <Image
                                    borderRadius={"2xl"}
                                    w={"210px"}
                                    h={"280px"}
                                    objectFit={'cover'}
                                    src={item.url}
                                    sx={{
                                        aspectRatio: "9 / 16"
                                    }}
                                    cursor="grab"
                                />
                            }
                        </Flex>
                    )
                })}
            </Flex>

            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                <ModalContent maxH={"100vh"} maxW={"100vw"}>
                    <Flex justify={"center"} position={"relative"} w="100vw" h={"100vh"} >
                        <Box
                            position={"absolute"}
                            bg={"black"}
                            onClick={handleClose}
                            zIndex={"2"}
                            w="100vw" h={"100vh"}></Box>
                        {mediaDisplay.type === 'video' ?
                            <Box
                                position={"absolute"}
                                w={"auto"}
                                h={"100%"}
                                as='video'
                                controls
                                src={mediaDisplay.url}
                                objectFit='contain'
                                zIndex={3}
                            />
                            :
                            <Image
                                position={"absolute"}
                                h="100%"
                                w="auto"
                                objectFit={'contain'}
                                src={mediaDisplay.url}
                                zIndex={"3"}
                            />
                        }
                        <CloseButton bg={"gray.800"}
                            fill="white"
                            position="absolute"
                            top={10}
                            left={10}
                            borderRadius="full"
                            // filter={"opacity(80%)"}
                            padding={"10px"}
                            size="xl"
                            cursor={"pointer"}
                            onClick={handleClose}
                            zIndex={3}
                        />
                    </Flex>

                </ModalContent>
            </Modal>
        </>
    )
}

export default Media