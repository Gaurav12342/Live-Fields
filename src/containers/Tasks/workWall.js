import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

import { GET_WALL_LIST } from '../../store/actions/actionType';

import { getSingleTask } from '../../store/actions/Task';
import { createWall, getWall, deleteWall } from '../../store/actions/projects';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import WallAttachment from './WallAttachment';
import moment from 'moment';
import { errorNotification } from '../../commons/notification';
import Loading from '../../components/loadig';
import { setLightBoxImageData, setLightBoxImageDefaultUrl, toggleLightBoxView } from '../../store/actions/imageLightBox';

const userId = getUserId();
function WorkWall(props) {
		const dispatch = useDispatch();
	const taskId = props?.info?.task_id;
	const [wallEditMode, setWallEditMode] = useState(false);
	const [wallList, setWallList] = useState([]);
		const [isWorkWallLoading, setIsWorkWallLoading] = useState(false);
	const [info, setInfo] = useState({
		wall_work_type: props?.task.task?.wall_work_type,
		total_work: props.task?.task?.total_work,
	});
	
	const [workData, setWorkData] = useState({
		note: '',
		work_done: 0,
		file: [],
	});
	const [isLoading, setIsLoading] = useState(false);


	const handleChange = (name, value) => {
		setWorkData({
			...workData,
			[name]: value,
		});
	};

	useEffect(() => {
		setInfo({
			task_id: taskId,
			wall_work_type: props?.task.task?.wall_work_type,
			total_work: props.task?.task?.total_work,
		});
	},[props?.task])

	useEffect(() => {
		setWallList([]);
		setIsWorkWallLoading(true);
		dispatch(
			getWall({
				user_id: props.userId,
				project_id: props.project_id,
				task_id: taskId,
			},(data)=>{
				if(data?.result?.length > 0){ //success :true
					setIsWorkWallLoading(false);
					setWallList(data?.result);
				}else{
					setIsWorkWallLoading(false);
				}
			}),
		);
	}, [taskId,setWallList]);

	const handleGeneralImage = (file) => {
		if (workData.file && Array.isArray(workData.file)) {
			workData.file.push(file);
		} else {
			workData.file = [file];
		}
		setWorkData({
			...workData,
			file: workData.file,
		});
	};

	const handleDeleteGeneralAttachment = (file) => {
		let files = workData.file.filter((f) => f != file);
		setWorkData({
			...workData,
			file: files,
		});
	};

	const handleSubmit = () => {
		const post = {
			...workData,
			user_id: props.userId,
			project_id: props.project_id,
			task_id: props?.task?.task?._id,
		};

		let totalDoneWork = wallList?.reduce((a, b) => b.work_done + a, 0);
		totalDoneWork = totalDoneWork ? totalDoneWork : 0;

		totalDoneWork = totalDoneWork + Number(workData.work_done);

		if (totalDoneWork > info.total_work) {
			errorNotification('You have entered more then the total work value');
		} else {
			dispatch(
				createWall(post, () => {
					setWorkData({
						note: '',
						work_done: 0,
						file: [],
					});
					setWallEditMode(!wallEditMode);
					dispatch(getSingleTask(props?.task?.task?._id));
					dispatch(
						getWall({
							user_id: props.userId,
							project_id: props.project_id,
							task_id: props?.task?.task?._id,
						},(data)=>{
							if(data?.result?.length > 0){ //success :true
								setWallList(data?.result);
							}
						}),
					);
				}),
			);
		}
	};

	const handleDeleteWall = (wallId) => {
		sweetAlert(
			() =>
				dispatch(
					deleteWall(
						{
							_id: wallId,
							project_id: props.project_id,
							task_id: props?.task?.task?._id,
						},
						(resData) => {
							dispatch(getSingleTask(props?.task?.task?._id));
							dispatch(
								getWall({
									user_id: props.userId,
									project_id: props.project_id,
									task_id: props?.task?.task?._id,
								},(data) => {
								    if(data?.success==true){
										setWallList(data?.result);
									}
								}),
							);
						},
					),
				),
			'task log',
			'Delete',
		);
	};

	const { word_done, save, cancel } = getSiteLanguageData('commons');
	const { notes } = getSiteLanguageData('material');
	const { attachment } = getSiteLanguageData('reports/toolbar');

	const handleImageView = (val) => {
		const images = [];
		wallList?.forEach((msg) => {
			if (msg?.file?.length > 0) {
				msg?.file.forEach((f) => {
					images.push(f);
				});
			}
		});

		dispatch(setLightBoxImageData(images));
		dispatch(toggleLightBoxView(true));
		dispatch(setLightBoxImageDefaultUrl(val));
	};

	return (
		<>
			<div
				style={{
					height: '67vh',
					overflow: 'hidden auto',
				}}
				className="bg-light">
				{!wallEditMode ? (
					<div className="wall-container">
						<div className="wall-wrapper">
							<ul className="wall-wrapper-ul">
								{isWorkWallLoading && <Loading />}
								{wallList &&
									Array.isArray(wallList) &&
									wallList.map((wall, i, arr) => {
										let oldArr = wallList.filter(
											(value, indexNo) => i < indexNo,
										);
										let wDone =
											wall.work_done +
											oldArr.reduce((a, b) => b.work_done + a, 0);
										let wPer = (wDone * 100) / info.total_work;
										wPer = Math.round(wPer * 100) / 100;
										let showDate =
											i == 0 ||
											(typeof wallList[i - 1] != 'undefined' &&
												moment(wallList[i - 1].createdAt).format(
													'YYYY-MM-DD',
												) != moment(wall.createdAt).format('YYYY-MM-DD'));
										return (
											<li key={i + 'wall'} className="wall-wrapper-ul-li">
												<div className="time-line-seprator">
													<span className="time-line-point"></span>
													<span className="line-connector"></span>
												</div>

												<div
													className="wall-content"
													style={{
														margin: !showDate
															? '-7px 0px 22px 20px'
															: '-21px 0px 22px 20px',
													}}>
													{showDate && (
														<div className="time-line-date mb-2">
															<i className="fas fa-calendar-week"></i>{' '}
															{moment(wall.createdAt).format('Do MMM, YYYY')}
														</div>
													)}

													<div className="wall-content-details">
														<div className="d-flex align-items-center">
															<h6 className="lfwpr-80 wall-head mb-0">
																Work done:{' '}
																<span className="text-danger">
																	{wall.work_done}
																</span>
																/{info.total_work} {info.wall_work_type}
															</h6>
															<div className="lfwpr-20">
																<div
																	className="progress fw-bold border border-success"
																	style={{
																		height: '1.5rem',
																		position: 'relative',
																	}}>
																	<div
																		className="wall-progress-percentage"
																		role="progressbar"
																		style={{ width: wPer + '%' }}
																		aria-valuenow={wPer}
																		aria-valuemin="0"
																		aria-valuemax="100">
																		{/* {wPer} % */}
																	</div>
																	<div
																		style={{
																			position: 'absolute',
																			top: '3px',
																			left: '5px',
																		}}>
																		{wPer || 0} %
																	</div>
																</div>
															</div>
														</div>

														<p className="wall-time">
															{moment(wall.createdAt).format('hh:mm A')} |{' '}
															{wall.user?.[0]?.first_name}
														</p>
														<div>{wall.note}</div>
														<div className="mt-2">
															{wall.file?.map((f, fi) => {
																return (
																	<div key={fi + 'file'} className="wall-img">
																		<img
																			onClick={() => handleImageView(f)}
																			className="wall-img-img"
																			src={f}
																		/>
																	</div>
																);
															})}
														</div>
													</div>
												</div>
												<div
													className="ps-2 delete-wall"
													onClick={() => handleDeleteWall(wall._id)}>
													<i className="far fa-trash-alt"></i>
												</div>
											</li>
										);
									})}
							</ul>
						</div>
					</div>
				) : (
					<div className="p-4">
						<div className="col-sm-12 text-start">
							<div className="mb-2 w-100">
								<label className="form-label mb-0">
									{word_done.text} ({info.wall_work_type})
								</label>
								<InputGroup>
									{/*     <InputGroup.Text className="theme-secondary bg-white">
                                            <i className="fas fa-users"></i>
                                        </InputGroup.Text> */}
									<FormControl
										className=" lf-formcontrol-height"
										aria-label="Total Work"
										fullWidth
										type="number"
										name="work_done"
										pattern="[0-9]"
										autoComplete="off"
										onChange={(e) => handleChange('work_done', e.target.value)}
										value={info.work_done}
									/>
								</InputGroup>
							</div>
						</div>

						<div className="col-sm-12 text-start">
							<div className="mb-2 w-100">
								<label className="form-label mb-0">{notes.text}</label>
								<InputGroup>
									{/*    <InputGroup.Text className="theme-secondary bg-white">
                                            <i className="fas fa-users"></i>
                                        </InputGroup.Text> */}
									<FormControl
										className=" lf-formcontrol-height"
										aria-label="Work note"
										fullWidth
										type="text"
										name="note"
										autoComplete="off"
										onChange={(e) => handleChange('note', e.target.value)}
										value={info.note}
									/>
								</InputGroup>
							</div>
						</div>
						<div className="col-sm-12 text-start">
							<div className="d-flex">
								<div className="w-50 p-1 form-label mb-0">
									{attachment.text}
								</div>

								<div className="w-50">
									<div className="p-1 text-end">
										<span>
											<WallAttachment isLoading={isLoading} setIsLoading={setIsLoading} setGeneralImage={handleGeneralImage} />
										</span>
									</div>
								</div>
							</div>

							<div className="progress-attachement p-3">
								{workData.file && Array.isArray(workData.file) && (
									<div
										className="position-relative"
										style={{ minHeight: '40px' }}>
										{isLoading && <Loading />}
										{workData.file?.map((f) => {
											return (
												<>
													<img
														alt="livefield"
														src={f}
														style={{ width: '40px', height: '40px' }}
													/>

													<i
														className="fas fa-times fa-xs lf-icon"
														onClick={() =>
															handleDeleteGeneralAttachment(f)
														}></i>
												</>
											);
										})}
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
			<div className="text-end pt-2 pb-4 pe-4 bg-light">
				{wallEditMode ? (
					<>
						<Button
							className="light-border btn-light btn-block me-2"
							onClick={() => {
								setWallEditMode(!wallEditMode);
							}}>
							{cancel.text}
						</Button>
						<Button
							className="text-white btn-primary"
							onClick={() => {
								handleSubmit();
							}}>
							{save.text}
						</Button>
					</>
				) : (
					<>
						<Button
							className="text-white"
							disabled={
								wallList?.reduce((a, b) => b.work_done + a, 0) >=
									info.total_work || !info.total_work
							}
							onClick={() => {
								setWallEditMode(!wallEditMode);
							}}>
							<i className="fa fa-plus"></i>
						</Button>
					</>
				)}
			</div>
		</>
	);
}
export default React.memo(WorkWall);
