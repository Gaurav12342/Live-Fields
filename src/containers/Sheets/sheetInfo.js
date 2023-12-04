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
import update from 'immutability-helper';
import TextareaAutosize from 'react-textarea-autosize';

function SheetDetailsInfo(props) {
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
	const { icon_info } = getSiteLanguageData('sheet/toolbar');
	useEffect(() => {
		if (tags?.length <= 0) {
			dispatch(getAllTags(project_id));
		}
	}, [tags?.length]);
	const moveCard = useCallback((dragIndex, hoverIndex) => {
		const prevCards = update(planR, {
			$splice: [
				[dragIndex, 1],
				[hoverIndex, 0, planR[dragIndex]],
			],
		});
		setPlanR(prevCards);
		const post = {
			user_id: userId,
			plan_id: plan_id,
			project_id: project_id,
			sort: prevCards?.map((p, k) => {
				return { revision_id: p?._id, index: k };
			}),
		};
		dispatch(palnRevisionIndexUpdate(post));
	}, []);
	const { sheet_no: sheet_no_lng, tage } = getSiteLanguageData('sheet');
	const { description } = getSiteLanguageData('commons');
	const { plan_setting, version, save } =
		getSiteLanguageData('sheet/sheetinfo');

	return (
		<>
			{props?.type === 'list' ? (
				<span
					className="p-2 fa-sm lf-link-cursor rounded theme-btnbg text-secondary"
					data-bs-target="#staticBackdrop"
					tooltip={icon_info.tooltip}
					flow={
						props?.view === 'list'
							? icon_info.tooltip_down
							: icon_info.tooltip_flow
					}
					onClick={() => handleShow()}>
					<i className="fa-solid fa-info ms-1"></i>
				</span>
			) : (
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
					{props.className ? (
						<>
							<i className="fa-solid fa-circle-info mx-1" /> Info
						</>
					) : (
						<>
							{' '}
							<i className="fa-solid fa-info ms-1" />
						</>
					)}
				</span>
			)}
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
						<div className="row">
							<div className="col-sm-12">
								<Form.Label className="mb-0">{sheet_no_lng?.text}</Form.Label>
								<InputGroup>
									<FormControl
										className="lf-formcontrol-height"
										type="text"
										name="sheet_no"
										autoComplete="off"
										onChange={(e) => handleChange('sheet_no', e.target.value)}
										placeholder={'Sheet No'}
										value={info?.sheet_no}
										required
									/>
								</InputGroup>
								<Form.Label className="mb-0 mt-1">
									{description?.text}
								</Form.Label>
								<InputGroup>
									{/* <FormControl
										className="lf-formcontrol-height"
										type="text"
										name="description"
										autoComplete="off"
										onChange={(e) =>
											handleChange('description', e.target.value)
										}
										placeholder={'description'}
										value={info?.description}
										required
									/> */}
									<TextareaAutosize
										style={{ width: '100%' }}
										type="text"
										as={`textarea`}
										required
										minRows={2}
										maxRows={3}
										name="description"
										autoComplete="off"
										onChange={(e) =>
											handleChange('description', e.target.value)
										}
										value={info?.description}
									>										
									</TextareaAutosize>
								</InputGroup>
							</div>
							<div className="col-12">
								<Form.Label className="mb-0 mt-1">{tage?.text}</Form.Label>
								<CustomSelect
									isClearable={false}
									isMulti
									type="Creatable"
									className="mb-1"
									placeholder="Tag..."
									name="tags"
									onChange={(e) => {
										let fireHandleChange = true;
										e.filter((val) => val.__isNew__).forEach((val) => {
											fireHandleChange = false;
											dispatch(
												createTag(
													{
														user_id: userId,
														project_id: project_id,
														name: val.value,
													},
													(newTag) => {
														if (newTag?.result?._id) {
															handleChange('tags', [
																...info.tags,
																newTag?.result?._id,
															]);
														}
													},
												),
											);
										});
										if (fireHandleChange) {
											handleChange(
												'tags',
												e?.map((t) => t.value),
											);
										}
									}}
									value={info?.tags?.map((t) => {
										const tag = tags?.filter((tt) => tt._id === t)[0];
										return {
											value: tag?._id,
											label: tag?.name,
										};
									})}
									options={tags.map((tag) => {
										return {
											value: tag?._id,
											label: tag?.name,
										};
									})}
									closeMenuOnSelect={false}
								/>
							</div>
							{/* {props?.type === 'single' ? (
								<Form.Label className="mb-0">{version?.text}</Form.Label>
							) : (
								''
							)}
							<span>
								{planR?.map((card, k) => {
									return (
										<Card
											k={k}
											lr={planR?.length}
											index={card?.index}
											id={card?._id}
											text={card}
											moveCard={moveCard}
											setShow={setShow}
										/>
									);
								})}
							</span> */}
							{/* <table>
                <tbody className="ms-1">
                  {
                    planRevision?.map((r) => {
                      return <tr className="mx-1 row">
                        <td className="col-9">
                          {r.revision_no}
                        </td>
                        <td className="col-3">
                          {
                            planRevision.length !== 1 ?
                              <span className="float-end ms-3 ">
                                <img alt="livefield" src="/images/delete-orange.svg" width="15px"
                                  onClick={() => {
                                    const isConfirmDelete = window.confirm(`are you sure to Delete Revision`)
                                    if (isConfirmDelete) {
                                      dispatch(
                                        deleteRevision({
                                          user_id: userId,
                                          project_id: project_id,
                                          plan_id: plan_id,
                                          revision_id: r._id
                                        })
                                      )
                                    }
                                  }
                                  }
                                />
                              </span>
                              :
                              ""
                          }
                          <span className=" float-end" >
                            <img alt="livefield" src="/images/edit-orange.svg" width="15px" />
                          </span>
                        </td>
                      </tr>
                    })
                  }
                </tbody>
              </table> */}
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

export default SheetDetailsInfo;
