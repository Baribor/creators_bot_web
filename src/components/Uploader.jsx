import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from '../lib/firebaseConfig';
import VideocamIcon from '@mui/icons-material/Videocam';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { fileTypes } from '../lib/utils';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { audioDuration, uploadedContents, user, videoDuration } from '../states';

const getIcon = (type) => {
	if (type === fileTypes.VIDEO) {
		return (<VideocamIcon />)
	}
	if (type === fileTypes.IMAGE) {
		return <PhotoLibraryIcon />
	}
	if (type === fileTypes.AUDIO) {
		return <AudiotrackIcon />
	}
	if (type === fileTypes.FILE) {
		return <AttachFileIcon />
	}
}

export default function Uploader({ content }) {
	const [percent, setPercent] = useState(0);
	const setUploadedContents = useSetRecoilState(uploadedContents)
	const vidDur = useRecoilValue(videoDuration)
	const audDur = useRecoilValue(audioDuration)
	const currentUser = useRecoilValue(user);

	const handleUpload = useCallback(() => {
		const storageRef = ref(storage, `/${currentUser.id}/${content.type}/${content.id}`);

		// progress can be paused and resumed. It also exposes progress updates.
		// Receives the storage reference and the file to upload.
		const uploadTask = uploadBytesResumable(storageRef, content.file);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const percent = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);

				// update progress
				setPercent(percent);
			},
			(err) => console.log(err),
			() => {
				// download url
				getDownloadURL(uploadTask.snapshot.ref).then((url) => {
					const newContent = { type: content.type, url };
					if (content.type === fileTypes.VIDEO) {
						newContent.duration = vidDur
					}
					if (content.type === fileTypes.AUDIO) {
						newContent.duration = audDur
					}

					if (content.type === fileTypes.PREVIEW) {
						newContent.fileType = fileTypes.FILE;
					}
					setUploadedContents((cur) => [...cur, newContent])
				});
			}
		);
	}, []);

	useEffect(() => handleUpload(), [])

	return (
		<div>
			<span>{getIcon(content.type)}{content.file.name}</span>
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<Box sx={{ width: '100%', mr: 1 }}>
					<LinearProgress variant="determinate" value={percent} />
				</Box>
				<Box sx={{ minWidth: 35 }}>
					<Typography variant="body2" color="text.secondary">{`${Math.round(
						percent,
					)}%`}</Typography>
				</Box>
			</Box>
		</div>
	)
}