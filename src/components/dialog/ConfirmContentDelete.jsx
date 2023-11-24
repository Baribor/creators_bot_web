import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { enqueueSnackbar } from 'notistack';
import { USER_KEY } from '../../lib/constants';
import { BASE_URL } from '../../states';
import { useState } from 'react';


export default function ConfirmContentDeletion({ handleClose, contentId }) {

	const [deleting, setDeleting] = useState(false)

	const handleConfirm = async () => {
		enqueueSnackbar({
			message: "Please wait...", variant: "info"
		})
		setDeleting(true);
		const token = sessionStorage.getItem(USER_KEY)
		const res = await fetch(BASE_URL + "/content?contentId=" + `${contentId}`, {
			headers: {
				Authorization: `Bearer ${token}`
			},
			method: "DELETE"
		}).then(res => res.json()).catch(err => ({ message: "An error occurred" }))


		enqueueSnackbar({
			message: res.message, variant: res.status ? "success" : "error"
		})
		handleClose(res.status ? true : false)
	}

	return (
		<>
			<Dialog open={true}>
				<DialogTitle>Delete content</DialogTitle>
				<DialogContent>
					<DialogContentText>
						This action is unrecoverable. <br />
						This content will be deleted permanently.
					</DialogContentText>

				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} disabled={deleting}>Cancel</Button>
					<Button onClick={handleConfirm} variant='success' disabled={deleting}>Confirm</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
