
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { contentData } from '../../states';
import Uploader from '../Uploader';
import { FinishPublishButton } from './FinishPublishButton';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiDialogContent-root': {
		padding: theme.spacing(2),
	},
	'& .MuiDialogActions-root': {
		padding: theme.spacing(1),
	},
}));

export default function DeployDialog() {
	const [open, setOpen] = useState(true);
	const contents = useRecoilValue(contentData)

	const handleClose = (evt, reason) => {
		if (reason && reason == "backdropClick")
			return;
		setOpen(false);
	};

	return (

		<BootstrapDialog
			onClose={handleClose}
			aria-labelledby="customized-dialog-title"
			open={open}
			disableEscapeKeyDown={true}
		>
			<DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
				Uploading files
			</DialogTitle>

			<DialogContent dividers sx={{ width: 420, minHeight: 100 }}>
				{
					contents.map((c) => (<Uploader key={c.id} content={c} />))
				}
			</DialogContent>
			<DialogActions>
				<FinishPublishButton handleClose={handleClose} />
			</DialogActions>
		</BootstrapDialog>

	);
}