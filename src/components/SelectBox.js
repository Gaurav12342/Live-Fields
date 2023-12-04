import Select, { components } from 'react-select';
import Creatable from 'react-select/creatable';
const brandColor = '#f97316';
const brandColor50 = '#f9731650';

const vendorComponents = {
	SingleValue: ({ children, data, ...props }) => {
		return (
			<components.SingleValue {...props}>
				{/* <span className='task-info-category text-uppercase me-2'>
                    {data.vendor_name.charAt(0)}
                    {data.vendor_name.charAt(1)}
                </span> */}
				{data?.vendor_name}
			</components.SingleValue>
		);
	},
};

const categoryComponents = {
	SingleValue: ({ children, data, ...props }) => {
		return (
			<components.SingleValue {...props}>
				<span className="task-info-category text-uppercase me-2">
					{data.label.charAt(0)}
					{data.label.charAt(1)}
				</span>
				{data?.label}
			</components.SingleValue>
		);
	},
};

const locationComponents = {
	Control: ({ children, data, ...props }) => {
		return (
			<components.Control {...props}>
				<i
					className="fas fa-map-marker-alt text-secondary"
					style={{
						// height: '41px',
						padding: '12px 5px 12px 10px',
						// background: '#E9E9E9',
					}}></i>
				{children}
			</components.Control>
		);
	},
	// ValueContainer: ({ children, data, ...props }) => {
	//     return (
	//         <components.ValueContainer {...props}>
	//             <i className="fas fa-map-marker-alt" style={{background: "#A1A5B7", height:'100%'}}></i>
	//             <span>{children}</span>
	//         </components.ValueContainer>
	//     )
	// },
};

const WorkTypeComponents = {
	Control: ({ children, data, ...props }) => {
		return (
			<components.Control {...props}>
				<i
					className="fa-solid fa-scale-balanced text-secondary"
					style={{
						// height: '41px',
						padding: '12px 5px 12px 10px',
						// background: '#E9E9E9',
					}}></i>
				{children}
			</components.Control>
		);
	},
	// ValueContainer: ({ children, data, ...props }) => {
	//     return (
	//         <components.ValueContainer {...props}>
	//             <i className="fas fa-map-marker-alt" style={{background: "#A1A5B7", height:'100%'}}></i>
	//             <span>{children}</span>
	//         </components.ValueContainer>
	//     )
	// },
};

const sheetComponents = {
	Control: ({ children, data, ...props }) => {
		return (
			<components.Control className="" {...props}>
				<span
					className="fas fa-file-alt text-secondary"
					style={{
						// height: '40px',
						padding: '12px 5px 12px 10px',
						borderRadius: '4px',
						// background: '#E9E9E9',
						margin: 0,
					}}></span>
				{children}
			</components.Control>
		);
	},
	// ValueContainer: ({ children, data, ...props }) => {
	//     console.log(data)
	//     return (
	//         <components.ValueContainer {...props}>
	//             <i className="fas fa-map-marker-alt" style={{background: "#A1A5B7", height:'100%'}}></i>
	//             <span>{children}</span>
	//         </components.ValueContainer>
	//     )
	// },
};

const userComponents = {
	SingleValue: ({ children, data, ...props }) => {
		return (
			<components.SingleValue {...props}>
				{data?.profile ? (
					<>
						{/* <img title={data.label} height={40} width={40} src={data.profile} className="lf-user-wrapper-item border border-white me-2" style={{ borderRadius: '25px' }} /> */}
						{data.label}
					</>
				) : (
					<>
						{/* <span className='task-info-category text-uppercase me-2'style={{background: '#B36BD4', color:'#FFFFFF'}}>
                                {data.first_name?.charAt(0)}
                                {data.last_name?.charAt(0)}
                            </span> */}
						{data?.label}
					</>
				)}
			</components.SingleValue>
		);
	},
	MultiValue: ({ children, data, ...props }) => {
		return (
			<components.MultiValue {...props}>
				{data?.profile ? (
					<>
						{/* <img
							title={data.first_name + ' ' + data.last_name}
							height={30}
							width={30}
							src={data?.thumbnail || data?.profile}
							className="lf-user-wrapper-item border border-white me-2"
							style={{ borderRadius: '25px' }}
						/> */}
						{data.label}
					</>
				) : (
					<>
						{/* <span
							className="task-info-category text-uppercase me-2"
							// style={{ background: '#B36BD4', color: '#FFFFFF' }}
						>
							{data.first_name?.charAt(0)}
							{data.last_name?.charAt(0)}
						</span> */}
						{data?.label}
					</>
				)}
			</components.MultiValue>
		);
	},
};

