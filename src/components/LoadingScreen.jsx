
import Backdrop from '@mui/material/Backdrop';
import Loader from './Loader';

export default function LoadingScreen({ open }) {
	return (
		<div>
			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={open}
			>
				<Loader />
			</Backdrop>
		</div>
	);
}
