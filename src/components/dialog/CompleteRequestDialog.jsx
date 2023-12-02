import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { enqueueSnackbar } from 'notistack';
import { ADMIN_KEY } from '../../lib/constants';
import { BASE_URL } from '../../states';


export default function CompleteRequestDialog({ id, handleClose }) {

	const handleConfirm = async () => {
		enqueueSnackbar({
			message: "Please wait...", variant: "info"
		})

		const token = localStorage.getItem(ADMIN_KEY)
		const res = await fetch(BASE_URL + "/admin/complete_request?" + new URLSearchParams({ request_id: id }), {
			headers: {
				Authorization: `Bearer ${token}`
			}
		}).then(res => res.json()).catch(err => ({ message: "An error occurred" }))


		enqueueSnackbar({
			message: res.message, variant: res.status ? "success" : "error"
		})
		handleClose(res.status ? true : false)
	}

	return (
		<>
			<Dialog open={true}>
				<DialogTitle>Complete Request</DialogTitle>
				<DialogContent>
					<DialogContentText>
						You confirm that this payment request has been processed.
					</DialogContentText>

				</DialogContent>
				<DialogActions>
					<Button onClick={() => handleClose()}>Cancel</Button>
					<Button onClick={handleConfirm} variant='success'>Confirm</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
