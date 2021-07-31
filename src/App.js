import { useState, useEffect } from "react";

import "./styles/App.css";

import Logo from "./components/Logo";
import Bill from "./components/Bill";
import People from "./components/People";
import Tips from "./components/Tips";
import Result from "./components/Result";

const App = () => {
	const [bill, setBill] = useState("");
	const [people, setPeople] = useState("");
	const [tip, setTip] = useState(5);
	const [total, setTotal] = useState("0.00");
	const [tipAmount, setTipAmount] = useState("0.00");

	const handleFormSubmit = e => {
		e.preventDefault();
	};

	const reset = () => {
		setBill("");
		setPeople("");
		setTip(5);
		setTotal("0.00");
		setTipAmount("0.00");
	};

	useEffect(() => {
		const calculateTotal = (bill, tip, people) => {
			let result;
			if (bill === "" || people === "") {
				setTotal("0.00");
			} else {
				result = parseInt(bill);
				result += parseInt((Number(tip) / 100) * bill);
				result /= parseInt(people);
				setTotal(result.toFixed(2));
			}
		};
		const calculateAmount = (bill, tip, people) => {
			let amount;

			if (bill === "" || people === "") {
				setTipAmount("0.00");
			} else {
				amount = (Number(tip) / 100) * bill;
				amount /= people;
				setTipAmount(amount.toFixed(2));
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
					<Bill bill={bill} setBill={setBill} />
					<Tips setTip={setTip} />
					<People people={people} setPeople={setPeople} />
				</div>
				<Result tipAmount={tipAmount} total={total} reset={reset} />
			</div>
		</form>
	);
};

export default App;
