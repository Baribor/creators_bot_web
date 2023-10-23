import Avatar from "@mui/material/Avatar";
import { Outlet } from "react-router-dom";
import SettingsIcon from '@mui/icons-material/Settings';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import NavItem from "./NavItem";
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { IconButton } from "@mui/material";


export default function MainLayout() {

	return (
		<>
			<div className="w-screen h-screen flex overflow-hidden">
				{/* Side bar */}
				<div className="w-1/4 p-3 shadow-md border-r-2 select-none">
					{/* navs */}
					<div className="flex flex-col gap-1 h-full pt-14">

						<NavItem text="Stat" to="">
							<EqualizerIcon />
						</NavItem>

						<NavItem text="Publish Content" to="">
							<SettingsInputAntennaIcon />
						</NavItem>

						<NavItem text="My Contents" to="contents">
							<FolderCopyIcon />
						</NavItem>

						<NavItem text="Settings" to="settings">
							<SettingsIcon />
						</NavItem>

					</div>
				</div>

				{/* Main content */}
				<div className="h-screen flex-grow ">
					{/* App bar */}
					<div className="w-full h-16 shadow-sm border-b-2 px-10 flex items-center justify-end gap-4">

						<div className="border-2 rounded-full overflow-hidden flex items-center">
							<span className="mr-2 px-3 font-bold">Balance</span>
							<span>€ 1200</span>
							<IconButton>
								<KeyboardArrowDownIcon />
							</IconButton>

						</div>


						{/* Avatar */}
						<div className="flex items-center justify-end gap-2">
							<Avatar alt="user profile image" src="vite.svg" variant="circular" />
							<p className="font-bold text-sm">Ada George</p>
						</div>
					</div>
					<div className="px-20 py-10 overflow-y-scroll ">

					<Outlet />
					</div>
				</div>
			</div>
		</>
	)
}