import { useLoaderData } from "react-router-dom"

export default function LoginPage() {
	const data = useLoaderData()
	if (data) {
		return null
	}

	return (
		<div>
			<div className="h-screen w-screen flex justify-center items-center">
				<iframe src={`https://oauth.telegram.org/embed/curvsyCreatorsBot?origin=${encodeURIComponent(location.origin)}&request_access=write&return_to=${encodeURIComponent(location.origin)}%2Flogin&size=large`} frameBorder="0" width="fit-content" height={40} scrolling="no" className="overflow-hidden border-none h-10 w-fit bg-white" style={{ colorScheme: "light dark" }}></iframe>
			</div>
		</div>
	)
}
