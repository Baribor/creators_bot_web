import ContentCard from "../components/card/ContentCard";
import { useParams } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as yup from "yup";
import { useFormik } from 'formik';
import { BASE_URL } from "../states";
import { useCallback, useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import LoadingScreen from "../components/LoadingScreen";
import Box from "@mui/material/Box";
import { USER_KEY } from "../lib/constants";


const Content = () => {
	const [contents, setContents] = useState([]);
	const [fetching, setFetching] = useState(false);


	const handleDeleted = (c) => {
		setContents((cur) => cur.filter(k => k.id !== c.id))
	}

	const fetchContents = useCallback(async () => {
		setFetching(true)
		const token = sessionStorage.getItem(USER_KEY);

		const res = await fetch(BASE_URL + "/contents", {
			headers: {
				Authorization: `Bearer ${token}`,
			}
		})
			.then(res => res.json()).catch(err => console.log(err))

		if (res.status) {
			setContents(res.contents);
		} else {
			enqueueSnackbar({
				message: "error fetching contents", variant: "error",
			});
		}

		setFetching(false);
	}, [])

	useEffect(() => {
		fetchContents()
	}, [])



	return fetching ?
		(<LoadingScreen open={true} />)
		:
		(
			<Box sx={{ p: 3 }}>
				{
					contents?.length > 0 ?
						(
							<div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(280px,280px))] gap-4 items-center md:gap-8">
								{
									contents.map((c) => <ContentCard key={c.id} content={c} handleDeleted={handleDeleted} isUser={true} />)
								}
							</div>
						) : (
							<div className="font-bold text-2xl">
								<h3>You don&apos;t have any content yet.</h3>
							</div>
						)
				}
			</Box>
		)
}

const validationSchema = yup.object({
	otp: yup.string().required("OTP is required")
})

const AuthorizeView = ({ handleAuthorized }) => {
	const { creatorId } = useParams();

	const formik = useFormik({
		initialValues: {
			otp: ""
		},
		validationSchema,

		onSubmit: async ({ otp }) => {

			const res = await fetch(BASE_URL + "/verifyOTP", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					otp,
					creatorId
				})
			}).then(res => res.json()).catch(err => console.log(err))

			if (res.status) {
				sessionStorage.setItem(USER_KEY, res.token);
				handleAuthorized(true)
				return
			}
			enqueueSnackbar({
				message: "Inavlid OTP", variant: "error", autoHideDuration: 2000
			})
			handleAuthorized(false)
		}
	})

	const sendOtp = useCallback(async () => {
		await fetch(BASE_URL + "/sendOTP", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ creatorId })
		})
	}, [])

	useEffect(() => {
		sendOtp()
	}, [])

	return (
		<div>
			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={open}
			>
				<Dialog open={true}>
					<DialogTitle>Authentication</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Enter the OTP sent to you on Telegram
						</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="otp"
							label="OTP"							fullWidth
							variant="standard"
							onChange={formik.handleChange}
							value={formik.values.otp}
							error={formik.touched.otp && Boolean(formik.errors.otp)}
							helperText={formik.touched.otp && formik.errors.otp}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={formik.handleSubmit}>Confirm</Button>
					</DialogActions>
				</Dialog>
			</Backdrop>
		</div>
	)
}

export default function MyContentsPage() {
	const [authorized, setAuthorized] = useState(sessionStorage.getItem(USER_KEY));

	const handleAuthorized = (isAuthorized) => {
		setAuthorized(isAuthorized);
	}

	return authorized ?
		(<Content />)
		:
		(
			<AuthorizeView handleAuthorized={handleAuthorized} />
	)
}