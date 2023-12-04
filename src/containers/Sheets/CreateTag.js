import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { InputGroup, Modal, FormControl, Form, Button } from 'react-bootstrap';
import { createTag, getAllSheets } from '../../store/actions/projects';
import getUserId, { getSiteLanguageData } from '../../commons';
import { CREATE_TAGS } from '../../store/actions/actionType';

function CreateTag(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [showTag, setShowTag] = useState(false);
	const handleCloseTag = () => setShowTag(false);
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		name: '',
	});

	const [infoTag, setInfoTag] = useState({
		user_id: '',
		project_id: '',
		name: '',
	});

	const handleChangeTag = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setInfoTag({
			...infoTag,
			[name]: value,
		});
	};

	const submitTag = (e) => {
		e.preventDefault();
		dispatch(createTag(infoTag));
	};

	const handleShowTag = (u) => {
		setInfoTag({
			...infoTag,
			user_id: userId,
			project_id: project_id,
		});
		setShowTag(true);
	};

	const createTagResult = useSelector((state) => {
		return state?.project?.[CREATE_TAGS] || {};
	});

	useEffect(() => {
		if (createTagResult?.success === true) {
			handleCloseTag();
			setInfo({
				...info,
				user_id: userId,
				project_id: project_id,
				name: '',
			});
			dispatch(getAllSheets(project_id));
		}
	}, [createTagResult?.success, dispatch]);
	const { add_tag, tag_name, add_tag_btn } =
		getSiteLanguageData('sheet/createtag');
	return (
		<>
			<span data-toggle="tooltip" data-placement="left" title="Tag">
				<i className="fas fa-tag mt-2" onClick={() => handleShowTag()}></i>
			</span>
			<br />

			<Modal show={showTag} onHide={handleCloseTag} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>{add_tag?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitTag}>
						<div className="row p-3">
							<div className="col-sm-12 mt-2">
								<div className="form-group">
									<Form.Label htmlFor="tag">{tag_name?.text}</Form.Label>
									<InputGroup className="mb-3">
										<FormControl
											placeholder="Name"
											type="text"
											name="name"
											autoComplete="off"
											onChange={(e) => handleChangeTag(e)}
											value={infoTag.name}
											required
										/>
									</InputGroup>
								</div>
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block my-2 show-verify float-end">
									<i class="fas fa-plus pe-1"> </i>
									{add_tag_btn?.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default CreateTag;
