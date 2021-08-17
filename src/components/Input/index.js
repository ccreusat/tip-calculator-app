import React, { useEffect, useState } from "react";

const Input = ({ values, value, setValues, name }) => {
	const [error, setError] = useState(false);

	const handleChange = ({ target }) => {
		if (!isNaN(target.value)) {
			setValues({ ...values, [target.name]: target.value });
		}
	};

	useEffect(() => {
		if (value === "" || parseInt(value) === 0) {
			setError(true);
		} else {
			setError(false);
		}
	}, [value, error]);

	return (
		<fieldset className="fieldset">
			<div className={`control ${error ? "error" : ""}`}>
				<label className="legend flex" htmlFor={name}>
					{name.toUpperCase()}
					<span className="error-message">Can't be zero</span>
				</label>
				<input
					type="text"
					id={name}
					className={name}
					name={name}
					value={value}
					placeholder="0"
					onChange={event => handleChange(event)}
				/>
			</div>
		</fieldset>
	);
};

export default Input;
