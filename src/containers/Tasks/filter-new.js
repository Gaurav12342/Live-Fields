import { useEffect, useState } from 'react';
import { Form, FormControl, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import { getBoardList, GetCategoryList } from '../../store/actions/Task';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_ALL_TASK_BOARD_LIST,
	GET_CATEGORY_LIST,
} from '../../store/actions/actionType';
import getUserId, { getSiteLanguageData } from '../../commons';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Creatable from 'react-select/creatable';
import { getAllRoleWisePeople } from '../../store/actions/projects';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { GET_ALL_TAGS } from '../../store/actions/actionType';
import { createTag, getAllTags } from '../../store/actions/projects';
import CustomSelect from '../../components/SelectBox';

const userId = getUserId();

function FilterTask({
	manageTaskFilter,
	filterData,
	clearTaskFilter,
	...props
}) {
	const { project_id } = useParams();
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();
	const dispatch = useDispatch();
	const [Status, setStatus] = useState(true);
	const boardList = useSelector((state) => {
		return state?.task?.[GET_ALL_TASK_BOARD_LIST]?.result || [];
	});
	const tags = useSelector((state) => {
		return state?.project?.[GET_ALL_TAGS]?.result || [];
	});
	useEffect(() => {
		if (boardList?.length <= 0) {
			dispatch(getBoardList(project_id, userId));
		}
	}, [boardList?.length, dispatch]);

	const category = useSelector((state) => {
		return state?.task?.[GET_CATEGORY_LIST]?.result || [];
	});
	useEffect(() => {
		if (category?.length <= 0) {
			dispatch(GetCategoryList(project_id, userId));
		}
	}, [category?.length, dispatch]);
	const assignee = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [];
	});
	useEffect(() => {
		if (assignee?.length <= 0) {
			dispatch(getAllRoleWisePeople(project_id));
		}
	}, [assignee, project_id, dispatch]);

	const projectUsers = [];
	assignee?.forEach((a) => {
		(a?.users).forEach((u) => {
			projectUsers.push({
				label: (
					<>
						{u?.profile ? (
							<img src={u.profile} className="me-1 priority-1 border" />
						) : (
							<span
								className="task-info-category text-uppercase me-2"
								style={{ background: '#B36BD4', color: '#FFFFFF' }}>
								{u.first_name?.charAt(0)}
								{u.last_name?.charAt(0)}
							</span>
						)}
						<span className="lf-react-select-item">
							{u.first_name} {u.last_name}
						</span>
					</>
				),
				value: u._id,
			});
		});
	});

	const watcherUsers = [];
	assignee?.forEach((a) => {
		(a?.users).forEach((u) => {
			watcherUsers.push({
				label: (
					<>
						{u?.profile ? (
							<img src={u.profile} className="me-1 priority-1 border" />
						) : (
							<span
								className="task-info-category text-uppercase me-2"
								style={{ background: '#B36BD4', color: '#FFFFFF' }}>
								{u.first_name?.charAt(0)}
								{u.last_name?.charAt(0)}
							</span>
						)}
						<span className="lf-react-select-item">
							{u.first_name} {u.last_name}
						</span>
					</>
				),
				value: u._id,
			});
		});
	});

	const board = boardList?.map((b) => {
		return { label: b.name, value: b._id };
	});
	const categories = category?.map((c) => {
		return { label: c.name, value: c._id };
	});

	const brandColor = '#f97316';

	const customStyles = {
		control: (base, state) => ({
			...base,
			borderRadius: 'none',
			boxShadow: state.isFocused ? 0 : 0,
			borderColor: state.isFocused ? brandColor : base.borderColor,
			'&:hover': {
				borderColor: state.isFocused ? brandColor : base.borderColor,
			},
			borderRadius: '4px',
			padding: '0px',
		}),
		indicatorSeparator: (style) => ({
			...style,
			display: 'none',
		}),
		option: (provided, state) => {
			return {
				...provided,
				backgroundColor: state.isSelected
				? "#f97316"
				: state.isFocused
				? "#f9731650"
				: null,
				color: '#000000',
				'&:hover': {
					opacity: state.isDisabled ? 1 : 1,
					backgroundColor: state.isFocused ? '#f9731650' : null,
					//color: '#ffffff',
				},
			};
		},
	};
	const workTypes = [
		{ name: 'Planned', value: 'planned' },
		{ name: 'Issue', value: 'issue' },
	];
	const typeOfWork = workTypes?.map((b) => {
		return { label: b.name, value: b.value };
	});
	const { filter_task, status_name, view_archive_task, clear_all } =
		getSiteLanguageData('task/update');
	const {
		types_of_work,
		category_name,
		assignee_name,
		watcher,
		start_date,
		end_date,
		tags_name
	} = getSiteLanguageData('commons');
	return (
		<>
			{props?.open ? (
				<div
					id=""
					style={{ width: props.open ? '375px' : '0px', height: '92vh' }}
					className="lf-task-list-filter bg-light">
					<div className="container lf-filter-topnav">
						<div className="row">
							<div className="col-6">
								<h4 className="lf-filtertask-head">{`filter_task?.text`}</h4>
							</div>
							<div className="col-6">
								<span className="lf-filtertask-head float-end">
									<span
										className="filter-clear-all lf-link-cursor lf-main-button px-1 py-1"
										onClick={() => clearTaskFilter()}>
										{clear_all?.text}
									</span>
									<img
										onClick={() => props.setOpen(false)}
										alt="livefield"
										src="/images/times-circle-regular.svg"
										className="ms-3"
										width="22px"
										height="20px"
									/>
								</span>
							</div>
						</div>
						<hr />
						<Form
						// onSubmit={boardfilter}
						>
							<div className="container">
								<span className="row">
									<div className="col">
										<Form.Label className="mb-0">
											{status_name?.text}
										</Form.Label>
										<Select
											placeholder={`${status_name?.text}...`}
											isMulti={true}
											name="status"
											onChange={(e) =>
												manageTaskFilter(
													'status',
													e.map((b) => b.value),
												)
											}
											options={board}
											value={board.filter((b) =>
												filterData.status?.includes(b.value),
											)}
											styles={customStyles}
											closeMenuOnSelect={false}
										/>
									</div>
								</span>
								<span className="row">
									<div className="col mt-2">
										<Form.Label className="mb-0">
											{types_of_work?.text}
										</Form.Label>
										<Select
											placeholder={`Select ${types_of_work?.text}...`}
											name="type"
											onChange={(e) => manageTaskFilter('type', e.value)}
											options={typeOfWork}
											value={typeOfWork?.filter(
												(as) => as.value === filterData.type,
											)}
											required
											styles={customStyles}
										/>
									</div>
								</span>
								<span className="row">
									<div className="col mt-2">
										<Form.Label className="mb-0">
											{category_name?.text}
										</Form.Label>
										<Creatable
											placeholder={`${category_name?.text}...`}
											name="categories"
											isMulti={true}
											onChange={(e) =>
												manageTaskFilter(
													'categories',
													e.map((c) => c.value),
												)
											}
											options={categories}
											value={categories.filter((c) =>
												filterData.categories?.includes(c.value),
											)}
											styles={customStyles}
											closeMenuOnSelect={false}
										/>
									</div>
								</span>
								<span className="row ">
									<div className="col mt-2">
										<Form.Label className="mb-0">
											{assignee_name?.text}
										</Form.Label>
										<Select
											placeholder={`${assignee_name?.text}...`}
											name="assignee"
											isMulti={true}
											onChange={(e) =>
												manageTaskFilter(
													'assignee',
													e.map((c) => c.value),
												)
											}
											options={projectUsers}
											value={projectUsers.filter((c) =>
												filterData.assignee?.includes(c.value),
											)}
											styles={customStyles}
											closeMenuOnSelect={false}
										/>
									</div>
								</span>
								<div className='row'>
									<div className="col-12 mt-2">
										<Form.Label className="mb-0">
											{tags_name.text}
										</Form.Label>
										<Select
											placeholder={tags_name.text}
											name="tags"
											isMulti={true}
											onChange={(e) =>
												manageTaskFilter(
													'tags',
													e.map((c) => c.value),
												)
											}
											options={tags.map((tag) => {
												return {
													value: tag?._id,
													label: tag?.name,
												};
											})}
											
											value={filterData?.tags?.map((t) => {
												const tag = tags?.filter((tt) => tt._id === t)[0];
												return {
													value: tag?._id,
													label: tag?.name,
												};
											})}
											styles={customStyles}
											closeMenuOnSelect={false}
										/>
									</div>
								</div>
								<span className="row">
									<div className="col mt-2">
										<Form.Label className="mb-0">{watcher?.text}</Form.Label>
										<Select
											placeholder={`${watcher?.text}...`}
											isMulti={true}
											name="watchers"
											onChange={(e) =>
												manageTaskFilter(
													'watchers',
													e.map((u) => u.value),
												)
											}
											options={watcherUsers}
											closeMenuOnSelect={false}
											value={watcherUsers.filter((u) =>
												filterData.watchers?.includes(u.value),
											)}
											styles={customStyles}
										/>
									</div>
								</span>
								<span className="row">
									<div className="col-6 mt-2">
										<Form.Label htmlFor="StartDate" className=" mb-0">
											{start_date?.text}
										</Form.Label>
										{/* <FormControl
											className="lf-formcontrol-height"
											type="date"
											name="start_date"
											onChange={(e) =>
												manageTaskFilter('start_date', e.target.value)
											}
											styles={customStyles}
										/> */}
										<DatePicker
											className="w-100 input-border form-control lf-formcontrol-height"
											placeholderText={`dd/MM/yyyy`}
											selected={filterData.start_date}
											dateFormat="dd/MM/yyyy"
											
											onChange={(date) => {
												manageTaskFilter('start_date', date);
												setStartDate(date);
											}}
											/* onCalendarClose={(date) =>
												manageTaskFilter('start_date', date)
											} */
											isClearable={true}
											required
										/>
									</div>
									<div className="col-6 mt-2">
										<Form.Label htmlFor="EndDate" className=" mb-0">
											{end_date?.text}
										</Form.Label>

										<DatePicker
											className="w-100 input-border form-control lf-formcontrol-height"
											placeholderText={`dd/MM/yyyy`}
											selected={filterData.end_date}
											dateFormat="dd/MM/yyyy"
											onChange={(date) => {
												manageTaskFilter('end_date', date);
												setEndDate(date);
											}}
											/* onCalendarClose={(date) =>
												manageTaskFilter('end_date', date)
											} */
											isClearable={true}
											required
										/>

										{/* <FormControl
											className="lf-formcontrol-height"
											type="date"
											name="end_date"
											onChange={(e) =>
												manageTaskFilter('end_date', e.target.value)
											}
											styles={customStyles}
										/> */}
									</div>
								</span>
							</div>
							<div className="row mt-3 ">
								<div className="col text-center">
									<InputGroup className="ms-2">
										<Form.Group
											className="mb-1 ms-2"
											controlId="formBasicCheckbox">
											<label className="check">
												{view_archive_task?.text}
												<input
													type="checkbox"
													id="blankCheckbox"
													onChange={(e) =>
														manageTaskFilter('is_archived', e.target.checked)
													}
													checked={filterData?.is_archived}
												/>
												<span className="checkmark"></span>
											</label>
										</Form.Group>
									</InputGroup>
								</div>
								{/* <Button
                    type="submit"
                    className="btn btn-primary theme-btn btn-block my-1 show-verify">
                    Apply
                  </Button> */}
							</div>
						</Form>
					</div>
				</div>
			) : null}
		</>
	);
}

export default FilterTask;
