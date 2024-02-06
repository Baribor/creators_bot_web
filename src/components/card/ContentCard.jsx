import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import VideocamIcon from '@mui/icons-material/Videocam';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { v4 } from 'uuid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import ConfirmContentDeletion from '../dialog/ConfirmContentDelete';
import { useNavigate } from 'react-router-dom';
import { formatFilesToDurations } from '../../lib/utils';


export default function ContentCard({ content, handleDeleted, isUser = false }) {

	const [dialog, setDialog] = useState(false)
	const navigate = useNavigate();

	const getContentDetails = () => {
		const contents = [];

		if (content.video.length > 0) {
			contents.push(<div key={v4()} className='text-start flex gap-2'>
				<VideocamIcon />
				<span>Video [{content.video.length}] ({formatFilesToDurations(content.video)})</span>
			</div>)
		}
		if (content.audio.length > 0) {
			contents.push(<div key={v4()} className='text-start flex gap-2'>
				<AudiotrackIcon />
				<span>Audio [{content.audio.length}] ({formatFilesToDurations(content.audio)})</span>
			</div>)
		}

		if (content.images.length > 0) {
			contents.push(
				<div key={v4()} className='text-start flex gap-2'>
					<PhotoLibraryIcon />
					<span>Photo [{content.images.length}]</span>
				</div>
			)
		}

		if (content.files.length > 0) {
			contents.push(
				<div key={v4()} className='text-start flex gap-2'>
					<AttachFileIcon />
					<span>Files [{content.files.length}]</span>
				</div>
			)
		}

		return contents;
	}

	const handleDetailsClicked = (content) => {
		navigate("details", {
			state: {
				content,
			}
		})
	}

	const handleClose = (status) => {
		if (status) {
			handleDeleted(content);
		}
		setDialog(false)
	}

	const handleCopy = () => {
		navigator.clipboard.writeText(`https://${location.hostname}/content/${content.id}`).then(() => {
			enqueueSnackbar({
				message: "Link copied to clipboard", variant: "success"
			})
		}).catch(() => {
			enqueueSnackbar({
				message: "Failed to copy link", variant: "error"
			})
		})
	}

	return (
		<div className='relative'>
			<Card sx={{ width: 280, position: "relative", height: "100%" }}>
			<CardMedia
				sx={{ height: 180 }}
					image={content.preview?.type === "image" ? content.preview.url : "/locked-file.jpg"}
					title={content.description}
			/>
			<CardContent>
				<div className='flex justify-between font-bold text-blue-600 mb-4'>
					<span>Content: #{content.id}</span>
						{
							content.plan_id ? (
								<span>Plan based</span>
							) : (<span>€ {content.price}</span>)
						}
				</div>
				<Typography gutterBottom variant="h6" component="div" sx={{ textAlign: "start", fontSize: "1rem", fontWeight: "bold" }} >
					Contents:
				</Typography>
				{
					getContentDetails()
				}
				<div className='mt-10 text-start'>
					<p>
						{content.description}
					</p>
				</div>
			</CardContent>
				<Tooltip title="Copy link">
					<div className='text-white bg-black w-fit h-fit rounded-full absolute top-0 right-0 m-2 bg-opacity-[65]'>
						<IconButton onClick={handleCopy} color='inherit'>
							<ContentCopyIcon />
						</IconButton>
					</div>
			</Tooltip>


		</Card>
			<div className='flex p-1 gap-4'>
				<span className='bg-blue-600 text-white px-4 rounded-lg cursor-pointer' onClick={() => {
					handleDetailsClicked(content)
				}}>View</span>

				<span className='bg-red-400 text-white px-4 rounded-lg cursor-pointer' onClick={() => {
					setDialog(true)
				}}>Delete</span>
			</div>

			{
				dialog && <ConfirmContentDeletion handleClose={handleClose} contentId={content.id} isUser={isUser} />
			}
		</div>

	)
}