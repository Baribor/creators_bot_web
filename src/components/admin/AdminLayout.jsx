import { Navigate, Outlet, useLoaderData, useNavigate } from "react-router-dom";
import NavItem from "../NavItem";
import DashboardIcon from '@mui/icons-material/Dashboard';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PersonIcon from '@mui/icons-material/Person';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import { ADMIN_KEY } from "../../lib/constsnts";

export default function AdminLayout() {
	const token = useLoaderData();
	const navigate = useNavigate()

	const handleLogout = () => {
		localStorage.removeItem(ADMIN_KEY)
		navigate("/auth/admin/login", {
			replace: true
		})
	}
	if (!token) {
		return <Navigate to="/auth/admin/login" replace={true} />;
	}
	return (
		<div className="w-screen h-screen overflow-hidden relative">
			{/* appbar */}
			<div className="w-full h-16 fixed top-0 border-b-2 flex items-center justify-start">
				<h3 className="ml-10 font-bold text-blue-600 text-xl">Curvsy Creators Bot Administration</h3>
			</div>

			<div className="flex w-full pt-16">
				{/* Side bar */}
				<div className="w-1/5 border-r-2 select-none p-3 flex flex-col gap-1">
					<NavItem text="Dashboard" to="">
						<DashboardIcon />
					</NavItem>
					<NavItem text="Creators" to="creators">
						<EngineeringIcon />
					</NavItem>
					<NavItem text="Customers" to="customers">
						<PersonIcon />
					</NavItem>
					<NavItem text="Contents" to="contents">
						<FolderCopyIcon />
					</NavItem>
					<span className="text-red-400 text-start ml-1 p-3 hover:bg-red-200 w-fit rounded-full px-4 cursor-pointer" onClick={handleLogout}>LOGOUT</span>
				</div>

				{/* Main content */}
				<div className="flex-grow px-20 py-10 overflow-y-scroll">
					<Outlet />
				</div>
			</div>

		</div>
	)
}