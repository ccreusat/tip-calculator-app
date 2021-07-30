import { useState, useEffect } from "react";

import "./styles/App.css";

import Logo from "./components/Logo";
import Input from "./components/Input";
import Tips from "./components/Tips";
import Result from "./components/Result";

const App = () => {
	const [bill, setBill] = useState("");
	const [people, setPeople] = useState("");
	const [tip, setTip] = useState("");
	const [total, setTotal] = useState(2);
	const [tipAmount, setTipAmount] = useState(2);

	const handleFormSubmit = e => {
		e.preventDefault();
	};

	const getBillValue = val => {
		setBill(parseFloat(val));
	};

	const getPeopleValue = val => {
		setPeople(parseFloat(val));
	};

	const getTipValue = val => {
		setTip(val);
	};

	useEffect(() => {
		/* const calculateTotal = (bill, tip, people) => {
			let result;
			if (
				(bill !== "" && people !== "") ||
				(bill !== "0" && people !== "0")
			) {
				result += bill;
				console.log(typeof bill);
				console.log(typeof people);
				console.log(typeof tip);
				console.log(typeof result);
				result += parseInt((tip / 100) * bill);
				console.log(result);
				result /= parseInt(people);
				console.log(result);
				// setTotal(Number(result));
			}
		}; */
		const calculateAmount = (bill, tip, people) => {
			let amount;
			if (
				(bill !== "" && people !== "") ||
				(bill !== "0" && people !== "0")
			) {
				amount += parseInt((tip / 100) * bill);
				amount /= parseInt(people);
				setTipAmount(amount);
			}
		};
		// calculateTotal(bill, tip, people);
		calculateAmount(bill, tip, people);
	}, [bill, tip, people]);

	return (
		<form
			id="splitter"
			autoComplete="off"
			onSubmit={event => handleFormSubmit(event)}
		>
			<Logo />
			<div className="splitter__container">
				<div className="splitter__calculator">
					<Input
						name="bill"
						text="Bill"
						getBillValue={getBillValue}
					/>
					<Tips getTipValue={getTipValue} />
					<Input
						name="number-of-people"
						text="Number of people"
						getPeopleValue={getPeopleValue}
					/>
				</div>
				<Result tipAmount={tipAmount} total={total} />
			</div>
		</form>
	);
};

export default App;
