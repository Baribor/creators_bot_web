import { Outlet } from "react-router-dom";



export default function MainLayout() {

	return (
		<>
			<div>
				{/* Side bar */}
				<div>

				</div>

				{/* Main content */}
				<div>
					<Outlet />
				</div>
			</div>
		</>
	)
}