import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import VideocamIcon from '@mui/icons-material/Videocam';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { useRecoilValue } from 'recoil';
import { audioDuration, contentData, description, price, videoDuration } from '../states';
import { fileTypes } from '../lib/utils';
import { v4 } from 'uuid';

export default function Preview({ activeStep }) {
	const contents = useRecoilValue(contentData)
	const desc = useRecoilValue(description)
	const contentPrice = useRecoilValue(price)
	const vidDur = useRecoilValue(videoDuration)
	const audDur = useRecoilValue(audioDuration)

	if (activeStep !== 2) {
		return null;
	}

	const getContentDetails = () => {


		const details = contents.map((c) => {
			if (c.type === fileTypes.VIDEO) {
				return <div key={c.id} className='text-start flex gap-2'>
					<VideocamIcon />
					<span>Video ({vidDur})</span>
				</div>
			} else if (c.type === fileTypes.AUDIO) {
				return <div key={c.id} className='text-start flex gap-2'>
					<AudiotrackIcon />
					<span>Audio ({audDur})</span>
				</div>
			}
		})

		const images = contents.filter(c => c.type === fileTypes.IMAGE)
		const files = contents.filter(c => c.type === fileTypes.FILE)
		if (images.length > 0) {
			details.push(
				<div key={v4()} className='text-start flex gap-2'>
					<PhotoLibraryIcon />
					<span>Photo ({images.length})</span>
				</div>
			)
		}

		if (files.length > 0) {
			details.push(
				<div key={v4()} className='text-start flex gap-2'>
					<AttachFileIcon />
					<span>Files ({files.length})</span>
				</div>
			)
		}

		return details
	}

	return (
		<div className='flex justify-center'>
			<Card sx={{ width: 320 }}>
				<CardMedia
					sx={{ height: 280 }}
					image="/locked-file.jpg"
					title="green iguana"
				/>
				<CardContent>
					<div className='text-end font-bold text-blue-600'>
						<span>€ {contentPrice}</span>
					</div>
					<Typography gutterBottom variant="h6" component="div" sx={{ textAlign: "start" }} >
						Contents:
					</Typography>
					{
						getContentDetails()
					}
					<div className='mt-10 text-start'>
						<p>
							{desc}
						</p>
					</div>
				</CardContent>

			</Card>
		</div>
	)
}