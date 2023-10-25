import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import AddFiles from '../components/AddFiles';
import AddProperties from '../components/AddProperties';
import Preview from '../components/Preview';
import PageNavigator from './PageNavigator';
import DeployDialog from '../components/dialog/DeployDialog';

const steps = ['Add files', 'Add properties', 'Preview'];

export default function PublishContent() {
	const [activeStep, setActiveStep] = useState(0);
	const [publishing, setPublishing] = useState(false)

	const handleNext = () => {
		if (activeStep === 2) {
			setPublishing(true)
			return
		}
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};


	const handleReset = () => {
		setActiveStep(0);
	};

	return (
		<>
			<Box sx={{ width: '100%' }}>
				<Stepper activeStep={activeStep}>
					{steps.map((label) => {
						const stepProps = {};
						const labelProps = {};
						return (
							<Step key={label} {...stepProps}>
								<StepLabel {...labelProps}>{label}</StepLabel>
							</Step>
						);
					})}
				</Stepper>
				{activeStep === steps.length ? (
					<>
						<Typography sx={{ mt: 2, mb: 1 }}>
							All steps completed - you&apos;re finished
						</Typography>
						<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
							<Box sx={{ flex: '1 1 auto' }} />
							<Button onClick={handleReset}>Reset</Button>
						</Box>
					</>
				) : (
					<div className='py-10'>
						<AddFiles activeStep={activeStep} />
						<AddProperties activeStep={activeStep} handleBack={handleBack} handleNext={handleNext} steps={steps.length} />
						<Preview activeStep={activeStep} />
						{
							activeStep !== 1 && <PageNavigator handleBack={handleBack} handleNext={handleNext} activeStep={activeStep} steps={steps.length} />
						}

					</div>
				)}
			</Box>
			{
				publishing && <DeployDialog />
			}
		</>

	);
}
