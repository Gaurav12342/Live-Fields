import { useState } from 'react';
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
import { createPlan } from '../../../store/actions/projects';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../../commons';
import {
	FILE_UPLOAD_LOADING,
	GET_ALL_SHEETS,
} from '../../../store/actions/actionType';
// import Tags from "../../components/tags";
import Upload from '../../../components/upload';
import { errorNotification } from '../../../commons/notification';
import { clearUploadFile } from '../../../store/actions/Utility';
import CustomSelect from '../../../components/SelectBox';

function CreatePlan(props) {
	const { project_id } = useParams();
	const directoryId = props?.directory_id;
	const userId = getUserId();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const [step, setStep] = useState();
	const handleShow = () => setShow(true);
	const sheet = useSelector((state) => {
		return state?.project?.[GET_ALL_SHEETS]?.result;
	});
	const pageLoading = useSelector((state) => {
		return state?.loading?.[FILE_UPLOAD_LOADING];
	});

	const sheets = sheet?.map((c) => {
		return { label: c.name, value: c._id };
	});
	const handleClose = (e) => {
		setShow(false);
		dispatch(clearUploadFile());
		setInfo([]);
		setSheetDirectory({
			directory_id: sheets[0]?.value,
		});
		setStep([]);
	};

	const [sheetDirectory, setSheetDirectory] = useState({
		directory_id: sheets[0]?.value,
	});
	const [info, setInfo] = useState([]);
	const submitPlan = (e) => {
		e.preventDefault();
		if (info.file_url === '') {
			return errorNotification('please select a file');
		}
		handleClose(e);
		const post = {
			user_id: userId,
			project_id: project_id,
			directory_id: directoryId || sheetDirectory?.directory_id,
			plans: info,
		};
		
		dispatch(createPlan(post));
		dispatch(clearUploadFile());
		setInfo([]);
	};

	const handleChangeInfo = (name, value) => {
		setSheetDirectory({
			...sheetDirectory,
			[name]: value,
		});
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
	const { select_directory, choose_folder, add_plan } =
		getSiteLanguageData('sheet/createplan');
	const { sheet_no } = getSiteLanguageData('sheet');
	const { description, upload_file } = getSiteLanguageData('commons');

	return (
		<>
			{React.cloneElement(props.children, { onClick: handleShow })}
			{props.type === 'common' ? (
				<>
					<Modal
						className="lf-modal"
						show={show}
						onHide={handleClose}
						size=""
						animation={true}>
						<Modal.Header className="py-2 bg-light" closeButton>
							<Modal.Title>{choose_folder?.text}</Modal.Title>
						</Modal.Header>

						<Modal.Body>
							<div>
								<Form onSubmit={submitPlan}>
									<div className="form-group col-lg-12 ">
										<Form.Label className="mb-0">
											{select_directory?.text}
										</Form.Label>
										<CustomSelect
											name="directory_id"
											onChange={(e) =>
												handleChangeInfo('directory_id', e?.value)
											}
											placeholder="Select Directory"
											options={sheets}
											value={sheets?.filter(
												(d) => d?.value === sheetDirectory?.directory_id,
											)}
											required
										/>
									</div>
									{sheetDirectory?.directory_id === '' ? (
										''
									) : (
										<div className="form-group col-sm-12 mt-2">
											<Upload
												fileType="plan"
												fileKey={directoryId}
												onFinish={(file, fileName) => {
													const fname = fileName
														.split('.')
														.slice(0, -1)
														.join('.');
													const sNo = fname ? fname.split(" ")[0] : fname;
													const ds = fname && fname.split(" ").length > 0 ? fname.replace(sNo, "").trim() : fname;
													const data = {
														name: fname,
														sheet_no: sNo,
														description: ds,
														tags: [],
														file_url: file,
													};
													const newArr = info;
													newArr.push(data);
													setInfo([...newArr]);
												}}></Upload>
										</div>
									)}

									{info?.length ? (
										<div className="my-3">
											{info?.map((i, k) => {
											let file = i.file_url.split('/').slice(-1).join('.');
											let ext = file.split('.').slice(-1).join('.');
											return (
												<div className="border-bottom pb-3 mt-3">
													<div className="row" key={k}>
														<div className="form-group col-sm-4 text-center">
															{/* <Card> */}
																{ext === 'pdf' ? (
																	<img
																		alt="livefield"
																		className="mt-2"
																		src={`/images/${ext}-icon.svg`}
																		style={{ maxHeight: 100, width: 'auto', maxWidth:'100%' }}
																	/>
																) : (
																	<img
																		alt="livefield"
																		className="mt-2"
																		src={i.file_url}
																		style={{ maxHeight: 100, maxWidth: 150 }}
																	/>
																)}
															{/* </Card> */}
														</div>
														<div className="col-sm-7 ">
															<div className="form-group">
																<Form.Label
																	htmlFor="sheet no"
																	className="ms-1 mb-0">
																	{sheet_no?.text}{' '}
																</Form.Label>
																<InputGroup className="">
																	<FormControl
																		type="text"
																		autoComplete="off"
																		onChange={(e) =>
																			handleChange(
																				e.target.value,
																				'sheet_no',
																				k,
																			)
																		}
																		value={i.sheet_no}
																		placeholder={'Sheet no'}
																		required
																	/>
																</InputGroup>
															</div>
															<div className="form-group">
																<Form.Label
																	htmlFor="Description"
																	className="ms-1 mt-1 mb-0">
																	{description?.text}{' '}
																</Form.Label>
																<InputGroup className="">
																	<FormControl
																		type="text"
																		autoComplete="off"
																		onChange={(e) =>
																			handleChange(
																				e.target.value,
																				'description',
																				k,
																			)
																		}
																		value={i.description}
																		placeholder={'Description'}
																	/>
																</InputGroup>
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
									) : (
										''
									)}
									
									<div className="form-group col-lg-12 ">
										<Button
											type="submit"
											className="theme-btn ms-2 btn-block my-3 float-end ">
											<i class="fas fa-plus pe-1"></i>
											{add_plan?.text}
										</Button>
									</div>
								</Form>
							</div>
						</Modal.Body>
					</Modal>
				</>
			) : (
				<Modal
					className="lf-modal"
					show={show}
					onHide={handleClose}
					size="md"
					animation={true}>
					<Modal.Header className="py-2 bg-light" closeButton>
						<Modal.Title>{add_plan?.text}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div>
							<Form onSubmit={submitPlan}>
							<div className="form-group col-sm-12 mt-2">
									{/* <Tags type="core">
				Select Tags
				</Tags> */}

									{/* {data?.map((u) => {
				return (
					<label className="check">{u.name}
					<input
						type="checkbox"
						id="blankCheckbox"
						value="option1"
						
					/>
					<input type="checkbox" />
					<span className="checkmark"></span>
					</label>
				);
				})
				} */}

									<Upload
										fileType="plan"
										fileKey={directoryId}
										onFinish={(file, fileName) => {
											const fname = fileName.split('.').slice(0, -1).join('.');
											const disc = fname.replace(fname.split(' ')[0], "");
											const data = {
												name: fname,
												sheet_no: fname.split(' ')[0],
												description: disc,
												tags: [],
												file_url: file,
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

									{/* <span className="btn ms-3 border border">
				{

					info.file_url.length > 0 ?
					info.file_url.map(f => <img src={f} style={{ width: '150px' }} />)
					: null
				}
				</span>
				<Upload fileType="plan" fileKey={directoryId} onFinish={(file_url,fileName) => {
				const fileList = info.file_url;
				fileList.push(file_url)
				handleChange(fileList, 'file_url')
				}}>
				
				<span className="btn ms-3 border border">
					<i className="fas fa-upload" /> upload file {pageLoading ? <div className="spinner-border" /> : ""}
				</span>
				</Upload> */}
								</div>
								<div
									className={`my-3 ${
										info.length > 0 ? '' : 'd-none'
									}`}>
									{info?.map((i, k) => {
										let file = i.file_url.split('/').slice(-1).join('.');
										let ext = file.split('.').slice(-1).join('.');
										return (
											<div className="row border-bottom pb-3 mt-3" key={k}>
												<div className="form-group col-sm-4 text-center">
													{/* <Form.Label htmlFor="Add plan" className="ms-1">Plan Name </Form.Label>
					<InputGroup className="">
						<FormControl
						type="text"
						onChange={(e) => handleChange(e.target.value, 'name')}
						placeholder={"Plan name"}
						required
						/>
					</InputGroup> */}
													<div className="mt-2">
														{ext === 'pdf' ? (
															// <img alt="livefield" className="mt-2" src={i.file_url} style={{ maxHeight: 200, maxWidth: 200 }} />
															<img
																alt="livefield"
																className="mt-2"
																src={`/images/${ext}-icon.svg`}
																style={{ maxHeight: 100, maxWidth: 150 }}
															/>
														) : (
															<img
																alt="livefield"
																className="mt-2"
																src={i.file_url}
																style={{ maxHeight: 100, width: 'auto', maxWidth:'100%' }}
															/>
														)}
													</div>
												</div>
												<div className="col-sm-7 ">
													<div className="form-group">
														<Form.Label htmlFor="sheet no" className="ms-1">
															{sheet_no?.text}
														</Form.Label>
														<InputGroup>
															<FormControl
																type="text"
																autoComplete="off"
																onChange={(e) =>
																	handleChange(e.target.value, 'sheet_no', k)
																}
																value={i.sheet_no}
																placeholder={'Sheet no'}
																required
															/>
														</InputGroup>
													</div>
													<div className="form-group">
														<Form.Label htmlFor="Description" className="ms-1">
															{description?.text}{' '}
														</Form.Label>
														<InputGroup className="">
															<FormControl
																type="text"
																autoComplete="off"
																onChange={(e) =>
																	handleChange(e.target.value, 'description', k)
																}
																value={i.description}
																placeholder={'Description'}
																// required
															/>
														</InputGroup>
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
										);
									})}
								</div>

								
								<Button
									type="submit"
									className="theme-btn float-end btn-block my-3 folat-end mb-3">
									<i class="fas fa-plus pe-1"></i>
									{add_plan?.text}
								</Button>
							</Form>
						</div>
					</Modal.Body>
				</Modal>
			)}
		</>
	);
}
export default CreatePlan;
