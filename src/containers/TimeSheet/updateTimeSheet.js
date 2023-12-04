import { useEffect, useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import {
	updateTimeSheet,
	getAllRoleWisePeople,
} from '../../store/actions/projects';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import {
	UPDATE_TIMESHEET,
	GET_ALL_ROLE_WISE_PEOPLE,
} from '../../store/actions/actionType';
import moment from 'moment';
function EditTimeSheet(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const from_date = moment(props?.data?.from_date).format('YYYY-MM-DD');
	const to_date = moment(props?.data?.to_date).format('YYYY-MM-DD');
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		time_sheet_id: props?.data?._id,
		assigee_id: props?.data?.assigee_id,
		description: props?.data?.description,
		from_date: from_date,
		to_date: to_date,
	});
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitEditLabour = (e) => {
		e.preventDefault();
		dispatch(updateTimeSheet(info));
	};
	const updateTimeSheetRes = useSelector((state) => {
		return state?.project?.[UPDATE_TIMESHEET] || [];
	}, shallowEqual);
	const assingee = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [];
	});
	useEffect(() => {
		if (assingee?.length <= 0) {
			dispatch(getAllRoleWisePeople(project_id));
		}
	}, [assingee, project_id, dispatch]);

	useEffect(() => {
		if (updateTimeSheetRes?.success === true) {
			handleClose();
			setInfo({
				...info,
				user_id: userId,
				project_id: project_id,
				assigee_id: '',
				description: '',
				from_date: '',
				to_date: '',
			});
		}
	}, [updateTimeSheetRes?.success, dispatch]);

	const { update_timeSheet } = getSiteLanguageData('storeroom');

	const { assignee_name, description: timeSheetDescription,from_date:fromData,to_date:toData,save } =
		getSiteLanguageData('commons');

	const { select_role } = getSiteLanguageData('inspection');
	
	return (
		<>
			<Button className="btn-blue" onClick={handleShow}>
				<img alt="livefield" src="/images/edit-white.svg" width="15px" />
			</Button>
			<Modal show={show} onHide={handleClose} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>{update_timeSheet.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitEditLabour}>
						<div className="row p-3 ">
							<div className="col-sm-5 mt-2 ">
								<Form.Label htmlFor="templatename">
									{assignee_name.text}
								</Form.Label>
							</div>

							<div className="col-sm-7 mt-2">
								<InputGroup className="mb-3">
									<FormControl
										as="select"
										name="assigee_id"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										value={info.assigee_id}
										required>
										<option value={null}>{select_role.text}</option>
										{assingee?.map((d) => {
											return d?.users?.map((u) => {
												return (
													<option key={u._id} value={u?._id}>
														{u?.first_name}
													</option>
												);
											});
										})}
									</FormControl>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2 ">
								<Form.Label htmlFor="templatename">
									{timeSheetDescription.text}
								</Form.Label>
							</div>

							<div className="col-sm-7 mt-2 ">
								<InputGroup className="mb-3">
									<FormControl
										placeholder={`Enter ${timeSheetDescription.text}`}
										as="textarea"
										name="description"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										value={info.description}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2 ">
								<Form.Label htmlFor="templatename">{fromData.text}</Form.Label>
							</div>

							<div className="col-sm-7 mt-2 ">
								<InputGroup className="mb-3">
									<FormControl
										type="date"
										name="from_date"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										value={info.from_date}
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2 ">
								<Form.Label htmlFor="templatename">{toData.text}</Form.Label>
							</div>

							<div className="col-sm-7 mt-2 ">
								<InputGroup className="mb-3">
									<FormControl
										type="date"
										name="to_date"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										value={info.to_date}
									/>
								</InputGroup>
							</div>
							<div className="col-12 mt-3">
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block my-1 show-verify">
									{`${save.text} Changes`}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default EditTimeSheet;
