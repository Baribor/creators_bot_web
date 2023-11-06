import { Suspense } from "react"
import Loader from "../components/Loader"
import StateContainer from "../components/StatContainer"
import { Await, useAsyncValue, useLoaderData } from "react-router-dom"


const StatDetails = () => {
	const data = useAsyncValue()

	return (
		<div className="h-full w-full">
			{
				data.status ? (
					Object.entries(data.data).map((data) => <StateContainer key={data[0]} title={data[0]} stats={data[1]} />)
				) :
					(
						<span className="font-bold text-xl">An error occurred while fetching data</span>
					)
			}

		</div>
	)
}


export default function StatPage() {
	const res = useLoaderData();

	return (
		<Suspense fallback={<Loader />}>
			<Await resolve={res.data}>
				<StatDetails />
			</Await>
		</Suspense>
	)
}