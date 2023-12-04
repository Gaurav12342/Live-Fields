import { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Modal, Form, Button, Dropdown } from 'react-bootstrap';
import {
	getAllFileDirectoriesWise,
	changeFileDirectories,
} from '../../store/actions/projects';
import getUserId, { getSiteLanguageData } from '../../commons';
import {
	GET_ALL_FILE_LIST_DIRECTORIES_WISE,
	MOVE_PLAN_DIRECTORY,
} from '../../store/actions/actionType';

function MoveDirectory(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);

	const [showMoveDirectories, setshowMoveDirectory] = useState(false);
	const handleCloseChangeDirectories = () => setshowMoveDirectory(false);

	const [infoFile, setInfoFile] = useState({
		user_id: userId,
		project_id: project_id,
		file_id: props?.file_id,
		file_directory_id: '',
	});
	const data = useSelector((state) => {
		return state?.project?.[GET_ALL_FILE_LIST_DIRECTORIES_WISE]?.result || [];
	});
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setInfoFile({
			...infoFile,
			[name]: value,
		});
	};

	const MoveDirectory = useCallback(
		(e) => {
			handleCloseChangeDirectories();
			// const post = {
			//   user_id: userId,
			//   project_id: project_id,
			//   file_id: props?.file_id || [props?.file_id],
			//   file_directory_id: infoFile?.file_directory_id,
			// };
			dispatch(changeFileDirectories(infoFile));
			props?.handleMultiSelect([]);
		},
		[infoFile],
	);
	const handleShowFileDirectory = (p) => {
		setInfoFile({
			...infoFile,
		});
		setshowMoveDirectory(true);
	};
	const changeDirectoryResult = useSelector((state) => {
		return state?.project?.[MOVE_PLAN_DIRECTORY] || [];
	}, shallowEqual);
	useEffect(() => {
		if (changeDirectoryResult?.success && show) {
			handleCloseChangeDirectories();
			dispatch(getAllFileDirectoriesWise(project_id));
		}
	}, [changeDirectoryResult, dispatch]);
	useEffect(() => {
		if (changeDirectoryResult?.success === true) {
			handleClose();
			setInfoFile({
				...infoFile,
				user_id: userId,
				project_id: project_id,
				file_id: props?.file_id,
				file_directory_id: '',
			});
		}
	}, [changeDirectoryResult?.success, dispatch]);

	const { move_file, move_to, move,move_files } = getSiteLanguageData('files');

	return (
		<>
			{!props?.className ? (
				<span
					data-toggle="tooltip"
					className="theme-btnbg theme-secondary rounded lf-link-cursor p-1"
					tooltip={move_file.tooltip}
					flow={move_file.tooltip_flow}
					onClick={() => handleShowFileDirectory()}>
					<i className="fas fa-arrows-alt lf-sheet-icon m-1"></i>
				</span>
			) : (
				<Dropdown.Item
					onClick={() => handleShowFileDirectory()}
					className={props?.className}>
					<i className="fas fa-arrows-alt px-2" />
					{move_files.text}
				</Dropdown.Item>
			)}
			<Modal
				className="lf-modal"
				size="sm"
				show={showMoveDirectories}
				onHide={handleCloseChangeDirectories}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{move_to?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body className="px-3">
					<Form>
						<div className="row">
							{data?.map((r) => {
								return (
									<div className="col-sm-12" key={r._id}>
										{/* <i className="fa-regular fa-folder me-2"></i> */}
										<span>
											<label className="fs-5 radio-orange text-break text-dark mb-1">
												{r?.name}
												<input
													type="radio"
													name="file_directory_id"
													onChange={(e) => handleChange(e)}
													value={r._id}
												/>
												<span className="radiokmark"></span>
											</label>
										</span>
									</div>
								);
							})}
						</div>
					</Form>
				</Modal.Body>
				<Modal.Footer className="justify-content-center">
					<Button
						onClick={() => MoveDirectory()}
						className="btn btn-primary theme-btn btn-block my-1 show-verify text-center">
						<i className="fa fa-check me-2"></i>
						{move?.text}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default MoveDirectory;
