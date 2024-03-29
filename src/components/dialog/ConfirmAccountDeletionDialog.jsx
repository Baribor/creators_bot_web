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


export default function ConfirmAccountDeletion({ handleClose, account, type, children, title }) {
	const [loading, setLoading] = useState(false);

	const handleConfirm = async () => {
		setLoading(true);

		const path = {
			"customer": `customers?customer_id=${account.id}`,
			"creator": `creator?creator_id=${account.id}`,
			"ban": `creator`,
			"unban": `creator`,
		}

		const methods = {
			"customer": "DELETE",
			"creator": "DELETE",
			"ban": "PUT",
			"unban": "POST",
		}
		const token = localStorage.getItem(ADMIN_KEY)

		const payload = {
			headers: {
				Authorization: `Bearer ${token}`
			},
			method: methods[type]
		}

		if (['ban', 'unban'].includes(type)) {
			payload.body = JSON.stringify({
				creator_id: account.id
			})
			payload.headers['Content-Type'] = 'application/json';
		}

		const res = await fetch(`${BASE_URL}/admin/${path[type]}`, payload).then(res => res.json()).catch(err => ({ message: "An error occurred" }))


		enqueueSnackbar({
			message: res.message, variant: res.status ? "success" : "error"
		})

		if (res.status) {
			handleClose({ ...account, ...res });
		} else {
			handleClose(false)
		}
		setLoading(false)
	}

	return (
		<>
			<Dialog open={true}>
				<DialogTitle>{title}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{children}
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