const taskUserComponents = {
	SingleValue: ({ children, data, ...props }) => {
		return (
			<components.SingleValue {...props}>
				{data?.profile ? (
					<>
						{/* <img title={data.label} height={40} width={40} src={data.profile} className="lf-user-wrapper-item border border-white me-2" style={{ borderRadius: '25px' }} /> */}
						{data.label}
					</>
				) : (
					<>
						{/* <span className='task-info-category text-uppercase me-2'style={{background: '#B36BD4', color:'#FFFFFF'}}>
                                {data.first_name?.charAt(0)}
                                {data.last_name?.charAt(0)}
                            </span> */}
						{data?.label}
					</>
				)}
			</components.SingleValue>
		);
	},
	MultiValue: ({ children, data, ...props }) => {
		return (
			<components.MultiValue {...props}>
				{data?.profile ? (
					<>
						<img
							title={data.label}
							height={30}
							width={30}
							src={data?.thumbnail || data?.profile}
							className="lf-user-wrapper-item me-2"
							style={{ borderRadius: '25px' }}
						/>
					</>
				) : (
					<>
						<span
							className="task-info-category text-uppercase me-2"
							// style={{ background: '#B36BD4', color: '#FFFFFF' }}
						>
							{data.first_name?.charAt(0)}
							{data.last_name?.charAt(0)}
						</span>
						{/* {data?.label} */}
					</>
				)}
			</components.MultiValue>
		);
	},
};

const tagStyles = {
	control: (base, state) => ({
		...base,
		boxShadow: state.isFocused ? 0 : 0,
		borderColor: state.isFocused ? brandColor : base.borderColor,
		'&:hover': {
			borderColor: state.isFocused ? brandColor : base.borderColor,
		},
		borderRadius: '4px',
		// border: 'none',
		padding: 'unset',
		height: '100%',
		width: '100%',
		overflow: 'auto',
		maxHeight: '100px',
	}),
	clearIndicator: (prevStyle) => ({
		...prevStyle,
		color: brandColor,
		':hover': {
			color: brandColor,
		},
	}),
	indicatorsContainer: (prevStyle) => ({
		...prevStyle,
		display: 'none',
		color: brandColor,
		':hover': {
			color: brandColor,
		},
	}),
	option: (provided, state) => {
		return {
			...provided,
			backgroundColor: state.isSelected
				? brandColor
				: state.isFocused
				? brandColor50
				: null,
			'&:hover': {
				backgroundColor: state.isFocused ? brandColor50 : null,
			},
		};
	},
};

const userStyles = {
	control: (base, state) => ({
		...base,
		boxShadow: state.isFocused ? 0 : 0,
		borderColor: state.isFocused ? brandColor : base.borderColor,
		'&:hover': {
			borderColor: state.isFocused ? brandColor : base.borderColor,
		},
		borderRadius: '4px',
		padding: 'unset',
		height: '100%',
	}),
	clearIndicator: (prevStyle) => ({
		...prevStyle,
		color: brandColor,
		':hover': {
			color: brandColor,
		},
	}),
	indicatorsContainer: (prevStyle) => ({
		...prevStyle,
		display: 'none',
		color: brandColor,
		':hover': {
			color: brandColor,
		},
	}),
	valueContainer: (style, state) => {
		if (state.isMulti && state.hasValue) {
			return {
				position: 'relative',
				flexWrap: 'nowrap',
				overflow: 'hidden',
				display: 'flex',
				//flexGrow: 0,
				// flexDirection: 'row-reverse',
			};
		} else {
			return {
				...style,
				height: '38px',
			};
		}
	},
	option: (provided, state) => {
		return {
			...provided,
			backgroundColor: state.isSelected
				? brandColor
				: state.isFocused
				? brandColor50
				: null,
			flexWrap: 'nowrap',
			overflow: 'hidden',
			display: 'flex',
			alignItems: 'center',
			//paddingLeft:'5px',
			'&:hover': {
				backgroundColor: state.isFocused ? brandColor50 : null,
			},
		};
	},

	multiValue: (provided, state) => {
		return {
			position: 'relative',
			marginLeft: '-15px',
			'&:first-child': {
				marginLeft: '0px',
			},
			':hover div:last-child': {
				display: 'block',
			},
		};
	},
	multiValueRemove: (provided, state) => {
		return {
			position: 'absolute',
			top: '0%',
			left: '50%',
			display: 'none',
			backgroundColor: '#FFBDAD',
			color: '#DE350B',
			height: '14px',
			width: '14px',
			//padding: '1px',
			borderRadius: '50% !important',
			svg: {
				position: 'absolute',
				//top: '1px',
				verticalAlign: 'center',
			},
		};
	},
};

