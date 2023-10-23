import StateContainer from "../components/StatContainer"

const contentData = [
	{
		title: 'total',
		value: 34
	},
	{
		title: 'views',
		value: 345
	},
	{
		title: 'subscribers',
		value: 345
	}
]

const earningData = [
	{
		title: 'today',
		value: '€ 6'
	},
	{
		title: 'this week',
		value: "€ 345"
	},
	{
		title: 'this month',
		value: "€ 1500"
	},
	{
		title: 'total',
		value: "€ 1851"
	}
]

export default function StatPage() {

	return (
		<div>
			<StateContainer title="Contents" stats={contentData} />
			<StateContainer title="Earnings" stats={earningData} />
		</div>
	)
}