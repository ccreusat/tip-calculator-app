import React from "react";

function Result({ tipAmount, total, reset }) {
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

			<button id="reset" onClick={() => reset()}>
				Reset
			</button>
		</div>
	);
}

export default Result;
