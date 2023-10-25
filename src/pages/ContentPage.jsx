import { useCallback, useEffect, useState } from "react"
import Loader from "../components/Loader";
import { useRecoilValue } from "recoil";
import { BASE_URL, user } from "../states";
import { enqueueSnackbar } from "notistack";
import ContentCard from "../components/card/ContentCard";


export default function MyContentsPage() {
	const currentUser = useRecoilValue(user)
	const [loading, setLoading] = useState(true)
	const [contents, setContents] = useState([])

	const getContents = useCallback(async () => {

		try {
			const res = await fetch(BASE_URL + "/contents", {
				headers: {
					Authorization: `Bearer ${currentUser.token}`
				}
			}).then(res => res.json())
			setContents(res.contents)
		} catch (error) {
			enqueueSnackbar({
				message: "Error fetching contents", variant: "error"
			})
		}
		setLoading(false)
	}, [])

	useEffect(() => {
		getContents()
	}, [])

	return (
		<div className="h-full w-full">
			{
				loading ? (
					<Loader />
				) :
					contents.length > 0 ?
						(
							<div className="grid grid-cols-3 gap-16 ">
								{
									contents.map((c) => <ContentCard key={c.id} content={c} />)
								}
							</div>
						) : (
							<div className="font-bold text-2xl">
								<h3>You don&apos;t have any content yet.</h3>
							</div>
						)
			}
		</div>
	)
}