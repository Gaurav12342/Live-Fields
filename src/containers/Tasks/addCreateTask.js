import { Form, InputGroup, FormControl } from 'react-bootstrap';
import React,{Component,useState,useEffect} from 'react';
import { createTask } from '../../store/actions/Task';
import { connect } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_ALL_SHEETS,
	GET_ALL_TAGS,
	GET_ALL_TASK_BOARD_LIST,
	GET_CATEGORY_LIST,
	GET_LOCATION_LIST,
} from '../../store/actions/actionType';
import withRouter from '../../components/withrouter';
import moment from 'moment';

// class CreateTask extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.userId = getUserId();
// 		this.project_id = this.props.router?.params.project_id;
		
// 		this.state = {
// 			info: {
// 				user_id: this.userId,
// 				project_id: this.project_id,
// 				title: '',
// 				board_id:
// 					this.props.task_view_type === 'board' ? this.props.board_id : '',
// 				location_id: '',
// 				plan_id: '',
// 				type: 'planned',
// 				category_id: '',
// 				assigee_id: this.userId,
// 				members_id: [],
// 				watchers: [],
// 				tags: [],
// 				cost: '',
// 				start_date: '',
// 				end_date: '',
// 				manpower: '',
// 				is_published: true,
// 			},
// 			show: false,
// 		};
// 	}

// 	componentDidMount() {
// 		const { dispatch } = this.props;
		
// 		// dispatch(getAllTags(this.project_id));
// 		// dispatch(getBoardList(this.project_id, userId));
// 		// dispatch(getAllRoleWisePeople(this.project_id));
// 		// dispatch(GetCategoryList(this.project_id, userId));
// 		// dispatch(getLocationList(this.project_id, userId));
// 		// dispatch(getAllSheets(this.project_id));
// 	}

// 	handleShow = () => {
// 		this.setState({ show: true });
// 		// document.getElementById("myTextField").focus();
// 	};
// 	handleClose = () => {
// 		this.setState({
// 			info: {
// 				user_id: this.userId,
// 				project_id: this.project_id,
// 				title: '',
// 				board_id: this.props.board_id,
// 				location_id: '',
// 				plan_id: '',
// 				type: 'planned',
// 				category_id: '',
// 				assigee_id: this.userId,
// 				members_id: [],
// 				watchers: [],
// 				tags: [],
// 				cost: '',
// 				start_date: '',
// 				end_date: '',
// 				manpower: '',
// 				is_published: true,
// 			},
// 		});
// 		this.setState({ show: false });
// 		if (this.props.handleClose) {
// 			this.props.handleClose();
// 		}
// 	};

// 	submitTask = (e) => {
// 		const { kanban } = this.props;
// 		var date = new Date();
// 		var date = new Date(date.setDate(date.getDate() - 1));
// 		e.preventDefault();
// 		this.handleClose();
// 		if (this.state.info.title !== '') {
// 			this.props.dispatch(
// 				createTask(
// 					{
// 						...this.state.info,
// 						is_completed: ['Completed', 'Verified'].some((st) => kanban == st)
// 							? true
// 							: false,
// 						is_verified: kanban === 'Verified' ? true : false,
// 						start_date:
// 							kanban === 'Due Today'
// 								? moment(new Date()).format('YYYY-MM-DD')
// 								: kanban === 'Overdue'
// 								? moment(date).format('YYYY-MM-DD')
// 								: kanban === 'In Progress'
// 								? moment(new Date()).format('YYYY-MM-DD')
// 								: undefined,
// 						end_date:
// 							kanban === 'Due Today'
// 								? moment(new Date()).format('YYYY-MM-DD')
// 								: kanban === 'Overdue'
// 								? moment(date).format('YYYY-MM-DD')
// 								: kanban === 'In Progress'
// 								? undefined
// 								: undefined,
// 						watchers: (this.state.info?.watchers).map((e) => {
// 							return e.value;
// 						}),
// 						tags: (this.state.info?.tags).map((t) => {
// 							return t.value;
// 						}),
// 						board_id:this.props?.board_id ? this.props?.board_id : ''
// 					},
// 					this.props.plan_id ? true : false,
// 					this.props.task_view_type,
// 					this.props.filterData,
// 					this.props.router?.navigate,
// 				),
// 			);
// 		}
// 	};

// 	setInfo = (info) => {
// 		this.setState({ info });
// 	};
// 	handleChangeInfo = (name, value) => {
// 		this.setInfo({
// 			...this.state.info,
// 			[name]: value,
// 		});
// 	};

