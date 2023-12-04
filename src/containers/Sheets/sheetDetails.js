import { Component } from 'react';
import { Card, Col, Row, Tabs, Tab, Placeholder, Modal } from 'react-bootstrap';
import React from 'react';
import AddRelatedSheet from './addRelatedSheet';
import AddRelatedFile from './addRelatedFile';
import AddRevision from './addRevision';
import SheetDetailsInfo from './sheetInfo';
import RevisionSort from './RevisionSort';
import AddCreateTask from '../Tasks/addCreateTask';
import AddSheetsPhotos from './addsheetsphotos';
import {
	GET_ALL_SHEETS_COMMENT,
	GET_ALL_SHEETS_PHOTOS,
	GET_RELATED_FILES,
	GET_RELATED_SHEET,
	GET_SHEET_DETAILS_BY_ID,
} from '../../store/actions/actionType';
import {
	addRelatedFiles,
	addRelatedSheet,
	deleteSheetRelatedPhotos,
	getAllSheetsComments,
	getAllSheetsPhotos,
	getRelatedFiles,
	getRelatedSheet,
	getSingleSheets,
	planComment,
} from '../../store/actions/projects';
import Nodata from '../../components/nodata';
import NotFound from '../../containers/General/NotFound';
import { connect } from 'react-redux';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import {REACT_APP_TOOL_URL} from '../../commons/constants';
import Layout from '../../components/layout';
import CustomSelect from '../../components/SelectBox';
import { getToken } from '../../store/axiosHelper';
import UpdateTask from '../Tasks/updateTask';
import { createTask, updateTask } from '../../store/actions/Task';
import { Link } from 'react-router-dom';
import {
	setLightBoxImageData,
	setLightBoxImageDefaultUrl,
	toggleLightBoxView,
} from '../../store/actions/imageLightBox';
import withRouter from '../../components/withrouter';
const userId = getUserId();
class SheetInfo extends Component {
	constructor(props) {
		super(props);
		this.plan_id = this.props.router?.params.plan_id;
		this.project_id = this.props.router?.params.project_id;
		this.state = {
			infoComment: {
				user_id: userId,
				plan_id: this.plan_id,
				comment: '',
				file_link: [],
			},
			file: '',
			selected_revision_no: {},
			visible: {},
			selectedTask: {},
			versionModel:false,
		};
	}

	componentDidMount() {
		const { dispatch } = this.props;
		const plan_id = this.plan_id;
		dispatch(getSingleSheets(plan_id));
		dispatch(getAllSheetsComments(plan_id));
		dispatch(getRelatedSheet(plan_id));
		dispatch(getRelatedFiles(plan_id));
		dispatch(getAllSheetsPhotos(this.plan_id));
		const that = this;
		/* window.onmessage = function (e) {
			
			if (e.data?.type == 'task_created' || e.data?.type == 'task_deleted') {
				dispatch(getSingleSheets(plan_id));
				that.setSelectetdTask(e?.data?.task);
				
			}else{
				dispatch(getRelatedSheet(plan_id));
				dispatch(getRelatedFiles(plan_id));
				dispatch(getAllSheetsPhotos(this.plan_id));
			}
		}; */
		window.addEventListener('message', function (e) {
			// Get the sent data
			const data = e.data;
			let message = data && data.length > 10 && data.indexOf("$") === -1 ? JSON.parse(data) : {};
			
			if(message.task && message.task.trim()){
				dispatch(getSingleSheets(plan_id));
			}

			if(message.sheet && Array.isArray(message.sheet) && message.sheet.length > 0){
				dispatch(getRelatedSheet(plan_id));
			}

			if(message.photo && Array.isArray(message.photo) && message.photo.length > 0){
				dispatch(getAllSheetsPhotos(plan_id));
			}

			if(message.file && Array.isArray(message.file) && message.file.length > 0){
				dispatch(getRelatedFiles(plan_id));
			}
			/*
			
			
			dispatch(getAllSheetsPhotos(plan_id)); */
			// If you encode the message in JSON before sending them,
			// then decode here
			// const decoded = JSON.parse(data);
		});
	}

	setSelectetdTask = (task) => {
		this.setState({
			selectedTask: task,
		});
		if (task?._id) {
			this.props.navigate(
				`/sheets/${this.project_id}/sheetInfo/${this.plan_id}?${task?._id}`,
			);
		} else {
			this.props.navigate(
				`/sheets/${this.project_id}/sheetInfo/${this.plan_id}`,
			);
		}
	};

