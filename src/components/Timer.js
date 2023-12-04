import React, { useEffect, useState } from 'react';

const CountDownTimer = ({ hoursMinSecs, isEnable, isReset, handleReset }) => {
	const [[mins, secs], setTime] = useState([1, 59]);
	const tick = () => {
		if (isReset) {
			reset();
			handleReset(false);
		} else if (mins === 0 && secs === 0) {
			stop();
		} else if (secs === 0) {
			setTime([mins - 1, 59]);
		} else {
			setTime([mins, secs - 1]);
		}
	};

	const reset = () => setTime([parseInt(1), parseInt(59)]);
	const stop = () => setTime([0, 0]);
	useEffect(() => {
		if (isEnable) {
			const timerId = setInterval(() => tick(), 1000);
			return () => clearInterval(timerId);
		}
	});

	return (
		<div>
			<p>{`${mins.toString().padStart(2, '0')}:${secs
				.toString()
				.padStart(2, '0')}`}</p>
		</div>
	);
};

export default CountDownTimer;
