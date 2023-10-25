import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button"
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRecoilValue } from "recoil";
import { BASE_URL, user } from "../states";
import * as yup from "yup"
import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";


const validationSchema = yup.object({
	firstName: yup.string(),
	lastName: yup.string(),
	email: yup.string().email(),
	bio: yup.string(),
	iban: yup.string(),
})

export default function SettingsPage() {
	const currentUser = useRecoilValue(user)

	const formik = useFormik({
		initialValues: {
			firstName: currentUser?.firstName,
			lastName: currentUser?.lastName,
			email: currentUser?.email,
			bio: currentUser?.bio,
			iban: currentUser?.iban
		},
		validationSchema,

		onSubmit: async (values) => {
			const data = await fetch(BASE_URL + "/creator", {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${currentUser?.token}`
				},
				body: JSON.stringify(values)
			}).then(res => res.json())

			if (data.status) {
				enqueueSnackbar({
					message: data.message, variant: "success"
				})
			} else {
				enqueueSnackbar({
					message: data.message, variant: "error"
				})
			}
		}
	})
	return (
		<div className="flex flex-col gap-3">
			<div className="flex gap-2">
				<p className="font-bold">Your ID:</p>
				<span>{currentUser?.id}</span>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<TextField label="First Name" name="firstName" value={formik.values.firstName} onChange={formik.handleChange} />
				<TextField label="Last Name" name="lastName" value={formik.values.lastName} onChange={formik.handleChange} />
			</div>
			<div className="flex flex-col gap-3">
				<TextField label="Email" name="email" value={formik.values.email} onChange={formik.handleChange} />
				<TextField label="Public bio" multiline maxRows={4} minRows={3} name="bio" value={formik.values.bio} onChange={formik.handleChange} />
				<span className="w-fit">Profile Pic</span>
				<TextField type="file" />
				<span className="w-fit font-bold" >Payment</span>
				<TextField label="IBAN" name="iban" value={formik.values.iban} onChange={formik.handleChange} />

			</div>
			<div className="grid grid-cols-2 gap-4">
				<Button variant="text" style={{ padding: "1rem" }} color="error" endIcon={<DeleteIcon />}>Delete Account</Button>
				<Button variant="contained" style={{ padding: "1rem" }} endIcon={<SaveIcon />} onClick={formik.handleSubmit}>SAVE</Button>
			</div>

		</div>
	)
}