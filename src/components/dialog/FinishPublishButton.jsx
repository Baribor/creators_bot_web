import { Button } from "@mui/material"
import { useRecoilState, useRecoilValue } from "recoil"
import { BASE_URL, contentData, description, price, uploadedContents, user } from "../../states"
import { enqueueSnackbar } from "notistack"
import { useNavigate } from "react-router-dom"


export const FinishPublishButton = ({ handleClose }) => {
	const [contents, setContents] = useRecoilState(contentData)
	const [uploaded, setUploaded] = useRecoilState(uploadedContents)
	const p = useRecoilValue(price)
	const desc = useRecoilValue(description)
	const currentUser = useRecoilValue(user)
	const navigate = useNavigate()

	const cleanUp = () => {
		setContents([])
		setUploaded([])
	}
	const handleFinish = async () => {
		enqueueSnackbar({
			message: "Publishing please wait...", variant: "info"
		})

		let uniques = uploaded.map(JSON.stringify)
		uniques = new Set(uniques)
		uniques = Array.from(uniques).map(JSON.parse)
		console.log(uniques)

		const payload = {
			contents: uniques,
			price: p,
			description: desc
		}
		const res = await fetch(BASE_URL + "/content", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${currentUser?.token}`
			},
			body: JSON.stringify(payload)
		})
			.then(res => res.json())

		if (res.status) {
			enqueueSnackbar({
				message: res.message, variant: "success"
			})
			navigate("/home/contents")
			cleanUp()
		} else {
			enqueueSnackbar({
				message: res.message, variant: "error"
			})

		}
		handleClose()
	}

	return (
		contents.length * 2 === uploaded.length &&
		<Button autoFocus onClick={handleFinish}>
			Finish
		</Button>
	)
}