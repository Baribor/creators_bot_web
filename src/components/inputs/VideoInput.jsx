import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import VideoFileIcon from '@mui/icons-material/VideoFile';
import { fileTypes, formatDuration, useAddContent } from "../../lib/utils";
import { v4 } from "uuid";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { contentData, videoDuration } from "../../states";
import { enqueueSnackbar } from "notistack";


export default function VideoInput() {
	const [file, setFile] = useState()
	const addContent = useAddContent()
	const contents = useRecoilValue(contentData)
	const [videoContent, setVideoContent] = useState([])
	const setVideoDuration = useSetRecoilState(videoDuration)
	const vref = useRef()
	const {
		acceptedFiles,
		fileRejections,
		getRootProps,
		getInputProps
	} = useDropzone({
		maxFiles: 1,
		accept: {
			'video/*': ['.mp4', '.mpeg', '.3gp', '.webm']
		},

		onDrop: (acceptedFiles, rejection) => {
			if (rejection.length > 0) {
				enqueueSnackbar({
					message: "You can only select one video file", variant: "error"
				})
				return
			}
			addContent(acceptedFiles[0], fileTypes.VIDEO, v4())

		}
	});

	const setDuration = () => {
		const video = vref.current;
		if (!video) return;
		setVideoDuration(formatDuration(video.duration))
	}

	useEffect(() => {
		setVideoContent(contents.filter(c => c.type === fileTypes.VIDEO).map(c => ({ ...c, preview: URL.createObjectURL(c.file) })))
		return () => videoContent.forEach(c => URL.revokeObjectURL(c.preview))
	}, [contents])

	return (
		<div >
			<div {...getRootProps()} className="bg-blue-400 text-center rounded-full p-3 cursor-pointer">
				<input type="file" {...getInputProps()} />
				<span className="text-white font-bold"><VideoFileIcon /> Add video</span>
			</div>
			{
				videoContent.map(c => (
					<aside key={c.id} className="w-full rounded-md overflow-hidden mt-4 flex justify-center">
						<video src={c.preview} controls onLoadedMetadata={setDuration} ref={vref}></video>
					</aside>
				))

			}
		</div>
	)
}