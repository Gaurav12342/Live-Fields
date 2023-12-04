import { useEffect, useState } from 'react';
import { Form, FormControl, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_ALL_TAGS
} from '../../store/actions/actionType';

import getUserId, { getSiteLanguageData } from '../../commons';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Creatable from 'react-select/creatable';
import { getAllRoleWisePeople } from '../../store/actions/projects';
import DatePicker from 'react-datepicker';
import moment from 'moment';
const userId = getUserId();

function Filter({
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
	
	const tags = useSelector((state) => {
		return state?.project?.[GET_ALL_TAGS]?.result || [];
	});

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
				backgroundColor: state.isSelected ? '#f97316' : state.isFocused ? '#f9731650' : null,
				color: '#000000',
				'&:hover': {
					opacity: state.isDisabled ? 1 : 1,
					backgroundColor: state.isFocused ? '#f9731650' : null,
					//color: '#ffffff',
				},
			};
		},
	};

	const { filter_task, clear_all,filter_photo } = getSiteLanguageData('task/update');
	const { start_date, end_date } = getSiteLanguageData('commons');
	const { uploaded_by } = getSiteLanguageData('files');
	const { tags_n } = getSiteLanguageData('components/tags');
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
								<h4 className="lf-filtertask-head">{filter_photo.text}</h4>
							</div>
							<div className="col-6">
								<div className="lf-filtertask-head float-end">
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
								</div>
							</div>
						</div>
						<hr />
						<Form
						// onSubmit={boardfilter}
						>
							<div className="container">
								
								<div className="row ">
									<div className="col mt-2">
										<Form.Label className="mb-0">
											{uploaded_by.text}
										</Form.Label>
										<Select
											placeholder={uploaded_by.text}
											name="uploaded_by"
											isMulti={true}
											onChange={(e) =>
												manageTaskFilter(
													'uploaded_by',
													e.map((c) => c.value),
												)
											}
											options={projectUsers}
											value={projectUsers.filter((c) =>
												filterData.uploaded_by?.includes(c.value),
											)}
											styles={customStyles}
											closeMenuOnSelect={false}
										/>
									</div>
								</div>

								<div className="row ">
									<div className="col mt-2">
										<Form.Label className="mb-0">
											{tags_n.text}
										</Form.Label>
										<Select
											placeholder={tags_n.text}
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
								
								<div className="row">
									<div className="col-6 mt-2">
										<Form.Label htmlFor="StartDate" className=" mb-0">
											{start_date?.text}
										</Form.Label>
										
										<DatePicker
											className="w-100 input-border form-control lf-formcontrol-height"
											placeholderText={`dd/MM/yyyy`}
											selected={filterData.start_date ? new Date(filterData.start_date) : null}
											dateFormat="dd/MM/yyyy"
											maxDate={filterData.end_date ? new Date(filterData.end_date) : new Date()}
											onChange={(date) => {
												console.log(date, "date")
												if(date){
													manageTaskFilter('start_date', moment(new Date(date)).format("YYYY-MM-DD"));
												}else{
													manageTaskFilter('start_date', '');
												}
												
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
											selected={filterData.end_date ? new Date(filterData.end_date) : null}
											dateFormat="dd/MM/yyyy"
											maxDate={new Date()}
											minDate={filterData.start_date ? new Date(filterData.start_date) : null}
											onChange={(date) => {
												if(date){
													manageTaskFilter('end_date',  moment(new Date(date)).format("YYYY-MM-DD"));
												}else{
													manageTaskFilter('end_date',  '');
												}
												
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
								</div>
							</div>
							
						</Form>
					</div>
				</div>
			) : null}
		</>
	);
}

export default Filter;
