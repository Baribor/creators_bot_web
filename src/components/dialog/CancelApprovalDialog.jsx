import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { enqueueSnackbar } from 'notistack';
import { ADMIN_KEY } from '../../lib/constants';
import { BASE_URL } from '../../states';
import * as yup from "yup";
import { useFormik } from 'formik';

const validationSchema = yup.object({
	reason: yup.string().required("Reason is required").min(10, "Reason cannot be less than 10 characters")
})

export default function CancelApprovalDialog({ creatorId, handleClose }) {

	const formik = useFormik({
		validationSchema,
		initialValues: {
			reason: '',
		},

		onSubmit: async ({ reason }) => {
			enqueueSnackbar({
				message: "Please wait...", variant: "info"
			})

			const token = localStorage.getItem(ADMIN_KEY)
			const res = await fetch(BASE_URL + "/admin/reject", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					creatorId,
					reason
				})
			}).then(res => res.json()).catch(err => ({ message: "An error occurred" }))


			enqueueSnackbar({
				message: res.message, variant: res.status ? "success" : "error"
			})
			handleClose(res.status ? true : false)
		}
	})


	return (
		<>
			<Dialog open={true}>
				<DialogTitle>Disapprove Verification</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please enter the reason for disapproving this request.<br />This message will be sent to the creator
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="reason"
						label="Message"
						fullWidth
						variant="filled"
						multiline
						minRows={2}
						maxRows={5}
						onChange={formik.handleChange}
						value={formik.values.reason}
						error={formik.touched.reason && Boolean(formik.errors.reason)}
						helperText={formik.touched.reason && formik.errors.reason}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => handleClose()}>Cancel</Button>
					<Button onClick={formik.handleSubmit}>Confirm</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
