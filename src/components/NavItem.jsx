import { Link } from "react-router-dom"

export default function NavItem({ text, to, children }) {

	return (
		<Link to={to}>
			<div className="border-2 p-3 rounded-md hover:shadow-md flex gap-2">
				{children}
				<span className="text-lg">{text}</span>
			</div>
		</Link>

	)
}