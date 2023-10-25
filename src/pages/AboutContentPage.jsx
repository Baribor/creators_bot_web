import Avatar from "@mui/material/Avatar";
import { useLoaderData } from "react-router-dom";
import Divider from '@mui/material/Divider';
import VisitorContentCard from "../components/card/VisitorContentCard";



export default function AboutContentPage() {
	const content = useLoaderData()
	const creator = content.creator;

	return (

		content ? (
			<div className="flex w-screen h-screen">
				{/* Sidebadr */}
				<div className="w-2/5 flex items-center py-10 flex-col gap-4 px-6 border-r">
					{/* Avatar */}
					<div className="flex items-center flex-col gap-2">
						<Avatar alt="user profile image" src={creator.profilePic} variant="circular" sx={{ width: "6em", height: "auto" }} />
						<p className="font-bold text-2xl">{creator.username}</p>
					</div>
					<Divider flexItem />
					<div>
						<p>{creator.bio}</p>
					</div>
				</div>

				{/* Content info */}
				<div className="w-3/5 flex justify-center items-center flex-col">
					<VisitorContentCard content={content} />
					<div className="mt-8 bg-blue-600 text-white rounded-full p-2 px-6 hover:bg-blue-500 duration-300 cursor-pointer">
						<a href={`http://t.me/curvsyCreatorsBot?start=unlock_${content.id}`}><span>UNLOCK CONTENT</span></a>
					</div>
				</div>
			</div >
		) :
			(
				<div>
					<span>No content with that ID</span>
				</div>
			)
	)
}