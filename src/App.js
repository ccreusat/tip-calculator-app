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
	const [total, setTotal] = useState("0.00");
	const [tipAmount, setTipAmount] = useState("0.00");

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
		const calculateTotal = (bill, tip, people) => {
			let result;
			if (
				(bill !== "" && people !== "") ||
				(bill !== "0" && people !== "0")
			) {
				result += bill;
				result += (tip / 100) * bill;
				result /= people;
				setTotal(parseFloat(result).toFixed(2));
			}
		};
		const calculateAmount = (bill, tip, people) => {
			let amount;
			if (
				(bill !== "" && people !== "") ||
				(bill !== "0" && people !== "0")
			) {
				amount += (tip / 100) * bill;
				amount /= people;
				setTipAmount(parseFloat(amount).toFixed(2));
			}
		};
		calculateTotal(bill, tip, people);
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
