import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import getUserId, { getSiteLanguageData } from '../../commons';
import { GET_ALL_TAGS } from '../../store/actions/actionType';
import {
	deleteRevision,
	palnRevisionIndexUpdate,
	updateSheetPlan,
} from '../../store/actions/sheetPlan';
import { createTag, getAllTags } from '../../store/actions/projects';
import CustomSelect from '../../components/SelectBox';
// import { Card } from './Card';
import { MoveSheet } from './MoveSheet';
import update from 'immutability-helper';
import TextareaAutosize from 'react-textarea-autosize';
import sheetDetails from './sheetDetails';

function RevisionSort(props) {
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const userId = getUserId();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const planRevision = props?.planData?.revisions;
	const plan_id = props?.planData?._id;
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		plan_id: plan_id,
		directory_id: props?.planData?.directory_id,
		name: props?.planData?.name,
		sheet_no: props?.planData?.sheet_no,
		description: props?.planData?.description,
		tags: props?.planData?.tags,
	});
	const [planR, setPlanR] = useState(
		planRevision?.sort((a, b) => a.index - b.index),
	);
	const handleChange = (name, value) => {
		setInfo({
			...info,
			[name]: value,
		});
	};
	const updatePlan = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(updateSheetPlan(info, props?.type === 'single' ? true : false));
	};
	const tags = useSelector((state) => {
		return state?.project?.[GET_ALL_TAGS]?.result || [];
	});

	const sheetdetails = useSelector((state)=>state?.project?.["GET_SHEET_DETAILS_BY_ID"]?.result);


	useEffect(()=>{
		if(sheetDetails.revisions){
			setPlanR(sheetDetails?.revisions?.sort((a, b) => a.index - b.index))
		}
	},[sheetdetails])

	
	const { icon_info } = getSiteLanguageData('sheet/toolbar');
	useEffect(() => {
		if (tags?.length <= 0) {
			dispatch(getAllTags(project_id));
		}
	}, [tags?.length]);
	const moveCard = useCallback((ddr) => {
		/* const prevCards = update(planR, {
			$splice: [
				[dragIndex, 1],
				[hoverIndex, 0, planR[dragIndex]],
			],
		}); */
		ddr = ddr.sort((a, b) => a.index - b.index);
		setPlanR(ddr);
		const post = {
			user_id: userId,
			plan_id: plan_id,
			project_id: project_id,
			sort: ddr?.map((p, k) => {
				return { revision_id: p?._id, index: k };
			}),
		};
		dispatch(palnRevisionIndexUpdate(post));
	}, []);
	const { sheet_no: sheet_no_lng, tage,revisons } = getSiteLanguageData('sheet');
	const { description } = getSiteLanguageData('commons');
	const { plan_setting, version, save } =
		getSiteLanguageData('sheet/sheetinfo');

	return (
		<>
			<span
                className={props.className || 'lf-link-cursor'}
                data-bs-target="#staticBackdrop"
                tooltip={icon_info.tooltip}
                flow={
                    props?.view === 'list'
                        ? icon_info.tooltip_down
                        : icon_info.tooltip_flow
                }
                onClick={() => handleShow()}>
                <i className="fa-solid fa-circle-info mx-1" /> {revisons.text}
            </span>
			<Modal
				className="lf-modal"
				size="sm"
				show={show}
				data-keyboard={false}
				// backdrop={false}
				closeOnEscape={false}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title className="mb-0 fs-4">{plan_setting?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						
							
							
								{planR?.map((card, k) => {
									return (
										<div className="row align-items-center lf-Sheet-detail-hover py-1 rounded-2">
										<MoveSheet
											k={k}
											lr={planR?.length}
											planR={planR}
											index={card?.index}
											id={card?._id}
											text={card}
											moveCard={moveCard}
											setShow={setShow}
										/>
										</div>
									);
								})}

							
							{/* <div className='col-12'>

								{planR?.map((card, k) => {
									return (
										<div className='d-flex'>
											<div className='lfwpr-20'>
												<span className='p-1'><i class="fa-solid fa-arrow-up"></i></span>
												<span className='p-1'><i class="fa-solid fa-arrow-down"></i></span>
											</div>
											<div className='lfwpr-60'>
												{
													card
												}
											</div>
										</div>
									);
								})}

							</div> */}
							<div className="row align-items-center">
							<div className="col-12">
								<span
									className="btn mt-2 theme-btn float-end"
									onClick={updatePlan}>
									<i class="fa-solid fa-floppy-disk pe-2"></i>
									{save?.text}
								</span>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default RevisionSort;
