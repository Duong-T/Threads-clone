import { useState } from 'react'

const mulipleFile = () => {
    const [selectedFile, setSelectedFile] = useState([])
    const [previewFile, setPreviewFile] = useState([])

    const handleSelectedFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }
        const selectedFileArray = Array.from(e.target.files);

        const filesArray = selectedFileArray.map((file) => {
            return ({
                name: file.name,
                file: URL.createObjectURL(file),
                type: file.type
            })
        });
        setSelectedFile(selectedFileArray)

        setPreviewFile((previousFile) => previousFile.concat(filesArray));
    }
    const handleDeleteFile = (item) => {
        setPreviewFile(prev => prev?.filter(files => files !== item));
        setSelectedFile(prev => prev?.filter(files => files.name !== item.name));
    }
    return (
        { selectedFile, previewFile, handleSelectedFile, handleDeleteFile, setPreviewFile, setSelectedFile }
    )
}

export default mulipleFile