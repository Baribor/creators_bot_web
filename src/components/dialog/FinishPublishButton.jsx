import { Button } from "@mui/material"
import { useRecoilState, useRecoilValue } from "recoil"
import { BASE_URL, contentData, description, price, uploadedContents } from "../../states"
import { enqueueSnackbar } from "notistack"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import LoadingScreen from "../LoadingScreen"
import { USER_KEY } from "../../lib/constants"


export const FinishPublishButton = ({ handleClose }) => {
	const [contents, setContents] = useRecoilState(contentData)
	const [uploaded, setUploaded] = useRecoilState(uploadedContents)
	const p = useRecoilValue(price)
	const desc = useRecoilValue(description)
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)


	const cleanUp = () => {
		setContents([])
		setUploaded([])
	}
	const handleFinish = async () => {

		setLoading(true)
		let uniques = uploaded.map(JSON.stringify)
		uniques = new Set(uniques)
		uniques = Array.from(uniques).map(JSON.parse)

		const payload = {
			contents: uniques,
			price: p,
			description: desc
		}

		const token = localStorage.getItem(USER_KEY);

		const res = await fetch(BASE_URL + "/content", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
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
		setLoading(false)
		handleClose()
	}

	return (
		(contents.length * 2 === uploaded.length || contents.length === uploaded.length) &&
		<>
			<Button autoFocus onClick={handleFinish}>
				Finish
			</Button>
			<LoadingScreen open={loading} />
		</>
	)
}