const taskUserStyles = {
	control: (base, state) => {
		// const workType = state.getValue()?.[0]?.value;
		return {
			...base,
			boxShadow: state.isFocused ? 0 : 0,
			borderColor: state.isFocused ? brandColor : base.borderColor,
			'&:hover': {
				borderColor: state.isFocused ? brandColor : base.borderColor,
			},
			borderRadius: '4px',
			//background: '#F5F8FA',
			padding: '0px',
			// fontSize: "16px",
		};
	},
	indicatorSeparator: (style) => ({
		...style,
		display: 'none',
	}),
	dropdownIndicator:(style) => ({
		...style,
		display: 'none',
	}),
	option: (provided, state) => {
		return {
			...provided,
			backgroundColor: state.isSelected
			? brandColor
			: state.isFocused
			? brandColor50
			: null,
			'&:hover': {
				backgroundColor: state.isFocused ? brandColor50 : null,
			},
		};
	},
};

const SurveyUserStyles = {
	control: (base, state) => {
		// const workType = state.getValue()?.[0]?.value;
		// console.log(base, "base", state)
		return {
			...base,
			boxShadow: state.isFocused ? 0 : 0,
			borderColor: state.isFocused ? brandColor : base.borderColor,
			'&:hover': {
				borderColor: state.isFocused ? brandColor : base.borderColor,
			},
			borderRadius: '4px',
			background: state.isDisabled ? '#e9ecef' : '#ffffff',
			padding: '0px',
			// fontSize: "16px",
		};
	},
	valueContainer: (style, state) => {
		return {
			...style,
			color: state.isDisabled ? '#212529' : '#212529',
		};
	},
	singleValue: (provided, state) => {
		return {
			...provided,
			color: state.isDisabled ? '#212529' : '#212529',
		};
	},
	indicatorSeparator: (style) => ({
		...style,
		display: 'none',
	}),
	option: (provided, state) => {
		return {
			...provided,

			backgroundColor: state.isSelected ? brandColor : null,
			'&:hover': {
				backgroundColor: state.isFocused ? brandColor50 : null,
			},
		};
	},
};

const statusStyles = {
	control: (base, state) => {
		const statusColor = state.getValue()?.[0]?.color_code;
		return {
			...base,
			boxShadow: state.isFocused ? 0 : 0,
			borderColor: state.isFocused ? brandColor : base.borderColor,
			'&:hover': {
				borderColor: state.isFocused ? brandColor : base.borderColor,
			},
			borderRadius: '4px',
			//backgroundColor: state.getValue()?.[0]?.color_code,
			//fontSize: '16px',
		};
	},
	dropdownIndicator: (style) => ({
		...style,
		/* 		color: 'white',
		'&:hover': {
			color: 'white',
		}, */
	}),
	option: (provided, state) => {
		return {
			...provided,
			backgroundColor: state.isSelected
			? brandColor
			: state.isFocused
			? brandColor50
			: null,
			'&:hover': {
				backgroundColor: state.isFocused ? brandColor50 : null,
			},
		};
	},
	indicatorSeparator: (style) => ({
		...style,
		display: 'none',
	}),
	singleValue: (provided, state) => {
		return {
			...provided,
			//color: 'white',
		};
	},
	valueContainer: (style, state) => {
		return {
			...style,
		};
	},
};

