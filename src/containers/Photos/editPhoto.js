import { useEffect, useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { updateProjectPhoto } from '../../store/actions/projects';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import { GET_ALL_TAGS } from '../../store/actions/actionType';
import { createTag, getAllTags } from '../../store/actions/projects';
import CustomSelect from '../../components/SelectBox';

const userId = getUserId();
function EditPhoto(props) {
	const { project_id } = useParams();
	const file = props?.data?.file;
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		photo_id: props?.data?._id,
		title: props?.data?.title,
		description: props?.data?.description,
		file: file,
		tags:Array.isArray(props.data.tags) ? props.data.tags : []
	});
	const editPhoto = (e) => {
		e.preventDefault();
		handleClose();
		const post = {
			user_id: userId,
			project_id: project_id,
			photo_id: props?.data?._id,
			title: info?.title,
			description: info?.description,
			file: info?.file,
			tags: info?.tags
		};
		dispatch(updateProjectPhoto(post));
	};

	const handleChange = (val, name) => {
		setInfo({
			...info,
			[name]: val,
		});
	};

	const tags = useSelector((state) => {
		return state?.project?.[GET_ALL_TAGS]?.result || [];
	});

	useEffect(() => {
		if (tags?.length <= 0) {
			dispatch(getAllTags(project_id));
		}
	}, [tags?.length]);

	const { edit_photos, edit_photo, title, upload_file } =
		getSiteLanguageData('photos');
	const { description, save } = getSiteLanguageData('commons');
	const { tage } = getSiteLanguageData('sheet');
	return (
		<>
			<span
				href="/dashboard"
				onClick={handleShow}
				data-placement="left"
				tooltip={edit_photos.tooltip}
				flow={edit_photos.tooltip_flow}>
				<i className="fas fa-edit mt-2"></i>
			</span>
			<Modal
				className="lf-moodal"
				show={show}
				onHide={handleClose}
				size="sm"
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{edit_photo?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<Form onSubmit={editPhoto}>
							<div className="form-group col-sm-12">
								<Form.Label htmlFor="Add Photo" className="mb-0">
									{title?.text}
								</Form.Label>
								<InputGroup>
									<FormControl
										type="text"
										autoComplete="off"
										onChange={(e) => handleChange(e.target.value, 'title')}
										placeholder={'Photo Title'}
										value={info.title}
									/>
								</InputGroup>
							</div>
							<div className="form-group col-sm-12 mt-1">
								<Form.Label htmlFor="Description" className="mb-0">
									{description?.text}{' '}
								</Form.Label>
								<InputGroup>
									<FormControl
										type="text"
										autoComplete="off"
										onChange={(e) =>
											handleChange(e.target.value, 'description')
										}
										placeholder={'Description'}
										value={info.description}
									/>
								</InputGroup>
							</div>

							<div className="form-group col-sm-12 mt-1">
								<Form.Label className="mb-0 mt-1">{tage?.text}</Form.Label>
								<CustomSelect
									isClearable={false}
									isMulti
									type="Creatable"
									className="mb-1"
									placeholder="Tag..."
									name="tags"
									onChange={(e) => {
										let fireHandleChange = true;
										e.filter((val) => val.__isNew__).forEach((val) => {
											fireHandleChange = false;
											dispatch(
												createTag(
													{
														user_id: userId,
														project_id: project_id,
														name: val.value,
													},
													(newTag) => {
														console.log(newTag, "newTag newTag")
														if (newTag?.result?._id) {
															handleChange( [
																...(info.tags) ? info.tags : [],
																newTag?.result?._id,
																'tags'
															]);
														}
													},
												),
											);
										});
										if (fireHandleChange) {
											handleChange(
												e?.map((t) => t.value),
												'tags'
											);
										}
									}}
									value={info?.tags?.map((t) => {
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
									closeMenuOnSelect={false}
								/>
							</div>
							{/* <div className="form-group col-sm-12 mt-3">
				<Upload fileType="Photos" onFinish={(file) => handleChange(file, 'file')}>
				<span className="btn border">
					<i className="fas fa-upload" /> {upload_file?.text}
				</span>
				</Upload></div><div>
			</div> */}
							<div className="text-center mt-1">
								<img
									alt="livefield"
									src={
										info?.thumbnail ||
										info?.file ||
										'/images/sheets/noImage.png'
									}
									width="120px"
									height="120px"
									className=" mt-2 mb-3"
								/>
							</div>
							<Button
								type="submit"
								className="theme-btn btn-block float-end my-3">
								<i className='fa-solid fa-floppy-disk pe-2'></i>	
								{save?.text}
							</Button>
						</Form>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default EditPhoto;
