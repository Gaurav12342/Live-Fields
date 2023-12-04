import React, { Component, Fragment } from 'react';
import {
	Modal,
	Form,
	Button,
	InputGroup,
	FormControl,
	Dropdown,
	Table,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import ImportQuestion from './ImportQuestion';
import CustomSelect from '../../../components/SelectBox';
import DatePicker from 'react-datepicker';
import _ from 'lodash';
import DataSheet from 'react-datasheet';
import {
	getAllRoleWisePeople,
	getAllTemplateWithFullDetails,
	getAdminProjectTemplates,
	importAdminTemplate,
} from '../../../store/actions/projects';
import { getLocationList } from '../../../store/actions/Task';
import getUserId, { getSiteLanguageData } from '../../../commons';
import { createSurveyReport } from '../../../store/actions/report';
import moment from 'moment';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_ALL_TEMPLATE,
	GET_LOCATION_LIST,
} from '../../../store/actions/actionType';
import withRouter from '../../../components/withrouter';

class CreatSurveyReport extends Component {
	constructor(props) {
		super(props);
		this.jRef = React.createRef();
		this.handleSelect = this.handleSelect.bind(this);
		this.handleSelectAllChanged = this.handleSelectAllChanged.bind(this);
		this.handleSelectChanged = this.handleSelectChanged.bind(this);
		this.handleCellsChanged = this.handleCellsChanged.bind(this);

		this.sheetRenderer = this.sheetRenderer.bind(this);
		this.rowRenderer = this.rowRenderer.bind(this);
		this.cellRenderer = this.cellRenderer.bind(this);
		this.userId = getUserId();
		this.project_id = this.props.router?.params.project_id;
		this.state = {
			show: false,
			as: 'table',
			columns: [{ label: 'Questions', width: '100%' }],
			grid: [[{ value: 'Enter Question' }]],
			selections: [false],
			page: 0,
			quetions: [''],
			counter: 0,
			tempalteId: '',
			info: {
				user_id: this.userId,
				project_id: this.project_id,
				description: '',
				start_date: new Date(),
				frequency: '',
				customday: '',
				end_date: '',
				assigee_id: { value: this.userId, _id: this.userId },
				location_id: '',
				questions: [''],
			},
			adminTemplateList: [],
			importModel: false,
			showProjectCheckList: false,
			adminTemplateCheckList: [],
			selectedQuestions: [],
		};
	}
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(getAllRoleWisePeople(this.project_id));
		dispatch(getLocationList(this.project_id, this.userId));
		dispatch(getAllTemplateWithFullDetails(this.project_id));
		dispatch(
			getAdminProjectTemplates((resData) => {
				this.setState({ adminTemplateList: resData?.result });
			}),
		);
	}

	/* Import Things */

	setImportModel = (ml) => {
		this.setState({ importModel: ml });
	};

	handleImportModel = () => {
		this.setImportModel(!this.state.importModel);
	};

	handleProjectCheckListModel = () => {
		this.setState({ showProjectCheckList: !this.state.showProjectCheckList });
	};

	handleAdminTemplateChecklist = (obj) => {
		this.setState({ adminTemplateCheckList: obj });
	};

	importAdminTemplateHandle = (templateData) => {
		let questions = templateData.check_list?.map((q) => {
			return [q.item];
		});

		this.setState({ selectedQuestions: questions });
		this.setImportModel(!this.state.importModel);
		/* const { dispatch } = this.props;
		let postData = {
			project_id:this.project_id,
			user_id: this.userId,
			templateData:templateData
		}
		dispatch(importAdminTemplate(postData,()=>{
			this.setImportModel(!this.state.importModel)
		})) */
	};
	/* Import Things */

	handleSelect(e) {
		this.setState({ as: e.target.value });
	}
	setTemplate = (tempalteId) => {
		this.setState({ tempalteId });
	};

	handleSelectAllChanged(selected) {
		const selections = this.state.selections.map((s) => selected);
		this.setState({ selections });
	}

	handleSelectChanged(index, selected) {
		const selections = [...this.state.selections];
		selections[index] = selected;
		this.setState({ selections });
	}

	handleCellsChanged(changes, additions) {
		const grid = this.state.grid.map((row) => [...row]);
		changes.forEach(({ cell, row, col, value }) => {
			grid[row][col] = { ...grid[row][col], value };
		});
		// paste extended beyond end, so add a new row
		additions &&
			additions.forEach(({ cell, row, col, value }) => {
				if (!grid[row]) {
					grid[row] = [{ value: '' }];
				}
				if (grid[row][col]) {
					grid[row][col] = { ...grid[row][col], value };
				}
			});
		this.setState({ grid });
	}

	sheetRenderer(props) {
		const { columns, selections } = this.state;
		switch (this.state.as) {
			case 'list':
				return (
					<SheetRenderer
						columns={columns}
						selections={selections}
						onSelectAllChanged={this.handleSelectAllChanged}
						as="segment"
						headerAs="div"
						bodyAs="ul"
						rowAs="div"
						cellAs="div"
						{...props}
					/>
				);
			case 'div':
				return (
					<SheetRenderer
						columns={columns}
						selections={selections}
						onSelectAllChanged={this.handleSelectAllChanged}
						as="div"
						headerAs="div"
						bodyAs="div"
						rowAs="div"
						cellAs="div"
						{...props}
					/>
				);
			default:
				return (
					<SheetRenderer
						columns={columns}
						selections={selections}
						onSelectAllChanged={this.handleSelectAllChanged}
						as="table"
						headerAs="thead"
						bodyAs="tbody"
						rowAs="tr"
						cellAs="th"
						{...props}
					/>
				);
		}
	}

	rowRenderer(props) {
		const { selections } = this.state;
		switch (this.state.as) {
			case 'list':
				return (
					<RowRenderer
						as="li"
						cellAs="div"
						selected={selections[props.row]}
						onSelectChanged={this.handleSelectChanged}
						className="data-row lf-h-35 text-start"
						{...props}
					/>
				);
			case 'div':
				return (
					<RowRenderer
						as="div"
						cellAs="div"
						selected={selections[props.row]}
						onSelectChanged={this.handleSelectChanged}
						className="data-row lf-h-35 text-start"
						{...props}
					/>
				);
			default:
				return (
					<RowRenderer
						as="tr"
						cellAs="td"
						selected={selections[props.row]}
						onSelectChanged={this.handleSelectChanged}
						className="data-row lf-h-35 text-start"
						{...props}
					/>
				);
		}
	}

	cellRenderer(props) {
		switch (this.state.as) {
			case 'list':
				return (
					<CellRenderer as="div" columns={this.state.columns} {...props} />
				);
			case 'div':
				return (
					<CellRenderer as="div" columns={this.state.columns} {...props} />
				);
			default:
				return <CellRenderer as="td" columns={this.state.columns} {...props} />;
		}
	}
	setShow = (show) => {
		this.setState({ show });
	};
	setQuetions = (quetions) => {
		this.setState({ quetions });
	};
	setCounter = (counter) => {
		this.setState(counter);
	};
	setPage = (page) => {
		this.setState({ page });
	};
	setInfo = (info) => {
		this.setState({ info });
	};
	handleClose = () => {
		this.setState({
			info: {
				user_id: this.userId,
				project_id: this.project_id,
				description: '',
				start_date: new Date(),
				frequency: '',
				customday: '',
				end_date: '',
				assigee_id: { _id: this.userId, value: this.userId },
				location_id: '',
				questions: [''],
			},
			page: 0,
		});
		this.setState({ show: false });
	};
	handleShow = () => this.setShow(true);

	handleChange = (name, value) => {
		this.setInfo({
			...this.state.info,
			[name]: value,
		});
	};
	handleChangeQuestion = (value, index) => {
		let quetions = [...this.state.quetions];
		quetions[index] = value;
		this.setState({ quetions });
	};

	handleQuestion = (index = null) => {
		if (index) {
			const quetions = [...this.state.quetions];
			quetions.splice(index, 1);
			this.setState({ quetions });
		} else {
			const quetions = [...this.state.quetions];
			quetions.push('');
			this.setState({ quetions });
		}
	};
	submitReport = (e) => {
		e.preventDefault();
		const { info, quetions, grid } = this.state;
		// grid?.map((g) => g?.map((f) => qun.push(f?.value)));

		if (this.state.page === 0) {
			this.setPage(1);
		} else {
			let qD = this.jRef.current.jexcel.getData();
			let qun =
				qD && Array.isArray(qD) && qD.length > 0
					? qD.filter((q) => q[0] != null && q[0].trim() != '')
					: [];
			qun = qun.map((q) => q[0]);
			this.handleClose();
			let end_date = null;
			this.props.dispatch(
				createSurveyReport({
					...info,
					assigee_id: info.assigee_id.value,
					location_id: info.location_id.value,
					frequency: info.frequency.value,
					questions: qun,
				}),
			);
		}
	};

	handleClick = () => {
		this.setCounter(this.state.counter + 1);
	};
	handleremove = () => {
		this.setCounter(this.state.counter - 1);
	};
	render() {
		const { SurveyLocation, assignee, template } = this.props;
		const { page } = this.state;
		const reportFrequency = [
			{ value: 'Daily', name: 'Daily' },
			{ value: 'First_Day_of_Month', name: 'First Day of Month' },
			{ value: 'Last_Day_of_Month', name: 'Last Day of Month' },
			{ value: 'Every_Month', name: 'Every Month' },
			{ value: 'Custom_Days', name: 'Custom Days' },
		];
		const frequency = reportFrequency?.map((tl) => {
			return { label: tl.name, value: tl.value };
		});

		const location = SurveyLocation?.map((tl) => {
			return { label: tl.name, value: tl._id };
		});
		const templates = template?.map((tl) => {
			return { label: tl.name, value: tl._id };
		});
		const projectUsers = [];
		assignee?.forEach((a) => {
			(a?.users).forEach((u) => {
				projectUsers.push({
					...u,
					label: (
						<>
							{' '}
							<div className="d-flex align-items-center">
								{u?.profile ? (
									<img
										src={u.thumbnail || u.profile}
										className="me-1 priority-1 border"
									/>
								) : (
									<span
										className="task-info-category text-uppercase me-2 w-25"
										style={{ background: '#FFF', color: '#FFFFFF' }}>
										{u.first_name?.charAt(0)}
										{u.last_name?.charAt(0)}
									</span>
								)}
								<div className="lf-react-select-item w-75">
									{u.first_name} {u.last_name}
								</div>
							</div>
						</>
					),
					value: u._id,
				});
			});
		});
		const {
			survey_report,
			location_name,
			question,
			generate_report,
			back,
			checklist_items,
		} = getSiteLanguageData('reports/components/createsurveyreport');

		const {
			start_date,
			end_date,
			name,
			frequency_name,
			assignee_name,
			next_btn,
			import_template,
			description,
			action,
			close,
		} = getSiteLanguageData('commons');

		const { edit_template } = getSiteLanguageData('project_tamplate');

		return (
			<>
				{/* <Dropdown.Item
					className="lf-layout-profile-menu"
					onClick={this.handleShow}>
					<i className="fas fa-plus px-2"></i>
					{survey_report?.text}
				</Dropdown.Item> */}
				<span
					onClick={this.handleShow}
					className="ms-1 theme-btnbg theme-secondary rounded lf-link-cursor">
					<i className="fas fa-plus px-1"></i>
				</span>
				<Modal
					className="lf-modal"
					size={'md'}
					show={this.state.show}
					onHide={this.handleClose}
					animation={true}>
					<Modal.Header className="py-2 bg-light" closeButton>
						<Modal.Title className="w-100">{survey_report?.text}</Modal.Title>
						{/* <div className='w-100 text-end'>
							<Button
								className="lf-link-cursor lf-main-button text-center"
								tooltip={import_template.tooltip}
								flow={import_template.tooltip_flow}
								onClick={this.handleImportModel}
							>
								<i className="fas fa-plus px-1"></i>
								{import_template?.text}
							</Button>
						</div> */}
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={this.submitReport}>
							{!this.state.importModel ? (
								<>
									{page === 1 ? (
										<>
											{/* <div className="row">
													<div className="col-12 mt-2">
														<Form.Label>{question?.text}</Form.Label>
														<div className="p-2 ">
															<DataSheet
																data={this.state.grid}
																className="custom-sheet text-start"
																sheetRenderer={this.sheetRenderer}
																// headerRenderer={this.headerRenderer}
																// bodyRenderer={this.bodyRenderer}
																rowRenderer={this.rowRenderer}
																cellRenderer={this.cellRenderer}
																onCellsChanged={this.handleCellsChanged}
																valueRenderer={(cell) => cell.value}
															/>
														</div>
													</div>
												</div> */}
											<ImportQuestion
												selectedQuestions={this.state.selectedQuestions}
												handleImportModel={this.handleImportModel}
												jRef={this.jRef}
											/>
											<div className="col-sm-12 mt-4 p-0">
												<Button
													type="button"
													className="btn btn-light btn-block my-1 show-verify"
													onClick={(e) => {
														e.preventDefault();
														this.setPage(0);
													}}>
													{back?.text}
												</Button>
												<Button
													type="submit"
													className="btn btn-primary theme-btn btn-block my-1 show-verify float-end">
													{generate_report?.text}
												</Button>
											</div>
										</>
									) : (
										<>
											<div className="row px-3">
												<div className="col-sm-12 ">
													<Form.Label className="mb-0">{name?.text}</Form.Label>
													<InputGroup>
														<FormControl
															placeholder={description.text}
															type="text"
															name="description"
															autoComplete="off"
															className="lf-formcontrol-height"
															onChange={(e) =>
																this.handleChange('description', e.target.value)
															}
															value={this.state.info?.description}
															required
														/>
													</InputGroup>
												</div>
												<div className="col-sm-12 mt-2">
													<div className="row">
														<div className="col-sm-6">
															<Form.Label className="mb-0">
																{start_date?.text}
															</Form.Label>
															<DatePicker
																customInput={
																	<FormControl className="lf-formcontrol-height" />
																}
																name="start_date"
																selected={moment(
																	this.state.info.start_date,
																).toDate()}
																dateFormat="dd-MM-yyyy"
																autoComplete="off"
																placeholderText={start_date.text}
																onChange={(e) =>
																	this.handleChange(
																		'start_date',
																		moment(e).format('YYYY-MM-DD'),
																	)
																}
																minDate={moment().toDate()}
																maxDate={
																	this.state.info?.end_date
																		? moment(this.state.info?.end_date).toDate()
																		: ''
																}
																required
															/>
														</div>
														<div className="col-sm-6">
															<Form.Label className="mb-0">
																{end_date?.text}
															</Form.Label>
															<DatePicker
																customInput={
																	<FormControl className="lf-formcontrol-height" />
																}
																name="end_date"
																dateFormat="dd-MM-yyyy"
																autoComplete="off"
																selected={
																	this.state.info.end_date
																		? moment(this.state.info.end_date).toDate()
																		: null
																}
																placeholderText={end_date.text}
																onChange={(e) =>
																	this.handleChange(
																		'end_date',
																		moment(e).format('YYYY-MM-DD'),
																	)
																}
																minDate={moment(
																	this.state.info.start_date,
																).toDate()}
															/>
														</div>
													</div>
												</div>

												<div className="col-sm-12 mt-2">
													<Form.Label className="mb-0">
														{frequency_name?.text}
													</Form.Label>
													<CustomSelect
														placeholder={`${frequency_name.text}...`}
														name="frequency"
														onChange={(e) => this.handleChange('frequency', e)}
														options={frequency}
														value={this.state.info.frequency}
														required
													/>
												</div>

												{this.state.info?.frequency?.value === 'Custom_Days' ? (
													<div className="col-sm-12 mt-2 ">
														<Form.Label className="mb-0">
															{frequency_name?.text}
														</Form.Label>
														<InputGroup>
															<FormControl
																placeholder="Enter your custom day"
																type="number"
																name="customday"
																autoComplete="off"
																onChange={(e) =>
																	this.handleChange('customday', e.target.value)
																}
																value={this.state.info.customday}
																required
															/>
														</InputGroup>
													</div>
												) : (
													''
												)}
												<div className="col-sm-12 mt-2">
													<Form.Label className="mb-0">
														{assignee_name?.text}
													</Form.Label>
													<CustomSelect
														placeholder={`${assignee_name?.text}...`}
														name="assigee_id"
														moduleType="taskUsers"
														onChange={(e) => this.handleChange('assigee_id', e)}
														options={projectUsers}
														value={projectUsers.find(
															(u) =>
																u.value == this.state.info?.assigee_id?.value,
														)}
														required
													/>
												</div>
												<div className="col-sm-12 mt-2">
													<Form.Label className="mb-0">
														{location_name?.text}
													</Form.Label>
													<CustomSelect
														placeholder={`${location_name?.text}...`}
														name="location_id"
														onChange={(e) =>
															this.handleChange('location_id', e)
														}
														options={location}
														value={this.state.info.location_id}
														required
													/>
												</div>
											</div>
											<div className="col-sm-12 mt-3 px-3">
												<Button
													type="submit"
													className="theme-btn btn-block float-end">
													{next_btn?.text}
												</Button>
											</div>
										</>
									)}
								</>
							) : (
								<div className="row">
									<Table hover size="sm">
										<thead className={`border-0`}>
											<tr className="border-0">
												<th className={`border-0`}>{name.text}</th>
												<th className={`text-end border-0`}>{action.text}</th>
											</tr>
										</thead>
										<tbody className="border-0">
											{this.state.adminTemplateList?.map((r, ind) => {
												return (
													<Fragment key={r._id}>
														<tr
															className={`theme-table-data-row border-0 ${
																ind % 2 == 0 ? 'bg-light' : 'bg-transparent'
															}`}>
															<td className="ps-2 border-0">
																<span
																	className="text-dark  lf-link-cursor"
																	variant="transparent">
																	<span className="d-inline-block">
																		{r?.type} ({r?.check_list?.length})
																	</span>
																</span>
															</td>
															<td className="text-end align-middle border-0">
																<span
																	className=""
																	tooltip={edit_template.tooltip}
																	flow={edit_template.tooltip_flow}
																	onClick={() =>
																		this.importAdminTemplateHandle(r)
																	}>
																	<i className="fas fa-download theme-btnbg theme-secondary me-2"></i>
																</span>
																{/* <OverlayTrigger
																		container={this}
																		trigger="click"
																		placement="right"
																		
																		rootClose
																		overlay={
																			<Popover id={"popover-positioned-right"+r._id} title="Check list">
																			{r.check_list.map((item)=>{
																				return (
																					<div className='px-2 mb-2 border-bottom '>
																						{item.item}
																					</div>
																				)
																			})}
																			</Popover>
																		}
																		>
																		
																	</OverlayTrigger> */}
																<span
																	onClick={() => {
																		this.handleProjectCheckListModel();
																		this.handleAdminTemplateChecklist(r);
																	}}>
																	<i className="fas fa-eye theme-btnbg theme-secondary me-2"></i>
																</span>
															</td>
														</tr>
													</Fragment>
												);
											})}
										</tbody>
									</Table>
								</div>
							)}
						</Form>
					</Modal.Body>
					{this.state.importModel && (
						<Modal.Footer className="justify-content-center">
							<Button variant="secondary" onClick={this.handleImportModel}>
								{close.text}
							</Button>
						</Modal.Footer>
					)}
				</Modal>

				<Modal
					className="lf-modal"
					show={this.state.showProjectCheckList}
					onHide={this.handleProjectCheckListModel}
					centered
					animation={true}>
					<Modal.Header className="py-2 bg-light" closeButton>
						<Modal.Title>{this.state.adminTemplateCheckList?.type}</Modal.Title>
					</Modal.Header>
					<Modal.Body
						style={{
							minHeight: '520px',
							maxHeight: '520px',
							overflowY: 'auto',
						}}>
						<div className="row px-3">
							<Table hover size="sm">
								<thead className={`border-0`}>
									<tr className="border-0">
										<th className={`border-0`}>{checklist_items.text}</th>
									</tr>
								</thead>
								<tbody className="border-0">
									{this.state.adminTemplateCheckList?.check_list?.map(
										(it, i) => {
											return (
												<tr
													className={`theme-table-data-row border-0 ${
														i % 2 == 0 ? 'bg-light' : 'bg-transparent'
													}`}>
													<td className="border-0">{it.item}</td>
												</tr>
											);
										},
									)}
								</tbody>
							</Table>
						</div>
					</Modal.Body>
				</Modal>
			</>
		);
	}
}
export default withRouter(
	connect((state) => {
		return {
			SurveyLocation: state?.task?.[GET_LOCATION_LIST]?.result || [],
			assignee: state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [],
			template: state?.project?.[GET_ALL_TEMPLATE]?.result || [],
		};
	})(CreatSurveyReport),
);

