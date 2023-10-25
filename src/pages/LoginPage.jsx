import { useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { BASE_URL, user } from "../states";
import { enqueueSnackbar } from "notistack";



export default function LoginPage() {
	const setUser = useSetRecoilState(user);
	const navigate = useNavigate()

	const [searchParams] = useSearchParams()

	const beginLogin = useCallback(async () => {
		const res = await fetch(BASE_URL + "/auth/login?" + searchParams)
			.then(res => res.json())
		if (res.status) {
			localStorage.setItem("creatorBotUser", JSON.stringify(res.user));
			setUser(res.user)
			navigate("/" + searchParams.get("redirect"))
		} else {
			enqueueSnackbar({
				message: res.message,
				variant: "error"
			})
			navigate("/login")
		}
	}, [])

	useEffect(() => {
		if (searchParams.get("id")) {
			beginLogin()
		}

	}, [])

	return (
		<div>
			{
				!searchParams.get("id") && <div className="h-screen w-screen flex justify-center items-center">
					<div className="bg-blue-600 text-white font-bold rounded-full p-3 px-5 text-center">
						<a href="https://t.me/curvsyCreatorsBot?start=signin"><span>Login from telegram</span></a>
					</div>
				</div>
			}
		</div>
	)
}