import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import VideocamIcon from '@mui/icons-material/Videocam';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { v4 } from 'uuid';


export default function VisitorContentCard({ content }) {

	const getContentDetails = () => {
		const contents = [];

		if (content.video) {
			contents.push(<div key={v4()} className='text-start flex gap-2'>
				<VideocamIcon />
				<span>Video ({content.video.duration})</span>
			</div>)
		}
		if (content.audio) {
			contents.push(<div key={v4()} className='text-start flex gap-2'>
				<AudiotrackIcon />
				<span>Audio ({content.audio.duration})</span>
			</div>)
		}

		if (content.images) {
			contents.push(
				<div key={v4()} className='text-start flex gap-2'>
					<PhotoLibraryIcon />
					<span>Photo ({content.images})</span>
				</div>
			)
		}

		if (content.files) {
			contents.push(
				<div key={v4()} className='text-start flex gap-2'>
					<AttachFileIcon />
					<span>Files ({content.files})</span>
				</div>
			)
		}

		return contents;
	}

	return (
		<Card sx={{ width: 280, position: "relative" }}>
			<CardMedia
				sx={{ height: 180 }}
				image="/locked-file.jpg"
				title="green iguana"
			/>
			<CardContent>
				<div className='flex justify-between font-bold text-blue-600 mb-4'>
					<span>Content: #{content.id}</span>
					<span>€ {content.price}</span>
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
		</Card>
	)
}