const locationStyles = {
	control: (base, state) => {
		const workType = state.getValue()?.[0]?.value;
		return {
			...base,
			boxShadow: state.isFocused ? 0 : 0,
			borderColor: state.isFocused ? brandColor : base.borderColor,
			'&:hover': {
				borderColor: state.isFocused ? brandColor : base.borderColor,
			},
			borderRadius: '4px',
			//background: '#F5F8FA',
			padding: '0px',
			// fontSize: "16px",
		};
	},
	indicatorSeparator: (style) => ({
		...style,
		display: 'none',
	}),
	dropdownIndicator: (style) => ({
		...style,
		display: 'none',
	}),
	option: (provided, state) => {
		return {
			...provided,
			backgroundColor: state.isSelected
			? brandColor
			: state.isFocused
			? brandColor50
			: null,
			'&:hover': {
				backgroundColor: state.isFocused ? brandColor50 : null,
			},
		};
	},
};

const SheetStyles = {
	control: (base, state) => {
		const workType = state.getValue()?.[0]?.value;
		return {
			...base,
			boxShadow: state.isFocused ? 0 : 0,
			borderColor: state.isFocused ? brandColor : base.borderColor,
			'&:hover': {
				borderColor: state.isFocused ? brandColor : base.borderColor,
			},
			borderRadius: '4px',
			// background: '#F5F8FA',
			padding: '0px',
			// fontSize: "16px"
		};
	},
	indicatorSeparator: (style) => ({
		...style,
		display: 'none',
	}),
	dropdownIndicator: (style) => ({
		...style,
		display: 'none',
	}),
	option: (provided, state) => {
		return {
			...provided,
			backgroundColor: state.isSelected
			? brandColor
			: state.isFocused
			? brandColor50
			: null,
			wordBreak: 'break-all',
			'&:hover': {
				backgroundColor: state.isFocused ? brandColor50 : null,
			},
		};
	},
};

const workTypeStyles = {
	control: (base, state) => {
		const workType = state.getValue()?.[0]?.value;
		return {
			...base,
			boxShadow: state.isFocused ? 0 : 0,
			borderColor: state.isFocused ? brandColor : base.borderColor,
			'&:hover': {
				borderColor: state.isFocused ? brandColor : base.borderColor,
				/* borderLeft: `${
					workType === 'issue' || state.isFocused ? '4px solid grey' : ''
				}`, */
			},
			borderRadius: '4px',
			/* borderLeft: `${
				workType === 'issue' || state.isFocused ? '4px solid grey' : ''
			}`, */
		};
	},
	indicatorSeparator: (style) => ({
		...style,
		display: 'none',
	}),
	option: (provided, state) => {
		return {
			...provided,
			backgroundColor: state.isSelected
			? brandColor
			: state.isFocused
			? brandColor50
			: null,
			'&:hover': {
				backgroundColor: state.isFocused ? brandColor50 : null,
			},
		};
	},
};

const categoryStyles = {
	control: (base, state) => {
		return {
			...base,
			boxShadow: state.isFocused ? 0 : 0,
			borderColor: state.isFocused ? brandColor : base.borderColor,
			'&:hover': {
				borderColor: state.isFocused ? brandColor : base.borderColor,
			},
			borderRadius: '4px',
			//border: 'unset',
			height: '100%',
			// fontSize: "16px",
		};
	},
	indicatorSeparator: (style) => ({
		...style,
		display: 'none',
	}),

	dropdownIndicator: (style) => ({
		...style,
		display: 'none',
	}),
	valueContainer: (style, state) => ({
		...style,
		// height: '40px'
	}),
	option: (provided, state) => {
		return {
			...provided,
			flexWrap: 'nowrap',
			overflow: 'hidden',
			display: 'flex',
			alignItems: 'center',
			backgroundColor: state.isSelected
			? brandColor
			: state.isFocused
			? brandColor50
			: null,
			'&:hover': {
				backgroundColor: state.isFocused ? brandColor50 : null,
			},
		};
	},
};

