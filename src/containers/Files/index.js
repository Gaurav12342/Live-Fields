import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Nodata from '../../components/nodata';
import Layout from '../../components/layout';
import {
	CREATE_DIRECTORY,
	DELETE_FILE,
	DELETE_FILE_DIRECTORY,
	GET_ALL_FILE_LIST_DIRECTORIES_WISE,
	UPDATE_FILE_DIRECTORY,
} from '../../store/actions/actionType';
import {
	createFileDirectory,
	getAllFileDirectoriesWise,
	updateDirectories,
	deleteFileDirectory,
	deleteFile,
	sharefiles,
	shareFiles,
} from '../../store/actions/projects';
import {
	Button,
	Dropdown,
	Form,
	FormCheck,
	FormControl,
	InputGroup,
	Modal,
} from 'react-bootstrap';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import Loading from '../../components/loadig';
import ChangeFileDirectory from './changeFileDirectory';
import UpdateFileName from './updateFile';
import SheetFile from './createFile';
import moment from 'moment';
import CustomSearch from '../../components/CustomSearch';
import Swal from 'sweetalert2';
import withRouter from '../../components/withrouter';
import ShareFile from '../../components/shareFile'
const userId = getUserId();
const directoryId = window.localStorage.getItem('_id');

class Files extends Component {
	constructor(props) {
		super(props);
		this.project_id = this.props.router?.params.project_id;
		this.state = {
			info: {
				user_id: userId,
				project_id: this.project_id,
				directory_id: directoryId,
				name: '',
			},
			directoryInfo: {
				project_id: this.project_id,
				user_id: userId,
				name: '',
			},
			show: false,
			collapsibleData: {},
			sortType: '3',
			showEditDirectories: false,
			multiSelect: [],
			showShareModel:false,
			shareLink:""
		};
	}

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(getAllFileDirectoriesWise(this.project_id));
	}

	handleShow = () => {
		this.setShow(true);
	};
	handleClose = () => {
		this.setShow(false);
		this.setDirectoryInfo({
			project_id: this.project_id,
			user_id: userId,
			name: '',
		});
	};
	handleCloseEditDirectories = () => {
		this.setshowEditDirectory(false);
	};

	setShow = (show) => {
		this.setState({ show });
	};
	setshowEditDirectory = (showEditDirectories) => {
		this.setState({ showEditDirectories });
	};
	manageCollapsibleData = (collapsibleData) => {
		this.setState({ collapsibleData });
	};
	setInfo = (info) => {
		this.setState({ info });
	};
	handleMultiSelect = (multiSelect) => {
		this.setState({ multiSelect });
	};
	setDirectoryInfo = (directoryInfo) => {
		this.setState({ directoryInfo });
	};
	handleSortType = (sortType) => {
		this.setState({ sortType });
	};
	handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		this.setDirectoryInfo({
			...this.state.directoryInfo,
			[name]: value,
		});
	};
	handleChangeEditDirectories = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		this.setInfo({
			...this.state.info,
			[name]: value,
		});
	};
	setshowEditDirectories = (r) => {
		this.setInfo({
			...this.state.info,
			directory_id: r?.data?._id,
			name: r?.data?.name,
		});
		this.setshowEditDirectory(true);
	};
	submitProject = (e) => {
		e.preventDefault();
		this.handleClose();
		this.props.dispatch(createFileDirectory(this.state.directoryInfo));
	};
	updateDirectory = (e) => {
		this.handleCloseEditDirectories();
		e.preventDefault();
		const post = {
			user_id: userId,
			project_id: this.project_id,
			name: this.state.info?.name,
			directory_id: this.state.info?.directory_id,
		};

		this.props.dispatch(updateDirectories(post));
	};
	// if (!data?.length && data?.length !== 0) {
	//   return <Loading />
	// }

	openFileInTab = (url) => {
		window.open(url, '_blank')
	}

	hendleShowShereModel = () => {
		this.setState({showShareModel:!this.state.showShareModel});
	};

	handleSharableLink = (data) => {
		this.setState({shareLink:data});
		if(data){
			this.hendleShowShereModel()
		}
	}

	render() {
		const project_id = this.props.router?.params.project_id;
		const sortingList = [
			`A ${String.fromCharCode(60)} Z`,
			` Z ${String.fromCharCode(60)} A`,
			` New ${String.fromCharCode(60)} Old`,
			` Old ${String.fromCharCode(60)} New`,
		];
		const { data } = this.props;
		const { multiSelect } = this.state;
		if (!data) {
			return (
				<Layout>
					<Loading />
				</Layout>
			);
		}
		const file_id = [];
		multiSelect?.forEach((f) => {
			file_id.push(f?._id);
		});
		const file_url = [];
		multiSelect?.forEach((f) => {
			file_url.push(f?.file);
		});
		let searchDataSource = [];
		data?.forEach((slist) => {
			searchDataSource = searchDataSource.concat(slist?.plans);
		});
		const {
			sort_by,
			action,
			create,
			share_files,
			new_directory,
			icon_delete,
			no_files_available,
			save
		} = getSiteLanguageData('commons');
		const {
			btn_create_file,
			btn_create_directory,
			icon_rename,
			icon_add_file,
			share_file,
			delete_file,
			file_name,
			uploaded_by,
			uploaded_date,
			directory_name,
			ph_directory_name,
			file_directory_name,
			ph_file_directory_name,
			create_directory,
			update_file_directory,
		} = getSiteLanguageData('files');
		return (
			<Layout>
				{data?.length === 0 ? (
					<Nodata type="Files">
						<span
							className="lf-link-cursor lf-main-button text-center"
							onClick={this.handleShow}>
							<i className="fas fa-plus pe-1 mt-2"></i> {new_directory?.text}
						</span>
					</Nodata>
				) : (
					<div id="page-content-wrapper">
						<section className="lf-dashboard-toolbar">
							<div className="row">
								<div className="col-12">
									<div className="d-flex align-items-center">
										<div className="float-start d-none d-md-inline-block">
											<CustomSearch
												suggestion={true}
												dataSource={{
													file: searchDataSource,
												}}
											/>
										</div>
										<div className="float-start d-none d-lg-inline-block">
											<Dropdown className="mt-1 lf-responsive-common">
												<span tooltip={sort_by.tooltip} flow={sort_by.tooltip_flow}>
													<Dropdown.Toggle
														variant="transparent"
														id="dropdown-basic"
														className="d-inline-block  lf-common-btn">
														<span>
															{sortingList[parseInt(this.state.sortType) - 1]}{' '}
														</span>
													</Dropdown.Toggle>
												</span>
												<Dropdown.Menu
													style={{ backgroundColor: '#73a47' }}
													className="shadow p-2 mb-2 bg-white rounded-7 dropdown-menu lf-dropdown-center lf-dropdown-animation">
													{sortingList.map((st, k) => {
														return (
															<Dropdown.Item
																key={k}
																className="lf-layout-profile-menu "
																onClick={() =>
																	this.handleSortType((k + 1).toString())
																}>
																{st} <i></i>
															</Dropdown.Item>
														);
													})}
												</Dropdown.Menu>
											</Dropdown>
										</div>
										<div className="ms-auto float-end d-flex align-items-center">

											<div className="float-start d-inline-block">
												<SheetFile type={'common'} project_id={project_id}>
													<span
														className="mt-1 lf-link-cursor lf-main-button"
														tooltip={btn_create_file.tooltip}
														flow={btn_create_file.tooltip_flow}>
														<i className="fas fa-plus pe-1"></i>{' '}
														{btn_create_file?.text}
													</span>
												</SheetFile>
											</div>

											<div className="float-start d-inline-block">
												<span
													className="mt-1 lf-link-cursor lf-common-btn"
													onClick={this.handleShow}
													tooltip={btn_create_directory.tooltip}
													flow={btn_create_directory.tooltip_flow}>
													<i className="fas fa-plus pe-1"></i>{' '}
													{btn_create_directory?.text}
												</span>
											</div>
											<div className="float-start d-inline-block">
											<Dropdown className="d-inline ">
												<Dropdown.Toggle
													disabled={file_id.length === 0}
													variant="transparent"
													className="lf-common-btn">
													<span>{action?.text}</span>
												</Dropdown.Toggle>
												<Dropdown.Menu className="shadow p-2 mb-2 bg-white rounded-7 dropdown-menu lf-dropdown-center lf-dropdown-animation">
													<Dropdown.Item
														className="lf-layout-profile-menu "
														onClick={() =>
															sweetAlert(
																() =>
																	this.props.dispatch(
																		deleteFile({
																			user_id: userId,
																			project_id: project_id,
																			file_id: file_id.filter(
																				(f) => f !== undefined,
																			),
																		}),
																	),
																'files',
																'Delete',
																this.handleMultiSelect,
															)
														}>
														<i className="fas fa-trash-alt px-2" />
														{icon_delete?.text}
													</Dropdown.Item>
													<Dropdown.Item
														className="lf-layout-profile-menu "
														onClick={() => {
															this.props.dispatch(
																shareFiles({
																	files: file_url.filter((f) => f !== undefined),
																}, this.handleSharableLink),
															);
															this.handleMultiSelect([]);
														}}>
														<i className="fas fa-share-alt px-2 "></i>
														{share_files?.text}
													</Dropdown.Item>

													<ChangeFileDirectory
														handleMultiSelect={this.handleMultiSelect}
														file_id={file_id.filter((f) => f !== undefined)}
														className="lf-layout-profile-menu"
													/>
												</Dropdown.Menu>
											</Dropdown>
											</div>
										</div>
									</div>
								</div>
							</div>
						</section>
						<div className="container-fluid">
							<div className="theme-table-wrapper no-bg mt-3">
								<table className={`table table-hover theme-table`}>
									<thead className="theme-table-title text-capitalize bg-light text-nowrap text-center">
										<tr>
											<th className="lf-w-50"></th>
											<th className="lf-w-50"></th>
											<th className="lf-w-500 text-start">
												<span>{file_name?.text}</span>
											</th>
											<th className="lf-w-300 text-start">
												<span>{uploaded_by?.text}</span>
											</th>
											<th className="lf-w-250">
												<span>{uploaded_date?.text}</span>
											</th>
											<th>
												<span className="lf-w-50 me-3">{action?.text}</span>
											</th>
										</tr>
									</thead>
									<tbody>
										{data
											?.sort((a, b) => {
												if (this.state.sortType === '1') {
													return a?.name.localeCompare(b?.name);
												}
												if (this.state.sortType === '2') {
													return b?.name.localeCompare(a?.name);
												}
												if (this.state.sortType === '3') {
													return new Date(b.createdAt) - new Date(a.createdAt);
												}
												if (this.state.sortType === '4') {
													return new Date(a.createdAt) - new Date(b.createdAt);
												}
												return true;
											})
											?.map((r, k) => {
												return (
													<Fragment>
														<tr
															className={`theme-table-data-row ${
																!this.state.collapsibleData?.[r._id]
																	? 'bg-light'
																	: 'bg-transparent'
															}`}>
															<td className="text-center">
																<FormCheck
																	type="checkbox"
																	name="file"
																	className={
																		r?.plans?.length === 0
																			? 'invisible'
																			: 'visible'
																	}
																	onChange={({ target: { checked } }) => {
																		let newArr = [...this.state.multiSelect];
																		r?.plans?.forEach((p) => {
																			if (checked === true) {
																				newArr.push(p);
																			} else {
																				newArr = newArr.filter((d) => d !== p);
																			}
																		});
																		this.handleMultiSelect(newArr);
																	}}
																	checked={r?.plans?.every((d) =>
																		this.state.multiSelect.includes(d),
																	)}
																/>
															</td>
															<td colSpan={5}>
																<h6
																	className="ms-1 lf-link-cursor text-dark  d-inline-block fw-bold"
																	onClick={() =>
																		this.manageCollapsibleData({
																			...this.state.collapsibleData,
																			[r._id]:
																				!this.state.collapsibleData?.[r._id],
																		})
																	}>
																	<i className="fa-regular fa-folder me-2"></i>
																	<span className="text-capitalize lf-task-color-list lf-w-300 ls-md">
																		{r?.name} ({r?.plans?.length})
																	</span>
																	<span>
																		<i
																			className={
																				!this.state.collapsibleData?.[r._id]
																					? 'fas fa-caret-down theme-secondary ms-2'
																					: 'fas fa-caret-right theme-secondary ms-2'
																			}></i>
																	</span>
																</h6>

																<span
																	tooltip={icon_rename.tooltip}
																	flow={icon_rename.tooltip_flow}>
																	<i
																		className="fas fa-edit lf-sheet-icon theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold p-2"
																		onClick={() =>
																			this.setshowEditDirectories({ data: r })
																		}
																	/>
																</span>

																<span
																	tooltip={icon_delete.tooltip}
																	flow={icon_delete.tooltip_flow}>
																	<i
																		className="far fa-trash-alt theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold p-2"
																		onClick={() =>
																			sweetAlert(
																				() =>
																					this.props.dispatch(
																						deleteFileDirectory({
																							user_id: userId,
																							project_id: project_id,
																							directory_id: [r?._id],
																						}),
																					),
																				'File Directory',
																			)
																		}
																	/>
																</span>
																<SheetFile directory_id={r?._id}>
																	<span
																		href="/dashboard"
																		onClick={this.handleShow}
																		tooltip={icon_add_file.tooltip}
																		flow={icon_add_file.tooltip_flow}
																		className={`pointer lf-toolbar-action-icon theme-btnbg theme-btnbold theme-secondary  `}>
																		{' '}
																		+<i className="far fa-file"></i>
																	</span>
																</SheetFile>
															</td>
														</tr>
														{r?.plans?.length === 0 ? (
															<tr
																className={`theme-table-data-row bg-white text-center lf-text-vertical-align ${
																	!this.state.collapsibleData?.[r._id] === true
																		? ''
																		: 'd-none'
																}`}>
																<td colSpan={6}>{no_files_available?.text} </td>
															</tr>
														) : (
															r?.plans?.sort((a, b) => {
																if (this.state.sortType === '1') {
																	return a?.file_name.localeCompare(b?.file_name);
																}
																if (this.state.sortType === '2') {
																	return b?.file_name.localeCompare(a?.file_name);
																}
																if (this.state.sortType === '3') {
																	return new Date(b.createdAt) - new Date(a.createdAt);
																}
																if (this.state.sortType === '4') {
																	return new Date(a.createdAt) - new Date(b.createdAt);
																}
																return true;
															})?.map((u) => {
																let file = u.file
																	.split('/')
																	.slice(-1)
																	.join('.');
																let ext = file.split('.').slice(-1).join('.');
																return (
																	<tr
																		className={`theme-table-data-row bg-white ${
																			!this.state.collapsibleData?.[r._id]
																				? ''
																				: 'd-none'
																		}`}
																		key={u._id}>
																		<td className="lf-w-50 text-center">
																			<FormCheck
																				type="checkbox"
																				name="plan_id"
																				className={`${
																					this.state.multiSelect.length > 0
																						? 'visible'
																						: ''
																				}`}
																				onChange={({ target: { checked } }) => {
																					let newArr = [
																						...this.state.multiSelect,
																					];
																					if (checked === true) {
																						newArr.push(u);
																					} else {
																						newArr = newArr.filter(
																							(d) => d !== u,
																						);
																					}
																					this.handleMultiSelect(newArr);
																				}}
																				checked={this.state.multiSelect.includes(
																					u,
																				)}
																				value={u}
																			/>
																		</td>
																		<td onClick={()=>this.openFileInTab(u?.file)} className="lf-w-50 text-start">
																			<img
																				alt="livefield"
																				src={ u.icon || `/images/${ext}-icon.png`}
																				height="25px"
																			/>
																		</td>
																		<td onClick={()=>this.openFileInTab(u?.file)} className="lf-w-500 lf-text-vertical-align text-start">
																			<span className="lf-text-overflow-500 lf-task-color pointer lf-text-vertical-align hover-theme-color">
																				{/* <a
																					className="text-nowrap text-truncate lf-task-color"
																					href={decodeURI(u?.file)}>
																					{decodeURI(u?.file_name) ||
																						decodeURI(file)}
																				</a> */}
																				{decodeURIComponent(u?.file_name) || decodeURIComponent(file)}
																			</span>
																		</td>
																		<td onClick={()=>this.openFileInTab(u?.file)} className="lf-w-300 text-start lf-text-vertical-align">
																			<span className="theme-secondary">
																				{u?.createdBy?.first_name}{' '}
																				{u?.createdBy?.last_name}
																			</span>
																		</td>
																		<td onClick={()=>this.openFileInTab(u?.file)} className="theme-secondary lf-w-250 text-center lf-text-vertical-align">
																			{moment(u.createdAt).format(
																				'MMM DD,YYYY',
																			)}
																		</td>
																		<td className="lf-w-100 text-nowrap text-center lf-text-vertical-align">
																			<span>
																				<span
																					className="theme-btnbg theme-secondary rounded lf-link-cursor ms-1 p-1"
																					tooltip={share_file.tooltip}
																					flow={share_file.tooltip_flow}
																					onClick={() => {
																						this.props.dispatch(
																							shareFiles({
																								files: [u?.file],
																								project_id: u?.project_id,
																							},this.handleSharableLink),
																						);
																					}}>
																					<i className="fas fa-share-alt"></i>
																				</span>
																				<ChangeFileDirectory
																					file_id={[u._id]}
																				/>
																				<UpdateFileName
																					file={u}
																					fileName={file}></UpdateFileName>
																				<span
																					className="theme-btnbg theme-secondary rounded lf-link-cursor ms-1 p-1"
																					tooltip={delete_file.tooltip}
																					flow={delete_file.tooltip_flow}
																					onClick={() =>
																						sweetAlert(
																							() =>
																								this.props.dispatch(
																									deleteFile({
																										user_id: userId,
																										project_id: project_id,
																										directory_id: r._id,
																										file_id: [u?._id],
																									}),
																								),
																							'File',
																						)
																					}>
																					<i className="far fa-trash-alt"></i>
																				</span>
																			</span>
																		</td>
																	</tr>
																);
															})
														)}
													</Fragment>
												);
											})}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				)}
				{/* add new directory */}

				<Modal
					className="lf-modal"
					show={this.state.show}
					onHide={this.handleClose}
					animation={true}>
					<Modal.Header className="py-2 bg-light" closeButton>
						<Modal.Title>{create_directory?.text}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={this.submitProject}>
							<div className="row p-3">
								<div className="col-sm-12">
									<div className="form-group">
										<Form.Label htmlFor="templatename" className="mb-0">
											{directory_name?.text}
										</Form.Label>
										<InputGroup className="mb-3">
											<FormControl
												placeholder={ph_directory_name?.text}
												type="text"
												name="name"
												autoComplete="off"
												onChange={(e) => this.handleChange(e)}
												value={this.state.directoryInfo.name}
												required
											/>
										</InputGroup>
									</div>
									<Button
										type="submit"
										className="btn btn-primary theme-btn btn-block show-verify float-end">
										<i className="fa fa-plus pe-1"></i>
										{create?.text}
									</Button>
								</div>
							</div>
						</Form>
					</Modal.Body>
				</Modal>
				{/* Edit Directories */}

				<Modal
					className="lf-modal"
					show={this.state.showEditDirectories}
					onHide={this.handleCloseEditDirectories}
					animation={true}>
					<Modal.Header className="py-2 bg-light" closeButton>
						<Modal.Title>{update_file_directory?.text}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={this.updateDirectory}>
							<div className="row p-3">
								<div className="col-sm-12">
									<div className="form-group">
										<Form.Label htmlFor="templatename" className="mb-0">
											{file_directory_name?.text}
										</Form.Label>
										<InputGroup className="mb-3">
											<FormControl
												placeholder={ph_file_directory_name?.text}
												type="text"
												name="name"
												autoComplete="off"
												onChange={(e) => this.handleChangeEditDirectories(e)}
												value={this.state.info.name}
												required
											/>
										</InputGroup>
									</div>
									<Button
										type="submit"
										className="btn btn-primary theme-btn btn-block show-verify float-end">
										<i className='fa-solid fa-floppy-disk pe-2'></i>
										{save?.text}
									</Button>
								</div>
							</div>
						</Form>
					</Modal.Body>
				</Modal>
				<ShareFile open={this.state.showShareModel} shareLink={this.state.shareLink} handleClose={this.hendleShowShereModel} />
			</Layout>
		);
	}
}
export default withRouter(
	connect((state) => {
		return {
			data: state?.project?.[GET_ALL_FILE_LIST_DIRECTORIES_WISE]?.result,
			editFileDirectoriesResult: state?.project?.[UPDATE_FILE_DIRECTORY],
			createFileDirectoriesResult: state?.project?.[CREATE_DIRECTORY],
			deleteFileResult: state?.project?.[DELETE_FILE],
			deleteFileDirectoryResult: state?.project?.[DELETE_FILE_DIRECTORY],
		};
	})(Files),
);
