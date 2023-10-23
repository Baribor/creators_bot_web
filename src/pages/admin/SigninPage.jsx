import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button"
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useState } from 'react';

export default function AdminSignIn() {
	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	return (
		<div className='h-screen w-screen flex justify-center items-center'>
			<Paper elevation={3}>
				<div className='flex flex-col p-10 gap-3 w-[40vw]'>
					<h1 className='font-bold text-xl'>ADMINISTRATION</h1>
					<TextField label="Email" type='email' />
					<OutlinedInput type={showPassword ? 'text' : 'password'} endAdornment={
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle password visibility"
								onClick={handleClickShowPassword}
								onMouseDown={handleMouseDownPassword}
								edge="end"
							>
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					}
						label="Password" />
					<Button variant='contained' sx={{
						width: "fit-content", alignSelf: "center", paddingX: "2rem"
					}}>Login</Button>
				</div>

			</Paper>
		</div>

	)
}