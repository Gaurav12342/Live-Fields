import { useEffect, useState } from 'react';
import {
	InputGroup,
	Modal,
	FormControl,
	Form,
	Button,
	Card,
} from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import {
	addMultipleProjectPhoto,
	createPlan,
} from '../../store/actions/projects';
import { GET_ALL_TAGS } from '../../store/actions/actionType';
import { createTag, getAllTags } from '../../store/actions/projects';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import { FILE_UPLOAD_LOADING } from '../../store/actions/actionType';
// import Tags from "../../components/tags";
import Upload from '../../components/upload';
import { errorNotification } from '../../commons/notification';
import { clearUploadFile } from '../../store/actions/Utility';
import CustomSelect from '../../components/SelectBox';

function UploadProjectPhoto(props) {
	const {isLoading, setIsLoading} = props;
	const { project_id } = useParams();
	const userId = getUserId();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleShow = () => setShow(true);

	const pageLoading = useSelector((state) => {
		return state?.loading?.[FILE_UPLOAD_LOADING];
	});

	const tags = useSelector((state) => {
		return state?.project?.[GET_ALL_TAGS]?.result || [];
	});

	useEffect(() => {
		if (tags?.length <= 0) {
			dispatch(getAllTags(project_id));
		}
	}, [tags?.length]);

	const handleClose = (e) => {
		setShow(false);
		dispatch(clearUploadFile());
		setInfo([]);
	};

	const [info, setInfo] = useState([]);
	const submitProjectPhoto = (e) => {
		e.preventDefault();
		if (info.file === '') {
			return errorNotification('please select a file');
		}
		handleClose(e);
		const post = {
			user_id: userId,
			project_id: project_id,
			files: info,
		};
		
		dispatch(addMultipleProjectPhoto(post));
		dispatch(clearUploadFile());
		setInfo([]);
	};
	const handleChange = (val, name, k) => {
		const arr = info.filter((file) => {
			return file !== val;
		});

		arr[k] = {
			...arr[k],
			[name]: val,
		};
		setInfo([...arr]);
	};
	const { btn_photo, title } = getSiteLanguageData('photos');
	const { description } = getSiteLanguageData('commons');
	const { add_photo, upload_file } = getSiteLanguageData(
		'photos/uploadprojectphoto',
	);
	const { tage } = getSiteLanguageData('sheet');
	return (
		<>
			<span
				tooltip={btn_photo.tooltip}
				flow={btn_photo.tooltip_flow}
				className={
					props.className || 'lf-main-button lf-link-cursor  float-end'
				}
				onClick={handleShow}>
				<i className="fas fa-plus pe-1"></i> {btn_photo?.text}
			</span>

			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				size="md"
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{add_photo?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<Form onSubmit={submitProjectPhoto}>
							<div className="form-group col-sm-12 mt-2">
								<Upload
									isLoading={isLoading} 
									setIsLoading={setIsLoading}
									fileType="project_photo"
									fileKey={project_id}
									onFinish={(file, fileName) => {
										const fname = fileName.split('.').slice(0, -1).join('.');
										const disc = fname.replace(fname.split(' ')[0], "");
										const data = {
											title: fname.split(' ')?.[0],
											description: disc,
											file: file,
										};
										const newArr = info;
										newArr.push(data);
										setInfo([...newArr]);
									}}>
									<span className="btn border border">
										<i className="fas fa-upload" /> {upload_file?.text}{' '}
										{pageLoading ? <div className="spinner-border" /> : ''}
									</span>
								</Upload>
							</div>
							<div
								className={`my-3 ${
									info.length > 0 ? '' : 'd-none'
								}`}>
								{info?.map((i, k) => {
									return (
										<div className="border-bottom pb-3 mt-3">
											<div className="row" key={k}>
											<div className="form-group col-sm-4 ">
												<Card className="my-1">
													<img
														alt="livefield"
														src={i.file}
														style={{ maxHeight: 200, maxWidth: 200 }}
													/>
												</Card>
											</div>

											<div className="col-sm-7 ">
												<div className="form-group">
													<Form.Label htmlFor="sheet no" className="ms-1">
														{title?.text}
													</Form.Label>
													<InputGroup>
														<FormControl
															type="text"
															autoComplete="off"
															onChange={(e) =>
																handleChange(e.target.value, 'title', k)
															}
															value={i.title}
															placeholder={`${title.text}...`}
															required
														/>
													</InputGroup>
												</div>
												<div className="form-group">
													<Form.Label htmlFor="Description" className="ms-1 mt-2">
														{description?.text}
													</Form.Label>
													<InputGroup className="">
														<FormControl
															type="text"
															autoComplete="off"
															onChange={(e) =>
																handleChange(e.target.value, 'description', k)
															}
															value={i.description}
															placeholder={`${description.text}...`}
															// required
														/>
													</InputGroup>
												</div>
												


												<div className="form-group">
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
																				console.log(i?.tags, "Old")
																				handleChange( [
																					...(i?.tags) ? i?.tags : [],
																					newTag?.result?._id,
																					'tags',
																					k
																				]);
																			}
																		},
																	),
																);
															});
															if (fireHandleChange) {
																handleChange(
																	e?.map((t) => t.value),
																	'tags',
																	k
																);
															}
														}}
														value={i?.tags?.map((t) => {
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



											</div>
											<div className="col-1">
												<span>
													<i
														className="fas fa-trash-alt p-2 theme-btnbg rounded theme-secondary"
														onClick={handleChange.bind(this, i)}></i>
												</span>
											</div>
											</div>
										</div>
									);
								})}
							</div>

							
							<Button
								disabled={isLoading ?? false}
								type="submit"
								className="theme-btn float-end btn-block my-3 folat-end mb-3">
								<i className='fas fa-plus pe-1'></i>
								{add_photo?.text}
							</Button>
						</Form>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default UploadProjectPhoto;
