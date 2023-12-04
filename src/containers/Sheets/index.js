import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Layout from '../../components/layout';
import {
	GET_ALL_SHEETS,
	GET_ALL_TAGS,
	GET_RECENT_SHEETS,
} from '../../store/actions/actionType';
import {
	deletePlan,
	getAllSheets,
	getAllTags,
	getRecentSheets,
	attachTagsInPlan,
	createTag
} from '../../store/actions/projects';
import getUserId, { getSiteLanguageData } from '../../commons';
import SheetDirectory from './createDirectory';
import MoveDirectory from './moveDirectory';
import SheetsFilter from './sheetsfilter';
import Loading from '../../components/loadig';
import SheetToolBar from './Components/ToolBar';
import Nodata from '../../components/nodata';
import ShareFile from '../../components/shareFile'
import SheetList from './list';
import SheetGrid from './grid';
import { getParameterByName } from '../../helper';
import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CustomSelect from '../../components/SelectBox';
import {
	errorNotification,
	successNotification,
} from '../../commons/notification';

function Sheets() {
	// declaration
	const dispatch = useDispatch();
	const { project_id } = useParams();
	const userId = getUserId();
	// state
	const view = getParameterByName('v') || 'grid';
	const [collapsibleData, manageCollapsibleData] = useState({});
	const [multiSelect, handleMultiSelect] = useState([]);
	const [multiFileSelect, handleFileMultiSelect] = useState([]);
	const [showShareModel, setShowShareModel] = useState(false);
	const [shareLink, setShareLink] = useState('');
	const [sortType, handleSortType] = useState('3');
	const [history, handleHistory] = useState(false);
	const [dirSelect, setDirSelect] = useState([]);
	const [attachTagsModel, setAttachTagsModel] = useState(false);
	const [attachTags, setAttachTags] = useState([]);
		const sortingList = [
		`A ${String.fromCharCode(60)} Z`,
		` Z ${String.fromCharCode(60)} A`,
		` New ${String.fromCharCode(60)} Old`,
		` Old ${String.fromCharCode(60)} New`,
	];
	// redux props
	const data = useSelector((state) => {
		return state?.project?.[GET_ALL_SHEETS]?.result;
	});

	const loadig_data = useSelector(({ui_red})=> ui_red?.loading_data );
	
	// methods
	const recentPlan = useSelector((state) => {
		return state?.project?.[GET_RECENT_SHEETS]?.result || [];
	});
	useEffect(() => {
		
			dispatch(getRecentSheets(project_id, userId));
		
	}, [dispatch, project_id, userId]);
	const deletePlans = (e) => {
		// e.preventDefault();
		const post = {
			user_id: userId,
			project_id: project_id,
			plan_id: multiSelect,
		};
		dispatch(deletePlan(post));
		handleMultiSelect([]);
	};
	
	// life cycle
	useEffect(() => {
		if (!data) {
			dispatch(getAllSheets(project_id));
		}
	}, []);
	const allTags = useSelector((state) => {
		return state?.project?.[GET_ALL_TAGS]?.result || [];
	});
	useEffect(() => {
		
		dispatch(getAllTags(project_id));
		
	}, []);

	const handleHistoryPopup = () => {
		handleHistory(!history)
	}
	const [tagsFilter, setTagsFilter] = useState([]);
	let filteredData = data;
	if (!data) {
		return (
			<Layout>
				<Loading />
			</Layout>
		);
	} else if (data?.length > 0 && tagsFilter?.length > 0) {
		filteredData = [];
		data.forEach((d) => {
			const plans = [];
			if (d?.plans?.length > 0) {
				d?.plans?.forEach((p) => {
					if (p?.tags?.some((t) => tagsFilter.includes(t))) {
						plans.push(p);
					}
				});
			}
			if (plans.length > 0) {
				filteredData.push({
					...d,
					plans,
				});
			}
		});
	}
	const { recent_sheets } = getSiteLanguageData('sheet');
	const { update_tags } = getSiteLanguageData('sheet');

	const handleDirSelect = (id) => {
		if(dirSelect.includes(id)){
			let ids = dirSelect.filter((p)=>p != id);
			setDirSelect(ids)
		}else{
			let ids = dirSelect;
			ids.push(id);
			setDirSelect(ids);
		}
	}
	const hendleShowShereModel = () => {
		setShowShareModel(!showShareModel);
		setShareLink("")
	};
	const handleSharableLink = (data) => {
		setShareLink(data);
	}

	const handleAttachTags = () => {
		if(!attachTagsModel) setAttachTags([]);
		setAttachTagsModel(!attachTagsModel);

	}

	const handleTagsSubmit = () => {
		dispatch(attachTagsInPlan({
			project_id,
			plan_id: multiSelect,
			tags_id: attachTags
		},(resData)=>{
			if(resData.success){
				successNotification("Tags has been added succuessfully");
			}else{
				errorNotification("Failed to add tags");
			}
			handleMultiSelect([]);
			dispatch(getAllSheets(project_id));
			handleAttachTags()
		}))
	}
	
	return (
		<Layout>
			{
				loadig_data && loadig_data === true ? (
					<Loading />
				) : (
					data?.length === 0 ? (
						<Nodata type="Plans">
							<SheetDirectory />
						</Nodata>
					) : (
						<div id="page-content-wrapper">
							<SheetToolBar
								handleAttachTags={handleAttachTags}
								tagsFilter={tagsFilter}
								setTagsFilter={setTagsFilter}
								handleHistory={handleHistory}
								history={history}
								view={view}
								project_id={project_id}
								recentPlan={recentPlan}
								SheetsFilter={SheetsFilter}
								SheetDirectory={SheetDirectory}
								multiSelect={multiSelect}
								deletePlans={deletePlans}
								MoveDirectory={MoveDirectory}
								data={data}
								projectId={project_id}
								allTags={allTags}
								sortType={sortType}
								sortingList={sortingList}
								handleSortType={handleSortType}
								handleMultiSelect={handleMultiSelect}
								multiFileSelect={multiFileSelect}
								handleFileMultiSelect={handleFileMultiSelect}
								handleDirSelect={handleDirSelect}
								dirSelect={dirSelect}
								handleSharableLink={handleSharableLink}
								hendleShowShereModel={hendleShowShereModel}
							/>
							{history === true && false ? (
								<div className={`row py-3 main-area`}>
									<strong className="pb-2">{recent_sheets?.text}</strong>
									{recentPlan?.map((r, k) => {
										return (
											<div className="col-xl-2 col-lg-3 col-md-4" key={k}>
												<div className="sheet-grid-box position-relative">
													<a
														href={`/sheets/${project_id}/sheetInfo/${r?.plans[0]?._id}`}>
														<div className="row">
															<div className="col-12 position-relative">
																{/* <h6 className='theme-btn position-absolute mx-3 my-1'>{r?.plans[0]?.revision_no}</h6> */}
																<div
																	className="lf-sheets-grid-sheetimg sheet-grid-bg"
																	style={{
																		background: `url(${
																			r?.plans[0]?.thumbnail
																				? r?.plans[0]?.thumbnail
																				: '/images/sheets/sheets_demo.png'
																		})`,
																		backgroundRepeat: 'no-repeat',
																	}}>
																	{/* <img
																		alt="livefield"
																		src={r?.plans[0]?.file}
																		className="image-full float-end lf-sheet-gridimg"
																	/> */}
																</div>
																<div className="text-black sheet-grid-box-footer pt-0 lf-h-50">
																	<div
																		title={r?.plans[0]?.sheet_no}
																		className="text-black fw-bold overflow-hidden text-nowrap text-truncate mt-1">
																		{r?.plans[0]?.sheet_no}
																		<div
																			title={r?.plans[0]?.description}
																			className="fw-normal m-0 overflow-hidden text-nowrap text-truncate">
																			{r?.plans[0]?.description}
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</a>
												</div>
											</div>
										);
									})}
								</div>
							) : (
								''
							)}
							{view === 'grid' ? (
								<SheetGrid
									view={view}
									SheetsFilter={SheetsFilter}
									SheetDirectory={SheetDirectory}
									multiSelect={multiSelect}
									deletePlans={deletePlans}
									MoveDirectory={MoveDirectory}
									data={filteredData}
									project_id={project_id}
									allTags={allTags}
									sortType={sortType}
									sortingList={sortingList}
									handleSortType={handleSortType}
									handleMultiSelect={handleMultiSelect}
									handleFileMultiSelect={handleFileMultiSelect}
									multiFileSelect={multiFileSelect}
									manageCollapsibleData={manageCollapsibleData}
									collapsibleData={collapsibleData}
									handleDirSelect={handleDirSelect}
									dirSelect={dirSelect}
									handleSharableLink={handleSharableLink}
									hendleShowShereModel={hendleShowShereModel}
								/>
							) : (
								<SheetList
									view={view}
									SheetsFilter={SheetsFilter}
									SheetDirectory={SheetDirectory}
									multiSelect={multiSelect}
									deletePlans={deletePlans}
									MoveDirectory={MoveDirectory}
									data={filteredData}
									project_id={project_id}
									allTags={allTags}
									sortType={sortType}
									sortingList={sortingList}
									handleSortType={handleSortType}
									handleMultiSelect={handleMultiSelect}
									handleFileMultiSelect={handleFileMultiSelect}
									multiFileSelect={multiFileSelect}
									manageCollapsibleData={manageCollapsibleData}
									collapsibleData={collapsibleData}
									handleDirSelect={handleDirSelect}
									dirSelect={dirSelect}
									handleSharableLink={handleSharableLink}
									hendleShowShereModel={hendleShowShereModel}
								/>
							)}
						</div>
					)
				)
			}
			


			<Modal show={history} centered onHide={handleHistoryPopup}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{recent_sheets?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body
					id={`location-model-body`}
					style={{
						maxHeight: '70vh',
						overflow: 'auto',
					}}>
					<div className="row">
					{recentPlan?.map((r, k) => {
								return (
									<div className="col-xl-12 col-lg-12 col-md-12 mb-3 " key={k}>
										<Link to={`/sheets/${project_id}/sheetInfo/${r?.plans[0]._id}`}>
											<div className={`d-flex align-items-center`}>
												<div style={{width:'20%'}}>
													<img
														style={{maxWidth:'90%', width:'90%'}}
														alt="livefield"
														src={
															r?.plans[0]?.thumbnail
																? r?.plans[0]?.thumbnail
																: '/images/sheets/sheets_demo.png'}

														className={`border`}
														
													/>
												</div>
												<div style={{width:'80%'}}>
													<p className={`mb-0 fw-bold`}>{r?.plans[0]?.sheet_no}</p>
													<p className={`mb-0`}>{r?.plans[0]?.description}</p>
												</div>
											</div>
										</Link>										
									</div>
										
									
								);
							})}
					</div>
				</Modal.Body>
				
			</Modal>
			<ShareFile open={showShareModel} shareLink={shareLink} handleClose={hendleShowShereModel} />
			<Modal
				style={{ width: '100%',}}
				show={attachTagsModel}
				
				centered
				onHide={handleAttachTags}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{update_tags.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body id={`import-model-body`}>
					<div className='row'>
						<div className='col-12'>
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
													const results = [...attachTags];
													if (newTag?.result?._id) {
														results.push(newTag?.result?._id);
														setAttachTags(results);
													}
												},
											),
										);
									});
									if (fireHandleChange) {
										setAttachTags(e?.map((t) => t.value))
									}
								}}
								value={attachTags?.map((t) => {
									const tag = allTags?.filter((tt) => tt._id === t)[0];
									return {
										value: tag?._id,
										label: tag?.name,
									};
								})}
								options={allTags.map((tag) => {
									return {
										value: tag?._id,
										label: tag?.name,
									};
								})}
								closeMenuOnSelect={false}
							/>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button
						className='lf-main-btn text-white'
						disabled={attachTags.length === 0 }
						onClick={handleTagsSubmit}
					>
						{update_tags.text}
					</Button>
				</Modal.Footer>
			</Modal>
		</Layout>
	);
}
export default Sheets;