	setInfoComment = (infoComment) => {
		this.setState({ infoComment });
	};
	handleChangeComment = (val, name) => {
		this.setInfoComment({
			...this.state.infoComment,
			[name]: val,
		});
	};
	submitComment = (e) => {
		e.preventDefault();
		const post = {
			user_id: userId,
			plan_id: this.plan_id,
			comment: this.state.infoComment?.comment,
			file_link: this.state.infoComment?.file_link,
		};
		this.props.dispatch(planComment(post));
	};
	setInfo = (info) => {
		this.setState({ info });
	};
	handleUnlinkSheet = (link) => {
		const { relatedplan } = this.props;
		const newArr = relatedplan?.filter((item) => {
			return item._id !== link._id;
		});
		const relatedId = newArr?.map((x) => x._id);
		this.props.dispatch(
			addRelatedSheet({
				project_id: this.project_id,
				plan_id: this.plan_id,
				user_id: userId,
				related_plans: relatedId,
			}),
		);
	};
	handleUnlinkFiles = (link) => {
		const { relatedfile } = this.props;
		const newArr = relatedfile?.filter((item) => {
			return item._id !== link._id;
		});
		const relatedId = newArr?.map((x) => x._id);
		this.props.dispatch(
			addRelatedFiles({
				project_id: this.project_id,
				plan_id: this.plan_id,
				user_id: userId,
				files: relatedId,
			}),
		);
	};
	handleUnlinkTasks = (link) => {
		this.props.dispatch(
			updateTask(
				{
					user_id: userId,
					project_id: this.project_id,
					task_id: link._id,
					title: link.title,
					location_id: link.location_id,
					plan_id: 'unlink',
					board_id: link.board_id,
					type: link.type,
					category_id: link.category_id,
					assigee_id: link.assigee_id,
					members_id: link.members_id,
					watchers: link.watchers,
					tags: link.tags,
					cost: link.cost,
					start_date: this.start_date,
					end_date: this.end_date,
					manpower: link.manpower,
					is_published: link.is_published,
				},
				this.plan_id,
			),
		);
	};

	setVisible = (visible) => {
		this.setState({
			visible,
		});
	};

	handleChangeImg = (e) => {
		
		const file = this.props?.data?.revisions
			?.filter((x) => x.index === e.value)[0]
			?.file?.toString();
		this.setState({
			file,
			selected_revision_no: e,
		});
	};
	handleImageViewer = (url) => {
		const { photoData } = this.props;
		const images = [];
		photoData?.forEach((r) => {
			r?.photos?.forEach((d) => {
				images.push({
					url: d.file,
					imageCaption: r.description,
					imageTitle: r.title,
				});
			});
		});
		this.props.dispatch(setLightBoxImageData(images));
		// this.props.dispatch(toggleLightBoxView(true));
		this.props.dispatch(setLightBoxImageDefaultUrl(url));
		if(this?.props?.lightBoxView != true){
			this.props.dispatch(toggleLightBoxView(true));
		}
	};

	handleVersionModel = () => {
		this.setState({versionModel: !this.state.handleVersionModel});
	}

