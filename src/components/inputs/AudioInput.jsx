import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import AudioFileIcon from '@mui/icons-material/AudioFile';
import Uploader from "../Uploader";
import { fileTypes, formatDuration, useAddContent } from "../../lib/utils";
import { v4 } from "uuid";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { audioDuration, contentData } from "../../states";
import { enqueueSnackbar } from "notistack";


export default function AudioInput() {
	const [file, setFile] = useState();
	const addContent = useAddContent();
	const contents = useRecoilValue(contentData);
	const [audioContent, setAudioContent] = useState([]);
	const setAudioDuration = useSetRecoilState(audioDuration);
	const aref = useRef()

	const {
		acceptedFiles,
		fileRejections,
		getRootProps,
		getInputProps
	} = useDropzone({
		maxFiles: 1,
		accept: {
			'audio/*': ['.mp3', '.wav', '.oga']
		},

		onDrop: (acceptedFiles, rejection) => {
			if (rejection.length > 0) {
				enqueueSnackbar({
					message: "You can only select one audio file", variant: "error"
				})
				return
			}
			addContent(acceptedFiles[0], fileTypes.AUDIO, v4())
			setFile(Object.assign(acceptedFiles[0], {
				preview: URL.createObjectURL(acceptedFiles[0])
			}))
		}
	});

	const setDuration = () => {
		const audio = aref.current;
		if (!audio) return;
		setAudioDuration(formatDuration(audio.duration))
	}

	useEffect(() => {
		setAudioContent(contents.filter(c => c.type === fileTypes.AUDIO).map(c => ({ ...c, preview: URL.createObjectURL(c.file) })))
		return () => audioContent.forEach(c => URL.revokeObjectURL(c.preview))
	}, [contents])

	return (
		<div >
			<div {...getRootProps()} className="bg-blue-400 text-center rounded-full p-3 cursor-pointer">
				<input type="file" {...getInputProps()} />
				<span className="text-white font-bold"><AudioFileIcon /> Add audio</span>
			</div>
			{
				audioContent.map(c => (
					<aside key={c.id} className="mt-4">
						<audio src={c.preview} controls className="w-full" ref={aref} onLoadedMetadata={setDuration}></audio>
					</aside>
				))

			}
		</div>
	)
}