import Box from '@mui/material/Box';
import LoadingGif from "../assets/loader.gif";

export default function Loader() {

	return (
		<div className="flex justify-center items-center h-full">
			<Box sx={{ display: 'flex' }}>
				<img src={LoadingGif} alt="loading" />
			</Box>
		</div>
	)
}