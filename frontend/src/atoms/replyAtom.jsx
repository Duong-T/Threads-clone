import { atom } from "recoil";

const replyAtom = atom({
    key: "replyAtom",
    default: [],
});

export default replyAtom;