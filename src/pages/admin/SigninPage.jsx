import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button"
import * as yup from "yup"
import { useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import { ADMIN_KEY } from '../../lib/constants';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../states';

const validationSchema = yup.object({
	email: yup.string().email().required("Email cannot be empty"),
	password: yup.string().required("Password cannot be empty")
})

export default function AdminSignIn() {
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			email: "",
			password: ""
		},
		validationSchema,
		onSubmit: async (values) => {
			const res = await fetch(BASE_URL + "/auth/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(values)
			}).then(res => res.json())

			if (!res.status) {
				enqueueSnackbar({
					message: res.message, variant: "error"
				})
				return;
			}

			localStorage.setItem(ADMIN_KEY, res.token);
			navigate("/admin", {
				replace: true
			})
		}
	})
	return (
		<div className='h-screen w-screen flex justify-center items-center'>
			<Paper elevation={3}>
				<div className='flex flex-col p-10 gap-3 w-[90vw] md:w-[50vw]'>
					<h1 className='font-bold text-xl'>ADMINISTRATION</h1>
					<TextField label="Email" type='email' helperText={formik.touched.email && formik.errors.email}
						error={formik.touched.email && Boolean(formik.errors.email)}
						value={formik.values.email}
						onChange={formik.handleChange} name="email" />
					<TextField label="Password" type='password' name='password'
						helperText={formik.touched.password && formik.errors.password}
						error={formik.touched.password && Boolean(formik.errors.password)}
						value={formik.values.password}
						onChange={formik.handleChange} />

					<Button variant='contained' sx={{
						width: "fit-content", alignSelf: "center", paddingX: "2rem"
					}} onClick={formik.handleSubmit}>Login</Button>
				</div>

			</Paper>
		</div>

	)
}