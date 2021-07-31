import React, { useEffect, useState } from "react";

const Input = ({ people, setPeople }) => {
	const [error, setError] = useState(false);

	const handleChange = ({ target }) => {
		if (!isNaN(target.value)) {
			setPeople(target.value);
		}
	};

	useEffect(() => {
		if (people === "" || parseInt(people) === 0) {
			setError(true);
		} else {
			setError(false);
		}
	}, [people, error]);

	useEffect(() => {
		setPeople(people);
	}, [people, setPeople]);

	return (
		<fieldset className="fieldset">
			<div className={`control ${error ? "error" : ""}`}>
				<label className="legend flex" htmlFor="number-of-people">
					Number of people
					<span className="error-message">Can't be zero</span>
				</label>
				<input
					type="text"
					id="number-of-people"
					className="number-of-people"
					name="number-of-people"
					value={people}
					placeholder="0"
					onChange={event => handleChange(event)}
				/>
			</div>
		</fieldset>
	);
};

export default Input;
