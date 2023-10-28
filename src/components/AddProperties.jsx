import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { contentData, description, previewData, price } from "../states";
import { useDropzone } from "react-dropzone";
import * as yup from "yup"
import { useFormik } from "formik";
import PageNavigator from "../pages/PageNavigator";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { enqueueSnackbar } from "notistack";


const validationSchema = yup.object({
	description: yup.string().required("Description cannot be empty"),
	price: yup.number().min(1, "Price must be greater than 0")
})


export default function AddProperties({ activeStep, handleBack, handleNext, steps }) {

	const [preview, setPreview] = useRecoilState(previewData);
	const setDescription = useSetRecoilState(description);
	const setPrice = useSetRecoilState(price);

	const {
		acceptedFiles,
		fileRejections,
		getRootProps,
		getInputProps
	} = useDropzone({
		maxFiles: 1,
		onDrop: (acceptedFiles, rejection) => {
			if (rejection.length > 0) {
				enqueueSnackbar({
					message: "Only a file is required", variant: "error"
				})
				return
			}
			setPreview({
				file: acceptedFiles[0],
			})
		},
	});


	const formik = useFormik({
		initialValues: {
			description: "",
			price: 0.0
		},

		validationSchema,
		onSubmit: (values) => {
			setDescription(values.description)
			setPrice(values.price)
			handleNext()
		}
	})

	if (activeStep !== 1) {
		return null;
	}
	return (
		<>
			<div className="text-start mt-10 flex flex-col gap-3">
				<TextField label="Description" multiline minRows={3} maxRows={3} required value={formik.values.description}
					onChange={formik.handleChange} name="description"
					error={formik.touched.description && Boolean(formik.errors.description)}
					helperText={formik.touched.description && formik.errors.description}
				/>

				<label className="text-blue-600">Price </label>
				<OutlinedInput
					id="outlined-adornment-amount"
					startAdornment={<InputAdornment position="start">€</InputAdornment>}
					sx={{
						width: 150
					}}
					type="number"
					value={formik.values.price}
					onChange={formik.handleChange}
					required
					name="price"
					error={formik.touched.price && Boolean(formik.errors.price)}
					helperText={formik.touched.price && formik.errors.price}
				/>
				<div>
					<div {...getRootProps()} className="bg-blue-400 text-center rounded-full p-3 cursor-pointer">
						<input type="file" {...getInputProps()} />
						<span className="text-white font-bold"><AttachFileIcon />Add Preview</span>
					</div>
					{
						preview && <span className="mt-2 text-gray-500 block"><AttachFileIcon />{preview.file.name}</span>
					}
				</div>

			</div>
			<PageNavigator handleBack={handleBack} handleNext={formik.handleSubmit} activeStep={activeStep} steps={steps} />
		</>

	)
}