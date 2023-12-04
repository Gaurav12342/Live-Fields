import { useEffect, useState } from 'react';
import { InputGroup, FormControl, Form, Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import Loading from '../../components/loadig';
import {
	errorNotification,
	successNotification,
} from '../../commons/notification';
import CustomSelect from '../../components/SelectBox';
import { getVendorsList } from '../../store/actions/projects';
import { GET_ALL_MATERIAL_LIST, GET_VENDOR_LIST } from '../../store/actions/actionType';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { getAllMaterialList, getVendorAndMaterialReport } from '../../store/actions/storeroom';

const userId = getUserId();

const sortByConst = [
	{label:"Vendor / Material", value:"Material / Vendor"},
	{label:"Material / Vendor", value:"Vendor / Material"}
]

function GenerateReport({
	manageTaskFilter,
	filterData,
	clearTaskFilter,
	...props
}) {
	const dispatch = useDispatch();
	const [shareLink, setShareLink] = useState(null);
	const [loading, setLoading] = useState(false);
	const [reportType, setReportType] = useState('Material');
	const [reportParams, setReportParams] = useState({
		report_type: 'Material',
		sort_by: 'Material / Vendor',
		material_ids:[],
		vendor_ids:[],
		start_date:new Date(),
		end_date:new Date()
	});

	const vendorList = useSelector((state) => {
		return (state?.project?.[GET_VENDOR_LIST]?.result || [])?.map((vendor)=> ({value:vendor._id,  label:vendor.vendor_name}));
	});

	const materialData = useSelector((state) => {
		return (state?.storeroom?.[GET_ALL_MATERIAL_LIST]?.result || [])?.map((mt)=> ({label:`${mt.type} (${mt.unit})`, value:mt._id}));
	});

	useEffect(()=>{
		dispatch(getVendorsList(props.project_id));
		dispatch(getAllMaterialList(props.project_id));
	},[dispatch, props.project_id]);

	
	
	const handleChange = (name, value) => {
		setReportParams({
			...reportParams,
			[name]: value
		});
	}
	
	const handleReportResponse = (data) => {
		
		if (data && data.result && data.result.file) {
			setShareLink(data.result.file);
		} else {
			setShareLink('');
		}
		setLoading(false);
	};
	const generateReport = () => {
		const post = {
			...reportParams,
			user_id: userId,
			project_id: props.project_id,
			store_room_id: props.store_room_id
		};
		setLoading(true);
		dispatch(getVendorAndMaterialReport(post, handleReportResponse));
	};

	const handleClose = () => {
		setLoading(false);
		setShareLink('');
		props.handleClose();
	};

	const {
		share_file,
		share_file_heading,
		share_file_description,
		shareable_link,
		copy_paste_link,
		download_file,
		copy,
		link_here,
		report_by
	} = getSiteLanguageData('shareFile');

	const {
		material,from
	} = getSiteLanguageData('storeroom');

	const {
		generate
	} = getSiteLanguageData('reports/toolbar');

	const {
		vendor
	} = getSiteLanguageData('storeroom/updateOrder');
	
	return (
		<>
			<Modal
				show={props.open}
				onHide={handleClose}
				className="lf-right-sidebar bg"
				animation={false}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<h4>{share_file?.text}</h4>
				</Modal.Header>
				<Modal.Body className="">
					{!loading && !shareLink && (
						<div className="row">
							<div className={`col-12`}>
								
								<div className='form-group'>
									<div className="text-start white-box-label mb-0 mt-4 mb-2">
										{report_by.text}
									</div>
									<InputGroup className="">
									<div className="form-check me-3">
										<input
											className="form-check-input"
											value={material.text}
											id={`flexRadioDefault1`}
											type="radio"
											name="report_type"
											checked={reportParams.report_type === material.text}
											onChange={(e)=>handleChange('report_type', e.target.value)}
										/>
										<label className="form-check-label" for="flexRadioDefault1">
											{material.text}
										</label>
									</div>
									<div className="form-check">
										<input
											className="form-check-input"
											value={vendor.text}
											id={`flexRadioDefault2`}
											type="radio"
											name="report_type"
											onChange={(e)=>handleChange('report_type', e.target.value)}
											checked={reportParams.report_type === vendor.text}
										/>
										<label className="form-check-label" for="flexRadioDefault2">
											{vendor.text}
										</label>
									</div>
									</InputGroup>
								</div>


								{/* <div className='form-group'>
									<div className="text-start white-box-label mb-0 mt-4 mb-2">
										Sort By
									</div>
									<CustomSelect
										placeholder={`Select sort by`}
										moduleType="status"
										name="sort_by"
										onChange={(e) => {
											handleChange('sort_by', e.value)
										}}
										options={sortByConst}
										value={sortByConst.find((sb)=>sb.value === reportParams.sort_by)}
										
									/>

								</div> */}


								<div className='form-group row'>
									<div className='col-6'>
										<div className="text-start white-box-label mb-0 mt-4 mb-2">
											{from.text}
										</div>
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
														{reportParams.start_date
															? moment(reportParams.start_date).format('DD MMM YYYY')
															: null}
														
													</span>
												</div>
											}
											
											maxDate={
												reportParams.end_date
													? moment(reportParams.end_date).toDate()
													: new Date()
											}
											dateFormat="dd/MM/yyyy"
											onChange={(e) => {		
												handleChange('start_date', e);
											}}
											selected={reportParams.start_date ? new Date(reportParams.start_date) : null}
											// onCalendarClose={this.onBlurSubmit}
											isClearable={true}
										/>
									</div>

									<div className='col-6'>
										<div className="text-start white-box-label mb-0 mt-4 mb-2">
											To
										</div>
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
														{reportParams.end_date
															? `${moment(reportParams.end_date).format('DD MMM YYYY')}`
															: null}
													</span>
												</div>
											}
											minDate={
												reportParams.start_date ? moment(reportParams.start_date).toDate() : null
											}
											maxDate={new Date()}
											dateFormat="dd/MM/yyyy"
											onChange={(e) => {
												handleChange('end_date', e);
											}}
											selected={reportParams.end_date ? new Date(reportParams.end_date) : null}
											// onCalendarClose={this.onBlurSubmit}
											isClearable={true}
										/>
									</div>
									
								</div>

								<div className='form-group'>
									<div className="text-start white-box-label mb-0 mt-4 mb-2">
										Select {reportParams.report_type}
									</div>
									{
										reportParams.report_type === "Material" && (
											<CustomSelect
												placeholder={`Sort By ${reportParams.report_type}`}
												moduleType="status"
												name="material_ids"
												onChange={(e) => {
													if(Array.isArray(e)){
														handleChange('material_ids', e.map((cv)=>cv.value))
													}else{
														handleChange('material_ids', [])
													}
												}}
												options={materialData}
												value={materialData.filter((v)=>reportParams.material_ids.includes(v.value))}
												isMulti
											/>
										)
									}

									{
										reportParams.report_type === "Vendor" && (
											<CustomSelect
												placeholder={`Sort By ${reportParams.report_type}`}
												moduleType="status"
												name="vendor_ids"
												onChange={(e) => {
													if(Array.isArray(e)){
														handleChange('vendor_ids', e.map((cv)=>cv.value))
													}else{
														handleChange('vendor_ids', [])
													}
													
												}}
												options={vendorList}
												value={vendorList?.filter((v)=>reportParams.vendor_ids.includes(v.value))}
												isMulti
												// onBlur={this.onBlurSubmit}
											/>
										)
									}
									
								</div>

								<div className="form-group text-center mt-4">
									<span
										onClick={generateReport}
										target="_blank"
										className="lf-main-button px-0 mx-0 pointer">
										{' '}
										<i className="fas fa-check-circle me-2"></i>
										{generate.text}
									</span>
								</div>
							</div>
						</div>
					)}

					{!loading && shareLink && (
						<div className="row">
							<div className={`col-12 text-center`}>
								<div className="my-4 text-center">
									<img
										alt="Process Done"
										src="/images/correct.svg"
										width="100px"
									/>
								</div>
								<div className="fw-bold text-center">
									<h4>{share_file_heading?.text}</h4>
								</div>
								<div className="text-secondary my-2 text-center">
									{share_file_description?.text}
								</div>

								<div className="text-start white-box-label mb-0 mt-5">
									{shareable_link?.text}
								</div>
								<div className="text-start text-secondary my-2">
									{copy_paste_link?.text}
								</div>

								<div className="form-group">
									<InputGroup className="mb-3">
										<FormControl
											type="text"
											readOnly
											name="Share Link"
											placeholder={link_here?.text}
											autoComplete="off"
											value={shareLink}
										/>
										<div className="input-group-append">
											<span
												sharelink={shareLink}
												tooltip={copy.tooltip}
												flow={copy.tooltip_flow}
												className="theme-btnbg theme-secondary lf-link-cursor input-group-text copy-button"
												onClick={() =>
													navigator.clipboard.writeText(shareLink).then(() => {
														/* successNotification('Copied to clipboard!'); */
													})
												}>
												<i className="far fa-copy"></i>
											</span>
										</div>
									</InputGroup>
								</div>
								<div className="form-group mt-4">
									<a
										href={shareLink}
										download
										target="_blank"
										className="lf-main-button  ps-md-2 px-0 px-md-2 pointer"
										style={{ color: '#fff' }}>
										{' '}
										<i className="fas fa-download me-2"></i>
										{download_file?.text}
									</a>
								</div>
							</div>
						</div>
					)}

					{loading && <><Loading /></>}
				</Modal.Body>
			</Modal>
		</>
	);
}

export default GenerateReport;
