import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
	Modal,
	Form,
	Button,
	InputGroup,
	FormControl,
	Dropdown,
	OverlayTrigger,
	Spinner,
} from 'react-bootstrap';
import Layout from '../../components/layout';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { 
	getSiteLanguageData, 
	sweetAlert,
	// findSum,
	// vol_polygon_t
} from '../../commons';
import { getParameterByName } from '../../helper';
import { GET_ALL_MATERIAL_LIST, GET_PROJECT_DETAILS, GET_SINGLE_PO_DETAILS, GET_VENDOR_LIST } from '../../store/actions/actionType';
import {
	createStoreRoomPO,
	getAllMaterialList,
	updateStoreRoomPO,
	getSinglePoDDetails,
	deliverdStoreRoomPoOrder
} from '../../store/actions/storeroom';
import {
	setLightBoxImageData,
	setLightBoxImageDefaultUrl,
	toggleLightBoxView,
} from '../../store/actions/imageLightBox';
import { unlockReport, downloadPurcheseReport } from '../../store/actions/report';
import { addVendor, getProjectDetails, getVendorsList } from '../../store/actions/projects';
import CustomSelect from '../../components/SelectBox';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import InvoicePhoto from './InvoicePhoto';
import GeneralAttachment from './GeneralAttachment';
import Signature from '../../components/signature';
import ShareFile from '../../components/shareFile';
import Nodata from '../../components/nodata';
import TextareaAutosize from 'react-textarea-autosize';
import CreateNewMaterial from './createNewMaterial';
import { successNotification } from '../../commons/notification';

