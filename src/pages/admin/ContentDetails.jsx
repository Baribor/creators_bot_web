import { Suspense } from "react";
import { Await, useAsyncValue, useLoaderData } from "react-router-dom";
import Loader from "../../components/Loader";


const ContentDetail = () => {
	const { content } = useAsyncValue();

	return (
		<div className="flex flex-col gap-10">
			{
				content.images.length > 0 && <div>
					<h2 className="text-start text-lg font-bold">Images</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{
							content.images.map((image) => (
								<img src={image.url} alt="" key={image.id} />
							))
						}
					</div>
				</div>
			}

			{
				content.video && <div>
					<h2 className="text-start text-lg font-bold">Video</h2>

					<video src={content.video.url} controls></video>
				</div>
			}
			{
				content.audio && <div>
					<h2 className="text-start text-lg font-bold">Audio</h2>

					<audio src={content.audio.url} controls></audio>
				</div>
			}

			{
				content.files.length > 0 && <div>
					<h2 className="text-start text-lg font-bold">Files</h2>
					<div className="flex flex-col gap-3">
						{
							content.files.map((file, idx) => (
								<a href={file.url} key={file.id}>
									{`File ${idx}`}
								</a>
							))
						}
					</div>
				</div>
			}
		</div>
	)
}

export default function ContentDetailPage() {

	const res = useLoaderData();

	return (
		<Suspense fallback={<Loader />}>
			<Await resolve={res.data}>
				<ContentDetail />
			</Await>
		</Suspense>
	)
}