const profileStyles = {
	control: (base, state) => {
		return {
			...base,
			boxShadow: state.isFocused ? 0 : 0,
			height: 32,
			borderRadius: 0,
			minHeight: 32,
			borderColor: state.isFocused ? brandColor : base.borderColor,
			'&:hover': {
				borderColor: state.isFocused ? brandColor : base.borderColor,
			},
		};
	},
	indicatorSeparator: (style) => ({
		...style,
		display: 'none',
	}),
	option: (provided, state) => {
		return {
			...provided,
			backgroundColor: state.isSelected ? brandColor : null,
			color: '#000000',
			'&:hover': {
				backgroundColor: state.isFocused ? brandColor50 : null,
			},
		};
	},
};

const rolesStyles = {
	control: (base, state) => {
		return {
			...base,
			boxShadow: state.isFocused ? 0 : 0,
			height: 41,
			borderRadius: 0,
			minHeight: 41,
			borderColor: state.isFocused ? brandColor : base.borderColor,
			'&:hover': {
				borderColor: state.isFocused ? brandColor : base.borderColor,
			},
		};
	},
	indicatorSeparator: (style) => ({
		...style,
		display: 'none',
	}),
	option: (provided, state) => {
		return {
			...provided,
			backgroundColor: state.isSelected ? brandColor : null,
			color: '#000000',
			'&:hover': {
				backgroundColor: state.isFocused ? brandColor50 : null,
			},
		};
	},
};

const customStyles = {
	control: (base, state) => {
		return {
			...base,
			boxShadow: state.isFocused ? 0 : 0,
			borderRadius: '4px',
			overflow: 'auto',
			maxHeight: '196px',
			borderColor: state.isFocused ? brandColor : base.borderColor,
			'&:hover': {
				borderColor: state.isFocused ? brandColor : base.borderColor,
			},
			// backgroundColor: state.getValue()?.[0]?.color_code,
			backgroundColor: state.isDisabled ? '#e9ecef' : '#ffffff',
		};
	},
	indicatorSeparator: (prevStyle) => ({
		...prevStyle,
		display: 'none',
	}),
	clearIndicator: (prevStyle) => ({
		...prevStyle,
		color: brandColor,
		':hover': {
			color: brandColor,
		},
	}),
	valueContainer: (style, state) => {
		return {
			...style,
		};
	},
	option: (provided, state) => {
		return {
			...provided,
			backgroundColor: state.isSelected
				? brandColor
				: state.isFocused
				? brandColor50
				: null,
			'&:hover': {
				backgroundColor: state.isFocused ? brandColor50 : null,
			},
		};
	},
	singleValue: (provided, state) => {
		const transition = 'opacity 300ms';
		let color = '#212529';
		return {
			...provided,
			color,
			transition,
		};
	},
};

const CustomSelect = (props) => {
	let styles = undefined;
	let components = undefined;

	switch (props.moduleType) {
		case 'tags':
			styles = tagStyles;
			components = undefined;
			break;

		case 'users':
			styles = userStyles;
			components = userComponents;
			break;

		case 'taskUsers':
			styles = taskUserStyles;
			components = taskUserComponents;
			break;

		case 'fieldUsers':
			styles = SurveyUserStyles;
			components = taskUserComponents;
			break;

		case 'status':
			styles = statusStyles;
			components = undefined;
			break;

		case 'workType':
			styles = workTypeStyles;
			components = undefined;
			break;

		case 'category':
			styles = categoryStyles;
			components = categoryComponents;
			break;

		case 'vendor_po':
			styles = categoryStyles;
			components = vendorComponents;
			break;

		case 'wall_work_type':
			styles = locationStyles;
			components = WorkTypeComponents;
			break;
		case 'location':
			styles = locationStyles;
			components = locationComponents;
			break;

		case 'sheet':
			styles = SheetStyles;
			components = sheetComponents;
			break;

		case 'profile':
			styles = profileStyles;
			components = undefined;
			break;

		case 'roles':
			styles = rolesStyles;
			components = undefined;
			break;

		default:
			styles = customStyles;
		// return state;
	}

	return props?.type === 'Creatable' ? (
		<Creatable
			styles={styles}
			disabled={props.disabled ? props.disabled : false}
			components={components}
			{...props}
		/>
	) : (
		<Select
			styles={styles}
			borderRadius="4px"
			components={components}
			isOptionDisabled={(option) => option.isdisabled}
			isDisabled={props.disabled ? props.disabled : false}
			{...props}
		/>
	);
};

export default CustomSelect;
