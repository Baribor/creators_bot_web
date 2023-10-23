import StatItem from "./StateItem";



export default function StateContainer({ title, stats }) {

	return (

		<div className="mb-4">
			<h2 className="text-start font-bold text-lg">{title}</h2>
			<div className="grid grid-cols-2 gap-4">
				{
					stats.map((s, i) => (
						<StatItem key={i} title={s.title} value={s.value} />
					))
				}
			</div>
		</div>
	)
}
