import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button"
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRecoilState, useRecoilValue } from "recoil";
import { BASE_URL, user } from "../states";
import * as yup from "yup"
import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";
import PermMediaIcon from '@mui/icons-material/PermMedia';
import { useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import Avatar from "@mui/material/Avatar";
import { USER_KEY } from "../lib/constsnts";
import { json } from "react-router-dom";
import { Link } from "@mui/material";


const validationSchema = yup.object({
	firstName: yup.string(),
	lastName: yup.string(),
	email: yup.string().email(),
	bio: yup.string(),
	iban: yup.string(),
})

function SettingsPage() {
	const currentUser = useRecoilValue(user)
	const [pic, setPic] = useState({ preview: currentUser.profilePic });

	const formik = useFormik({
		initialValues: {
			firstName: currentUser.profile?.firstName,
			lastName: currentUser.profile?.lastName,
			email: currentUser?.email,
			bio: currentUser?.bio,
			iban: currentUser?.iban
		},
		validationSchema,

		onSubmit: async (values) => {
			const formData = new FormData();
			formData.set("firstName", values.firstName);
			formData.set("lastName", values.lastName);
			formData.set("bio", values.bio);
			formData.set("iban", values.iban);
			formData.set("email", values.email);
			if (pic.file) {
				formData.set("avatar", pic.file, pic.file.name);
			}

			enqueueSnackbar({
				message: "Updating please wait...", variant: "info"
			})
			const data = await fetch(BASE_URL + "/creator", {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${currentUser?.token}`
				},
				body: formData
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

	const { getRootProps,
		getInputProps } = useDropzone({
			maxFiles: 1,
			accept: {
				'image/*': ['.png', '.jpeg', '.jpg']
			},

			onDrop: (acceptedFiles, rejection) => {
				if (rejection.length > 0) {
					enqueueSnackbar({
						message: "You can only select a single image", variant: "error"
					})
					return
				}
				const file = acceptedFiles[0];

				setPic({
					file,
					preview: URL.createObjectURL(file)
				})
			}
		})
	return (
		<div className="flex flex-col gap-3">
			<div className="flex gap-2">
				<p className="font-bold">Your ID:</p>
				<span>{currentUser?.id}</span>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<TextField label="First Name" name="firstName" value={formik.values.firstName} onChange={formik.handleChange} />
				<TextField label="Last Name" name="lastName" value={formik.values.lastName} onChange={formik.handleChange} />
			</div>

			<div className="flex flex-col gap-3">

				<TextField label="Email" name="email" value={formik.values.email} onChange={formik.handleChange} />

				<TextField label="Public bio" multiline maxRows={4} minRows={3} name="bio" value={formik.values.bio} onChange={formik.handleChange} />

				<div>
					<div {...getRootProps()} className="bg-blue-400 text-center rounded-full p-3 cursor-pointer">
						<input type="file" {...getInputProps()} />
						<span className="text-white font-bold"><PermMediaIcon /> Change profile pic</span>
					</div>

					<div className="inline-flex rounded-sm border mb-2 mr-2 w-24 h-24 p-1 box-border">
						<div className="flex min-w-0 overflow-hidden ">
							<img
								src={pic.preview}
								className="block w-auto h-full"
								// Revoke data uri after image is loaded
								onLoad={() => { URL.revokeObjectURL(pic.preview) }}
							/>
						</div>
					</div>

				</div>


				<span className="w-fit font-bold" >Payment</span>

				<TextField label="IBAN" name="iban" value={formik.values.iban} onChange={formik.handleChange} />

			</div>
			<div className="grid grid-cols-2 gap-4">
				<Button variant="text" sx={{ padding: { "sm": ".3rem", "lg": "1rem" } }} color="error" endIcon={<DeleteIcon />}>Delete Account</Button>
				<Button variant="contained" style={{ padding: "1rem" }} endIcon={<SaveIcon />} onClick={formik.handleSubmit}>SAVE</Button>
			</div>

		</div>
	)
}


const botLinkSettingsSchema = yup.object({
	token: yup.string().required("Bot token is required")
})

const botMessageSchema = yup.object({
	message: yup.string().required("Message cannot be empty")
})



function BotAccountSettings() {
	const [currentUser, setUser] = useRecoilState(user);
	const botLinkForm = useFormik({
		initialValues: {
			token: ""
		},
		validationSchema: botLinkSettingsSchema,
		onSubmit: async (values) => {
			enqueueSnackbar({
				message: "Please wait...", variant: "info"
			})

			try {
				const res = await fetch(BASE_URL + "/creatorHook/addBot", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${localStorage.getItem(USER_KEY)}`,
						"Content-Type": "application/json"
					},
					body: JSON.stringify(values)
				}).then(res => res.json());

				if (res.status) {
					enqueueSnackbar({
						message: "Account linked successfully", variant: "success"
					})
					setUser({ ...currentUser, bot: res.bot })
				} else {
					enqueueSnackbar({
						message: res.message, variant: "error"
					})
				}
			} catch (error) {
				enqueueSnackbar({
					message: "An error occurred", variant: "error"
				})
			}
		}
	})


	const botMessageForm = useFormik({
		initialValues: {
			message: currentUser.bot?.settings?.welcomeMessage ? currentUser.bot.settings?.welcomeMessage : ""
		},
		validationSchema: botMessageSchema,
		onSubmit: async (values) => {
			enqueueSnackbar({
				message: "Please wait...", variant: "info"
			})

			try {
				const res = await fetch(BASE_URL + "/creatorHook/setMessage", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${localStorage.getItem(USER_KEY)}`,
						"Content-Type": "application/json"
					},
					body: JSON.stringify(values)
				}).then(res => res.json());

				if (res.status) {
					enqueueSnackbar({
						message: res.message, variant: "success"
					})
				} else {
					enqueueSnackbar({
						message: res.message, variant: "error"
					})
				}
			} catch (error) {
				enqueueSnackbar({
					message: "An error occurred", variant: "error"
				})
			}
		}
	})


	const handleUnlink = async () => {
		enqueueSnackbar({
			message: "Please wait...", variant: "info"
		})
		const res = await fetch(BASE_URL + "/creatorHook/removeBot", {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${localStorage.getItem(USER_KEY)}`,
			},
		}).then(res => res.json())
			.catch(err => console.log(err))

		if (res?.status) {
			setUser({ ...currentUser, bot: null })
			enqueueSnackbar({
				message: "Bot successfully unlinked", variant: "success"
			})
		} else {
			enqueueSnackbar({
				message: "An error occurred", variant: "error"
			})
		}
	}


	return currentUser.bot ? (
		<Box textAlign={"start"}>
			<div className="flex items-center gap-2 font-bold">
				<Avatar src={"/bot.png"} /><Link underline="none" href={`https://t.me/${currentUser.bot.username}`} target="_blank">{currentUser.bot.username}</Link>
			</div>
			<div className="bg-red-400 hover:bg-red-500 text-white w-fit py-1 px-4 rounded-full mb-4 cursor-pointer active:scale-[.98] select-none" onClick={handleUnlink}>
				<span>Unlink Bot</span>
			</div>

			<TextField multiline minRows={3} maxRows={6} label="Auto-response message" fullWidth margin="dense" name="message" value={botMessageForm.values.message} error={botMessageForm.touched.message && Boolean(botMessageForm.errors.message)} helperText={botMessageForm.touched.message && botMessageForm.errors.message} onChange={botMessageForm.handleChange} />
			<Button variant="contained" onClick={botMessageForm.handleSubmit}>
				Set Message
			</Button>
		</Box>
	) : (
		<Box textAlign="start">
			<Typography>You have not linked any account yet</Typography>

			<div className="flex flex-col gap-1 mt-3">
				<TextField label="Bot token" fullWidth name="token" value={botLinkForm.values.token} onChange={botLinkForm.handleChange} error={botLinkForm.touched.token && Boolean(botLinkForm.errors.token)} helperText={botLinkForm.touched.token && botLinkForm.errors.token} />
				<Button variant="contained" sx={{ flexGrow: "1" }} onClick={botLinkForm.handleSubmit}>Link Account</Button>
			</div>
		</Box>
	)
}


function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};



function a11yProps(index) {
	return {
		id: `vertical-tab-${index}`,
		'aria-controls': `vertical-tabpanel-${index}`,
	};
}

export default function SettingsPageRoot() {
	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs
					value={value}
					onChange={handleChange}
					textColor="secondary"
					indicatorColor="secondary"
					aria-label="secondary tabs example"
				>
					<Tab label="Profile" {...a11yProps(0)} />
					<Tab label="Bot Account" {...a11yProps(1)} />
				</Tabs>
			</Box>


			<TabPanel value={value} index={0} ><SettingsPage /></TabPanel>
			<TabPanel value={value} index={1} ><BotAccountSettings /></TabPanel>
		</Box>
	);
}