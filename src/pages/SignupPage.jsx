import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button"
import { useRecoilState } from "recoil";
import { BASE_URL, user } from "../states";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import FormControl from "@mui/material/FormControl";


const validationSchema = yup.object({
	username: yup.string().required("Username is required"),
})


export default function CreatorSignup() {
	const [currentUser, setUser] = useRecoilState(user)
	const navigate = useNavigate()

	const handleSubmit = async (username) => {
		console.log("Callled")
		const res = await fetch(BASE_URL + "/creator", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				...currentUser,
				username,
			})
		}).then(res => res.json())

		if (res.status) {
			setUser(res.user)
			navigate("/home")
			enqueueSnackbar({
				message: "Account created successfully", variant: "success"
			})
		} else {
			enqueueSnackbar({
				message: res.message,
				variant: "error"
			})
		}
		formik.setSubmitting(false)
	}

	const formik = useFormik({
		initialValues: {
			username: currentUser?.username?.toLowerCase() || "",
		},
		validationSchema,
		onSubmit: (values) => {
			handleSubmit(values.username)
		},
	})

	useEffect(() => {
		if (currentUser?.token) {
			navigate("/home")
		}
	}, [])
	return (
		<div className="w-screen h-screen flex ">
			<div className="w-1/2 p-8 flex items-center">

				<FormControl fullWidth className="flex flex-col justify-center items-center gap-5">
					<h1 className="font-bold text-3xl mb-10">Creator Sign Up</h1>
					<TextField
						fullWidth
						disabled
						defaultValue={currentUser.id} label="ID" />
					<TextField
						label="Username"
						fullWidth
						value={formik.values.username}
						onChange={formik.handleChange}
						required
						error={formik.touched.username && Boolean(formik.errors.username)}
						helperText={formik.touched.username && formik.errors.username}
						name="username"
					/>

					<Button variant="contained" style={{ width: "fit-content" }} onClick={formik.handleSubmit}>Sign up</Button>
				</FormControl>

			</div>

			<div className="w-1/2 bg-green-600">

			</div>
		</div>
	)
}