import Button from "@mui/material/Button";
import Box from "@mui/material/Box";


export default function PageNavigator({ handleBack, handleNext, activeStep, steps }) {

	return (
		<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
			<Button
				color="inherit"
				disabled={activeStep === 0}
				onClick={handleBack}
				sx={{ mr: 1 }}
			>
				Back
			</Button>
			<Box sx={{ flex: '1 1 auto' }} />
			<Button onClick={handleNext}>
				{activeStep === steps - 1 ? 'Publish' : 'Next'}
			</Button>
		</Box>
	)
}