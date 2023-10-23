import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button"

export default function CreatorSignup() {

	return (
		<div className="w-screen h-screen flex ">
			<div className="w-1/2 p-8 flex flex-col justify-center items-center gap-5">
				<h1 className="font-bold text-3xl mb-10">Creator Sign Up</h1>
				<TextField
					value='23443332'
					fullWidth
					disabled />
				<TextField
					label="Username"
					fullWidth />

				<Button variant="contained" style={{ width: "fit-content" }}>Sign up</Button>
			</div>

			<div className="w-1/2 bg-green-600">

			</div>
		</div>
	)
}