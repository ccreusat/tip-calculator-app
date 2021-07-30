import React from "react";
import logo from "../../images/logo.svg";

const Logo = () => {
	return (
		<div className="splitter__logo">
			<div aria-label="Splitter Logo">
				<img src={logo} alt="Splitter" />
			</div>
		</div>
	);
};

export default Logo;
