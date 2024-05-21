import {
  Menu,
  MenuButton,
  MenuList,
  useColorModeValue,
  IconButton,
  MenuItem,
  Divider
} from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import { useState } from 'react';
import ShowToast from './../hooks/ShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import postsAtom from './../atoms/postsAtom';
import replyAtom from './../atoms/replyAtom';
import { useParams } from 'react-router-dom';
import userAtom from './../atoms/userAtom';

const Options = ({ isPost, id, By }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [replys, setReplys] = useRecoilState(replyAtom);
  const param = useParams();
  const user = useRecoilValue(userAtom)
  const styleMenuIcon = {
    bg: useColorModeValue("white", "black"),
    py: '10px'
  }
  const toast = ShowToast();
  const handleDelete = async (e) => {
    e.preventDefault();
    if (isPost) {
      try {
        const res = await fetch(`/api/posts/${id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.message) {
          toast("Error", data.error, "error");
          return;
        }
        toast("Success", "Post deleted", "success");
        setPosts(posts.filter((p) => p._id !== id));
      } catch (error) {
        toast("Error", error, "error")
      }
    }
    if (!isPost) {
      try {
        const res = await fetch(`/api/reply/${id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.message) {
          toast("Error", data.error, "error");
          return;
        }
        toast("Success", "Reply deleted", "success");
        setReplys(replys.filter((r) => r._id !== id));
      } catch (error) {
        toast("Error", error, "error")
      }
    }
  }

  return (
    <Menu
      bg={useColorModeValue("black", "white")}
      color={useColorModeValue("white", "black")}
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <MenuButton
        as={IconButton}
        icon={<BsThreeDots />}
        aria-label="options"
        variant='unstyled'
        onClick={(e) => { e.preventDefault(), setIsOpen(!isOpen) }}
      >

      </MenuButton>

      {By !== user._id ?
        <MenuList
          pos={"absolute"}
          borderRadius={"1rem"}
          right={"-10"}
          display={'block'}
          minW={'174px'}
          p={'0'}
          bg="none">
          <MenuItem sx={styleMenuIcon} borderTopRadius={"1rem"}>
            Hide
          </MenuItem>
          <MenuItem sx={styleMenuIcon}>
            Not interested
          </MenuItem>
          <Divider />
          <MenuItem sx={styleMenuIcon}>
            Block
          </MenuItem>
          <MenuItem sx={styleMenuIcon} borderBottomRadius={"1rem"}>
            Mute
          </MenuItem>
        </MenuList>
        :
        <MenuList
          pos={"absolute"}
          borderRadius={"1rem"}
          right={"-10"}
          display={'block'}
          minW={'174px'}
          p={'0'}
          bg="none"
        >
          <MenuItem borderTopRadius={"1rem"} sx={styleMenuIcon}>
            Pin to profile
          </MenuItem>
          <Divider />
          <MenuItem sx={styleMenuIcon}>
            Hide like and share counts
          </MenuItem>
          <Divider />
          <MenuItem sx={styleMenuIcon}>
            Who can reply
          </MenuItem>
          <MenuItem
            borderBottomRadius={"1rem"}
            sx={styleMenuIcon}
            onClick={handleDelete}
            color="red"
          >
            Delete
          </MenuItem>
        </MenuList>
      }
    </Menu>
  )
}

export default Options