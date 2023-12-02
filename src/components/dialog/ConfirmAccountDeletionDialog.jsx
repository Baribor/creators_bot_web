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


export default function ConfirmAccountDeletion({ handleClose, creatorId, type }) {
	const [loading, setLoading] = useState(false);

	const handleConfirm = async () => {
		setLoading(true);
		const token = localStorage.getItem(ADMIN_KEY)
		const res = await fetch(BASE_URL + (type === "customer" ? `/admin/customers?customer_id=${creatorId}` : `/admin/creator?creator_id=${creatorId}`), {
			headers: {
				Authorization: `Bearer ${token}`
			},
			method: "DELETE"
		}).then(res => res.json()).catch(err => ({ message: "An error occurred" }))


		enqueueSnackbar({
			message: res.message, variant: res.status ? "success" : "error"
		})
		handleClose(res.status ? creatorId : false)
		setLoading(false)
	}

	return (
		<>
			<Dialog open={true}>
				<DialogTitle>Delete Account</DialogTitle>
				<DialogContent>
					<DialogContentText>
						This action is unrecoverable. <br />
						All generated data belonging to this account will be lost.
					</DialogContentText>

				</DialogContent>
				<DialogActions>
					<Button onClick={() => handleClose()} disabled={loading}>Cancel</Button>
					<Button onClick={handleConfirm} variant='success' disabled={loading}>Confirm</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
