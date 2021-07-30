import React, { useEffect, useState } from "react";

const Input = ({ name, text, getBillValue, getPeopleValue }) => {
	const [value, setValue] = useState({
		val: "",
	});
	const [error, setError] = useState(false);

	const handleChange = (name, { target }) => {
		if (!isNaN(target.value)) {
			setValue({
				id: name,
				val: target.value,
			});
		}
	};

	useEffect(() => {
		if (value === "" || parseInt(value) === 0) {
			setError(true);
		} else {
			setError(false);
		}
	}, [value, error]);

	useEffect(() => {
		const getCorrectInput = elem => {
			if (elem.id === "bill") {
				getBillValue(value.val);
			}

			if (elem.id === "number-of-people") {
				getPeopleValue(value.val);
			}
		};
		getCorrectInput(value);
	}, [value, getBillValue, getPeopleValue]);

	return (
		<fieldset className="fieldset">
			<div className={`control ${error ? "error" : ""}`}>
				<label className="legend flex" htmlFor={name}>
					{text}
					<span className="error-message">Can't be zero</span>
				</label>
				<input
					type="text"
					id={name}
					className={name}
					name={name}
					value={value.val}
					placeholder="0"
					onChange={event => handleChange(name, event)}
				/>
			</div>
		</fieldset>
	);
};

export default Input;
