import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import PermMediaIcon from '@mui/icons-material/PermMedia';
import { v4 } from "uuid";
import { fileTypes, useAddContent } from "../../lib/utils";
import { useRecoilValue } from "recoil";
import { contentData } from "../../states";
import { enqueueSnackbar } from "notistack";


export default function ImageInput() {
	const addContent = useAddContent()
	const contents = useRecoilValue(contentData)
	const [files, setFiles] = useState([])

	const {
		getRootProps,
		getInputProps
	} = useDropzone({
		maxFiles: 10,
		accept: {
			'image/*': ['.png', '.jpeg', '.gif', '.webp', '.svg']
		},
		onDrop: (acceptedFiles, rejection) => {
			if (rejection.length > 0) {
				enqueueSnackbar({
					message: "You can only select a max of 10 images", variant: "error"
				})
				return
			}

			acceptedFiles.forEach(file => addContent(file, fileTypes.IMAGE, v4()))
		}
	});

	useEffect(() => {
		setFiles(contents.filter(c => c.type === fileTypes.IMAGE).map(c => ({ ...c, preview: URL.createObjectURL(c.file) })))
		// Make sure to revoke the data uris to avoid memory leaks, will run on unmount
		return () => files.forEach(file => URL.revokeObjectURL(file.preview));
	}, [contents]);

	const thumbs = files.map(file => (
		<div className="inline-flex rounded-sm border mb-2 mr-2 w-24 h-24 p-1 box-border" key={file.id}>
			<div className="flex min-w-0 overflow-hidden">
				<img
					src={file.preview}
					className="block w-auto h-full"
					// Revoke data uri after image is loaded
					onLoad={() => { URL.revokeObjectURL(file.preview) }}
				/>
			</div>
		</div>
	));

	return (
		<div >
			<div {...getRootProps()} className="bg-blue-400 text-center rounded-full p-3 cursor-pointer">
				<input type="file" {...getInputProps()} />
				<span className="text-white font-bold"><PermMediaIcon /> Add images. Max (10)</span>
			</div>

			<aside className="flex flex-wrap mt-4">
				{thumbs}
			</aside>
		</div>
	)
}