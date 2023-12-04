import { useEffect, useState } from 'react';
import { InputGroup, Modal, FormControl, Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router';

import React from 'react';
import { createPlan } from '../../store/actions/projects';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import { GET_ALL_TAGS } from '../../store/actions/actionType';
import { getAllTags } from '../../store/actions/projects';
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

	const { add_plan, plan_name, sheet_no, add_file } =
		getSiteLanguageData('task/update');
	const { description } = getSiteLanguageData('commons');
	return (
		<>
			{React.cloneElement(props.children, { onClick: handleShow })}
			<Modal show={show} onHide={handleClose} size="md" animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>
						<h3 className="ms-5 theme-color">{add_plan?.text}</h3>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<Form onSubmit={submitPlan}>
							<div className="form-group col-sm-12 ">
								<Form.Label htmlFor="Add plan" className="ms-1">
									{plan_name?.text}
								</Form.Label>
								<InputGroup className="">
									<FormControl
										type="text"
										autoComplete="off"
										onChange={(e) => handleChange(e.target.value, 'name')}
										placeholder={plan_name?.text}
									/>
								</InputGroup>
							</div>
							<div className="form-group col-sm-12 ">
								<Form.Label htmlFor="sheet no" className="ms-1">
									{sheet_no?.text}
								</Form.Label>
								<InputGroup className="">
									<FormControl
										type="text"
										autoComplete="off"
										onChange={(e) => handleChange(e.target.value, 'sheet_no')}
										placeholder={sheet_no?.text}
									/>
								</InputGroup>
							</div>
							<div className="form-group col-sm-12 ">
								<Form.Label htmlFor="Description" className="ms-1">
									{description?.text}
								</Form.Label>
								<InputGroup className="">
									<FormControl
										type="text"
										autoComplete="off"
										onChange={(e) =>
											handleChange(e.target.value, 'description')
										}
										placeholder={description?.text}
									/>
								</InputGroup>
							</div>
							<div className="form-group col-sm-12">
								{/* <Form.Label htmlFor="Tag" className="ms-1"> Add Tag </Form.Label> */}
								{/* <Dropdown className="">
					<Dropdown.Toggle variant="transparent" className="card-add theme-color btn-style py-0 px-2 mt-3" >
						Add Tags
					</Dropdown.Toggle>
					<Dropdown.Menu>
					{data?.map((u) => {
				return (
						<Dropdown.Item className="card-add">{u.name}</Dropdown.Item>
						);
					})
					}
					</Dropdown.Menu>
					</Dropdown> */}

								{/* <Tags>
				Select Tags
				</Tags> */}

								{/* {data?.map((u) => {
				return (
					<label className="check">{u.name}
					<input
						type="checkbox"
						id="blankCheckbox"
						value="option1"
						
					/>
					<input type="checkbox" />
					<span className="checkmark"></span>
					</label>
				);
				})
				} */}
							</div>
							{/* <div className="form-group col-sm-12">
				<InputGroup className="">
				<FormControl
					type="file"
					onChange={(e) => setUploadFile(e.target.files)}
				/>
				</InputGroup>
			</div> */}
							<Upload
								fileType="plan"
								fileKey={directoryId}
								onFinish={(file) => handleChange(file, 'file_url')}>
								<span className="btn mt-1 theme-secondary theme-btnbg">
									{add_file.name}
								</span>
							</Upload>
							<hr />
							<Button type="submit" className="theme-btn float-end btn-block">
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
