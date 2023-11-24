import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { enqueueSnackbar } from 'notistack';
import { ADMIN_KEY, USER_KEY } from '../../lib/constants';
import { BASE_URL } from '../../states';


export default function ConfirmAccountDeletion({ handleClose }) {

	const handleConfirm = async () => {
		enqueueSnackbar({
			message: "Please wait...", variant: "info"
		})

		const token = localStorage.getItem(USER_KEY)
		const res = await fetch(BASE_URL + "/creator", {
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
				<DialogTitle>Delete Account</DialogTitle>
				<DialogContent>
					<DialogContentText>
						This action is unrecoverable. <br />
						All your generated data will be lost, however we will retain your id in some sections for the continual functionality of our system.
					</DialogContentText>

				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleConfirm} variant='success'>Confirm</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
