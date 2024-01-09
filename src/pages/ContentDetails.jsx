import { useLocation, useNavigate, useParams } from "react-router-dom"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from "@mui/material/IconButton";
import 'react-lazy-load-image-component/src/effects/blur.css';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import Loader from "../components/Loader";
import { useState } from "react";
import DeleteContentItemDialog from "../components/dialog/DeleteContentItemDialog";

const ContentDetails = () => {
	const navigate = useNavigate();
	const { creatorId } = useParams();
	const { state } = useLocation();
	const { content } = state;
	const [contents, setContents] = useState(content);
	const [dialog, setDialog] = useState(false);

	const handleClose = (status) => {
		if (status) {
			const newContent = { ...contents };
			if (status.type === "image") {
				newContent.images = newContent.images.filter((img) => img.id !== status.id)
			}

			setContents(newContent);
		}
		setDialog(false);
	}

	const handleBackClicked = () => {
		navigate(`/contents/${creatorId}`, {
			replace: true
		})
	}

	return (
		<div className="grid gap-6 p-4">
			<div className="flex items-start flex-col ">
				<IconButton onClick={handleBackClicked}>
					<ArrowBackIcon />
				</IconButton>
				<a href={`https://t.me/${content.botUsername}?start=add_${content.id}`} className="self-center" target="_blank" rel="noreferrer">
					<button className="bg-blue-500 border-none text-white px-10 rounded-full my-2 py-2 uppercase font-bold text-sm md:text-lg w-fit">Add contents</button>
				</a>

			</div>
			{
				contents.images.length > 0 && <div>
					<h2 className="text-start text-xl font-[cursive] font-bold">Images</h2>
					<div className="grid grid-cols-[repeat(auto-fit,minmax(220px,max-content))] row gap-3">
						{
							contents.images.map((image) => (
								<div key={image.id} className="border flex flex-col justify-between items-center">
									<LazyLoadComponent placeholder={<Loader />}>
										<img src={image.url} alt="" className="max-h-[250px]" />
									</LazyLoadComponent>
									<button className="bg-red-500 border-none text-white px-4 rounded-full my-2 w-fit" onClick={() => setDialog({ ...image, type: "image" })}>Remove</button>
								</div>
							))
						}
					</div>
				</div>
			}

			{
				contents.video.length > 0 && <div>
					<h2 className="text-start text-xl font-[cursive] font-bold">Video</h2>
					<div className="grid grid-cols-[repeat(auto-fit,minmax(220px,400px))] row gap-3">
						{
							contents.video.map(({ url }, i) => (
								<LazyLoadComponent placeholder={<Loader />} key={i}>
									<video src={url} controls ></video>
								</LazyLoadComponent>
							))
						}
					</div>
				</div>
			}

			{
				contents.audio.length > 0 && <div>
					<h2 className="text-start text-xl font-[cursive] font-bold">Audio</h2>
					<div className="grid grid-cols-[repeat(auto-fit,minmax(220px,max-content))] row gap-3">
						{
							contents.audio.map(({ url }, i) => (
								<LazyLoadComponent placeholder={<Loader />} key={i}>
									<audio src={url} controls></audio>
								</LazyLoadComponent>
							))
						}
					</div>
				</div>
			}
			{
				contents.files.length > 0 && <div>
					<h2 className="text-start text-lg font-bold">Files</h2>
					<div className="flex flex-col gap-3">
						{
							contents.files.map((file, idx) => (
								<a href={file.url} key={file.id} download>
									{`File ${idx}`}
								</a>
							))
						}
					</div>
				</div>
			}

			{
				dialog && <DeleteContentItemDialog item={dialog} handleClose={handleClose} />
			}
		</div>
	)
}

export default ContentDetails;