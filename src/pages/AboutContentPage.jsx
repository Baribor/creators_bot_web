import Avatar from "@mui/material/Avatar";
import { useLoaderData } from "react-router-dom";
import Divider from '@mui/material/Divider';
import VisitorContentCard from "../components/card/VisitorContentCard";
import Box from "@mui/material/Box";



export default function AboutContentPage() {
	const content = useLoaderData()
	const creator = content.creator;

	return (
		content ? (
			<Box>
				{/* Sidebadr */}
				{/* <div className="items-center md:py-10 flex-col gap-4 px-6 border-r bg-green-50 rounded-b-[2rem] md:rounded-b-none shadow hidden md:flex">

					<div className="flex items-center flex-col gap-2">
						<Avatar alt="user profile image" src={creator.profilePic} variant="circular" sx={{ width: "6em", height: "auto", borderWidth: 3, borderColor: "rgb(37 99 235 / var(--tw-bg-opacity))" }} />
						<p className="font-bold text-2xl ">{creator.username}</p>
					</div>
					<Divider flexItem />
					<div>
						<p className="text-lg font-[cursive]">{creator.bio}</p>
					</div>
				</div> */}

				{/* Content info */}
				<div className="flex mt-6 flex-col pb-4 px-6">
					<div className="bg-green-500 text-white  px-4 py-2 rounded-lg">
						<div className="text-start">
							<p className="font-bold">Monetize your contents</p>
							<p><a href={`https://t.me/${content.botUsername}`} target="_blank" rel="noreferrer" className="underline">Try it yourself</a></p>
						</div>
					</div>
					<VisitorContentCard content={content} />
					<p className="font-bold text-4xl">{`${content.price.toLocaleString('en-US')} €`}</p>
					<div className="mt-8 bg-green-500 w-fit self-center font-bold text-white rounded-full p-3 px-10 hover:bg-green-600 duration-300 cursor-pointer">
						<a href={`https://t.me/${content.botUsername}?start=unlock_${content.id}`}><span>Pay to reveal</span></a>
					</div>
					<p className="text-gray-400 mt-4">Payment 100% secured</p>
				</div>
			</Box >
		) :
			(
				<div>
					<span>No content with that ID</span>
				</div>
			)
	)
}