import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useParams } from 'react-router-dom';


export default function FileContent({ file, index }) {
	const { content_id } = useParams();
	return (
		<div className="flex gap-4 justify-start border-b mb-2 w-full">
			<span className="font-semibold border-b text-blue-700">{`File ${index}`}</span>
			<a href={file.url} download={`content_${content_id}_file${index}`} target="_blank" rel="noreferrer">
				<FileDownloadIcon />
			</a>
		</div>
	)
}