function PurchaseOrder(props) {
	const userId = getUserId();
	const navigate = useNavigate();
	const [isFill, setIsFill] = useState(window.location.pathname.split("/").includes("fill_po"));
	const { project_id, store_room_id, store_room_log_date, order_id } = useParams();
	const reportName = getParameterByName('name');
	const dispatch = useDispatch();
	const [selectedMaterial, handleSelectedMaterial] = useState([]);
	const [url, setSignatureUrl] = useState('');
	const [materialSearch, setMaterialSearch] = useState('');
	const [showShareModel, setShowShareModel] = useState(false);
	const [shareLink, setShareLink] = useState('');
	const [info, setInfo] = useState({
		_id: order_id ? order_id : null,
		user_id: userId,
		project_id: project_id,
		store_room_id: store_room_id,
		order_no: '',
		vendor: '',
		notes: '',
		company_name: '',
		contact_name: '',
		address: '',
		email: '',
		mobile_number: '',
		date_of_order: moment(new Date()).format('YYYY-MM-DD'),
		expected_delivery_date: moment(new Date()).format('YYYY-MM-DD'),
		delivery_date: '',
		items: [],
		terms_and_conditions: '',
		sub_total:0,
		tax: 0,
		freight_charges: 0,
		other_charges: 0,
		total: 0,
		invoice_image: '',
		invoice_no: ''
	});
	const [isLoading, setIsLoading] = useState(false);

	const projectDetails = useSelector((state) => {
		return state?.project?.GET_PROJECT_DETAILS?.result || {};
	});

	const materialData = useSelector((state) => {
		return state?.storeroom?.[GET_ALL_MATERIAL_LIST]?.result || [];
	});

	const materials = materialData?.map((tl) => {
		return { label: tl.type, value: tl._id };
	});

	const vendorList = useSelector((state) => {
		return state?.project?.[GET_VENDOR_LIST]?.result || [];
	});

	const poData = useSelector((state)=>state?.storeroom?.[GET_SINGLE_PO_DETAILS]?.result || []);
	const lightBoxView = useSelector((state) => {
		return state?.image_lightbox?.LIGHTBOX_VIEW_STATUS || [];
	});
	useEffect(() => {
		dispatch(getVendorsList(project_id));
		dispatch(getProjectDetails(project_id, userId));
		if(order_id){
			dispatch(getSinglePoDDetails(order_id, (pD)=>{
				handleChangeMaterial(pD?.storeroomorderdetails?.map((m) => {
					return { material_id: m.material_id, quantity: m.quantity, order_unit_rate: m.order_unit_rate, received_quantity: m.received_quantity };
				}));				
			}));
		}else{

		}
	}, [order_id, dispatch, project_id, userId]);

	useEffect(()=>{
		if(poData && poData._id && order_id) setInfoState();
	},[poData, order_id]);

	const setInfoState = () => {
		setInfo({
			_id: poData._id,
			user_id: poData.user_id,
			project_id: poData.project_id,
			store_room_id: poData.store_room_id,
			order_no: poData.order_no,
			vendor: poData.vendor_id,
			notes: poData.notes,
			company_name: poData?.vendor_data?.company_name,
			contact_name: poData?.vendor_data?.contact_name,
			address: poData?.vendor_data?.address,
			email: poData?.vendor_data?.email,
			mobile_number: poData?.vendor_data?.contact_number,
			date_of_order: moment(poData?.date_of_order).format('YYYY-MM-DD'),
			expected_delivery_date: moment(poData?.expected_delivery_date).format('YYYY-MM-DD'),
			delivery_date: '',
			items:  poData.storeroomorderdetails && Array.isArray(poData.storeroomorderdetails) ? poData.storeroomorderdetails?.map((m) => {
				return { material_id: m.material_id, quantity: m.quantity, order_unit_rate: m.order_unit_rate };
			}) : [],
			terms_and_conditions: poData?.terms_and_conditions,
			sub_total:poData?.sub_total,
			tax: poData?.tax,
			freight_charges: poData?.freight_charges,
			other_charges: poData?.other_charges,
			total: poData?.total,
			file:poData.file,
			invoice_image: poData?.invoice_image,
			invoice_no: poData?.invoice_no,
			vendor_mobile: poData?.vendor_data?.contact_number ? poData?.vendor_data?.contact_number : "",
			vendor_email: poData?.vendor_data?.email ? poData?.vendor_data?.email : "",
			vendor_address: poData?.vendor_data?.address ? poData?.vendor_data?.address : ""
		});		
	}


	useEffect(() => {
		if (materialData?.length <= 0) {
			dispatch(getAllMaterialList(project_id));
		}
	}, [materialData?.length, dispatch, project_id]);


	const handleChangeItem = (name, val, k) => {
		const arr = selectedMaterial;
		arr[k] = {
			...arr[k],
			[name]: val,
		};
		handleChangeMaterial([...arr]);
	};
	const handleDelete = (m) => {
		const newArr = selectedMaterial.filter((item) => {
			return item.material_id !== m.material_id;
		});
		handleChangeMaterial(newArr);
	};

	const handleChangeMaterial = (value) => {
		handleSelectedMaterial(value);
		let subTotal = value?.reduce((a,b)=> a+(b.order_unit_rate ? b.order_unit_rate*( isFill ? (b.received_quantity ? Number(b.received_quantity) : 0) : (b.quantity ? Number(b.quantity) : 0)) : 0),0);
		handleChange('sub_total', subTotal)
	};


	const handleChange = (name, value) => {
		setInfo({
			...info,
			[name]: value,
		});
	};

	const handleChangeVendor = (vId) => {
		let vd = vendorList?.find(v=>v._id == vId);
		let addr = vd?.address;
		let email = vd?.email;
		let mobile = vd?.contact_number;
		setInfo({
			...info,
			vendor:vId,
			vendor_address: addr ? addr : "",
			vendor_email: email ? email : "",
			vendor_mobile: mobile ? mobile : ""
		})
	}

	const handleInvoiceImage = (file) => {
		setInfo({
			...info,
			invoice_image: file
		});
	}

	const handleGeneralImage = (file) => {
		if(info.file && Array.isArray(info.file)){
			info.file.push(file);
		}else{
			info.file = [file];
		}
		setInfo({
			...info,
			'file': info.file
		});
	}

	const handleDeleteGeneralAttachment = (file) => {
		let files = info.file.filter(f=> f!=file);
		setInfo({
			...info,
			'file': files
		});
	}


	const managePoHandle = () => {
		if(info._id){
			/* const post = {
				user_id: this.userId,
				project_id: this.project_id,
				store_room_id: this.store_room_id,
				store_room_order_id: this.props?.data?._id,
				items: this.state.selectedMaterial,
				order_no: this.state.data.order_no,
				vendor: this.state.data.vendor,
				date_of_order: this.state.data.date_of_order,
				expected_delivery_date: this.state.data.expected_delivery_date,
			}; */
			const post = { 
				...info, 
				items: selectedMaterial, 
				total: (info.sub_total +  info.tax + info.other_charges + info.freight_charges) ,
				store_room_order_id: info._id
			}
			dispatch(updateStoreRoomPO(post));
		}else{
			dispatch(createStoreRoomPO({ ...info, items: selectedMaterial, total: (info.sub_total +  info.tax + info.other_charges + info.freight_charges) },(resData)=>{
				navigate(`/storeroom/${project_id}/storeRoomOrderList/${store_room_id}?store_room_log_date=${store_room_log_date}&name=${reportName}`);
			}));
		}
	}

	const setUrl = (url) => {
		setSignatureUrl(url);		
	};

	const submitStorePO = (e) => {
		e.preventDefault();
		

		if(isFill){
			dispatch(deliverdStoreRoomPoOrder({
				user_id: userId,
				store_room_order_id: info._id,
				project_id: project_id,
				store_room_id: store_room_id,
				delivery_date: moment(new Date()).format("YYYY-MM-DD"),
				items: selectedMaterial,
				signature_url: url,
				signed_by: userId,
				notes: info.notes,
				file:info.file,
				invoice_image: info.invoice_image,
				invoice_no: info.invoice_no,
				sub_total: info.sub_total,
				tax: info.tax,
				other_charges: info.other_charges,
				freight_charges: info.freight_charges,
				total: (info.sub_total +  info.tax + info.other_charges + info.freight_charges) ,
			}, (pd)=>{
				dispatch(getSinglePoDDetails(order_id, (pD)=>{
					handleChangeMaterial(pD?.storeroomorderdetails?.map((m) => {
						return { material_id: m.material_id, quantity: m.quantity, order_unit_rate: m.order_unit_rate };
					}));				
				}));
			}));			
		}
	};

	const hendleShowShereModel = () => {
		setShowShareModel(!showShareModel);
		setShareLink("")
	};
	const handleSharableLink = (data) => {
		setShareLink(data);
	}

	const handleImageViewer = (url) => {
		const images = [];
		info.file?.forEach((d) => {
			images.push({
				url: d,
			});
		});
		dispatch(setLightBoxImageData(images));
		dispatch(setLightBoxImageDefaultUrl(url));
		if(lightBoxView != true){
			dispatch(toggleLightBoxView(true));
		}
		
	};

	const handleImageViewerForInvoicePhoto = (url)=>{
		const images = [url];
		dispatch(setLightBoxImageData(images));
		dispatch(setLightBoxImageDefaultUrl(url));
		if(lightBoxView != true){
			dispatch(toggleLightBoxView(true));
		}
	}
	
	const {
		material,
		order_qty,
		btn_create_order,
		btn_unlock,
		btn_download,
		vendor_name,
		PO_No,
		invoice_no,
		expected_delivery_date,
		order_Details,
		received_qty,
		unit_rate,
		amount,
		sub_total,
		freight_charges,
		tax,
		other_charges,
		terms_Conditions,
		invoice_photo,
		general_photo,
		order_date
	} = getSiteLanguageData('storeroom');
	const { save,email,select,notes } = getSiteLanguageData('commons');
	const { address } = getSiteLanguageData('setting');
	const { total } = getSiteLanguageData('components/planbillinginfo');
	const { mobile } = getSiteLanguageData('profile');
	const { browse_for_image_n } =
	getSiteLanguageData('components/upload');
	
	return (
		<Layout>
			<div id="page-content-wrapper">
					<div className="row align-items-center lf-dashboard-toolbar">
						<div className="col-12">
							<div className="d-flex align-items-center">
								<div className="float-start d-none d-md-inline-block">
									<Link
										className="lf-common-btn"
										to={`/storeroom/${project_id}/storeRoomOrderList/${store_room_id}?store_room_log_date=${store_room_log_date}&name=${reportName}`}>
										<i className="fa fa-arrow-left" aria-hidden="true"></i>
									</Link>

								</div>
								<div className="float-start d-none d-lg-inline-block">
									<span className="lf-text-overflow-350 text-nowrap mt-1">{btn_create_order.text}</span>
								</div>	
								<div className="d-flex ms-auto float-end d-inline-block text-middle">
									{isFill ? (
										<>
											{poData.is_locked ? (
												<>
													<div className="d-flex float-start">
														<span
															className="lf-common-btn"
															onClick={() =>
																sweetAlert(
																	() =>
																		dispatch(
																			unlockReport(
																				{
																					store_room_id: store_room_id,
																					user_id: userId,
																					report_date: poData?.date_of_order,
																					project_id: project_id,
																					report_name: reportName,
																					report_id: poData._id,
																					report_type: 'StoreRoomPoOrder',
																				},
																				false,
																				(pds) => {
																					dispatch(
																						getSinglePoDDetails(order_id, (pD) => {
																							handleChangeMaterial(
																								pD?.storeroomorderdetails?.map(
																									(m) => {
																										return {
																											material_id: m.material_id,
																											quantity: m.quantity,
																											order_unit_rate:
																												m.order_unit_rate,
																											received_quantity:
																												m.received_quantity,
																										};
																									},
																								),
																							);
																						}),
																					);
																				},
																			),
																		),
																	'Store-Room Po Order',
																	'Unlock',
																)
															}>
															<i className="p-1 lf-link-cursor fas fa-unlock"></i>{' '}
															{btn_unlock.text}
														</span>
														<span
															onClick={() => {
																hendleShowShereModel();
																dispatch(
																	downloadPurcheseReport(
																		{
																			store_room_order_id: poData._id,
																			user_id: userId,
																			project_id: poData.project_id,
																			store_room_id: poData.store_room_id,
																		},
																		handleSharableLink,
																	),
																);
															}}
															className="lf-common-btn px-0">
															<i className="p-1 lf-link-cursor fas fa-download"></i>{' '}
															{btn_download.text}
														</span>
													</div>
												</>
											) : (
												<div className="d-flex float-start">
													<Signature
													type="core"
													setUrl={setUrl}
													url={url}
													signReport={submitStorePO}
												/>
												</div>
												
											)}
										</>
									) : (
										<>
										<div className="d-flex float-start">
											{info._id && (
												<span
													onClick={() => {
														hendleShowShereModel();
														dispatch(
															downloadPurcheseReport(
																{
																	store_room_order_id: poData._id,
																	user_id: userId,
																	project_id: poData.project_id,
																	store_room_id: poData.store_room_id,
																},
																handleSharableLink,
															),
														);
													}}
													className="lf-common-btn mt-1">
													<i className="p-1 lf-link-cursor fas fa-download"></i>{' '}
													{btn_download.text}
												</span>
											)}
											<Button
												className="lf-main-button"
												onClick={managePoHandle}>
												<i className="fa fa-save" aria-hidden="true"></i>{' '}
												{save.text}
											</Button>
										</div>
											
										</>
									)}
								</div>
							</div>

							{/* <div className="d-flex align-items-center">
								<span className="py-1">
									<Link
										className="lf-common-btn pe-0"
										to={`/storeroom/${project_id}/storeRoomOrderList/${store_room_id}?store_room_log_date=${store_room_log_date}&name=${reportName}`}>
										<i className="fa fa-arrow-left " aria-hidden="true"></i>
									</Link> Purchase Order
								</span>
								<h3 className="text-nowrap">{``}</h3>
							</div> */}
						</div>
					</div>
				<div className="container p-3">
					<div className="row">
						<div className="col-sm-12">
							<div className="white-box">
								<div className="row">
									<div className="col-sm-6">
										<Form.Group className="row mt-4 mb-2 align-items-center">
											<Form.Label htmlFor="Vendor Name" className="col-3">
												{vendor_name.text}
											</Form.Label>
											<div className="col-9">
												<CustomSelect
													placeholder="Vendor..."
													type="Creatable"
													moduleType="vendor_po"
													name="vendor"
													isDisabled={isFill ? isFill : false}
													fullWidth
													onChange={(e) => {
														if (e && e?.__isNew__ && e.value) {
															dispatch(
																addVendor(
																	{
																		user_id: userId,
																		project_id: project_id,
																		vendor_name: e.value,
																	},
																	(newVendor) => {
																		if(newVendor?.success){
																			successNotification(newVendor?.message)
																			dispatch(
																				getVendorsList(project_id, () => {
																					if (newVendor?.result?._id) {
																						handleChange(
																							'vendor',
																							newVendor?.result?._id,
																						);
																					}
																				}),
																			);
																		}
																		
																	},
																),
															);
														} else {
															handleChangeVendor(e.value ? e?.value : '');
														}
													}}
													isSearchable={true}
													options={vendorList?.map((v) => ({
														label: v.vendor_name,
														value: v._id,
													}))}
													controlShouldRenderValue={true}
													value={vendorList?.find((v) => v._id == info?.vendor)}
												/>
											</div>
										</Form.Group>

										<Form.Group className="row mt-4 mb-2 align-items-center">
											<Form.Label htmlFor="Address Name" className="col-3">
												{address.text}
											</Form.Label>
											<InputGroup className="col-9 w-auto flex-grow-1">
												<FormControl
													placeholder={address.text}
													aria-label="Address"
													className="py-2"
													type="text"
													name="vendor_address"
													disabled
													autoComplete="off"
													value={info.vendor_address}
													onChange={(e) => handleChange(e)}
												/>
											</InputGroup>
										</Form.Group>

										<Form.Group className="row mt-4 mb-2 align-items-center">
											<Form.Label htmlFor="Email" className="col-3">
												{email.text}
											</Form.Label>
											<InputGroup className="col-9 w-auto flex-grow-1">
												<FormControl
													placeholder={email.text}
													aria-label="Email"
													className="py-2"
													type="text"
													name="vendor_email"
													disabled
													autoComplete="off"
													value={info.vendor_email}
													onChange={(e) => handleChange(e)}
												/>
											</InputGroup>
										</Form.Group>

										<Form.Group className="row mt-4 mb-2 align-items-center">
											<Form.Label htmlFor="Mobile" className="col-3">
												{mobile.text}
											</Form.Label>
											<InputGroup className="col-9 w-auto flex-grow-1">
												<FormControl
													placeholder={mobile.text}
													aria-label="Mobile"
													className="py-2"
													type="text"
													name="vendor_mobile"
													disabled
													autoComplete="off"
													value={info.vendor_mobile}
													onChange={(e) => handleChange(e)}
												/>
											</InputGroup>
										</Form.Group>
									</div>
									<div className="col-sm-6">
										<Form.Group className="row mt-4 mb-2 align-items-center">
											<Form.Label htmlFor="PO_No" className="col-3">
												{PO_No.text}.
											</Form.Label>
											<InputGroup className="col-9 w-auto flex-grow-1">
												<FormControl
													placeholder={`Enter ${PO_No.text}.`}
													aria-label="PO No."
													className="py-2"
													type="text"
													disabled={isFill ? isFill : false}
													name="order_no"
													autoComplete="off"
													value={info.order_no}
													onChange={(e) =>
														handleChange('order_no', e.target.value)
													}
												/>
											</InputGroup>
										</Form.Group>

										{isFill && (
											<Form.Group className="row mt-4 mb-2 align-items-center">
												<Form.Label htmlFor="invoice_no" className="col-3">
													{invoice_no.text}.
												</Form.Label>
												<InputGroup className="col-9 w-auto flex-grow-1">
													<FormControl
														placeholder={`${invoice_no.text}.`}
														aria-label="Invoice No."
														className="py-2"
														type="text"
														disabled={
															poData.is_locked ? poData.is_locked : false
														}
														name="invoice_no"
														autoComplete="off"
														value={info.invoice_no}
														onChange={(e) =>
															handleChange('invoice_no', e.target.value)
														}
													/>
												</InputGroup>
											</Form.Group>
										)}

										<Form.Group className="row mt-4 mb-2 align-items-center">
											<Form.Label htmlFor="Order_Date" className="col-3">
												{order_date.text}
											</Form.Label>
											<InputGroup className="col-9 w-auto flex-grow-1">
												<DatePicker
													customInput={
														<FormControl className="lf-formcontrol-height mb-1" />
													}
													name="date_of_order"
													selected={moment(info.date_of_order).toDate()}
													dateFormat="dd-MM-yyyy"
													placeholderText="Select Date"
													disabled={isFill ? isFill : false}
													onChange={(e) =>
														handleChange(
															'date_of_order',
															moment(e).format('YYYY-MM-DD'),
														)
													}
													minDate={moment(new Date()).toDate()}
												/>
											</InputGroup>
										</Form.Group>

										<Form.Group className="row mt-4 mb-2 align-items-center">
											<Form.Label htmlFor="Address Name" className="col-3">
												{expected_delivery_date.text}
											</Form.Label>
											<InputGroup className="col-9 w-auto flex-grow-1">
												<DatePicker
													customInput={
														<FormControl className="lf-formcontrol-height" />
													}
													name="expected_delivery_date"
													selected={moment(
														info.expected_delivery_date,
													).toDate()}
													dateFormat="dd-MM-yyyy"
													placeholderText="Select date"
													disabled={isFill ? isFill : false}
													onChange={(e) =>
														handleChange(
															'expected_delivery_date',
															moment(e).format('YYYY-MM-DD'),
														)
													}
													minDate={moment(info?.date_of_order).toDate()}
												/>
											</InputGroup>
										</Form.Group>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="row">
						<div className="col-sm-7">
							<div className="row">
								<div className="col-6 pb-2">{order_Details.text}</div>
								{!isFill && (
									<div className="col-6 text-end pe-4">
										<OverlayTrigger
											trigger="click"
											placement="right-start"
											rootClose={true}
											overlay={
												<div
													className={`p-2 border ps-3`}
													style={{
														zIndex: '9999',
														width: '260px',
														maxHeight: '400px',
														height: '250px',
														overflow: 'auto',
														background: 'white',
													}}>
													<InputGroup className="toolbar-search border-bottom">
														<InputGroup.Text>
															<i className="fas fa-search"></i>
														</InputGroup.Text>
														<input
															type="text"
															className="d-block form-control bg-transparent border border-0"
															placeholder="Search"
															onBlur={(e) => setMaterialSearch(e.target.value)}
															value={materialSearch}
															onChange={(e) => {
																setMaterialSearch(e.target.value);
															}}
														/>
													</InputGroup>
													<ul
														className="p-0 material-box"
														style={{ maxHeight: '190px' }}>
														{materials
															?.filter((it) => {
																return (
																	(materialSearch &&
																		it.label
																			.toLowerCase()
																			.includes(
																				materialSearch.toLowerCase(),
																			)) ||
																	materialSearch == ''
																);
															})
															?.map((m, i) => {
																return (
																	<li key={i}>
																		<label>
																			<input
																				type="checkbox"
																				name="po_material"
																				style={{
																					verticalAlign: 'middle',
																				}}
																				onChange={(e) => {
																					if (e.target.checked) {
																						const sm = [...selectedMaterial];
																						sm.push({
																							material_id: m.value,
																							quantity: 0,
																						});
																						handleChangeMaterial(sm);
																					} else {
																						handleDelete({
																							material_id: m.value,
																							quantity: 0,
																						});
																					}
																				}}
																				checked={selectedMaterial?.some(
																					(sm) => sm.material_id === m.value,
																				)}
																			/>{' '}
																			{m.label}
																		</label>
																	</li>
																);
															})}
													</ul>
													{/* <CreateNewMaterial><div className='text-center pointer font-bold theme-color'>+ Add</div></CreateNewMaterial> */}
													{/* <div className='text-center'>
															<CreateNewMaterial><span className='text-center pointer font-bold theme-color'>+ Material</span></CreateNewMaterial> | <CreateNewUnit><span className='text-center pointer font-bold theme-color'>+ Unit</span></CreateNewUnit>
														</div> */}

													{/* this one is old code <div
														style={{
															zIndex: '9999',
															width: '150px',
															maxHeight: '200px',
															overflow: 'auto',
															background: 'white',
														}}
														className="p-2 border">
														<ul className="p-0">
															{materials?.map((m, i) => {
																return (
																	<li key={i}>
																		<input
																			type="checkbox"
																			name="po_material"
																			onChange={(e) => {
																				if (e.target.checked) {
																					const sm = [...selectedMaterial];
																					sm.push({
																						material_id: m.value,
																						quantity: 0,
																					});
																					handleChangeMaterial(sm);
																				} else {
																					handleDelete({
																						material_id: m.value,
																						quantity: 0,
																					});
																				}
																			}}
																			checked={selectedMaterial?.some(
																				(sm) => sm.material_id === m.value,
																			)}
																		/>{' '}
																		{m.label}
																	</li>
																);
															})}
														</ul>
													</div> */}
												</div>
											}>
											<span className="theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold">
												{select.text}
											</span>
										</OverlayTrigger>
										<span className="px-2 theme-secondary">|</span>
										<CreateNewMaterial />
									</div>
								)}
							</div>
							<div
								className={` ${
									selectedMaterial &&
									Array.isArray(selectedMaterial) &&
									selectedMaterial.length > 0
										? 'white-box'
										: ''
								}`}>
								{selectedMaterial &&
								Array.isArray(selectedMaterial) &&
								selectedMaterial.length > 0 ? (
									<>
										<div className="row">
											<div className="col-12">
												<table className="table table-hover table-sm">
													<thead>
														<tr className="border-0">
															{!isFill && (
																<th className="lfwpr-3 border-0 text-start"></th>
															)}
															<th className="col-3 border-0">
																{material?.text}
															</th>
															<th className="col-2 border-0">
																{order_qty?.text}
															</th>
															{isFill && (
																<th className="col-2 border-0">
																	{received_qty.text}.
																</th>
															)}
															<th className="col-2 border-0">
																{unit_rate.text}
															</th>
															<th className="col-2 border-0 text-end">
																{amount.text}
															</th>
														</tr>
													</thead>
													<tbody className="border-0">
														{selectedMaterial?.map((ml, k) => {
															return (
																<tr key={k} className="col-12  ">
																	{!isFill && (
																		<td className="text-secondary text-start align-middle border-0">
																			<span className="">
																				<i
																					className="theme-bgcolor fas fa-trash-alt lf-link-cursor"
																					onClick={() => handleDelete(ml)}></i>
																			</span>
																		</td>
																	)}
																	<td className="border-0">
																		<CustomSelect
																			menuPlacement="top"
																			placeholder={`${material?.text}...`}
																			name="material_id"
																			isDisabled={isFill}
																			onChange={(e) =>
																				handleChangeItem(
																					'material_id',
																					e.value,
																					k,
																				)
																			}
																			options={materials}
																			value={materials?.filter(
																				(m) =>
																					String(m.value) ===
																					String(ml.material_id),
																			)}
																		/>
																	</td>
																	<td className="border-0">
																		<InputGroup className="lf-formcontrol-height">
																			<FormControl
																				type="number"
																				pattern="[0-9]"
																				autoComplete="off"
																				disabled={isFill}
																				onChange={(e) =>
																					handleChangeItem(
																						'quantity',
																						e.target.value,
																						k,
																					)
																				}
																				value={ml?.quantity}
																				placeholder={'Quantity'}
																				required
																			/>
																		</InputGroup>
																	</td>
																	{isFill && (
																		<td className="border-0">
																			<InputGroup className="lf-formcontrol-height">
																				<FormControl
																					type="number"
																					pattern="[0-9]"
																					autoComplete="off"
																					disabled={poData.is_locked}
																					onChange={(e) =>
																						handleChangeItem(
																							'received_quantity',
																							Number(e.target.value),
																							k,
																						)
																					}
																					value={ml.received_quantity}
																					placeholder={'Quantity'}
																					required
																				/>
																			</InputGroup>
																		</td>
																	)}

																	<td className="border-0">
																		<InputGroup className="lf-formcontrol-height">
																			<FormControl
																				type="number"
																				pattern="[0-9]"
																				autoComplete="off"
																				name="order_unit_rate"
																				disabled={isFill}
																				onChange={(e) =>
																					handleChangeItem(
																						'order_unit_rate',
																						e.target.value,
																						k,
																					)
																				}
																				value={ml?.order_unit_rate}
																				placeholder={'Unit Rate'}
																				required
																			/>
																		</InputGroup>
																	</td>

																	<td className="border-0">
																		<InputGroup className="lf-formcontrol-height">
																			<FormControl
																				type="number"
																				className="text-end"
																				pattern="[0-9]"
																				autoComplete="off"
																				name="order_amount"
																				disabled
																				value={Number(
																					(ml.order_unit_rate
																						? ml.order_unit_rate
																						: 0) *
																						(isFill
																							? ml.received_quantity
																								? Number(ml.received_quantity)
																								: 0
																							: ml.quantity),
																				).toFixed(2)}
																				placeholder={'Unit Rate'}
																				required
																			/>
																		</InputGroup>
																	</td>
																</tr>
															);
														})}
														<tr className="text-end">
															<td
																className="border-0 border-top border-light align-middle"
																colSpan={4}>
																{sub_total.text}
															</td>
															<td className="border-0 border-top border-light">
																<FormControl
																	type="number"
																	className="text-end"
																	pattern="[0-9]"
																	disabled
																	autoComplete="off"
																	name="sub_total"
																	onChange={(e) =>
																		handleChange(
																			'sub_total',
																			Number(e.target.value),
																		)
																	}
																	placeholder={'Sub total'}
																	required
																	value={Number(info.sub_total).toFixed(2)}
																/>
															</td>
														</tr>
														<tr className="text-end">
															<td className="border-0 align-middle" colSpan={4}>
																{tax.text}
															</td>
															<td className="border-0">
																<FormControl
																	type="number"
																	pattern="[0-9]"
																	autoComplete="off"
																	name="tax"
																	className="text-end"
																	disabled={poData.is_locked}
																	onChange={(e) =>
																		handleChange('tax', Number(e.target.value))
																	}
																	placeholder={tax.text}
																	required
																	value={Number(info?.tax)}
																/>
															</td>
														</tr>
														<tr className="text-end">
															<td className="border-0 align-middle" colSpan={4}>
																{freight_charges.text}
															</td>
															<td className="border-0">
																<FormControl
																	type="number"
																	pattern="[0-9]"
																	autoComplete="off"
																	name="freight_charges"
																	className="text-end"
																	disabled={poData.is_locked}
																	onChange={(e) =>
																		handleChange(
																			'freight_charges',
																			Number(e.target.value),
																		)
																	}
																	placeholder={'Freight Charges'}
																	required
																	value={Number(info?.freight_charges)}
																/>
															</td>
														</tr>
														<tr className="text-end">
															<td className="border-0 align-middle" colSpan={4}>
																{other_charges.text}
															</td>
															<td className="border-0">
																<FormControl
																	type="number"
																	pattern="[0-9]"
																	autoComplete="off"
																	name="other_charges"
																	className="text-end"
																	disabled={poData.is_locked}
																	onChange={(e) =>
																		handleChange(
																			'other_charges',
																			Number(e.target.value),
																		)
																	}
																	placeholder={other_charges.text}
																	required
																	value={Number(info?.other_charges)}
																/>
															</td>
														</tr>

														<tr className="text-end">
															<td className="border-0 align-middle" colSpan={4}>
																{total.text}
															</td>
															<td className="border-0">
																<FormControl
																	type="number"
																	pattern="[0-9]"
																	autoComplete="off"
																	name="total"
																	className="text-end"
																	disabled
																	onChange={(e) =>
																		handleChange(
																			'total',
																			Number(e.target.value),
																		)
																	}
																	placeholder={'Other Charges'}
																	required
																	value={Number(
																		info.sub_total +
																			info.tax +
																			info.other_charges +
																			info.freight_charges,
																	).toFixed(2)}
																/>
															</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>
									</>
								) : (
									<div className="white-box">
										<div className="col-sm-12">
											<div className="text-center main-area">
												<img
													alt="livefield"
													src="/images/projects/nodata.png"
													className="image-max-full mb-4"
													style={{ maxHeight: '200px' }}
												/>
												<h3 className="mt-2">
													Hey, Currently you haven't added Material.
												</h3>
												<h5 className="text-muted my-2 mb-4">
													Please add Material and explore the functionality
												</h5>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>

						<div className="col-sm-5">
							{!isFill ? (
								<>
									<div className="row">
										<div className="col-6 pb-2">{terms_Conditions.text}</div>
									</div>
									<div className="">
										<div className="row">
											<div className="col-12">
												<TextareaAutosize
													minRows={3}
													maxRows={15}
													className="w-100 p-3"
													autoComplete="off"
													name="terms_and_conditions"
													onChange={(e) =>
														handleChange('terms_and_conditions', e.target.value)
													}
													placeholder={`Enter ${terms_Conditions.text}`}
													required
													value={info.terms_and_conditions}
												/>
											</div>
										</div>
									</div>
								</>
							) : (
								<>
									<div className="row">
										<div className="col-6 pb-2">{notes.text}</div>
									</div>
									<div className="">
										<div className="row">
											<div className="col-12">
												<TextareaAutosize
													minRows={3}
													className="w-100 p-3"
													maxRows={15}
													autoComplete="off"
													name="notes"
													disabled={poData.is_locked}
													onChange={(e) =>
														handleChange('notes', e.target.value)
													}
													placeholder={notes.text}
													required
													value={info.notes}
												/>
											</div>
										</div>
									</div>

									<div className="row mt-4">
										<div className="col-4">
											<div className="pb-2">{invoice_photo.text}</div>
											<div className="white-box p-3">
												{info.invoice_image ? (
													<div className="position-relative">
														<img
															className="w-100"
															src={info.invoice_image}
															onClick={() =>
																handleImageViewerForInvoicePhoto({
																	url: info.invoice_image,
																})
															}
															style={{ maxHeight: '81px' }}
														/>
														{!poData.is_locked && (
															<span
																className="text-center pointer"
																onClick={() => {
																	handleChange('invoice_image', '');
																}}
																style={{
																	position: 'absolute',
																	top: '0',
																	width: '20px',
																	backgroundColor: '#495057',
																	borderRadius: '10px',
																	right: 0,
																}}>
																<i className="fas fa-close text-danger"></i>
															</span>
														)}
													</div>
												) : poData.is_locked ? (
													'No photo'
												) : (
													<InvoicePhoto
														setInvoiceImage={handleInvoiceImage}
														isLoading={isLoading}
														setIsLoading={setIsLoading}
													/>
												)}
											</div>
										</div>
										<div className="col-8">
											<div className="d-flex">
												<div className="w-50 pb-2">{general_photo.text}</div>
												{!poData.is_locked && (
													<div className="w-50">
														<div className="pe-2 text-end">
															<span>
																<GeneralAttachment
																	setGeneralImage={handleGeneralImage}
																	isLoading={isLoading}
																	setIsLoading={setIsLoading}
																/>
															</span>
														</div>
													</div>
												)}
											</div>

											<div className="white-box p-3" style={{ height: '70%' }}>
												{info.file &&
												Array.isArray(info.file) &&
												info.file.length ? (
													<div className="positio-relative">
														{info.file?.map((f) => {
															return (
																<>
																	<img
																		alt="livefield"
																		src={f}
																		className=""
																		onClick={() =>
																			handleImageViewer({
																				url: f,
																			})
																		}
																		style={{ width: '40px', height: '40px' }}
																	/>
																	{!poData.is_locked && (
																		<i
																			className="fas fa-times fa-xs lf-icon text-primary"
																			onClick={() =>
																				handleDeleteGeneralAttachment(f)
																			}></i>
																	)}
																</>
															);
														})}
													</div>
												) : (
													<div className="d-flex align-items-center justify-content-center lf-dull-color h-100">
														<div className="me-2">
															<i className="fas fa-upload fa-2x mt-2" />
														</div>
														<div className="ps-2">
															<div className="fs-4 text-center">
																{isLoading
																	? 'Loading...'
																	: browse_for_image_n.text}
															</div>
														</div>
													</div>
												)}
											</div>
										</div>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>

			<ShareFile
				open={showShareModel}
				shareLink={shareLink}
				handleClose={hendleShowShereModel}
			/>
		</Layout>
	);
}
export default PurchaseOrder;
