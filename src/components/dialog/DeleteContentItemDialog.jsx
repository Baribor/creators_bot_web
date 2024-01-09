import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { enqueueSnackbar } from 'notistack';
import { ADMIN_KEY, USER_KEY } from '../../lib/constants';
import { BASE_URL } from '../../states';
import { useState } from 'react';
import Loader from '../Loader';
import { getPublicId } from '../../lib/utils';


export default function DeleteContentItemDialog({ item, handleClose }) {

	const [deleting, setDeleting] = useState(false)

	const handleConfirm = async () => {

		setDeleting(true);

		const token = sessionStorage.getItem(USER_KEY)
		const res = await fetch(`${BASE_URL}/contentItem?${new URLSearchParams({
			itemId: item.id,
			itemType: item.type,
			public_id: getPublicId(item.url),
			previewType: item.previewType
		})}`, {
			headers: {
				Authorization: `Bearer ${token}`
			},
			method: "DELETE"
		}).then(res => res.json()).catch(err => ({ message: "An error occurred" }))


		enqueueSnackbar({
			message: res.message, variant: res.status ? "success" : "error"
		})
		handleClose(res.status ? item : false)
		setDeleting(false);
	}

	return (
		<>
			<Dialog open={true}>
				<DialogTitle>Delete content</DialogTitle>
				<DialogContent>
					{
						deleting ? (
							<Loader />
						) : (
							<DialogContentText>
								This action is unrecoverable. <br />
								This content will be deleted permanently.
							</DialogContentText>
						)
					}

				</DialogContent>
				<DialogActions>
					<Button onClick={() => handleClose()} disabled={deleting}>Cancel</Button>
					<Button onClick={handleConfirm} variant='success' disabled={deleting}>Confirm</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
