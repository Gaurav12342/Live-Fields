import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Modal, Form, Button } from 'react-bootstrap';
import { createTag, getAllSheets } from '../../store/actions/projects';
import getUserId, { getSiteLanguageData } from '../../commons';
import { CREATE_TAGS } from '../../store/actions/actionType';
import Select from 'react-select';

function SheetsFilter(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [showTag, setShowTag] = useState(false);
	const handleCloseTag = () => setShowTag(false);
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		name: '',
	});
	const brandColor = '#f97316';
	const customStyles = {
		control: (base, state) => ({
			...base,
			boxShadow: state.isFocused ? 0 : 0,
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
	const [infoTag, setInfoTag] = useState({
		user_id: '',
		project_id: '',
		name: '',
	});

	// const handleChangeTag = (e) => {
	//   const name = e.target.name;
	//   const value = e.target.value;
	//   setInfoTag({
	//     ...infoTag,
	//     [name]: value,
	//   });
	// };

	const submitTag = (e) => {
		e.preventDefault();
		dispatch(createTag(infoTag));
	};

	const handleShowTag = (u) => {
		setInfoTag({
			...infoTag,
			user_id: userId,
			project_id: project_id,
		});
		setShowTag(true);
	};

	const createTagResult = useSelector((state) => {
		return state?.project?.[CREATE_TAGS] || {};
	});

	useEffect(() => {
		if (createTagResult?.success === true) {
			handleCloseTag();
			setInfo({
				...info,
				user_id: userId,
				project_id: project_id,
				name: '',
			});
			dispatch(getAllSheets(project_id));
		}
	}, [createTagResult?.success, dispatch]);

	const { filter_sheets, filter, apply, clear, enter_tags } =
		getSiteLanguageData('sheet/sheetsfilter');
	return (
		<>
			{/* <span data-toggle="tooltip" data-placement="left" title="Tag"><i className="fas fa-tag mt-2" onClick={() => handleShowTag()}  ></i></span><br /> */}

			{/* <Button title="Filter Tag" onClick={() => handleShowTag()}  className="btn theme-btn btn-sm ms-3 mt-1">
                    Filter
                  </Button> */}
			<div
				onClick={() => handleShowTag()}
				className="lf-common-btn"
				title="filter sheets">
				<i className="fas fa-filter lf-all-icon-size me-1 "></i>
				<span>{filter?.text}</span>
			</div>
			<Modal
				className="lf-modal"
				size={'md'}
				show={showTag}
				onHide={handleCloseTag}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{filter_sheets?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitTag}>
						<div className="row p-3">
							<div className="col-sm-12 mt-2">
								<div className="form-group">
									<Form.Label htmlFor="tag">{enter_tags?.text}</Form.Label>
									<Select
										isClearable
										isMulti
										placeholder="..."
										name="related_plans"
										// onChange={(e) => handleChange('related_plans', e)}
										// options={sheetInfo}
										// closeMenuOnSelect={false}
										// value={info.related_plans}
										styles={customStyles}
									/>
								</div>
								<span className="float-end mx-1 mt-1">
									<Button type="submit" className="btn theme-btn mt-2">
										{apply?.text}
									</Button>
									<Button type="clear" className="btn ms-2 theme-btn mt-2">
										{clear?.text}
									</Button>
								</span>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default SheetsFilter;
