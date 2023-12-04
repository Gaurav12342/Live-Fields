function ProfileImage(props) {
	const getRandomColor = () => {
		let color = 'hsl(' + Math.random() * 360 + ', 100%, 75%)';
		return color;
	};
	return (
		<>
			<svg
				className={`${
					props.parentClass ? props.parentClass : 'profile-page-photo'
				} mb-0`}
				xmlns="http://www.w3.org/2000/svg"
				viewBox={`0 0 ${props.boxWidth ? props.boxWidth : '150'} ${
					props.boxWidth ? props.boxWidth : '150'
				}`}>
				<g>
					<rect
						fill={getRandomColor()}
						width={`${props.boxWidth ? props.boxWidth : '150'}`}
						height={`${props.boxWidth ? props.boxWidth : '150'}`}
					/>
					<text
						style={{
							fontSize: props.fontSize || '69px',
							fontFamily: 'Arial-BoldMT, Arial',
							fontWeight: '700',
							fill: '#63666A',
						}}
						transform="translate(24.79 95.25) scale(1.04 1)">
						{props.shortName}
					</text>
				</g>
			</svg>
		</>
	);
}

export default ProfileImage;