	render() {
		const { data, relatedplan, relatedfile, photoData } = this.props;
		const name = data?.name;
		const plan_id = this.plan_id;
		const sheetData = {
			_id: data?._id,
			directory_id: data?.directory_id,
			name: data?.name,
			sheet_no: data?.sheet_no,
			description: data?.description,
			tags: data?.tags,
			revisions: data?.revisions,
		};
		const { selected_revision_no } = this.state;
		const { btn_sheet_revision, btn_add_task } =
			getSiteLanguageData('sheet/toolbar');
			const { revisons } =
			getSiteLanguageData('sheet');
		const { delink } = getSiteLanguageData('commons');
		return (
			<>
				{
					data && data._id ? (

						<Layout
							chatOptions={{
								room: this.plan_id,
								chat_from: 'sheet',
								title: 'Sheet Chat',
							}}>
							{this.state.selectedTask?._id ? (
								<UpdateTask
									data={this.state.selectedTask}
									hideBtn={true}
									handleClose={() => {
										this.setSelectetdTask({});
									}}
								/>
							) : (
								''
							)}
							<div id="page-content-wrapper">
								<section className="lf-dashboard-toolbar">
									<div className="row align-items-center">
										<div className="col-sm-12 d-inline-block">
											<div className="d-flex align-items-center mt-1">
												<div className="float-start d-none d-md-inline-block">
														<Link
															className="lf-common-btn"
															to={`/sheets/${this.project_id}`}>
															<i className="fa fa-arrow-left" aria-hidden="true"></i>
														</Link>
													
												</div>
												<div className="float-start d-none d-md-inline-block">
													<h3 className="lf-text-overflow-350 mt-1">
															{data?.sheet_no}{' '}
															{data?.description ? ` - ` + data?.description : ''}
													</h3>

												</div>

												<div className="ms-auto float-end text-middle">
													{
														sheetData?.name && (
															<RevisionSort 
																className="lf-common-btn"
																planData={sheetData}
															/>
														)
													}
													{sheetData?.name ? (
														<SheetDetailsInfo
															className="lf-common-btn"
															planData={sheetData}
															type="single">
															{' '}
														</SheetDetailsInfo>
													) : (
														''
													)}
												</div>
											</div>
											
										</div>

									</div>
								</section>
								<div className="container-fluid">
									<div className="row mt-3 mx-2">
										<div className="col-md-6 col-lg-9 card position-relative lf-sheetdetails-parent p-1">
											{/* <span className="text-center m-3 "> */}
											{/* <img alt="livefield" className="lf-sheetdetails-img" src={this.state.file || data?.revisions?.filter(x => x.revision_no === data?.revision_no)[0]?.file?.toString()} width="100%" /> */}
											<iframe
												src={`${REACT_APP_TOOL_URL}?project_id=${
													this.project_id
												}&plan_id=${
													this.plan_id
												}&userId=${userId}&token=${getToken()}&revision_no=${
													selected_revision_no?.value
												}&platform=web&v=${new Date().getTime()}`}
												className="lf-sheetdetails-iframe"
												allow="fullscreen"
												id="lfiframe"
												// allowfullscreen
												// style={{width : '100%', height: 'inherit'}}
											/>
											<div className="lf-Sheet-details-toolbar position-absolute bottom-0 end-0 me-4 mb-3" style={{width:'125px'}}>
												{/* <h6 className="d-inline-block text-dark">
													{' '}
													{btn_sheet_revision?.text}
													<AddRevision plan_id={this.plan_id}></AddRevision>
												</h6> */}
												{data?.revisions?.length > 0 ? (
													<CustomSelect
														className="bg-light w-100"
														name="revision"
														onChange={(e) => this.handleChangeImg(e)}
														value={{
															label:
																selected_revision_no?.label ||
																data?.revisions?.[0].revision_no,
															value:
																selected_revision_no?.value ||
																data?.revisions?.[0]._id,
														}}
														options={data?.revisions?.map((pr) => {
															return {
																value: pr?._id,
																label: pr?.revision_no?.toString(),
															};
														})}
														menuPlacement={'top'}
													/>
												) : (
													<Placeholder />
												)}
											</div>
										</div>
										<div className="col-md-6 col-lg-3 task-insert-data lf-sheetdetails-parent">
											<Tabs
												defaultActiveKey="Related Tasks"
												id="tab-example"
												className="text-secondary"
												justify
												fill>
												<Tab eventKey="Related Sheets" title="Sheets">
													<div className="text-center">
														<div className="">
															<AddRelatedSheet
																selectedSheet={relatedplan?.map((e) => e._id)}
																plan_id={this.plan_id}></AddRelatedSheet>
														</div>
														<div className="lf-sheet-comment mt-2 ">
															{relatedplan?.map((rp) => {
																return (	
																		<Row  className="lf-sheetdetails-tos mt-2 p-2 d-flex align-items-center">
																			<Col onClick={(e)=>window.location.href=`/sheets/${this.project_id}/sheetInfo/${rp._id}`} xs={3}>
																				<img
																					alt="livefield"
																					src={
																						rp?.thumbnail ||
																						'/images/sheets/sheets_demo.png'
																					}
																					className="lf-sheetdetails-sheet align-middle"></img>
																			</Col>
																			<Col
																				onClick={(e)=>window.location.href=`/sheets/${this.project_id}/sheetInfo/${rp._id}`}
																				xs={7}
																				className="text-start overflow-hidden text-truncate">
																				<div className="lf-task-color text-nowrap p-0">
																					{rp.sheet_no}
																				</div>
																				<div className="theme-secondary lf-task-kanban-title text-wrap fw-normal">
																					{rp.description}
																				</div>
																			</Col>
																			<Col xs={2}>
																				<i
																					title="Link File"
																					className="fas fa-unlink fa-sm mt-2 rounded theme-secondary p-1 theme-btnbg "
																					onClick={this.handleUnlinkSheet.bind(
																						this,
																						rp,
																					)}>
																					{' '}
																				</i>
																				{/* {delink?.text} */}
																			</Col>
																		</Row>
																		
																	
																);
															})}
														</div>
													</div>
												</Tab>
												<Tab eventKey="Related Tasks" title="Tasks">
													<div className="">
														<div className="text-center">
															{/* <AddCreateTask /> */}
																<div
																	className="btn btn-block bg-white w-100 mt-3 border-0"
																	title={'Add Task'}
																	onClick={() => {
																		this.props.dispatch(
																			createTask(
																				{
																					user_id: userId,
																					is_completed: false,
																					is_verified: false,
																					project_id: this.project_id,
																					title: 'New Task',
																					board_id: '60f29b1e39a731803e8c4cf3',
																					type: 'planned',
																					assigee_id: userId,
																					members_id: [],
																					watchers: [],
																					tags: [],
																					cost: '',
																					plan_id: this.plan_id,
																					start_date: '',
																					end_date: '',
																					manpower: '',
																					is_published: true,
																				},
																				true,
																			),
																		);
																	}}>
																	<span title="Link Task" className="theme-color lf-link-cursor">
																		<i className="fas fa-plus px-1"></i>{' '}
																		{btn_add_task?.text}
																	</span>
																	
																</div>
															
														</div>
														<div className="lf-sheet-comment pb-2 mt-2 ">
															{data?.task?.map((t) => {
																const taskCategory = t?.category?.map((x) => x.name);
																const taskCat = taskCategory?.[0];
																return (
																	
																	<Row className="lf-sheetdetails-tos p-2 mt-2 d-flex">
																		<Col xs={2} className={`px-1`}>
																			{' '}
																			<span
																				className="d-block kanban-task-img text-white text-uppercase"
																				style={{
																					backgroundColor: t?.board[0]?.color_code,
																					fontSize: '11px',
																					paddingTop: '3px',
																				}}>
																				{taskCat?.charAt(0)}
																				{taskCat?.charAt(1)}
																			</span>
																		</Col>
																		<Col
																			xs={8}
																			className="px-1 text-start theme-secondary text-nowrap overflow-hidden text-truncate lf-task-kanban-title ms-1"
																			onClick={() => this.setSelectetdTask(t)}>
																			<span className="text-secondary">
																				#{t?.task_no} | @{' '}
																				{t?.assigee?.map((a) => {
																					return <>{a.first_name}</>;
																				})}
																			</span>
																			<br />
																			<span className="lf-task-color text-wrap">
																				{t.title}
																			</span>
																		</Col>
																		<Col xs={1} className="mx-0 px-0 ">
																			<i
																				title="Link File"
																				className="fas fa-unlink fa-sm  mt-0 p-1 rounded theme-secondary  theme-btnbg "
																				onClick={this.handleUnlinkTasks.bind(
																					this,
																					t,
																				)}>
																				{' '}
																			</i>
																			{/* {delink?.text}{' '} */}
																		</Col>
																	</Row>
																	
																);
															})}
														</div>
													</div>
												</Tab>
												<Tab eventKey="Add File" title="Files">
													<div>
														<div className="text-center">
															<div className="">
																<AddRelatedFile
																	selectFile={relatedfile?.map((f) => f._id)}
																	plan_id={this.plan_id}></AddRelatedFile>
															</div>
														</div>

														<div className="lf-sheet-comment pb-2 mt-2">
															{relatedfile?.map((rf) => {
																let file = rf.file.split('/').slice(-1).join('.');
																let ext = file.split('.').slice(-1).join('.');
																
																return (
																	
																	<Row title={rf.file.split('/').slice(-1)} className="lf-sheetdetails-tos p-2 mt-2 d-flex align-items-center">
																		<Col xs={2} className="overflow-hidden">
																			<a href={rf.file} target={'_blank'}>
																				<img
																				alt="livefield"
																				src={rf.icon || `/images/${ext}-icon.png`}
																				style={{height: '30px'}}></img>
																			</a>
																			
																		</Col>
																		<Col
																			xs={8}
																			className="lf-task-color text-start text-wrap">
																			<a href={rf.file} target={'_blank'}>{decodeURI(rf?.file_name) || decodeURI(file)}</a>
																		</Col>
																		<Col xs={2} className="mx-0 px-0 ">
																			<i
																				title="Link File"
																				className="fas fa-unlink fa-sm rounded theme-secondary p-2 theme-btnbg"
																				onClick={this.handleUnlinkFiles.bind(
																					this,
																					rf,
																				)}>
																				{' '}
																			</i>
																			{/* {delink?.text} */}
																		</Col>
																	</Row>
																	
																);
															})}
														</div>
													</div>
												</Tab>
												<Tab eventKey="Add Photo" title="Photos">
													<div className="">
														<div className="text-center">
															<div className="">
																<AddSheetsPhotos
																	plan_id={this.plan_id}
																	className="theme-color lf-link-cursor"
																/>
															</div>
														</div>
														<div className="lf-sheet-comment mt-2">
															{photoData?.map((sp, k) => {
																return (
																	<div className="" key={k}>
																		<h6 className="text-start">
																			<i className="fa-regular fa-folder me-2"></i>
																			<span className="lf-task-color">{sp.date}</span>
																		</h6>
																		<div className="d-flex flex-wrap">
																			{Object.values(sp?.photos).map((f, pk) => {
																				return (
																					<>
																						<div className="load-more-container-300">
																							<div className="sheet-grid-box position-relative ms-1">
																								<div className="position-relative">
																									<img
																										title={f.description || f.title}
																										alt={f.description || f.title}
																										src={
																											f.thumbnail ||
																											'/images/sheets/sheets_demo.png'
																										}
																										onClick={() =>
																											this.handleImageViewer({
																												url: f.file,
																												imageCaption: sp.description,
																												imageTitle: sp.title,
																											})
																										}
																										className="lf-h-70 lf-w-75"
																									/>
																								</div>
																								<div className="sheet-grid-box-actions-plan lf-link-cursor">
																									<span
																										data-toggle="tooltip"
																										data-placement="left"
																										title="Delete">
																										<i
																											className="fas fa-trash-alt mt-2 "
																											onClick={() =>
																												sweetAlert(
																													() =>
																														this.props.dispatch(
																															deleteSheetRelatedPhotos(
																																{
																																	plan_id:
																																		this.plan_id,
																																	user_id: userId,
																																	photos: [
																																		{
																																			id: f?._id,
																																			// url: [f.file],
																																		},
																																	],
																																},
																															),
																														),
																													'Plan Photo',
																												)
																											}></i>
																									</span>
																								</div>
																							</div>
																						</div>
																					</>
																				);
																			})}
																		</div>
																	</div>
																);
															})}
														</div>
													</div>
												</Tab>
											</Tabs>
										</div>
									</div>
								</div>
							</div>
							<Modal
								className="lf-modal"
								size="sm"
								show={this.state.versionModel}
								data-keyboard={false}
								// backdrop={false}
								closeOnEscape={false}
								onHide={this.handleVersionModel}
								animation={true}>
								<Modal.Header className="py-2 bg-light" closeButton>
									<Modal.Title className="mb-0 fs-4">{`${revisons.text} versions`} </Modal.Title>
								</Modal.Header>
								<Modal.Body>
									
								</Modal.Body>
							</Modal>
						</Layout>
					) : (
						<Nodata type="Plans"></Nodata>
					)
				}
			</>
				
		);
	}
}
export default withRouter(
	connect((state) => {
		return {
			forgotPasswordData: state.forgotPass,
			data: state?.project?.[GET_SHEET_DETAILS_BY_ID]?.result,
			comments: state?.project?.[GET_ALL_SHEETS_COMMENT]?.result,
			relatedplan: state?.project?.[GET_RELATED_SHEET]?.result,
			relatedfile: state?.project?.[GET_RELATED_FILES]?.result,
			photoData: state?.project?.[GET_ALL_SHEETS_PHOTOS]?.result,
			lightBoxView:state?.image_lightbox?.LIGHTBOX_VIEW_STATUS
		};
	})(SheetInfo),
);
