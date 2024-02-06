import Box from "@mui/material/Box";
import { useLocation, useNavigate } from "react-router-dom";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useState } from "react";
import ApproveCreator from "../../components/dialog/ApproveCreatorDialog";
import CancelApprovalDialog from "../../components/dialog/CancelApprovalDialog";


export default function VerificationDetail() {
	const { state } = useLocation();
	const { id, firstName, lastName, username, verificationFiles, code } = state.request;
	const [dialog, setDialog] = useState(); //{type, creatorId}
	const navigate = useNavigate();

	const handleApproved = (approved) => {
		if (approved) {
			navigate("/admin/verification", {
				replace: true,
			})
		}

		setDialog(null);
	}


	return (
		<Box>
			<div className="grid gap-y-8">
				<div className="flex gap-1 justify-end py-2">
					<span className="uppercase text-white bg-blue-600 px-4 rounded-full py-2 shadow-md cursor-pointer" onClick={() => setDialog({
						type: "approve", creatorId: id
					})}>Approve</span>
					<span className="uppercase text-white bg-red-600 px-4 rounded-full py-2 shadow-md cursor-pointer" onClick={() => setDialog({
						type: "reject", creatorId: id
					})}>Disapprove</span>
				</div>


				<div className="grid grid-cols-[max-content_1fr] gap-x-4">
					<span className="font-bold text-left">Creator ID</span>
					<span className="text-left">{id}</span>

					<span className="font-bold text-left">First Name</span>
					<span className="text-left">{firstName}</span>

					<span className="font-bold text-left">Last Name</span>
					<span className="text-left">{lastName}</span>

					<span className="font-bold text-left">Username</span>
					<span className="text-left">{username}</span>

					<div className="col-span-2 flex justify-center gap-4 select-none mt-4">
						<span className="font-bold text-left text-xl border border-r-0 rounded-s-full pl-4 border-red-400">Verification code</span>
						<span className="text-left text-xl border border-l-0 rounded-e-full pr-4 border-blue-400">{code}</span>
					</div>

				</div>


				<div className="grid md:grid-cols-2 md:gap-4">
					<div>
						<h3 className="font-bold text-xl text-start">Documents</h3>
						{
							verificationFiles.documents.map((f, i) => (
								<div key={f} className="flex gap-4 justify-start border-b mb-2 w-full">
									<span className="font-semibold border-b text-blue-700">{`Document ${i + 1}`}</span>
									<a href={f} download={`${username}_verificatioin_${i + 1}`} target="_blank" rel="noreferrer">
										<FileDownloadIcon />
									</a>
								</div>
							))
						}
					</div>

					<div>
						<h3 className="font-bold text-xl text-start">Selfies</h3>
						{
							verificationFiles.selfies.map((f, i) => (
								<div key={f} className="flex gap-4 justify-start border-b mb-2 w-full">
									<span className="font-semibold border-b text-blue-700">{`Selfie ${i + 1}`}</span>
									<a href={f} download={`${username}_verificatioin_${i + 1}`} target="_blank" rel="noreferrer">
										<FileDownloadIcon />
									</a>
								</div>
							))
						}
					</div>
				</div>
			</div>
			{
				dialog && dialog.type === "approve" && <ApproveCreator handleClose={handleApproved} creatorId={dialog.creatorId} title="Approve Creator" body="Do you want to approve this creator?" path="approve" />
			}
			{
				dialog && dialog.type === "reject" && <CancelApprovalDialog creatorId={dialog.creatorId} handleClose={handleApproved} />
			}
		</Box>
	)
}