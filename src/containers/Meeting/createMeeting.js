import { useEffect, useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import moment from 'moment';
import {
	createProjectMeeting,
	getAllMeetingList,
	getAllRoleWisePeople,
} from '../../store/actions/projects';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import getUserId from '../../commons';
import {
	CREATE_MEETING,
	GET_ALL_ROLE_WISE_PEOPLE,
} from '../../store/actions/actionType';
import DatePicker from 'react-datepicker';
import CustomSelect from '../../components/SelectBox';
const userId = getUserId();
function CreateMeeting(props) {
	const { project_id } = useParams();

	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const assignee = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [];
	});
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		meeting_number: '',
		meeting_name: '',
		agenda: '',
		venue: '',
		notes: '',
		meeting_date: new Date(),
		start_time: '',
		end_time: '',
		meeting_responsibility: '',
	});
	const handleChange = (name, value) => {
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitMeeting = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(createProjectMeeting(info));
	};
	const createMeetingRes = useSelector((state) => {
		return state?.project?.[CREATE_MEETING] || [];
	}, shallowEqual);
	useEffect(() => {
		if (createMeetingRes?.success && show) {
			handleClose();
			dispatch(getAllMeetingList(project_id));
		}
	}, [createMeetingRes, dispatch]);
	useEffect(() => {
		if (assignee?.length <= 0) {
			dispatch(getAllRoleWisePeople(project_id));
		}
	}, [assignee, project_id, dispatch]);
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

	return (
		<>
			<span
				title="Create Meeting"
				className={
					props.className || 'lf-main-button lf-link-cursor  float-end'
				}
				onClick={handleShow}>
				<i className="fas fa-plus pe-1"></i> Meeting
			</span>
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>Create Meeting</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitMeeting}>
						<div className="row p-3 ">
							<div className="col-sm-5">
								<Form.Label htmlFor="templatename">Meeting Number</Form.Label>
							</div>

							<div className="col-sm-7">
								<InputGroup className="mb-1">
									<FormControl
										placeholder="Enter Meeting Number"
										type="text"
										name="meeting_number"
										autoComplete="off"
										onChange={(e) =>
											handleChange('meeting_number', e.target.value)
										}
										value={info.meeting_number}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2">
								<Form.Label htmlFor="templatename">Meeting Name</Form.Label>
							</div>

							<div className="col-sm-7 mt-1 ">
								<InputGroup className="mb-1">
									<FormControl
										placeholder="Enter Meeting Name"
										type="text"
										name="meeting_name"
										autoComplete="off"
										onChange={(e) =>
											handleChange('meeting_name', e.target.value)
										}
										value={info.meeting_name}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2">
								<Form.Label htmlFor="templatename">Agenda</Form.Label>
							</div>

							<div className="col-sm-7 mt-1">
								<InputGroup className="mb-1">
									<FormControl
										placeholder="Enter Agenda"
										type="text"
										name="agenda"
										autoComplete="off"
										onChange={(e) => handleChange('agenda', e.target.value)}
										value={info.agenda}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2">
								<Form.Label htmlFor="templatename">Venue</Form.Label>
							</div>

							<div className="col-sm-7 mt-1">
								<InputGroup className="mb-1">
									<FormControl
										placeholder="Enter Venue"
										type="text"
										name="venue"
										autoComplete="off"
										onChange={(e) => handleChange('venue', e.target.value)}
										value={info.venue}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2">
								<Form.Label htmlFor="templatename">Notes</Form.Label>
							</div>

							<div className="col-sm-7 mt-1">
								<InputGroup className="mb-1">
									<FormControl
										placeholder="Notes"
										type="text"
										name="notes"
										autoComplete="off"
										onChange={(e) => handleChange('notes', e.target.value)}
										value={info.notes}
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2">
								<Form.Label htmlFor="templatename">Date Of Meeting</Form.Label>
							</div>
							<div className="col-sm-7 mt-1">
								<DatePicker
									customInput={
										<FormControl className="lf-formcontrol-height" />
									}
									name="meeting_date"
									dateFormat="dd-MM-yyyy"
									selected={moment(info.meeting_date).toDate()}
									placeholderText="End Date"
									onChange={(e) =>
										handleChange('meeting_date', moment(e).format('YYYY-MM-DD'))
									}
									minDate={moment().toDate()}
								/>
							</div>
							<div className="col-sm-5 mt-2">
								<Form.Label htmlFor="templatename">Start Time</Form.Label>
							</div>

							<div className="col-sm-7 mt-2">
								<InputGroup className="mb-1">
									<FormControl
										placeholder="Enter Start Time"
										type="time"
										name="start_time"
										autoComplete="off"
										onChange={(e) => handleChange('start_time', e.target.value)}
										value={info.start_time}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2">
								<Form.Label htmlFor="templatename">End Time</Form.Label>
							</div>

							<div className="col-sm-7 mt-1">
								<InputGroup className="mb-1">
									<FormControl
										placeholder="Enter End Time"
										type="time"
										name="end_time"
										autoComplete="off"
										onChange={(e) => handleChange('end_time', e.target.value)}
										value={info.end_time}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2">
								<Form.Label htmlFor="templatename">
									Meeting Responsibility
								</Form.Label>
							</div>

							<div className="col-sm-7 mt-1">
								<CustomSelect
									placeholder="Assignee..."
									name="meeting_responsibility"
									onChange={(e) =>
										handleChange('meeting_responsibility', e.value)
									}
									options={projectUsers}
									moduleType="taskUsers"
									value={info.assigee_id}
									// isMulti
								/>
							</div>
							<div className="col-12 mt-3">
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block  show-verify float-end">
									+ Create
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default CreateMeeting;
