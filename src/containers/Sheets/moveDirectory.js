import { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Modal, Form, Button, Dropdown, ModalBody } from 'react-bootstrap';
import {
	getAllSheets,
	MovePlanDirectories,
} from '../../store/actions/projects';
import getUserId, { getSiteLanguageData } from '../../commons';
import {
	GET_ALL_SHEETS,
	MOVE_PLAN_DIRECTORY,
} from '../../store/actions/actionType';

function MoveDirectory(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const [showMoveDirectories, setshowMoveDirectory] = useState(false);
	const handleCloseMoveDirectories = () => setshowMoveDirectory(false);
	const [infoPlan, setInfoPlan] = useState({
		user_id: userId,
		project_id: project_id,
		plan_id: props?.plan_id,
		plan_directory_id: '',
	});
	const data = useSelector((state) => {
		return state?.project?.[GET_ALL_SHEETS]?.result || [];
	});
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setInfoPlan({
			...infoPlan,
			[name]: value,
		});
	};

	const MoveDirectory = useCallback(
		(e) => {
			handleCloseMoveDirectories();
			const post = {
				user_id: userId,
				project_id: project_id,
				plan_id: props.plan || [props?.plan_id],
				plan_directory_id: infoPlan?.plan_directory_id,
			};
			dispatch(MovePlanDirectories(post));
			if (props?.handleMultiSelect) {
				props?.handleMultiSelect([]);
			}
		},
		[infoPlan],
	);
	const handleShowPlanDirectory = (p) => {
		setInfoPlan({
			...infoPlan,
		});
		setshowMoveDirectory(true);
	};
	const moveDirectoryResult = useSelector((state) => {
		return state?.project?.[MOVE_PLAN_DIRECTORY] || [];
	}, shallowEqual);
	useEffect(() => {
		if (moveDirectoryResult?.success && show) {
			handleCloseMoveDirectories();
			dispatch(getAllSheets(project_id));
		}
	}, [moveDirectoryResult, dispatch]);
	useEffect(() => {
		if (moveDirectoryResult?.success === true) {
			handleClose();
			setInfoPlan({
				...infoPlan,
				user_id: userId,
				project_id: project_id,
				plan_id: [props?.plan_id],
				plan_directory_id: '',
			});
		}
	}, [moveDirectoryResult?.success, dispatch]);

	const { sheet_move, icon_move } = getSiteLanguageData('sheet/toolbar');
	const { move_To, move_plans } = getSiteLanguageData('sheet');

	return (
		<>
			{!props?.className ? (
				<span
					tooltip={sheet_move.tooltip}
					flow={
						props?.view === 'list'
							? sheet_move.tooltip_down
							: sheet_move.tooltip_flow
					}
					onClick={() => handleShowPlanDirectory()}>
					<i className={'fas fa-arrows-alt  lf-text-vertical-align'}></i>
				</span>
			) : (
				<Dropdown.Item
					onClick={() => handleShowPlanDirectory()}
					className={props?.className}>
					{' '}
					<i className={'fas fa-arrows-alt p-2'}></i>
					{move_plans?.text}
				</Dropdown.Item>
			)}

			<Modal
				className="lf-modal"
				size="sm"
				show={showMoveDirectories}
				onHide={handleCloseMoveDirectories}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{move_To?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body className="px-3">
					<Form>
						<div className="row">
							{data?.map((r) => {
								return (
									<div className="col-sm-12" key={r._id}>
										<span>
											<label className="fs-5 radio-orange text-break text-dark mb-1">
												{r?.name}
												<input
													type="radio"
													name="plan_directory_id"
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
						{icon_move?.text}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default MoveDirectory;
