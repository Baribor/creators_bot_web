import classNames from "classnames"
import { useLocation, useNavigate } from "react-router-dom"

export default function NavItem({ text, to, handleClick, children }) {
	const location = useLocation();
	const navigate = useNavigate();

	const isCurrentPath = () => {
		const paths = location.pathname.split("/")
		const lastPath = paths[paths.length - 1]
		return lastPath === to || (to === "" && lastPath === "home") || (to === "" && lastPath === "admin");
	}

	return (

			<div className={
				classNames('hover:border-gray-200', 'p-3', 'rounded-md', 'hover:shadow-md', 'flex', 'gap-2', 'duration-200', "border-white", "border", {
					"bg-blue-600": isCurrentPath(),
					"text-white": isCurrentPath()
				})
			} onClick={() => {
				navigate(to);
				handleClick();
			}}>
				{children}
				<span className="text-lg">{text}</span>
			</div>


	)
}