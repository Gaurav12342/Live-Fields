import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Nodata from '../../components/nodata';
import Layout from '../../components/layout';
import {
	GET_ALL_MEETING_LIST,
	GET_ALL_SUBPOINT_LIST,
} from '../../store/actions/actionType';
import {
	getAllMeetingList,
	getAllSubPointsList,
	deleteMeeting,
	deleteMeetingPoint,
} from '../../store/actions/projects';
import { Dropdown, FormCheck } from 'react-bootstrap';
import Loading from '../../components/loadig';
import CreatePoint from './Components/createPoint';
import CreateMeeting from './Components/createMeeting';
import EditMeeting from './Components/updateMeeting';
import EditPoint from './Components/updatePoint';
import MeetingInvitation from './Components/inviteMeeting';
import CustomSearch from '../../components/CustomSearch';
import SubPoint from './Components/subPoint';
import { getSiteLanguageData, sweetAlert } from '../../commons';
function Meeting() {
	const [setShow] = useState(false);
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [sortType, handleSortType] = useState('3');
	const [collapsibleData, manageCollapsibleData] = useState({});
	const handleShow = () => setShow(true);

	const [multiSelect, handleMultiSelect] = useState([]);
	const data = useSelector((state) => {
		return state?.project?.[GET_ALL_MEETING_LIST]?.result || [];
	});
	useEffect(() => {
		if (data?.length <= 0) {
			dispatch(getAllMeetingList(project_id));
		}
	}, [data?.length, dispatch]);

	// const subpoints = useSelector(state => {
	//   return state?.project?.[GET_ALL_SUBPOINT_LIST]?.result || []
	// })
	// const point_id = data?.map(m => {
	//   return m?.meeting_point?.map(u => {
	//     return u._id
	//   }
	//   )
	// })

	// useEffect(() => {
	//   if (subpoints?.length <= 0) {
	//     dispatch(getAllSubPointsList(point_id));
	//   }
	// }, [subpoints?.length, dispatch]);

	if (!data?.length && data?.length !== 0) {
		return <Loading />;
	}

	const sortingList = [
		`A ${String.fromCharCode(60)} Z`,
		` Z ${String.fromCharCode(60)} A`,
		` New ${String.fromCharCode(60)} Old`,
		` Old ${String.fromCharCode(60)} New`,
	];
	let searchDataSource = [];
	data?.forEach((slist) => {
		searchDataSource = searchDataSource.concat(slist?.meeting_point);
	});
	const { btn_point, icon_delete, delete_point, no_point } =
		getSiteLanguageData('meeting');
	const { sort_by } = getSiteLanguageData('commons');
	return (
		<Layout>
			{/* { data?.length == 0 ?
       <Nodata type="Files"/>
       : */}
			{/* <Loading /> */}
			{data?.length === 0 ? (
				<Nodata type="Metting">
					<CreateMeeting className="lf-main-button text-center mt-2" />
				</Nodata>
			) : (
				<div id="page-content-wrapper">
					<section className="lf-dashboard-toolbar">
						<div className="row">
							<div className="col-lg-2 col-md-3 col">
								<CustomSearch
									suggestion={true}
									dataSource={{
										meeting: data,
									}}
								/>
							</div>
							<div className="col-4">
								<Dropdown className="mt-1 lf-responsive-common">
									<span tooltip={sort_by.tooltip} flow={sort_by.tooltip_flow}>
										<Dropdown.Toggle
											variant="transparent"
											id="dropdown-basic"
											className="lf-common-btn">
											<span>{sortingList[parseInt(sortType) - 1]}</span>
										</Dropdown.Toggle>
									</span>
									<Dropdown.Menu
										style={{ backgroundColor: '#73a47' }}
										className="shadow p-2 mb-2 bg-white rounded-7 dropdown-menu lf-dropdown-center lf-dropdown-animation">
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
							<div className="col-md-5 col-lg-6">
								<Dropdown className="d-inline-block  float-end ">
									<Dropdown.Toggle
										disabled={multiSelect.length === 0}
										variant="transparent"
										className="lf-common-btn mt-1 float-end">
										<span>Action</span>
									</Dropdown.Toggle>
									<Dropdown.Menu className="shadow p-2 bg-white rounded-7 dropdown-menu lf-dropdown-center lf-dropdown-animation">
										<Dropdown.Item
											className="lf-layout-profile-menu"
											onClick={() =>
												sweetAlert(
													() =>
														dispatch(
															deleteMeetingPoint({
																project_id: project_id,
																metting_point_id: multiSelect,
															}),
														),
													'Meeting Point',
													'Delete',
													handleMultiSelect,
												)
											}>
											{' '}
											<i className="fas fa-trash-alt px-2"></i>Delete
										</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
								<CreateMeeting />
							</div>
						</div>
					</section>

					<div className="container-fluid mt-3">
						<div className="theme-table-wrapper no-bg">
							<table className="table table-hover theme-table">
								<tbody>
									{data
										?.sort((a, b) => {
											if (sortType === '1') {
												return a?.meeting_name.localeCompare(b?.meeting_name);
											}
											if (sortType === '2') {
												return b?.meeting_name.localeCompare(a?.meeting_name);
											}
											if (sortType === '3') {
												return new Date(b.createdAt) - new Date(a.createdAt);
											}
											if (sortType === '4') {
												return new Date(a.createdAt) - new Date(b.createdAt);
											}
											return true;
										})
										.map((r) => {
											r = {
												...r,
												meeting_point: r?.meeting_point?.filter(
													(c) => c.is_deleted === false,
												),
											};
											return (
												<Fragment key={r._id}>
													<tr
														className={`theme-table-data-row ${
															!collapsibleData?.[r._id] === true
																? 'bg-light'
																: 'bg-transparent'
														}`}>
														<td className="text-center lf-w-30 align-middle">
															<FormCheck
																type="checkbox"
																id="blankCheckbox"
																className={
																	r?.meeting_point?.length === 0
																		? 'invisible'
																		: 'visible'
																}
																onChange={({ target: { checked } }) => {
																	let newArr = [...multiSelect];
																	r?.meeting_point?.forEach((p) => {
																		if (checked === true) {
																			newArr.push(p._id);
																		} else {
																			newArr = newArr.filter(
																				(d) => d !== p._id,
																			);
																		}
																	});
																	handleMultiSelect(newArr);
																}}
																checked={r?.meeting_point?.every((d) =>
																	multiSelect.includes(d._id),
																)}
															/>
														</td>
														<td colSpan={6} className={'ps-2 '}>
															<span
																className="text-dark  lf-link-cursor mt-2 "
																variant="transparent"
																onClick={() =>
																	manageCollapsibleData({
																		...collapsibleData,
																		[r._id]: !collapsibleData?.[r._id],
																	})
																}>
																<h6 className="d-inline-block mt-2">
																	<i className="fa-regular fa-folder me-2 mt-1 p-0"></i>
																	<strong className="align-middle">
																		{r?.meeting_name} (
																		{r?.meeting_point?.length})
																	</strong>
																	<span>
																		<i
																			className={
																				!collapsibleData?.[r._id] === true
																					? 'fas fa-caret-down theme-secondary ms-2'
																					: 'fas fa-caret-right theme-secondary ms-2'
																			}></i>
																	</span>
																</h6>
															</span>
															<CreatePoint
																meeting_id={r?._id}
																className="align-middle">
																<span
																	onClick={handleShow}
																	className=" p-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold"
																	tooltip={btn_point.tooltip}
																	flow={btn_point.tooltip_flow}>
																	<i className="fas fa-plus"></i>{' '}
																	{btn_point?.text}{' '}
																</span>
															</CreatePoint>

															<span
																className="float-end me-2  p-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold"
																tooltip={icon_delete.tooltip}
																flow={icon_delete.tooltip_flow}
																onClick={() =>
																	sweetAlert(
																		() =>
																			dispatch(
																				deleteMeeting({
																					project_id: project_id,
																					meeting_id: [r?._id],
																				}),
																			),
																		'Meeting',
																	)
																}>
																<i className="fas fa-trash-alt"></i>
															</span>
															<EditMeeting data={r} />
															<MeetingInvitation data={r} />
														</td>
													</tr>
													{r?.meeting_point.length === 0 ? (
														<tr
															className={`theme-table-data-row bg-white text-center lf-text-vertical-align ${
																!collapsibleData?.[r._id] === true
																	? ''
																	: 'd-none'
															}`}>
															<td colSpan={5}> {no_point?.text} </td>
														</tr>
													) : (
														r?.meeting_point?.map((u) => {
															return (
																<tr
																	className={`theme-table-data-row bg-white ${
																		!collapsibleData?.[r._id] === true
																			? ''
																			: 'd-none'
																	}`}
																	key={u._id}>
																	<td className="text-center lf-text-vertical-align">
																		<FormCheck
																			type="checkbox"
																			name="plan_id"
																			className={`${
																				multiSelect.length > 0 ? 'visible' : ''
																			}`}
																			onChange={({ target: { checked } }) => {
																				let newArr = [...multiSelect];
																				if (checked === true) {
																					newArr.push(u._id);
																				} else {
																					newArr = newArr.filter(
																						(d) => d !== u._id,
																					);
																				}
																				handleMultiSelect(newArr);
																			}}
																			checked={multiSelect.includes(u._id)}
																			value={u._id}
																		/>
																	</td>
																	<td className="lf-w-500 lf-task-color align-middle">
																		{u.title}
																	</td>
																	<td className="text-end">
																		<SubPoint
																			type="Create"
																			meeting_id={r?._id}
																			metting_point_id={u?._id}
																		/>
																		<EditPoint data={u} />
																		<span
																			className="p-2 me-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold "
																			tooltip={delete_point.tooltip}
																			flow={delete_point.tooltip_flow}
																			onClick={() =>
																				sweetAlert(
																					() =>
																						dispatch(
																							deleteMeetingPoint({
																								project_id: project_id,
																								metting_point_id: [u?._id],
																							}),
																						),
																					'Metting Point',
																				)
																			}>
																			<i className="fas fa-trash-alt"></i>
																		</span>
																	</td>
																</tr>
															);
														})
													)}
												</Fragment>
											);
										})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}
		</Layout>
	);
}

export default Meeting;
