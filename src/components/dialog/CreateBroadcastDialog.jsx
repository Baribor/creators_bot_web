import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { enqueueSnackbar } from 'notistack';
import { ADMIN_KEY } from '../../lib/constants';
import { BASE_URL } from '../../states';
import * as yup from "yup";
import { useFormik } from 'formik';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

const validationSchema = yup.object({
	message: yup.string().required("Reason is required").min(10, "Reason cannot be less than 10 characters"),
	target: yup.string(),
})

export default function CreateBroadcastDialog({ handleClose }) {

	const formik = useFormik({
		validationSchema,
		initialValues: {
			message: '',
			target: 'fans',
		},

		onSubmit: async ({ message, target }) => {
			enqueueSnackbar({
				message: "Please wait...", variant: "info"
			})

			const token = localStorage.getItem(ADMIN_KEY)
			const res = await fetch(BASE_URL + "/admin/broadcast", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					message,
					target
				})
			}).then(res => res.json()).catch(err => ({ message: "An error occurred" }))


			enqueueSnackbar({
				message: res.message, variant: res.status ? "success" : "error"
			})
			handleClose(res.status ? res.broadcast : false)
		}
	})


	return (
		<>
			<Dialog open={true}>
				<DialogTitle>New Broadcast Message</DialogTitle>
				<DialogContent>
					<InputLabel id="demo-simple-select-label">Target</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={formik.values.target}
						label="Age"
						name='target'
						onChange={formik.handleChange}
						variant='filled'
						sx={{
							minWidth: 150
						}}
					>
						<MenuItem value="fans">FANS</MenuItem>
						<MenuItem value="creators">CREATORS</MenuItem>
						<MenuItem value="all">ALL</MenuItem>
					</Select>
					<TextField
						autoFocus
						margin="dense"
						id="message"
						label="Message"
						fullWidth
						variant="filled"
						multiline
						minRows={5}
						maxRows={8}
						onChange={formik.handleChange}
						value={formik.values.message}
						error={formik.touched.message && Boolean(formik.errors.message)}
						helperText={formik.touched.message && formik.errors.message}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => handleClose()}>Cancel</Button>
					<Button onClick={formik.handleSubmit}>Send</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
