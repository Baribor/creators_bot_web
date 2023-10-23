import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button"
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';


export default function SettingsPage() {

	return (
		<div className="flex flex-col gap-3">
			<div className="flex gap-2">
				<p className="font-bold">Your ID:</p>
				<span>182727383</span>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<TextField label="First Name" />
				<TextField label="Last Name" />
			</div>
			<div className="flex flex-col gap-3">
				<TextField label="Email" />
				<TextField label="Public bio" multiline maxRows={4} minRows={3} />
				<span className="w-fit">Profile Pic</span>
				<TextField type="file" />
				<span className="w-fit font-bold">Payment</span>
				<TextField label="IBAN" />

			</div>
			<div className="grid grid-cols-2 gap-4">
				<Button variant="text" style={{ padding: "1rem" }} color="error" endIcon={<DeleteIcon />}>Delete Account</Button>
				<Button variant="contained" style={{ padding: "1rem" }} endIcon={<SaveIcon />}>SAVE</Button>
			</div>

		</div>
	)
}