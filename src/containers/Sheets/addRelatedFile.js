import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Modal, Form, Button } from 'react-bootstrap';
import getUserId, { getSiteLanguageData } from '../../commons';
import { GET_ALL_FILE_LIST_DIRECTORIES_WISE } from '../../store/actions/actionType';
import {
	addRelatedFiles,
	getAllFileDirectoriesWise,
} from '../../store/actions/projects';
import CustomSelect from '../../components/SelectBox';

function AddRelatedFile(props) {
	const userId = getUserId();
	const plan_id = props?.plan_id;
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		user_id: userId,
		plan_id: plan_id,
		files: props.selectFile,
	});

	const handleChange = (name, value) => {
		setInfo({
			...info,
			[name]: value,
		});
	};

	const submitFiles = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(addRelatedFiles(info));
	};
	const files = useSelector((state) => {
		return state?.project?.[GET_ALL_FILE_LIST_DIRECTORIES_WISE]?.result || [];
	});
	useEffect(() => {
		if (files?.length <= 0) {
			dispatch(getAllFileDirectoriesWise(project_id));
		}
	}, [files?.length, dispatch]);
	const fileInfo = [];
	files?.forEach((a) => {
		(a?.plans).forEach((s) => {
			fileInfo.push({ label: decodeURIComponent(s.file_name), value: s._id });
		});
	});
	const { btn_add_file } = getSiteLanguageData('sheet/toolbar');
	const { add_related_file, add_related_file_btn, file_list } =
		getSiteLanguageData('sheet/addrelatedfile');

	return (
		<>
			<div className='btn btn-block bg-white w-100 mt-3 border-0' onClick={() => handleShow()}>
				<span title="Link File" className="theme-color lf-link-cursor">
					<i className="fas fa-plus pe-1"></i>
					{btn_add_file?.text}
				</span>
			</div>
			<Modal show={show} onHide={handleClose} animation={false}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{add_related_file?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitFiles}>
						<div className="row p-3">
							<div className="col-sm-12">
								<div className="form-group">
									<label>{file_list?.text}</label>
									<CustomSelect
										isClearable
										isMulti
										placeholder="Files..."
										name="files"
										onChange={(e) =>
											handleChange(
												'files',
												e?.map((w) => w.value),
											)
										}
										options={fileInfo}
										closeMenuOnSelect={false}
										value={fileInfo?.filter((file) =>
											info.files?.some((w) => w === file.value),
										)}
									/>
								</div>
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block mt-3 show-verify float-end">
									<i class="fas fa-plus pe-1"></i>
									{add_related_file_btn?.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default AddRelatedFile;
