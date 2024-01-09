
export default function VisitorContentCard({ content }) {

	const getBlurUrl = (url) => {
		const e = url.split('upload');
		e[1] = '/e_blur:1500' + e[1];

		return e.join('upload')
	}
	const getImage = () => {

		if (content.preview && content.preview.type === "image") {
			return <img src={getBlurUrl(content.preview.url)} alt="preview" />
		}

		/* if (content.images.length > 0) {
			return <img src={content.images[0].url} alt="preview" />
		} */

		return <img src="/locked-file.jpg" alt="preview" />;
	}

	return (
		<div className='my-6 flex justify-center'>
			<div className='blur-md max-w-[350px] w-full px-6'>
				{getImage()}
			</div>
		</div>
	)
}