import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Layout from '../../components/layout';
import { GET_ALL_PHOTOS } from '../../store/actions/actionType';
import {
	deletePhoto,
	getAllFilterPhotos,
	getAllPhotos,
	sharePhotos,
	attachTagsInPhotos,
} from '../../store/actions/projects';
import Nodata from '../../components/nodata';
import AddPhoto from './addPhoto';
import EditPhoto from './editPhoto';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import {
	setLightBoxImageData,
	setLightBoxImageDefaultUrl,
	toggleLightBoxView,
} from '../../store/actions/imageLightBox';
import { Button, Dropdown, FormCheck, Modal } from 'react-bootstrap';
import { useState } from 'react';
import CustomSearch from '../../components/CustomSearch';
import UploadProjectPhoto from './uploadProjectPhoto';
import ShareFile from '../../components/shareFile';
import moment from 'moment';
import Filter from './Filter';
import CustomSelect from '../../components/SelectBox';
import { GET_ALL_TAGS } from '../../store/actions/actionType';
import { createTag, getAllTags } from '../../store/actions/projects';
import {
	errorNotification,
	successNotification,
} from '../../commons/notification';

function Photos() {
	const userId = getUserId();
	const { project_id } = useParams();

	const [multiSelect, handleMultiSelect] = useState([]);
	const [showShareModel, setShowShareModel] = useState(false);
	const [shareLink, setShareLink] = useState('');
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [attachTagsModel, setAttachTagsModel] = useState(false);

	const [attachTags, setAttachTags] = useState([]);

	const data = useSelector((state) => {
		return state?.project?.[GET_ALL_PHOTOS]?.result || [];
	});
	const lightBoxView = useSelector((state) => {
		return state?.image_lightbox?.LIGHTBOX_VIEW_STATUS || [];
	});

	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getAllPhotos(project_id));
	}, [project_id, dispatch]);

	const [filterData, handleFilterData] = useState({
		uploadedBy: undefined,
		start_date: undefined,
		end_date: undefined,
		tags: undefined,
	});
	const tags = useSelector((state) => {
		return state?.project?.[GET_ALL_TAGS]?.result || [];
	});
	const getTaskData = (fd = filterData) => {
		dispatch(getAllFilterPhotos({ project_id, user_id: userId, ...fd }));
	};

	const handleAttachTags = () => {
		if (!attachTagsModel) setAttachTags([]);
		setAttachTagsModel(!attachTagsModel);
	};

	const handleImageViewer = (url) => {
		const images = [];
		data?.forEach((r) => {
			r?.itemsSold?.forEach((d) => {
				images.push({
					url: d.file,
					imageCaption: `Upload By : ${d.upload_by.first_name} ${
						d.upload_by.last_name
					} | Upload At - ${moment(d.createdAt).format('YYYY-MM-DD hh:mm:ss')}`,
					imageTitle: `${d.title} ${d.description ? `- ` + d.description : ''}`,
					uploadAt: d.createdAt,
					uploadBy: `${d.upload_by.first_name} ${d.upload_by.last_name}`,
				});
			});
		});
		dispatch(setLightBoxImageData(images));
		dispatch(setLightBoxImageDefaultUrl(url));
		if (lightBoxView != true) {
			dispatch(toggleLightBoxView(true));
		}
	};
	const [sortType, handleSortType] = useState('3');
	const sortingList = [
		`Z ${String.fromCharCode(60)} A`,
		` A ${String.fromCharCode(60)} Z`,
		` New ${String.fromCharCode(60)} Old`,
		` Old ${String.fromCharCode(60)} New`,
	];

	let searchDataSource = [];
	data?.forEach((slist) => {
		searchDataSource = searchDataSource.concat(slist?.itemsSold);
	});
	const { icon_delete } = getSiteLanguageData('photos');
	const { sort_by } = getSiteLanguageData('commons');
	const hendleShowShereModel = () => {
		setShowShareModel(!showShareModel);
	};
	const handleSharableLink = (data) => {
		setShareLink(data);
		if (data) {
			hendleShowShereModel();
		}
	};

	const manageTaskFilter = (name, value) => {
		handleFilterData({
			...filterData,
			[name]: value !== 'unset' ? value : undefined,
		});
		getTaskData({
			...filterData,
			[name]: value !== 'unset' ? value : undefined,
		});
	};

	const clearTaskFilter = () => {
		handleFilterData({
			uploadedBy: undefined,
			start_date: undefined,
			end_date: undefined,
			tags: undefined,
		});
		getTaskData({
			uploadedBy: undefined,
			start_date: undefined,
			end_date: undefined,
			tags: undefined,
		});
	};

	const selectedFiterCount = Object.keys(filterData).filter(
		(x) =>
			((filterData[x] && filterData[x].length > 0) || filterData[x] === true) &&
			x !== 'filter_type',
	).length;

	const { btn_filter } = getSiteLanguageData('task/update');
	const { tags_n, update_tags } = getSiteLanguageData('components/tags');
	const { failed_to_update_tags_photo } = getSiteLanguageData('photos');

	const handleTagsSubmit = () => {
		console.log(multiSelect, 'multiSelect', attachTags, 'attachTags');
		dispatch(
			attachTagsInPhotos(
				{
					project_id,
					photo_id: multiSelect,
					tags_id: attachTags,
				},
				(resData) => {
					console.log(resData, 'resData');
					if (resData.success) {
						successNotification(`${tags_n} has been updated successfully`);
					} else {
						errorNotification(failed_to_update_tags_photo.text);
					}
					handleMultiSelect([]);
					dispatch(
						getAllFilterPhotos({ project_id, user_id: userId, ...filterData }),
					);
					handleAttachTags();
				},
			),
		);
	};
	return (
		<Layout>
			{data?.length === 0 ? (
				<Nodata type="Project Photo">
					{/* <AddPhoto className="lf-main-button text-center mt-2" /> */}
					<UploadProjectPhoto className="lf-main-button lf-link-cursor text-center mt-2" />
				</Nodata>
			) : (
				<div id="page-content-wrapper">
					<section className="lf-dashboard-toolbar">
						<div className="row align-items-center">
							<div className="col-12">
								<div className="d-flex align-items-center">
									<div className="float-start d-none d-md-inline-block">
									<CustomSearch
										suggestion={true}
										dataSource={{
											photo: searchDataSource,
										}}/>
									</div>
									<div className="float-start d-none d-lg-inline-block">
										<Dropdown className="lf-responsive-common">
											<span tooltip={sort_by.tooltip} flow={sort_by.tooltip_flow}>
												<Dropdown.Toggle
													variant="transparent"
													id="dropdown-basic"
													className="lf-common-btn">
													{sortingList[parseInt(sortType) - 1]}
												</Dropdown.Toggle>
											</span>
											<Dropdown.Menu
												style={{ backgroundColor: '#73a47' }}
												className="shadow p-2 mb-2 bg-white rounded-7 lf-dropdown-center lf-dropdown-animation dropdown-menu ">
												{sortingList.map((st, k) => {
													return (
														<Dropdown.Item
															key={k}
															className="lf-layout-profile-menu"
															onClick={() => handleSortType((k + 1).toString())}>
															{st}
														</Dropdown.Item>
													);
												})}
											</Dropdown.Menu>
										</Dropdown>
									</div>
									<div className="float-start d-none d-lg-inline-block">
										<div
											className={
												selectedFiterCount > 0
													? `lf-common-btn px-0 px-md-2 text-nowrap selected-filter`
													: `lf-common-btn text-nowrap px-0`
											}
											onClick={() => setOpen(!open)}
											tooltip={`Filter Photos`}
											flow={btn_filter.tooltip_flow}>
											<i className="fas fa-filter lf-all-icon-size"></i>
											<span className="d-none d-md-inline ">
												{' '}
												{btn_filter?.text}{' '}
												{selectedFiterCount > 0 ? `(${selectedFiterCount})` : ''}
											</span>
										</div>
									</div>
									<div className="ms-auto float-end d-inline-block d-flex align-items-center">

										<div className="float-start d-inline-block">
											<span className="lf-module-toolbar-btn-center">
												<UploadProjectPhoto isLoading={isLoading} setIsLoading={setIsLoading}/>
											</span>
										</div>

										<div className="float-start d-inline-block">
											<Dropdown>
												<Dropdown.Toggle
													disabled={multiSelect.length === 0}
													variant="transparent"
													className="lf-module-toolbar-btn-center lf-common-btn  mt-1 float-end">
													<span>Action</span>
												</Dropdown.Toggle>
												<Dropdown.Menu className="shadow p-2 mb-2 bg-white rounded-7 dropdown-menu  dropdown-menu lf-dropdown-center lf-dropdown-animation">
													<Dropdown.Item
														className="lf-layout-profile-menu "
														onClick={() =>
															sweetAlert(
																() =>
																	dispatch(
																		deletePhoto({
																			user_id: userId,
																			photo_id: multiSelect,
																		}),
																	),
																"Project Photo's",
																'Delete',
																handleMultiSelect,
															)
														}>
														{' '}
														<i className="fas fa-trash-alt px-2"></i>
														{icon_delete?.text}
													</Dropdown.Item>
													<Dropdown.Item
														className="lf-layout-profile-menu "
														onClick={() =>
															sweetAlert(
																() =>
																	dispatch(
																		sharePhotos(
																			{
																				user_id: userId,
																				photo_id: multiSelect,
																				project_id: project_id,
																			},
																			handleSharableLink,
																		),
																	),
																"Project Photo's",
																'Shate',
																handleMultiSelect,
															)
														}>
														{' '}
														<i className="fas fa-share-alt px-2"></i>
														{'Share'}
													</Dropdown.Item>
													<Dropdown.Item
														className="lf-layout-profile-menu "
														onClick={() => handleAttachTags()}>
														{' '}
														<i className="fas fa-tags px-2"></i>
														{'Add Tags'}
													</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>
										</div>
									<div>

									</div>
									</div>
								</div>
							</div>
						</div>
					</section>

					<div className="container-fluid mt-4">
						<div className="row">
							{data?.map((r, k) => {
								return (
									<div key={k} className="col-sm-12">
										<div className={`row`}>
											<div className="col-sm-12">
												<FormCheck
													className={`d-inline-block align-middle  ${
														r?.plans?.length === 0 ? 'invisible' : 'visible'
													}`}
													style={{
														margin: 0,
													}}
													type="checkbox"
													name="plan_id"
													onChange={({ target: { checked } }) => {
														let newArr = [...multiSelect];
														r?.itemsSold?.forEach((p) => {
															if (checked === true) {
																newArr.push(p._id);
															} else {
																newArr = newArr.filter((d) => d !== p._id);
															}
														});
														handleMultiSelect(newArr);
													}}
													checked={r?.itemsSold?.every((d) =>
														multiSelect.includes(d._id),
													)}
												/>
												<span className="text-capitalize fw-bold align-middle sheet-dir-title ls-md ms-4 ">
													<i className="fa-regular fa-folder me-2 my-1"></i>
													{r?._id?.date}{' '}
												</span>
											</div>
										</div>
										<div className="row" style={{ marginLeft: '22px' }}>
											{r?.itemsSold
												?.sort((a, b) => {
													if (sortType === '1') {
														return a?.title.localeCompare(b?.title);
													}
													if (sortType === '2') {
														return b?.title.localeCompare(a?.title);
													}
													if (sortType === '3') {
														return (
															new Date(b.createdAt) - new Date(a.createdAt)
														);
													}
													if (sortType === '4') {
														return (
															new Date(a.createdAt) - new Date(b.createdAt)
														);
													}
													return true;
												})
												.map((r, k) => {
													return (
														<div
															key={k}
															className={`col-xl-2 col-lg-3 col-md-4 mt-3`}>
															<div className="sheet-grid-box position-relative">
																<div className="row">
																	<div className="col-12 position-relative">
																		<FormCheck
																			type="checkbox"
																			onChange={({ target: { checked } }) => {
																				let newArr = [...multiSelect];
																				if (checked === true) {
																					newArr.push(r._id);
																				} else {
																					newArr = newArr.filter(
																						(d) => d !== r._id,
																					);
																				}
																				handleMultiSelect(newArr);
																			}}
																			checked={multiSelect.includes(r._id)}
																			value={r._id}
																			className={`position-absolute mx-2 my-1 ${
																				multiSelect.length > 0 ? 'visible' : ''
																			}`}
																		/>
																		<div className="lf-photo-grid-photoimg">
																			<img
																				title={'Show Image'}
																				onClick={() =>
																					handleImageViewer({
																						url: r.file,
																						imageCaption: r.description,
																						imageTitle: r.title,
																						uploadAt: r.createdAt,
																						uploadBy: `${r.upload_by.first_name} ${r.upload_by.last_name}`,
																					})
																				}
																				alt="livefield"
																				src={
																					r.thumbnail ||
																					r.file ||
																					'/images/sheets/noImage.png'
																				}
																				className="image-full float-end lf-photo-gridimg lf-link-cursor"
																			/>
																		</div>
																		<div className="sheet-grid-box-actions-plan me-1">
																			<EditPhoto data={r} />
																			<br />
																			<span
																				tooltip={icon_delete.tooltip}
																				flow={icon_delete.tooltip_flow}>
																				<i
																					className="fas fa-trash-alt mt-2"
																					onClick={() =>
																						sweetAlert(
																							() =>
																								dispatch(
																									deletePhoto({
																										user_id: userId,
																										photo_id: [r?._id],
																									}),
																								),
																							'Project Photo',
																						)
																					}></i>
																			</span>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													);
												})}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			)}
			<ShareFile
				open={showShareModel}
				shareLink={shareLink}
				handleClose={hendleShowShereModel}
			/>
			<div
				className="position-fixed end-0 mt-md-0 mt-1 mx-2 mx-md-0"
				style={{ zIndex: '5' }}>
				<Filter
					manageTaskFilter={manageTaskFilter}
					clearTaskFilter={clearTaskFilter}
					filterData={filterData}
					setOpen={setOpen}
					open={open}
				/>
			</div>

			<Modal
				style={{ width: '100%' }}
				show={attachTagsModel}
				centered
				onHide={handleAttachTags}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{update_tags.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body id={`import-model-body`}>
					<div className="row">
						<div className="col-12">
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
													console.log(newTag, 'newTag newTag');
													if (newTag?.result?._id) {
														setAttachTags(...attachTags, newTag?.result?._id);
													}
												},
											),
										);
									});
									if (fireHandleChange) {
										setAttachTags(e?.map((t) => t.value));
									}
								}}
								value={attachTags?.map((t) => {
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
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button
						className="lf-main-btn text-white"
						disabled={attachTags.length === 0}
						onClick={handleTagsSubmit}>
						{update_tags.text}
					</Button>
				</Modal.Footer>
			</Modal>
		</Layout>
	);
}

export default Photos;
