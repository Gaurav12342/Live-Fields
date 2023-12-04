import { useState } from 'react';
import { Modal, Form, Button, Card } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { createFile } from '../../store/actions/projects';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import Upload from '../../components/upload';
import { GET_ALL_FILE_LIST_DIRECTORIES_WISE } from '../../store/actions/actionType';
import { clearUploadFile } from '../../store/actions/Utility';
import CustomSelect from '../../../src/components/SelectBox';

function CreateFile(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const directoryId = props?.directory_id;
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleShow = () => setShow(true);
	const filedlist = useSelector((state) => {
		return state?.project?.[GET_ALL_FILE_LIST_DIRECTORIES_WISE]?.result;
	});
	const filedlists = filedlist?.map((c) => {
		return { label: c.name, value: c._id };
	});
	const handleClose = () => {
		setShow(false);
		dispatch(clearUploadFile());
		setInfo([]);
		setFileDirectory({
			directory_id: filedlists[0]?.value,
		});
	};

	const [fileDirectory, setFileDirectory] = useState({
		directory_id: filedlists[0]?.value,
	});

	const [info, setInfo] = useState([]);
	const submitFile = (e) => {
		e.preventDefault();
		handleClose();
		const post = {
			user_id: userId,
			project_id: project_id,
			directory_id: directoryId || fileDirectory?.directory_id,
			files: info,
		};
		dispatch(createFile(post));
		dispatch(clearUploadFile());
		setInfo([]);
	};
	const handleChangeInfo = (name, value) => {
		setFileDirectory({
			...fileDirectory,
			[name]: value,
		});
	};

	const handleChange = (val, name, k) => {
		const arr = info.filter((file) => {
			return file !== val;
		});

		arr[k] = {
			...arr[k],
			[name]: val,
		};
		setInfo([...arr]);
	};
	const { select_directory, add_file,ph_select_directory } = getSiteLanguageData('files');

	return (
		<>
			{React.cloneElement(props.children, { onClick: handleShow })}
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				size="md"
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{add_file?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<Form onSubmit={submitFile}>
							{props.type === 'common' ? (
								<div className="form-group col-lg-12 pb-2 mb-3">
									<Form.Label className="mb-0">
										{select_directory?.text}
									</Form.Label>
									<CustomSelect
										name="directory_id"
										onChange={(e) => handleChangeInfo('directory_id', e?.value)}
										placeholder={ph_select_directory?.text}
										options={filedlists}
										value={filedlists?.filter(
											(d) => d?.value === fileDirectory?.directory_id,
										)}
										required
									/>
								</div>
							) : (
								''
							)}

							<Upload
								className="mt-2"
								fileType="project_file"
								fileKey={directoryId}
								onFinish={(file, name, type, iconURL) => {
									const data = {
										file_url: file,
										icon:iconURL
									};
									const newArr = info;
									newArr.push(data);
									setInfo([...newArr]);
								}}></Upload>

							{info?.length ? (
								<div className="my-3">
									{info?.map((i, k) => {
										let file = i.file_url.split('/').slice(-1).join('.');
										let ext = file.split('.').slice(-1).join('.');
										return (
											
											<div className="row align-items-center mb-3">
												<div className="col-11">
													{
														<>
															<img
																alt="livefield"
																className="me-2 lf-w-25"
																src={i.icon || `/images/${ext}-icon.png`}
															/>
															<span className="">{decodeURI(file)}</span>
														</>
													}
													{/* <img alt="livefield" className="mt-2 lf-f-50 lf-w-50" src={i.file_url} /> */}
												</div>
												<div className="col-1 ps-0">
													<span className='pointer'>
														<i
															className="fas fa-trash-alt p-2 theme-btnbg rounded theme-secondary"
															onClick={handleChange.bind(this, i)}></i>
													</span>
												</div>
											</div>
											
										);
									})}
								</div>
							) : (
								''
							)}

							<Button
								type="submit"
								className="theme-btn btn-block float-end mb-3 mt-4">
								<i className='fas fa-plus pe-1'></i>	
								{add_file?.text}
							</Button>
						</Form>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default CreateFile;
