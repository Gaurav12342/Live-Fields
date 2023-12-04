import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { InputGroup, Modal, FormControl, Form, Button } from 'react-bootstrap';
import {
	getAllRoleWisePeople,
	editMeeting,
	getAllMeetingList,
} from '../../../store/actions/projects';
import getUserId, { getSiteLanguageData } from '../../../commons';
import moment from 'moment';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	UPDATE_MEETING,
} from '../../../store/actions/actionType';
function EditMeeting(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const meeting_date = moment(props?.data?.meeting_date).format('YYYY-MM-DD');
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const assignee = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [];
	});
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		meeting_id: props?.data?._id,
		meeting_number: props?.data?.meeting_number,
		meeting_name: props?.data?.meeting_name,
		agenda: props?.data?.agenda,
		venue: props?.data?.venue,
		notes: props?.data?.notes,
		meeting_date: meeting_date,
		start_time: props?.data?.start_time,
		end_time: props?.data?.end_time,
		meeting_responsibility: props?.data?.meeting_responsibility,
	});
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitEditMetting = (e) => {
		e.preventDefault();
		dispatch(editMeeting(info));
	};
	const updateMeetRes = useSelector((state) => {
		return state?.project?.[UPDATE_MEETING] || [];
	}, shallowEqual);
	useEffect(() => {
		if (updateMeetRes?.success && show) {
			handleClose();
			dispatch(getAllMeetingList(project_id));
		}
	}, [updateMeetRes, dispatch]);
	useEffect(() => {
		if (updateMeetRes?.success === true) {
			handleClose();
			setInfo({
				...info,
				user_id: userId,
				meeting_id: props?.data?._id,
				meeting_number: '',
				meeting_name: '',
				agenda: '',
				venue: '',
				notes: '',
				meeting_date: '',
				start_time: '',
				end_time: '',
				meeting_responsibility: '',
			});
		}
	}, [updateMeetRes?.success, dispatch]);
	useEffect(() => {
		if (assignee?.length <= 0) {
			dispatch(getAllRoleWisePeople(project_id));
		}
	}, [assignee, project_id, dispatch]);
	const { icon_edit } = getSiteLanguageData('meeting');
	const { save } = getSiteLanguageData('commons');
	const {
		meeting_number,
		meeting_name,
		agenda,
		venue,
		notes,
		start_time,
		date_of_meeting,
		end_time,
		meeting_responsibility,
		update_meeting,
	} = getSiteLanguageData('meeting/components');

	return (
		<>
			<span
				className="float-end me-2 p-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold"
				tooltip={icon_edit.tooltip}
				flow={icon_edit.tooltip_flow}
				onClick={handleShow}>
				<i className="fas fa-edit"></i>
			</span>
			<Modal
				clasName="lf-modal"
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{update_meeting?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitEditMetting}>
						<div className="row p-3 ">
							<div className="col-sm-5">
								<Form.Label htmlFor="templatename">
									{meeting_number?.text}
								</Form.Label>
							</div>

							<div className="col-sm-7">
								<InputGroup className="mb-1">
									<FormControl
										placeholder="Enter Meeting Number"
										type="text"
										name="meeting_number"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										value={info.meeting_number}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2">
								<Form.Label htmlFor="templatename">
									{meeting_name?.text}
								</Form.Label>
							</div>

							<div className="col-sm-7 mt-1 ">
								<InputGroup className="mb-1">
									<FormControl
										placeholder="Enter Meeting Name"
										type="text"
										name="meeting_name"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										value={info.meeting_name}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2">
								<Form.Label htmlFor="templatename">{agenda?.text}</Form.Label>
							</div>

							<div className="col-sm-7 mt-1">
								<InputGroup className="mb-1">
									<FormControl
										placeholder="Enter Agenda"
										type="text"
										name="agenda"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										value={info.agenda}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2">
								<Form.Label htmlFor="templatename">{venue?.text}</Form.Label>
							</div>

							<div className="col-sm-7 mt-1">
								<InputGroup className="mb-1">
									<FormControl
										placeholder="Enter Venue"
										type="text"
										name="venue"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										value={info.venue}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2">
								<Form.Label htmlFor="templatename">{notes?.text}</Form.Label>
							</div>

							<div className="col-sm-7 mt-1">
								<InputGroup className="mb-1">
									<FormControl
										placeholder="Notes"
										type="text"
										name="notes"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										value={info.notes}
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2">
								<Form.Label htmlFor="templatename">
									{date_of_meeting?.text}
								</Form.Label>
							</div>

							<div className="col-sm-7 mt-1">
								<InputGroup className="mb-1">
									<FormControl
										placeholder="Enter Date Of Meeting"
										type="date"
										name="meeting_date"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										value={info.meeting_date}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2">
								<Form.Label htmlFor="templatename">
									{start_time?.text}
								</Form.Label>
							</div>

							<div className="col-sm-7 mt-1">
								<InputGroup className="mb-1">
									<FormControl
										placeholder="Enter Start Time"
										type="time"
										name="start_time"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										value={info.start_time}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2">
								<Form.Label htmlFor="templatename">{end_time?.text}</Form.Label>
							</div>

							<div className="col-sm-7 mt-1">
								<InputGroup className="mb-1">
									<FormControl
										placeholder="Enter End Time"
										type="time"
										name="end_time"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										value={info.end_time}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2">
								<Form.Label htmlFor="templatename">
									{meeting_responsibility?.text}
								</Form.Label>
							</div>

							<div className="col-sm-7 mt-1">
								<InputGroup>
									<FormControl
										as="select"
										name="meeting_responsibility"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										value={info.meeting_responsibility}
										required>
										<option value={null}>select User</option>
										{assignee?.map((r) => {
											return r?.users?.map((u) => {
												return (
													<option key={u._id} value={u?._id}>
														{u?.first_name} {u?.last_name}
													</option>
												);
											});
										})}
									</FormControl>
								</InputGroup>
							</div>
							<div className="col-12 mt-3">
								<Button
									type="submit"
									className="float-end btn btn-primary theme-btn btn-block  show-verify">
									<i class="fa-solid fa-floppy-disk pe-2"></i>
									{save?.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default EditMeeting;
