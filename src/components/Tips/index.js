import React, { useState, useEffect } from "react";

const tipsArr = [5, 10, 15, 25, 50];
const Tips = ({ getTipValue }) => {
	const [selectedTip, setSelectedTip] = useState(5);
	const [customTip, setCustomTip] = useState("");

	useEffect(() => {
		getTipValue(selectedTip);
	}, [selectedTip, getTipValue]);

	const onSelectTip = tip => {
		setSelectedTip(tip);
		setCustomTip("");
		getTipValue(tip);
	};

	const onCustomInput = ({ target }) => {
		setSelectedTip(0);
		setCustomTip(target.value);
		getTipValue(target.value);
	};

	return (
		<fieldset className="fieldset">
			<label className="legend" htmlFor="tips">
				Select Tip %
			</label>
			<div className="tips">
				{tipsArr.map((tip, index) => (
					<div key={index} className="tips__control">
						<input
							type="radio"
							className="tips__radio"
							checked={selectedTip === tip}
							name="tip"
							id={`tip-${tip}`}
							value={tip}
							onChange={() => onSelectTip(tip)}
						/>
						<label className="tips__label" htmlFor={`tip-${tip}`}>
							{tip} %
						</label>
					</div>
				))}
				<div className="tips__control">
					<input
						type="text"
						className="tips__custom"
						name="tip-custom"
						id="tip-custom"
						placeholder="Custom"
						value={customTip}
						onInput={event => onCustomInput(event)}
					/>
				</div>
			</div>
		</fieldset>
	);
};

export default Tips;