const SheetRenderer = (props) => {
	const {
		as: Tag,
		headerAs: Header,
		bodyAs: Body,
		rowAs: Row,
		cellAs: Cell,
		className,
		columns,
		selections,
		onSelectAllChanged,
	} = props;
	return (
		<Tag className={className}>
			<Header className="data-header">
				<Row>
					{columns.map((column) => (
						<Cell
							className="cell"
							style={{ width: column.width }}
							key={column.label}>
							{column.label}
						</Cell>
					))}
				</Row>
			</Header>
			<Body className="data-body">{props.children}</Body>
		</Tag>
	);
};

const RowRenderer = (props) => {
	const {
		as: Tag,
		cellAs: Cell,
		className,
		row,
		selected,
		onSelectChanged,
	} = props;
	return <Tag className={className}>{props.children}</Tag>;
};

const CellRenderer = (props) => {
	const {
		as: Tag,
		cell,
		row,
		col,
		columns,
		attributesRenderer,
		selected,
		editing,
		updated,
		style,
		...rest
	} = props;
	// hey, how about some custom attributes on our cell?
	const attributes = cell.attributes || {};
	// ignore default style handed to us by the component and roll our own
	attributes.style = { width: '100%' };
	if (col === 0) {
		attributes.title = cell.label;
	}

	return (
		<Tag {...rest} {...attributes}>
			{props.children}
		</Tag>
	);
};
