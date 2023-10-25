
import { useDropzone } from "react-dropzone";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { fileTypes, useAddContent } from "../../lib/utils";
import { v4 } from "uuid";
import { useRecoilValue } from "recoil";
import { contentData } from "../../states";
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";

export default function FileInput() {
	const addContent = useAddContent()
	const contents = useRecoilValue(contentData)
	const [fileContent, setFileContent] = useState([])
	const {
		acceptedFiles,
		fileRejections,
		getRootProps,
		getInputProps
	} = useDropzone({
		maxFiles: 5,

		onDrop: (acceptedFiles, rejection) => {
			if (rejection.length > 0) {
				enqueueSnackbar({
					message: "You can only select a max of 5 files", variant: "error"
				})
				return
			}
			acceptedFiles.forEach(file => addContent(file, fileTypes.FILE, v4()))
		}
	});


	useEffect(() => {
		setFileContent(contents.filter(c => c.type === fileTypes.FILE).map(c => ({ ...c, preview: URL.createObjectURL(c.file) })))
		return () => fileContent.forEach(c => URL.revokeObjectURL(c.preview))
	}, [contents])

	return (
		<div >
			<div {...getRootProps()} className="bg-blue-400 text-center rounded-full p-3 cursor-pointer">
				<input type="file" {...getInputProps()} />
				<span className="text-white font-bold"><AttachFileIcon />Add Files. Max (5)</span>
			</div>

			<aside className="mt-4">

				<ul className="flex flex-col gap-1">
					{
						fileContent.map(c => (
							<li key={c.id} className="cursor-pointer hover:bg-blue-200 rounded-full p-2">
								<AttachFileIcon />
								{c.file.name} - {c.file.size} bytes
							</li>
						))
					}
				</ul>

			</aside>
		</div>
	)
}