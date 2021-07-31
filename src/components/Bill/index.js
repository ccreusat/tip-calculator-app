import React, { useEffect, useState } from "react";

const Input = ({ bill, setBill }) => {
	const [error, setError] = useState(false);

	const handleChange = ({ target }) => {
		if (!isNaN(target.value)) {
			setBill(target.value);
		}
	};

	useEffect(() => {
		if (bill === "" || parseInt(bill) === 0) {
			setError(true);
		} else {
			setError(false);
		}
	}, [bill, error]);

	useEffect(() => {
		setBill(bill);
	}, [bill, setBill]);

	return (
		<fieldset className="fieldset">
			<div className={`control ${error ? "error" : ""}`}>
				<label className="legend flex" htmlFor="bill">
					Bill
					<span className="error-message">Can't be zero</span>
				</label>
				<input
					type="text"
					id="bill"
					className="bill"
					name="bill"
					value={bill}
					placeholder="0"
					onChange={event => handleChange(event)}
				/>
			</div>
		</fieldset>
	);
};

export default Input;
