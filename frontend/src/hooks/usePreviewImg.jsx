import { useState } from 'react';
import ShowToast from './ShowToast';

const usePreviewImg = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imgUrl, setImgUrl] = useState(null);
    const toast = ShowToast();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            setSelectedFile(file);
            reader.onloadend = () => {
                setImgUrl(reader.result);
            }

            reader.readAsDataURL(file);
        } else {
            toast("Invalid file type", "Please select an image file", "error");
            setImgUrl(null);
        }
    };
    return {
        handleImageChange, imgUrl, selectedFile
    }
}

export default usePreviewImg