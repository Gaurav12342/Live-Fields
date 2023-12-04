import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Nodata from '../../components/nodata';
import Layout from '../../components/layout';
import { GET_RFI_LIST, GET_PROJECT_DETAILS } from '../../store/actions/actionType';
import {
	getRFIList,
	deleteRFI
} from '../../store/actions/projects';
import {
	Button,
	Dropdown,
	Form,
	FormCheck,
	FormControl,
	InputGroup,
	Modal,
} from 'react-bootstrap';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import Loading from '../../components/loadig';

import moment from 'moment';
import CustomSearch from '../../components/CustomSearch';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';


const RFI = (props) => {

	const dispatch = useDispatch();
	const { project_id } = useParams();
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState('');
	const [sortIndex, setSortIndex] = useState(0);
	const [selectedRFIs, setSelectedRFIs] = useState([]);
	const rfiData = useSelector((state) =>state?.RFI?.[GET_RFI_LIST]);
	const projectData = useSelector((state) => state?.project?.[GET_PROJECT_DETAILS]?.result || {});
	
	useEffect(()=>{
		setLoading(true);
		dispatch(getRFIList(project_id, ()=>{
			setLoading(false);
		}));
	},[dispatch, project_id]);


	const handleDeleteRFI = (ids) =>{
		if(ids && ids.length){
			setLoading(true);
			dispatch(deleteRFI({_id:ids},(resData)=>{
				dispatch(getRFIList(project_id, ()=>{
					setLoading(false);
				}));
			}))
		}
	}

	const sortingList = [
		`A ${String.fromCharCode(60)} Z`,
		` Z ${String.fromCharCode(60)} A`,
		` New ${String.fromCharCode(60)} Old`,
		` Old ${String.fromCharCode(60)} New`,
	];

	const handleSortType = (index) => {
		setSortIndex(index)
	}

	const {
		sort_by,
		action,
		create,
		share_files,
		new_directory,
		icon_delete,
		no_files_available,
		description,
		assignee_name
	} = getSiteLanguageData('commons');
	const {
		btn_rfis,
		RFI_no,
		watchers,
		sheet_no
	} = getSiteLanguageData('RFIs');

	const {
		created_by,created_date,
		statusbar
	} = getSiteLanguageData('task/update');

	const {
		due_date
	} = getSiteLanguageData('projects_details');
	return (
		<Layout>
			{rfiData?.length === 0 ? (
				<Nodata type="Files">
					<Link to={`/rfi/${project_id}/create`}>
						<Button
							type='button'
							className="mt-1 lf-link-cursor lf-main-button"
							tooltip={btn_rfis.tooltip}
							flow={btn_rfis.tooltip_flow}
						>
							<i className="fas fa-plus pe-1"></i>{' '}
							{btn_rfis?.text}
						</Button>
						{/* <i className="fas fa-plus pe-1 mt-2"></i> Create RFI */}
					</Link>
				</Nodata>
			) : (
				<div id="page-content-wrapper">
					<section className="lf-dashboard-toolbar">
						<div className="row">
							<div className="col-md-3 col-lg-2" style={{height:'35px'}}>
								<InputGroup className="toolbar-search">
									<InputGroup.Text>
										<i className="fas fa-search"></i>
									</InputGroup.Text>
									<input
										type="text"
										className="d-block form-control bg-transparent border border-0"
										placeholder="Search"
										onBlur={(e) =>{
											setSearch(e.target.value);
										}}
										value={search}
										onChange={(e) => {
											setSearch(e.target.value);
										}}
									/>
								</InputGroup>
							</div>
							<div className="col-md-3 col-lg-4 d-none-xs">
								<Dropdown className="lf-responsive-common">
									<span tooltip={sort_by.tooltip} flow={sort_by.tooltip_flow}>
										<Dropdown.Toggle
											variant="transparent"
											id="dropdown-basic"
											className="d-inline-block  lf-common-btn">
											<span>
												{sortingList[sortIndex]}{' '}
											</span>
										</Dropdown.Toggle>
									</span>
									<Dropdown.Menu
										style={{ backgroundColor: '#73a47' }}
										className="shadow p-2 mb-2 bg-white rounded-7 dropdown-menu lf-dropdown-center lf-dropdown-animation">
										{sortingList.map((st, k) => {
											return (
												<Dropdown.Item
													key={k}
													className="lf-layout-profile-menu "
													onClick={() =>
														handleSortType((k).toString())
													}
													>
													{st} <i></i>
												</Dropdown.Item>
											);
										})}
									</Dropdown.Menu>
								</Dropdown>
							</div>
							<div className="col-md-6 col-lg-6 text-end">
								<span className="">
									{
										projectData?.role?.access?.RFIs?.create_rfis == 1 && (
											<Link to={`/rfi/${project_id}/create`}>
												<Button
													type='button'
													className="mt-1 lf-link-cursor lf-main-button"
													tooltip={btn_rfis.tooltip}
													flow={btn_rfis.tooltip_flow}
												>
													<i className="fas fa-plus pe-1"></i>{' '}
													{btn_rfis?.text}
												</Button>
											</Link>
										)
									}
									
									<Dropdown className="d-inline ">
										<Dropdown.Toggle
											disabled={selectedRFIs.length > 0 && (projectData?.role?.access?.RFIs?.delete_rfis == 1) ? false : true}
											variant="transparent"
											className="lf-common-btn">
											<span>{action?.text}</span>
										</Dropdown.Toggle>
										<Dropdown.Menu className="shadow p-2 mb-2 bg-white rounded-7 dropdown-menu lf-dropdown-center lf-dropdown-animation">
											<Dropdown.Item
												className="lf-layout-profile-menu "
												
												onClick={() =>
													sweetAlert(
														() => handleDeleteRFI(selectedRFIs),
														'RFI',
													)
												}
												>
												<i className="fas fa-trash-alt px-2" />
												{icon_delete?.text}
											</Dropdown.Item>
											
										</Dropdown.Menu>
									</Dropdown>
									<Dropdown className="mt-1 lf-responsive-common d-lg-none xs-d-in-block">
										<span tooltip={sort_by.tooltip} flow={sort_by.tooltip_flow}>
											<Dropdown.Toggle
												variant="transparent"
												id="dropdown-basic"
												className="d-inline-block  lf-common-btn">
												<span>
													{sortingList[0]}{' '}
												</span>
											</Dropdown.Toggle>
										</span>
										<Dropdown.Menu
											style={{ backgroundColor: '#73a47' }}
											className="shadow p-2 mb-2 bg-white rounded-7 dropdown-menu lf-dropdown-center lf-dropdown-animation">
											{sortingList.map((st, k) => {
												return (
													<Dropdown.Item
														key={k}
														className="lf-layout-profile-menu "
														onClick={() =>
															handleSortType((k + 1).toString())
														}>
														{st} <i></i>
													</Dropdown.Item>
												);
											})}
										</Dropdown.Menu>
									</Dropdown>
								</span>
							</div>
						</div>
					</section>
					<div className="container-fluid">
						<div className="theme-table-wrapper no-bg mt-3">
							<table className={`table table-hover theme-table`}>
								<thead className="theme-table-title text-capitalize bg-light text-nowrap text-center">
									<tr>
										<th className="px-1 text-center"></th>
										<th className="px-1 text-center">{RFI_no.text}</th>
										<th className="px-1 text-center">{description.text}</th>
										<th className="px-1 text-center">{assignee_name.text}</th>
										<th className="px-1 text-center">{created_by.text}</th>
										<th className="px-1 text-center">{watchers.text}</th>
										<th className="px-1 text-center">{created_date.text}</th>
										<th className="px-1 text-center">{due_date.text}</th>
										<th className="px-1 text-center">{sheet_no.text}</th>
										<th className="px-1 text-center">{statusbar.text}</th>
										<th className="px-1 text-center">{action.text}</th>
									</tr>
								</thead>
								<tbody>
									{rfiData.filter((r)=> !search || ( search && r.name.toLowerCase().includes(search.toLowerCase())) )?.sort((a, b)=>{
										if(sortIndex == 0){
											return ((a.name?.toLowerCase() == b.name?.toLowerCase()) ? 0 : ((a.name?.toLowerCase() > b.name?.toLowerCase()) ? 1 : -1 ))
										}else if(sortIndex == 1){
											return ((a.name?.toLowerCase() == b.name?.toLowerCase()) ? 0 : ((a.name?.toLowerCase() > b.name?.toLowerCase()) ? -1 : 1 ))
										}else if(sortIndex == 2){
											return ((a.createdAt == b.createdAt) ? 0 : ((a.createdAt > b.createdAt) ? 1 : -1 ))
										}else if(sortIndex == 3){
											return ((a.createdAt == b.createdAt) ? 0 : ((a.createdAt > b.createdAt) ? -1 : 1 ))
										}
									}).map((r, k) => {
										return (
											<tr className={`theme-table-data-row bg-white`}
												key={r._id}>
												<td className="px-1 text-center">
													<FormCheck
														type="checkbox"
														name="plan_id"
														className={`visible`}
														onChange={({ target: { checked } }) => {
															console.log(checked);
															if(checked === true){
																setSelectedRFIs([...selectedRFIs, r._id]);
															}else{
																setSelectedRFIs(selectedRFIs.filter((id)=>id !== r._id))
															}
															// setSelectedRFIs
														}}
														checked={selectedRFIs.includes(r._id)}
														value={r._id}
													/>
												</td>
												<td className="px-1 text-center text-secondary">
													{k+1}
												</td>
												<td className="lf-text-vertical-align px-1 text-center">{r.name}</td>
												<td 
													className="px-1 text-center lf-text-vertical-align text-secondary"
													tooltip={r?.assignee_data?.first_name+' '+r?.assignee_data?.last_name}
												>
													{r?.assignee_data?.first_name}{' '}
													{r?.assignee_data?.last_name}
												</td>
												<td className="px-1 text-center lf-text-vertical-align text-secondary">
														{r?.created_by_data?.first_name}{' '}
														{r?.created_by_data?.last_name}
												</td>
												<td 
													className="px-1 text-center text-nowrap lf-text-vertical-align text-secondary"
													tooltip={`
														${
															r.watchers_data.map(u=>{
																return `${u.first_name} ${u.last_name}, `
															})
														}
													`}
												>
													{
														r.watchers_data && r.watchers_data.length > 0 ? `${r.watchers_data[0].first_name} ${r.watchers_data[0].last_name}` : ''
													}
												</td>
												<td className="px-1 text-center text-nowrap lf-text-vertical-align text-secondary">
													{moment(r.createdAt).format("YYYY-MM-DD")}
												</td>
												<td className="px-1 text-center text-nowrap lf-text-vertical-align text-secondary">
													{moment(r.due_date).format("YYYY-MM-DD")}
												</td>
												<td className="px-1 text-center text-nowrap lf-text-vertical-align text-secondary">
													<Link to={`/sheets/${project_id}/sheetinfo/${r.sheet_id}`}>{r.sheet_data?.sheet_no}</Link>
												</td>
												<td className="px-1 text-center text-nowrap lf-text-vertical-align text-secondary">
													{r.status.charAt(0).toUpperCase()+r.status.substr(1,r.status.length-1)}
												</td>
												<td className="px-1 text-center text-nowrap text-center lf-text-vertical-align text-secondary">
													
														<Link 
															to={`/rfi/${project_id}/update/${r._id}`}
														>
															<i className="fas fa-edit"></i>
														</Link>
														
													{` `}
													{
														projectData?.role?.access?.RFIs?.delete_rfis == 1 && (
															<span
																tooltip={icon_delete.tooltip}
																flow={icon_delete.tooltip_flow}
																onClick={() =>
																	sweetAlert(
																		() => handleDeleteRFI([r?._id]),
																		'RFI',
																	)
																}
																>
																<i className="fas fa-trash-alt"></i>
															</span>
														)
													}
													
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}

			{
				loading === true ? (<Loading />) : ('')
			}
			
		</Layout>
	)
}

export default RFI;
