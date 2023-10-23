import Paper from '@mui/material/Paper';


export default function StatItem({ title, value }) {

	return (
		<Paper elevation={3}>
			<div className="p-6 select-none">
				<h3 className="text-xl uppercase text-blue-600">{title}</h3>
				<span className="font-bold text-4xl">{value}</span>
			</div>
		</Paper>

	)
}