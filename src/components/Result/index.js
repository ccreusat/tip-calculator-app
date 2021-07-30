import React from "react";

function Result({ tipAmount, total }) {
	React.useEffect(() => {
		console.log("test", typeof tipAmount);
	}, [tipAmount]);
	return (
		<div className="splitter__result">
			<div>
				<div className="control flex">
					<label htmlFor="amount" className="legend">
						Tip Amount <span>/ person</span>
					</label>
					<strong className="price">
						$<span id="amount">{tipAmount}</span>
					</strong>
				</div>

				<div className="control flex">
					<label htmlFor="total" className="legend">
						Total <span>/ person</span>
					</label>
					<strong className="price">
						$<span id="total">{total}</span>
					</strong>
				</div>
			</div>

			<button id="reset">Reset</button>
		</div>
	);
}

export default Result;
