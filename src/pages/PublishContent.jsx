import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Suspense, useEffect, useState } from 'react';
import AddFiles from '../components/AddFiles';
import AddProperties from '../components/AddProperties';
import Preview from '../components/Preview';
import PageNavigator from './PageNavigator';
import DeployDialog from '../components/dialog/DeployDialog';
import Loader from '../components/Loader';
import { Await, useAsyncValue, useLoaderData } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { plans } from '../states';

const steps = ['Add files', 'Add properties', 'Preview'];

function Publish() {
	const [activeStep, setActiveStep] = useState(0);
	const [publishing, setPublishing] = useState(false)
	const data = useAsyncValue();
	const setPlans = useSetRecoilState(plans);

	useEffect(() => {
		setPlans(data.subs);
	}, [data])

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


	return (
		<>
			<Box sx={{ width: '100%', height: "100%" }}>
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

				<div className='py-10'>
					<AddFiles activeStep={activeStep} />
					<AddProperties activeStep={activeStep} handleBack={handleBack} handleNext={handleNext} steps={steps.length} />
					<Preview activeStep={activeStep} />
					{
						activeStep !== 1 && <PageNavigator handleBack={handleBack} handleNext={handleNext} activeStep={activeStep} steps={steps.length} />
					}

				</div>

			</Box>
			{
				publishing && <DeployDialog />
			}
		</>

	);
}

export default function PublishContent() {
	const res = useLoaderData();

	return (
		<Suspense fallback={<Loader />}>
			<Await resolve={res.data}>
				<Publish />
			</Await>
		</Suspense>
	)
}