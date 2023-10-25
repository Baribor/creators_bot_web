import StateContainer from "../../components/StatContainer"

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

const clientsData = [
	{
		title: 'total creators',
		value: 950
	},
	{
		title: 'total customers',
		value: 5283
	}
]

export default function AdminStatPage() {

	return (
		<div>
			<StateContainer title="Clients" stats={clientsData} />
			<StateContainer title="Contents" stats={contentData} />
			<StateContainer title="Revenue" stats={earningData} />
		</div>
	)
}