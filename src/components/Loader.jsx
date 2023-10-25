import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loader() {

	return (
		<div className="flex justify-center items-center h-full">
			<Box sx={{ display: 'flex' }}>
				<CircularProgress size="5rem" />
			</Box>
		</div>
	)
}