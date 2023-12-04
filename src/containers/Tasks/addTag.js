import { useEffect, useState } from 'react';
import {
	InputGroup,
	Modal,
	FormControl,
	Form,
	Button,
	Dropdown,
} from 'react-bootstrap';

import { Link } from 'react-router-dom';
import { useParams } from 'react-router';

import React from 'react';
import axios from 'axios';
import { createPlan } from '../../store/actions/projects';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import { GET_ALL_TAGS } from '../../store/actions/actionType';
import { getAllTags } from '../../store/actions/projects';
import Tags from '../../components/tags';
import Upload from '../../components/upload';

const userId = getUserId();
function CreatePlan(props) {
	const { project_id } = useParams();
	const directoryId = props?.directory_id;

	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [info, setInfo] = useState({
		name: '',
		sheet_no: '',
		description: '',
		tags: [],
		file_url: '',
	});

	const data = useSelector((state) => {
		return state?.project?.[GET_ALL_TAGS]?.result || [];
	});

	const submitPlan = (e) => {
		e.preventDefault();
		handleClose();
		const post = {
			user_id: userId,
			project_id: project_id,
			directory_id: directoryId,
			plans: [info],
		};
		dispatch(createPlan(post));
	};

	const handleChange = (val, name) => {
		setInfo({
			...info,
			[name]: val,
		});
	};

	useEffect(() => {
		if (data?.length <= 0) {
			dispatch(getAllTags(project_id));
		}
	}, [data?.length, dispatch]);
	const { add_plan, add_tag } = getSiteLanguageData('task/update');
	const { name } = getSiteLanguageData('commons');
	return (
		<>
			{React.cloneElement(props.children, { onClick: handleShow })}
			<Modal show={show} onHide={handleClose} size="md" animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>
						<h3 className="ms-5 theme-color">{add_tag?.text}</h3>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<Form onSubmit={submitPlan}>
							<div className="form-group col-sm-12 ">
								<Form.Label htmlFor="Add plan" className="ms-1">
									{' '}
									{name?.text}{' '}
								</Form.Label>
								<InputGroup className="">
									<FormControl
										type="text"
										autoComplete="off"
										onChange={(e) => handleChange(e.target.value, 'name')}
										placeholder={'Plan name'}
									/>
								</InputGroup>
							</div>
							<Button
								type="submit"
								className="theme-btn mx-2 btn-block float-end">
								{add_plan?.text}
							</Button>
						</Form>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default CreatePlan;
