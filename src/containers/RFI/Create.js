
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import Nodata from '../../components/nodata';
import Layout from '../../components/layout';
import {
	GET_RFI_LIST,
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_ALL_SHEETS
} from '../../store/actions/actionType';
import {
	getAllRoleWisePeople,
	getAllSheets,
	createRFIs,
	updateRFIs,
	getRFIById
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
import Upload from '../../components/upload';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import Loading from '../../components/loadig';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import CustomSearch from '../../components/CustomSearch';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import CustomSelect from '../../components/SelectBox';
import { errorNotification } from '../../commons/notification';

const RFI = (props) => {
	const userId = getUserId();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { project_id, rfi_id } = useParams();
	const [watcherUsers, setWatcherUsers] = useState([]);
	const [RFIData, setRFIData] = useState({project_id:project_id});
	const [history, handleHistory] = useState(false);
	const [selectedSheet, setSelectedSheet] = useState({});
	const rfiData = useSelector((state) =>state?.RFI?.[GET_RFI_LIST]);
	const projectRoleWiseUser = useSelector((state) =>state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || []);
	const sheetList = useSelector((state) => state?.project?.[GET_ALL_SHEETS]?.result);

	useEffect(()=>{
		
		dispatch(getAllRoleWisePeople(project_id));
		dispatch(getAllSheets(project_id));

	},[dispatch, project_id]);

	const dropDownUsers = (userListRoleWise) => {
		if(userListRoleWise && userListRoleWise.length){
			let wUser = []
			userListRoleWise?.forEach((a) => {
				(a?.users).forEach((u) => {
					wUser.push({
						...u,
						label: (
							<>
								{u?.profile ? (
									<img
										src={u.thumbnail || u.profile}
										className="me-1 priority-1 border "
									/>
								) : (
									<span
										className="task-info-category text-uppercase me-2"
										style={{ background: '#B36BD4', color: '#FFFFFF' }}>
										{u.first_name?.charAt(0)}
										{u.last_name?.charAt(0)}
									</span>
								)}
								<span className="lf-react-select-item">
									{u.first_name} {u.last_name}
								</span>
							</>
						),
						value: u._id,
					});
					
				});
			});
			setWatcherUsers(wUser)
		}
		
		
	}

	useEffect(()=>{
		dropDownUsers(projectRoleWiseUser);		
		
	},[projectRoleWiseUser]);

	const setRFDDataHandle = (resData) => {
		setRFIData({
			project_id:project_id,
			_id: resData.result._id,
			// to_id: resData.result.to_id,
			watchers: resData.result.watchers,
			status: resData.result.status,
			sheet_id: resData.result.sheet_id,
			question_attachment: resData.result.question_attachment,
			question: resData.result.question,
			name: resData.result.name,
			due_date: resData.result.due_date ? new Date(moment(resData.result.due_date).format("YYYY-MM-DD")) : null,
			assignee_id: resData.result.assignee_id,
			answer_attachment: Array.isArray(resData.result.answer_attachment) ? resData.result.answer_attachment : [],
			answer: resData.result.answer,
		});

		if(resData.result.sheet_id){
			setSelectedSheet(resData.result.sheet_data)
		}else{
			setSelectedSheet({})
		}
	}

	const fetchDataById = ()=>{
		if(rfi_id && rfi_id.length > 0){
			dispatch(getRFIById(rfi_id,(resData)=>{
				console.log(resData, "resData resData")
				if(resData.result && resData.success){
					setRFDDataHandle(resData)
				}
			}));
		}else{
			setRFIData({
				project_id:project_id,
				_id: "",
				watchers: [],
				status: "",
				sheet_id: "",
				question_attachment: [],
				question: "",
				name: "",
				due_date: null,
				assignee_id: "",
				answer_attachment: [],
				answer: "",
			});
			setSelectedSheet({});
		}
	}

	useEffect(()=>{
		if(rfi_id && rfi_id.length > 0 && !RFIData._id){
			fetchDataById();
		}		
	},[]);

	const handleChange = (name, value) =>{
		setRFIData({
			...RFIData,
			[name]:value
		})
	}



	const RFIStatus = [
		{ label: "Pending", value: 'pending' },
		{ label: "Closed", value: 'closed' },
		{ label: "Draft", value: 'draft' },
		{ label: "Void", value: 'void' },
	]
	const handleHistoryPopup = () => {
		handleHistory(!history)
	}

	const discardRFI = () => {
		fetchDataById();
	}

	const saveRFI = () => {
		if(typeof RFIData.name == "undefined" || !(RFIData.name)){
			errorNotification('Please enter RFI name');
		}else if(typeof RFIData.due_date == "undefined" || !(RFIData.due_date)){
			errorNotification('Due date is empty');
		}else if(typeof RFIData.watchers == "undefined" || !Array.isArray(RFIData.watchers) || (Array.isArray(RFIData.watchers) && RFIData.watchers.length == 0)){
			errorNotification('Watchers is empty');
		}else if(typeof RFIData.status == "undefined" || !(RFIData.status)){
			errorNotification('Status is empty');
		}else if(typeof RFIData.assignee_id == "undefined" || !(RFIData.assignee_id)){
			errorNotification('Assignee id empty');
		}else if(typeof RFIData.sheet_id == "undefined" || !(RFIData.sheet_id)){
			errorNotification('Sheet id empty');
		}else if(typeof RFIData.question == "undefined" || !(RFIData.question)){
			errorNotification('Question is empty');
		}else{
			if(RFIData._id){
				dispatch(updateRFIs(RFIData,(resData)=>{
					console.log("Updated RFI", resData)
					if(resData.success){
						navigate(`/rfi/${project_id}`);
					}					
				}))
			}else{
				dispatch(createRFIs(RFIData,(resData)=>{
					console.log("Created RFI", resData)
					if(resData.success){
						navigate(`/rfi/${project_id}`);
					}					
				}));
			}
		}
	}

	// console.log(RFIData, "RFIData")
	
	const {
		select_sheet,
		save_rfis,
		discard_rfis,
		attributes,
		RFIs_name,
		watchers,
		answer
	} = getSiteLanguageData('RFIs');
	const {
		assignee_name,
	} = getSiteLanguageData('commons');

	const {due_date} = getSiteLanguageData("projects_details")
	const {statusbar} = getSiteLanguageData("task/update")
	const {sheet} = getSiteLanguageData("projects")
	const {attachment} = getSiteLanguageData("reports/toolbar")
	
	return (
		<Layout>
			<div id="page-content-wrapper">
				<section className="lf-dashboard-toolbar">
					<div className="row">
						<div className='col-6 text-start'>
							<Link
								to={`/rfi/${project_id}`}
							>
								<span
									className='theme-secondary lf-common-btn btn'
								>
									<i className="fa fa-arrow-left" aria-hidden="true"></i>
									<span className='ps-2'>{RFIData && RFIData._id ? RFIData.name : 'Create new RFI'}</span>
								</span>
							</Link>
						</div>
						<div className='col-6 text-end'>
							<span
								type='button'
								className="mt-1 lf-link-cursor lf-common-btn"
								onClick={discardRFI}
								tooltip={discard_rfis.tooltip}
								flow={discard_rfis.tooltip_flow}
							>
								<i className="fas fa-save pe-1"></i>{' '}
								{discard_rfis?.text}
							</span>
							<Button
								type='button'
								className="mt-1 lf-link-cursor lf-main-button"
								onClick={saveRFI}
								tooltip={save_rfis.tooltip}
								flow={save_rfis.tooltip_flow}
							>
								<i className="fas fa-save pe-1"></i>{' '}
								{save_rfis?.text}
							</Button>
						</div>
					</div>
				</section>
				<div className="container-fluid">
					<div className='row mt-4'>
						<div className='col-6 fs16'>
							<span className='ps-3'>{attributes.text}</span>
						</div>
					</div>
					<div className='white-box no-shadow'>
						<div className="row">
							<div className='col-8'>
								<div className="row">

									<div className='col-6'>
										<Form.Group className="mb-3">
											<Form.Label>{RFIs_name.text}</Form.Label>
											<Form.Control 
												placeholder="RFIs name"
												type='text'
												name="name"
												onChange={(e)=>handleChange('name', e.target.value)}
												value={RFIData.name}
											/>
										</Form.Group>
									</div>
									<div className='col-6'>
										<Form.Group className="mb-3">
											<Form.Label>{watchers.text}</Form.Label>
											<CustomSelect
												placeholder={`${watchers.text}...`}
												isMulti
												name="watchers"
												className={`task-waters-container`}
												moduleType="users"
												onChange={(e) =>
													handleChange(
														'watchers',
														e?.map((w) => w.value),
													)
												}
												options={watcherUsers}
												closeMenuOnSelect={false}
												// onBlur={this.onBlurSubmit}
												value={watcherUsers?.filter((watcher) =>
													RFIData.watchers?.some(
														(w) => w === watcher.value,
													),
												)}
											/>
										</Form.Group>
									</div>
								</div>

								<div className="row">
									<div className='col-6'>
										<Form.Group className="mb-3">
											<Form.Label>{assignee_name.text}</Form.Label>
											<CustomSelect
												//styles={{ fontSize: '13px', borderRadius: '8px' }}
												placeholder={`${assignee_name.text}...`}
												name="assignee_id"
												moduleType="taskUsers"
												onChange={(e) =>
													handleChange('assignee_id', e.value)
												}
												options={watcherUsers}
												value={watcherUsers?.filter(
													(ass) => ass.value === RFIData.assignee_id,
												)}
												// onBlur={this.onBlurSubmit}
											/>
										</Form.Group>
									</div>
									<div className='col-6'>
										<Form.Group className="mb-3">
											<Form.Label>{due_date.text}</Form.Label>
											<DatePicker
												className="w-100 input-border"
												customInput={
													<div className="bg-white">
														<i
															className="fas fa-calendar text-secondary"
															style={{
																padding: '12px 5px 12px 10px',
																margin: 0,
															}}></i>
														<span className="ms-2">
															{RFIData.due_date
																? moment(RFIData.due_date).format('DD MMM YYYY')
																: null}
														</span>
													</div>
												}
												selected={RFIData.due_date}
												dateFormat="dd/MM/yyyy"
												onChange={(e) => {
													console.log(e, "e[0]")
													handleChange('due_date', e);
												}}
												value={RFIData.due_date}
												// onCalendarClose={this.onBlurSubmit}
												isClearable={true}
											/>
										</Form.Group>
									</div>
								</div>

								<div className="row">
									
									<div className='col-6'>
										<Form.Group className="">
											<Form.Label>{statusbar.text}</Form.Label>
											<CustomSelect
												placeholder={statusbar.text}
												name="status"
												moduleType="workType"
												onChange={(e) => handleChange('status', e.value)}
												options={RFIStatus}
												value={RFIStatus?.filter(
													(work) => work?.value === RFIData.status,
												)}
												// onBlur={this.onBlurSubmit}
												required
											/>
										</Form.Group>
									
									</div>
								</div>
								
							</div>
							<div className='col-4'>
								<Form.Label>{sheet.text}</Form.Label>
								<div 
									className='sheet-selector-box text-center'
									onClick={() => handleHistory(history === false ? true : false)}
								>
									<div className='w-100'>
										{
											selectedSheet && selectedSheet.thumbnail ? (
												<img src={selectedSheet.thumbnail} />
											) : (
												<svg width="77" height="77" viewBox="0 0 77 77" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M9.0244 77H67.9756C70.3684 76.998 72.6626 76.0465 74.3546 74.3545C76.0465 72.6625 76.998 70.3682 77 67.9754V9.02279C76.9991 7.57946 76.6522 6.15739 75.9883 4.8758C75.3245 3.59421 74.3631 2.49046 73.1847 1.65708C72.0063 0.823703 70.6453 0.284994 69.2158 0.0861192C67.7862 -0.112756 66.3299 0.0340004 64.9688 0.514083L63.4634 1.0454V9.02279H13.5366V1.0454L12.0312 0.514083C10.6701 0.0340004 9.21377 -0.112756 7.78425 0.0861192C6.35473 0.284994 4.99372 0.823703 3.81533 1.65708C2.63694 2.49046 1.67552 3.59421 1.01167 4.8758C0.347828 6.15739 0.000908188 7.57946 0 9.02279V67.9754C0.00203902 70.3682 0.953476 72.6625 2.64544 74.3545C4.3374 76.0465 6.63161 76.998 9.0244 77ZM67.9756 4.51048C69.172 4.5115 70.3191 4.98723 71.1651 5.83323C72.0111 6.67923 72.4868 7.82636 72.4878 9.02279V60.1635C71.1169 59.3691 69.56 58.952 67.9756 58.9546V4.51048ZM4.5122 9.02279C4.51322 7.82636 4.98894 6.67923 5.83492 5.83323C6.6809 4.98723 7.828 4.5115 9.0244 4.51048V58.9508C7.43997 58.9482 5.88311 59.3653 4.5122 60.1597V9.02279ZM9.0244 63.4631C10.5874 63.6689 12.1093 64.1143 13.5366 64.7837V13.5351H63.4634V64.7837C64.891 64.1151 66.4128 63.6697 67.9756 63.4631C69.1723 63.4631 70.32 63.9385 71.1662 64.7847C72.0124 65.6309 72.4878 66.7786 72.4878 67.9754C72.4878 69.1721 72.0124 70.3198 71.1662 71.1661C70.32 72.0123 69.1723 72.4877 67.9756 72.4877H9.0244C7.82769 72.4877 6.67999 72.0123 5.83379 71.1661C4.98759 70.3198 4.5122 69.1721 4.5122 67.9754C4.5122 66.7786 4.98759 65.6309 5.83379 64.7847C6.67999 63.9385 7.82769 63.4631 9.0244 63.4631Z" fill="#CED4DA"/>
											<path d="M21.175 23.8683V64.7332H55.3053L21.175 23.8683ZM24.8441 34.0171L47.3935 61.014H24.8441V34.0171Z" fill="#CED4DA"/>
											<path d="M46.7082 40.8087C48.3834 40.8087 50.021 40.3119 51.4139 39.3812C52.8068 38.4505 53.8924 37.1276 54.5334 35.5799C55.1745 34.0321 55.3423 32.3291 55.0154 30.686C54.6886 29.0429 53.8819 27.5337 52.6974 26.3491C51.5128 25.1645 50.0036 24.3578 48.3606 24.031C46.7176 23.7042 45.0145 23.8719 43.4669 24.513C41.9192 25.1541 40.5964 26.2397 39.6657 27.6327C38.735 29.0256 38.2382 30.6632 38.2382 32.3384C38.2632 34.5771 39.1636 36.7171 40.7467 38.3001C42.3297 39.8832 44.4696 40.7836 46.7082 40.8087ZM46.7082 27.2448C48.057 27.2448 49.3507 27.7806 50.3045 28.7344C51.2582 29.6882 51.794 30.9819 51.794 32.3308C51.794 33.6796 51.2582 34.9733 50.3045 35.9271C49.3507 36.8809 48.057 37.4167 46.7082 37.4167C45.3593 37.4167 44.0658 36.8809 43.112 35.9271C42.1582 34.9733 41.6223 33.6796 41.6223 32.3308C41.6223 30.9819 42.1582 29.6882 43.112 28.7344C44.0658 27.7806 45.3593 27.2448 46.7082 27.2448Z" fill="#CED4DA"/>
												</svg>
											)
										}
										
									</div>
									<div className='box-lb-sheet w-100'>
										{select_sheet.text}
									</div>
								</div>
							</div>
						</div>						
					</div>

					<div className="row">
						<div className='col-8'>
							<Form.Group className="">
								<Form.Label>Question</Form.Label>
								<Form.Control name="question" onChange={(e)=>handleChange('question', e.target.value)} value={RFIData.question} as="textarea" rows={3} />
							</Form.Group>
						</div>
						<div className='col-4'>
							<div className="row">
								<div className='col-6'><Form.Label>{attachment.text}</Form.Label></div>
								<div className='col-6 text-end'>
									<Upload
										name="question_attachment"
										fileType="rfi_attachment"
										fileKey={project_id}
										onFinish={(file, fileName, type, iconURL, pp) => {
											if(pp.name == 'question_attachment'){
												let filesList = Array.isArray(RFIData.question_attachment) ? RFIData.question_attachment : [];
												filesList.push(file);
												handleChange('question_attachment', filesList)
											}
											
											
										}}
									>

									</Upload>
								</div>
							</div>
							<div className="row rfi-attachment-height">
								<div className='col-12'>
									<div className='rfi-attachment-box'>

									{RFIData.question_attachment?.length ? (
										<div className="my-3">
											{RFIData.question_attachment?.map((file_url, k) => {
											
											let ext = file_url.split('.').slice(-1).join('.');
											return (
												<span className="p-2 d-inline-block" key={k}>
													
													{ext === 'pdf' ? (
														<img
															alt="livefield"
															className="mt-2"
															src={`/images/${ext}-icon.svg`}
															style={{ height: '60px', width: '60px', maxWidth:'100%' }}
														/>
													) : (
														<img
															alt="livefield"
															className="mt-2"
															src={file_url}
															style={{ height: '60px',width: '60px', maxWidth: '80px' }}
														/>
													)}
													<i onClick={()=>{
														let newFileArr = RFIData.question_attachment.filter(fl=>fl != file_url);
														handleChange('question_attachment', newFileArr)
													}} className="fas fa-times fa-xs lf-icon"></i>
												</span>
											);
										})}

										</div>
									) : (
										''
									)}

									</div>
								</div>
								
							</div>
						</div>
					</div>
					{
						RFIData && RFIData._id ? (
							<div className="row mt-3">
								<div className='col-8'>
									<Form.Group className="">
										<Form.Label>{answer.text}</Form.Label>
										<Form.Control name="answer" onChange={(e)=>handleChange('answer', e.target.value)} value={RFIData.answer} as="textarea" rows={3} />
									</Form.Group>
								</div>
								<div className='col-4'>
									<div className="row">
										<div className='col-6'><Form.Label>{attachment.text}</Form.Label></div>
										<div className='col-6 text-end'>
											<Upload
												name={`answer_attachment`}
												fileType="rfi_files"
												fileKey={project_id}
												onFinish={(file, fileName, type, iconURL, pp) => {
													console.log(pp, "pp pp")
													if(pp.name == 'answer_attachment'){
														let filesList = Array.isArray(RFIData.answer_attachment) ? RFIData.answer_attachment : [];
														filesList.push(file);
														handleChange('answer_attachment', filesList)
													}
												}}
											>

											</Upload>
										</div>
									</div>
									<div className="row rfi-attachment-height">
										<div className='col-12'>
											<div className='rfi-attachment-box'>

											{RFIData.answer_attachment?.length ? (
												<div className="my-3">
													{RFIData.answer_attachment?.map((file_url, k) => {
													
													let ext = file_url.split('.').slice(-1).join('.');
													return (
														<span className="p-2 d-inline-block" key={k}>
															
															{ext === 'pdf' ? (
																<img
																	alt="livefield"
																	className="mt-2"
																	src={`/images/${ext}-icon.svg`}
																	style={{ height: '60px', width: '60px', maxWidth:'100%' }}
																/>
															) : (
																<img
																	alt="livefield"
																	className="mt-2"
																	src={file_url}
																	style={{ height: '60px',width: '60px', maxWidth: '80px' }}
																/>
															)}
															<i onClick={()=>{
																let newFileArr = RFIData.answer_attachment.filter(fl=>fl != file_url);
																handleChange('answer_attachment', newFileArr)
															}} className="fas fa-times fa-xs lf-icon"></i>
														</span>
													);
												})}

												</div>
											) : (
												''
											)}

											</div>
										</div>
										
									</div>
								</div>
							</div>
						) : ('')
					}
					
					
				</div>
			</div>
			<Modal show={history} centered onHide={handleHistoryPopup}>
				<Modal.Header className="py-2 bg-light sheet-select-md" closeButton>
					<Modal.Title>{select_sheet?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body
					id={`location-model-body`}
					style={{
						maxHeight: '70vh',
						overflow: 'auto',
					}}>
					<div className="row">
					{sheetList?.map((d, l) => {
						return (d?.plans.map((r,v)=>{
							return (
								<div 
									onClick={()=>{
										handleChange('sheet_id', r._id);
										setSelectedSheet(r);
										handleHistoryPopup();
									}}
									className="col-xl-12 col-lg-12 col-md-12 mb-3 pointer" 
									key={v}
								>
									
									<div className={`d-flex align-items-center`}>
										<div style={{width:'20%'}}>
											<img
												style={{maxWidth:'90%', width:'90%'}}
												alt="livefield"
												src={
													r.thumbnail
														? r.thumbnail
														: '/images/sheets/sheets_demo.png'}
	
												className={`border`}
												
											/>
										</div>
										<div style={{width:'80%'}}>
											<p className={`mb-0 fw-bold`}>{r.sheet_no}</p>
											<p className={`mb-0`}>{r.description}</p>
										</div>
									</div>
									
								</div>
									
								
							);
						}))
						
					})}
					</div>
				</Modal.Body>
				
			</Modal>
		</Layout>
	)
}

export default RFI;
