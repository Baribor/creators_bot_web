import { Outlet } from "react-router-dom";
import NavItem from "../NavItem";
import DashboardIcon from '@mui/icons-material/Dashboard';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PersonIcon from '@mui/icons-material/Person';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';

export default function AdminLayout() {

	return (
		<div className="w-screen h-screen overflow-hidden relative">
			{/* appbar */}
			<div className="w-full h-16 fixed top-0 border-b-2">

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
				</div>

				{/* Main content */}
				<div className="flex-grow px-20 py-10 overflow-y-scroll">
					<Outlet />
				</div>
			</div>

		</div>
	)
}