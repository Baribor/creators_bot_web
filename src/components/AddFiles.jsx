import TextField from "@mui/material/TextField";
import VideoInput from "./inputs/VideoInput";
import AudioInput from "./inputs/AudioInput";
import ImageInput from "./inputs/ImageInput";
import FileInput from "./inputs/FileInput";


export default function AddFiles({ activeStep }) {
	if (activeStep !== 0) {
		return null;
	}
	return (
		<div className="text-start mt-3">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
				<VideoInput />
				<AudioInput />
				<ImageInput />
				<FileInput />
			</div>
		</div>
	)
}