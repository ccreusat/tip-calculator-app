import { useState, useEffect } from "react";

import "./styles/App.css";

import Logo from "./components/Logo";
import Tips from "./components/Tips";
import Result from "./components/Result";
import Input from "./components/Input";

const App = () => {
	const [values, setValues] = useState({
		bill: "",
		people: "",
		tip: 5,
	});

	const [tip, setTip] = useState(5);
	const [total, setTotal] = useState("0.00");
	const [tipAmount, setTipAmount] = useState("0.00");

	const [selectedTip, setSelectedTip] = useState(5);
	const [customTip, setCustomTip] = useState("");

	const handleFormSubmit = e => {
		e.preventDefault();
	};

	const reset = () => {
		setValues({
			bill: "",
			people: "",
			tip: 5,
		});
		setSelectedTip(5);
		setCustomTip("");
	};

	useEffect(() => {
		const calculateTotal = (bill, tip, people) => {
			let result;
			if (bill === "" || people === "") {
				setTotal("0.00");
			} else {
				result = parseInt(bill);
				result += parseInt((Number(tip) / 100) * bill);
				result /= Math.round(people);
				setTotal(result.toFixed(2));
			}
		};
		const calculateAmount = (bill, tip, people) => {
			let amount;

			if (bill === "" || people === "") {
				setTipAmount("0.00");
			} else {
				amount = (Number(tip) / 100) * bill;
				amount /= Math.round(people);
				setTipAmount(amount.toFixed(2));
			}
		};
		calculateTotal(values.bill, tip, values.people);
		calculateAmount(values.bill, tip, values.people);
	}, [values, tip]);

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
						values={values}
						value={values.bill}
						setValues={setValues}
						name="bill"
					/>
					<Tips
						selectedTip={selectedTip}
						setSelectedTip={setSelectedTip}
						customTip={customTip}
						setCustomTip={setCustomTip}
						setTip={setTip}
					/>
					<Input
						values={values}
						value={values.people}
						setValues={setValues}
						name="people"
					/>
				</div>
				<Result tipAmount={tipAmount} total={total} reset={reset} />
			</div>
		</form>
	);
};

export default App;
