import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { InputGroup, Modal, FormControl, Form, Button } from 'react-bootstrap';
import { createTag, getAllTags } from './../store/actions/projects';
import getUserId, { getSiteLanguageData } from './../commons';
import { CREATE_TAGS, GET_ALL_TAGS } from './../store/actions/actionType';
import Select from 'react-select';
import { updateSheetPlan } from '../store/actions/sheetPlan';

function TagsCore(props) {
	const dispatch = useDispatch();
	const userId = getUserId();
	const { project_id } = useParams();
	const [addMode, setAddMode] = useState(false);
	const [addData, handleAddData] = useState({
		user_id: userId,
		project_id: project_id,
		name: '',
	});
	const [selectedTags, handleTagSelection] = useState(
		props.selectedTags || props.planData.tags,
	);
	const updateTags = (tagsInfo) => {
		const post = {
			...props.planData,
			tags: selectedTags,
			user_id: userId,
			plan_id: props.planData?._id,
		};
		dispatch(updateSheetPlan(post, true));
	};
	const submitAddData = (e) => {
		e.preventDefault();
		dispatch(createTag(addData));
	};

	const createTagResult = useSelector((state) => {
		return state?.project?.[CREATE_TAGS] || {};
	});

	useEffect(() => {
		if (createTagResult?.success === true) {
			setAddMode(false);
			dispatch(getAllTags(project_id));
			// dispatch(getAllSheets(project_id));
		}
	}, [createTagResult?.success, dispatch]);

	const tags = useSelector((state) => {
		return state?.project?.[GET_ALL_TAGS]?.result || [];
	});

	useEffect(() => {
		if (tags?.length <= 0) {
			dispatch(getAllTags(project_id));
		}
	}, [tags?.length, dispatch]);

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
	const { choose_Tags, create_tag, tag_name, tags_n,ph_tag_name } =
		getSiteLanguageData('components/tags');
	return (
		<div>
			{!addMode ? (
				<>
					<Form>
						<div className={props?.type === 'core' ? 'row' : 'row p-3'}>
							<div className="col-sm-12 ">
								<div className="form-group">
									<Form.Label htmlFor="tags" className="w-100">
										{choose_Tags?.text}
										<span
											onClick={() => setAddMode(true)}
											className="theme-link text-bold float-end show-login text-end">
											{create_tag?.text}
										</span>
									</Form.Label>
									<Select
										name="tags"
										isMulti
										closeMenuOnSelect={false}
										onChange={(e) => {
											handleTagSelection(e?.map((tag) => tag.value));
										}}
										onBlur={(e) => {
											if (props.func) {
												props.func(selectedTags);
											}
										}}
										value={selectedTags?.map((t) => {
											const tag = tags?.filter((tt) => tt._id === t)[0];
											return {
												value: tag?._id,
												label: tag?.name,
											};
										})}
										options={tags.map((tag) => {
											return {
												value: tag?._id,
												label: tag?.name,
											};
										})}
										styles={customStyles}
									/>
								</div>
								{/* <Button type="submit" className="theme-btn  me-2 btn-block">Add Tags</Button> */}
							</div>
						</div>
					</Form>
				</>
			) : (
				<Form>
					<div className={props?.type === 'core' ? 'row' : 'row p-3'}>
						<div className="col-sm-12 mt-2">
							<div className="form-group">
								<Form.Label htmlFor="tag">{tag_name?.text}</Form.Label>
								<InputGroup className="mb-3">
									<FormControl
										placeholder={ph_tag_name?.text}
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
								type="submit"
								onClick={submitAddData}
								className="btn btn-primary theme-btn btn-block my-1 show-verify">
								{create_tag?.text}
							</Button>
						</div>
					</div>
				</Form>
			)}
		</div>
	);
}

const Tags = (props) => {
	const [show, setShow] = useState(false);
	if (props?.type === 'core') {
		return <TagsCore {...props} />;
	}
	return (
		<>
			<span
				data-toggle="tooltip"
				className={props.className || ''}
				data-placement="left"
				onClick={() => setShow(true)}
				title="Tag">
				<i className="fas fa-tag mt-2 "></i>
				<span>{props.title}</span>
			</span>
			<Modal show={show} onHide={() => setShow(false)} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>{tags_n?.text}</Modal.Title>
				</Modal.Header>
				<TagsCore {...props} />
			</Modal>
		</>
	);
};

export default Tags;