// 	brandColor = '#f97316';
// 	customStyles = {
// 		control: (base, state) => ({
// 			...base,
// 			boxShadow: state.isFocused ? 0 : 0,
// 			borderColor: state.isFocused ? this.brandColor : base.borderColor,
// 			'&:hover': {
// 				borderColor: state.isFocused ? this.brandColor : base.borderColor,
// 			},
// 		}),
// 		clearIndicator: (prevStyle) => ({
// 			...prevStyle,
// 			color: '#f97316',
// 			':hover': {
// 				color: '#f97316',
// 			},
// 		}),
// 	};
// 	render() {
// 		const { new_task, add_task } = getSiteLanguageData('task/update');
// 		return (
// 			<>
// 				{this.props?.plan_id == null ? (
// 					this.state.show === false ? (
// 						<span
// 							className={
// 								this.props.className ||
// 								'm-auto theme-color btn btn-block lf-kanban-add-task-btn bg-white hover-theme-color'
// 							}
// 							onClick={this.handleShow}>
// 							<i className={`fas fa-plus`}></i>
// 							{new_task?.text}
// 						</span>
// 					) : (
// 						''
// 					)
// 				) : (
// 					<span className={this.props.className} onClick={this.handleShow}>
// 						{add_task?.text}
// 					</span>
// 				)}
// 				{this.state.show ? (
// 					<Form onSubmit={this.submitTask}>
// 						<InputGroup className="mb-1 ">
// 							<FormControl
// 								className="lf-formcontrol-height"
// 								placeholder="Enter Name"
// 								type="text"
// 								name="title"
// 								autoComplete="none"
// 								onBlur={this.submitTask}
// 								onChange={(e) => this.handleChangeInfo('title', e.target.value)}
// 								value={this.state.info.title}
// 								required
// 							/>
// 						</InputGroup>
// 					</Form>
// 				) : (
// 					''
// 				)}
// 			</>
// 		);
// 	}
// }

const CreateTask = (props) => {
	const [info, setInfo] = useState({
		user_id: getUserId(),
		project_id: props.router?.params.project_id,
		title: '',
		board_id: props.task_view_type === 'board' ? props.board_id : '',
		location_id: '',
		plan_id: '',
		type: 'planned',
		category_id: '',
		assigee_id: getUserId(),
		members_id: [],
		watchers: [],
		tags: [],
		cost: '',
		start_date: '',
		end_date: '',
		manpower: '',
		is_published: true,
	});
	const [show, setShow] = useState(false);

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
			color: brandColor,
			':hover': {
				color: brandColor,
			},
		}),
	};

	const handleShow = () => {
		setShow(true);
	};

	const handleClose = () => {
		setInfo({
			user_id: getUserId(),
			project_id: props.router?.params.project_id,
			title: '',
			board_id: props.board_id,
			location_id: '',
			plan_id: '',
			type: 'planned',
			category_id: '',
			assigee_id: getUserId(),
			members_id: [],
			watchers: [],
			tags: [],
			cost: '',
			start_date: '',
			end_date: '',
			manpower: '',
			is_published: true,
		});
		setShow(false);
		if (props.handleClose) {
			props.handleClose();
		}
	};

	const submitTask = (e) => {
		const { kanban } = props;
		var date = new Date();
		date = new Date(date.setDate(date.getDate() - 1));
		e.preventDefault();
		handleClose();
		if (info.title !== '') {
			props.dispatch(
				createTask(
					{
						...info,
						is_completed: ['Completed', 'Verified'].some((st) => kanban === st)
							? true
							: false,
						is_verified: kanban === 'Verified' ? true : false,
						start_date:
							kanban === 'Due Today'
								? moment(new Date()).format('YYYY-MM-DD')
								: kanban === 'Overdue'
								? moment(date).format('YYYY-MM-DD')
								: kanban === 'In Progress'
								? moment(new Date()).format('YYYY-MM-DD')
								: undefined,
						end_date:
							kanban === 'Due Today'
								? moment(new Date()).format('YYYY-MM-DD')
								: kanban === 'Overdue'
								? moment(date).format('YYYY-MM-DD')
								: kanban === 'In Progress'
								? undefined
								: undefined,
						watchers: info?.watchers?.map((e) => e.value),
						tags: info?.tags.map((t) => t.value),
						board_id: props?.board_id ? props?.board_id : '',
					},
					props.plan_id ? true : false,
					props.task_view_type,
					props.filterData,
					props.router?.navigate
				)
			);
		}
	};

	const handleChangeInfo = (name, value) => {
		setInfo({
			...info,
			[name]: value,
		});
	};

	const { new_task, add_task } = getSiteLanguageData('task/update');

	return (
		<>
			{props?.plan_id == null ? (
				show === false ? (
					<span
						className={
							props.className ||
							'm-auto theme-color btn btn-block lf-kanban-add-task-btn bg-white hover-theme-color'
						}
						onClick={handleShow}
					>
						<i className={`fas fa-plus`}></i>
						{new_task?.text}
					</span>
				) : (
					''
				)
			) : (
				<span className={props.className} onClick={handleShow}>
					{add_task?.text}
				</span>
			)}
			{show ? (
				<Form onSubmit={submitTask}>
					<InputGroup className="mb-1 ">
						<FormControl
							className="lf-formcontrol-height"
							placeholder="Enter Name"
							type="text"
							name="title"
							autoComplete="none"
							onBlur={submitTask}
							onChange={(e) => handleChangeInfo('title', e.target.value)}
							value={info.title}
							required
						/>
					</InputGroup>
				</Form>
			) : (
				''
			)}
		</>
	);
};
export default withRouter(
	connect((state) => {
		// export default connect((state) => {
		return {
			boardList: state?.task?.[GET_ALL_TASK_BOARD_LIST]?.result || [],
			assignee: state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [],
			category: state?.task?.[GET_CATEGORY_LIST]?.result || [],
			taskLocation: state?.task?.[GET_LOCATION_LIST]?.result || [],
			sheets: state?.project?.[GET_ALL_SHEETS]?.result || [],
			tag: state?.project?.[GET_ALL_TAGS]?.result || [],
		};
	})(CreateTask),
);
