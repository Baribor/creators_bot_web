import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { enqueueSnackbar } from 'notistack';
import { ADMIN_KEY } from '../../lib/constants';
import { BASE_URL } from '../../states';
import { useState } from 'react';
import Loader from '../Loader';


export default function ApproveCreator({ handleClose, creatorId, title, body, path }) {

	const [loading, setLoading] = useState(false)

	const handleConfirm = async () => {
		setLoading(true);
		const token = localStorage.getItem(ADMIN_KEY);

		const res = await fetch(BASE_URL + `/admin/${path}?creatorId=${creatorId}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		}).then(res => res.json()).catch(err => ({ message: "Connection error" }));

		enqueueSnackbar({
			message: res.message, variant: res.status ? "success" : "error"
		});

		if (res.status) {
			handleClose(true);
		}
		setLoading(false);
		//handleClose(res.status ? contentId : false)
	}

	return (
		<>
			<Dialog open={true}>
				<DialogTitle>{title}</DialogTitle>
				<DialogContent>
					{
						loading ? (<Loader />) : (<DialogContentText>
							{body}
						</DialogContentText>)
					}

				</DialogContent>
				<DialogActions>
					<Button onClick={() => handleClose()} disabled={loading}>Cancel</Button>
					<Button onClick={handleConfirm} variant='success' disabled={loading}>Confirm</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
