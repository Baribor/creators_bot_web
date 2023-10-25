import StateContainer from "../components/StatContainer"

const contentData = [
	{
		title: 'total',
		value: 0
	},
	{
		title: 'views',
		value: 0
	},
	{
		title: 'subscribers',
		value: 0
	}
]

const earningData = [
	{
		title: 'today',
		value: '€ 0'
	},
	{
		title: 'this week',
		value: "€ 0"
	},
	{
		title: 'this month',
		value: "€ 0"
	},
	{
		title: 'total',
		value: "€ 0"
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