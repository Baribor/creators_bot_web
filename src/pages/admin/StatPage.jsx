import { Suspense } from "react"
import Loader from "../../components/Loader"
import StateContainer from "../../components/StatContainer"
import { Await, Navigate, useAsyncValue, useLoaderData } from "react-router-dom"
import { ADMIN_KEY } from "../../lib/constants"


const StatDetails = () => {
	const data = useAsyncValue()

	if (data?.message === "invalid token") {
		localStorage.removeItem(ADMIN_KEY);
		return <Navigate to={"/auth/admin/login"} replace={true} />
	}
	return (
		<div>
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


export default function AdminStatPage() {
	const res = useLoaderData();

	return (
		<Suspense fallback={<Loader />}>
			<Await resolve={res.data}>
				<StatDetails />
			</Await>
		</Suspense>
	)
}