import { Suspense } from "react";
import { Await, useAsyncValue, useLoaderData } from "react-router-dom";
import Loader from "../../components/Loader";
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import FileContent from "../../components/admin/FileContent";

const getVidUrl = (url) => {
	const e = url.split('upload');
	e[1] = '/q_auto:best' + e[1];

	return e.join('upload')
}


const ContentDetail = () => {
	const { content } = useAsyncValue();

	return (
		<div className="grid gap-10 p-4">
			{
				content.images.length > 0 && <div>
					<h2 className="text-start text-xl font-[cursive] font-bold">Images</h2>
					<div className="grid grid-cols-[repeat(auto-fit,minmax(220px,max-content))] row gap-3">
						{
							content.images.map((image) => (
								<LazyLoadComponent placeholder={<Loader />} key={image.id}>
									<img src={image.url} alt="" className="max-h-[250px]" />
								</LazyLoadComponent>
							))
						}
					</div>
				</div>
			}

			{
				content.video.length > 0 && <div>
					<h2 className="text-start text-xl font-[cursive] font-bold">Video</h2>
					<div className="grid grid-cols-[repeat(auto-fit,minmax(220px,400px))] row gap-3">
						{
							content.video.map(({ url }, i) => (
								<LazyLoadComponent placeholder={<Loader />} key={i}>
									<video src={getVidUrl(url)} controls ></video>
								</LazyLoadComponent>
							))
						}
					</div>
				</div>
			}

			{
				content.audio.length > 0 && <div>
					<h2 className="text-start text-xl font-[cursive] font-bold">Audio</h2>
					<div className="grid grid-cols-[repeat(auto-fit,minmax(220px,max-content))] row gap-3">
						{
							content.audio.map(({ url }, i) => (
								<LazyLoadComponent placeholder={<Loader />} key={i}>
									<audio src={url} controls></audio>
								</LazyLoadComponent>
							))
						}
					</div>
				</div>
			}
			{
				content.files.length > 0 && <div>
					<h2 className="text-start text-lg font-bold">Files</h2>
					<div className="grid grid-cols-[repeat(auto-fit,minmax(160px,max-content))] gap-3">
						{
							content.files.map((file, idx) => (
								<FileContent key={file.id} file={file} index={idx} />
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

