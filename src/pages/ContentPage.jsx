import { Suspense } from "react";
import ContentCard from "../components/card/ContentCard";
import { Await, useAsyncValue, useLoaderData } from "react-router-dom";
import Loader from "../components/Loader";


const Content = () => {
	const data = useAsyncValue()
	const contents = data.contents;

	return contents?.length > 0 ?
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

export default function MyContentsPage() {
	const res = useLoaderData()

	return (
		<Suspense fallback={<Loader />}>
			<Await resolve={res.contents}>
				<div className="h-full w-full">
					<Content />
				</div>
			</Await>

		</Suspense>

	)
}