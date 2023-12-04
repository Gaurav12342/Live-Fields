import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { InputGroup, Modal, FormControl, Form, Button } from 'react-bootstrap';
import getUserId, { getSiteLanguageData } from './../commons';
import { GET_LOCATION_LIST } from './../store/actions/actionType';
import Select from 'react-select';
import { createlocation, getLocationList } from '../store/actions/Task';

function LocationCore(props) {
	const dispatch = useDispatch();
	const userId = getUserId();
	const { project_id } = useParams();
	const [addMode, setAddMode] = useState(false);
	const [addData, handleAddData] = useState({
		user_id: userId,
		project_id: project_id,
		name: '',
	});
	const [selectedLocation, handleLocationSelection] = useState(
		props.selectedLocation || props.planData.location,
	);
	const handleChange = (name, value) => {
		handleLocationSelection({
			...selectedLocation,
			[name]: value,
		});
	};
	const updateLocation = (lacationInfo) => {
		const post = {
			location_id: lacationInfo?.name,
		};
	};
	// const updateLocation = (tagsInfo) => {
	//   const post = {
	//     ...props.planData,
	//     tags: selectedTags,
	//     user_id: userId,
	//     plan_id: props.planData?._id
	//   };
	//   dispatch(updateSheetPlan(post));
	// };
	const submitLocation = (e) => {
		e.preventDefault();
		dispatch(createlocation(addData));
	};

	const taskLocation = useSelector((state) => {
		return state?.task?.[GET_LOCATION_LIST]?.result || [];
	});
	useEffect(() => {
		if (taskLocation?.length <= 0) {
			dispatch(getLocationList(project_id, userId));
		}
	}, [taskLocation?.length, dispatch]);
	const location = taskLocation?.map((tl) => {
		return { label: tl.name, value: tl._id };
	});

	const brandColor = '#f97316';
	const customStyles = {
		control: (base, state) => ({
			...base,
			boxShadow: state.isFocused ? 0 : 0,
			borderRadius: '4px',
			borderColor: state.isFocused ? brandColor : base.borderColor,
			'&:hover': {
				borderColor: state.isFocused ? brandColor : base.borderColor,
			},
		}),
		clearIndicator: (prevStyle) => ({
			...prevStyle,
			color: '#f97316',
			':hover': {
				color: '#f97316',
			},
		}),
	};
	const { location_name, add_location, location_n, create_location,ph_location_name,ph_location_n } =
		getSiteLanguageData('components/locationm');
	return (
		<div>
			{!addMode ? (
				<>
					<Form>
						<div className="row">
							<div className="col-sm-12 ">
								<div className="form-group">
									<Form.Label htmlFor="tags" className="w-100">
										{location_name?.text}
										<span
											onClick={() => setAddMode(true)}
											className="theme-link text-bold float-end show-login text-end">
											{add_location?.text}
										</span>
									</Form.Label>
									<Select
										placeholder={ph_location_name?.text}
										name="location_id"
										onChange={(e) => {
											handleChange('location_id', e.value);
										}}
										onBlur={(e) => {
											const name = e.target.value;
											updateLocation({
												name,
											});
										}}
										options={location}
										// value={}
										styles={customStyles}
									/>
								</div>
							</div>
						</div>
					</Form>
				</>
			) : (
				<Form>
					<div className="row">
						<div className="col-sm-12">
							<div className="form-group">
								<Form.Label htmlFor="tag">{location_n}</Form.Label>
								<InputGroup className="mb-3">
									<FormControl
										placeholder={ph_location_n?.text}
										type="text"
										name="name"
										autoComplete="off"
										onChange={(e) =>
											handleAddData({
												...addData,
												name: e.target.value,
											})
										}
										value={addData.name}
										required
									/>
								</InputGroup>
							</div>
							<Button
								type="button"
								onClick={submitLocation}
								className="btn btn-primary theme-btn btn-block my-1 show-verify">
								{create_location?.text}
							</Button>
						</div>
					</div>
				</Form>
			)}
		</div>
	);
}

const Location = (props) => {
	const [show, setShow] = useState(false);
	if (props?.type === 'core') {
		return <LocationCore {...props} />;
	}
	const { location_name } = getSiteLanguageData('components/locationm');
	return (
		<>
			<span data-toggle="tooltip" data-placement="left" title="Location">
				<i className="fas fa-tag mt-2" onClick={() => setShow(true)}></i>
				<span>{props.title}</span>
			</span>
			<Modal show={show} onHide={() => setShow(false)} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>{location_name?.text}</Modal.Title>
				</Modal.Header>
				<LocationCore {...props} />
			</Modal>
		</>
	);
};

export default Location;
