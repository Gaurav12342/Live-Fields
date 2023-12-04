import Layout from '../../components/layout';
import {
	InputGroup,
	FormControl,
	Form,
	Button,
	Card,
	Modal,
	Table,
} from 'react-bootstrap';
import { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
	createEquipment,
	createLabour,
	createTag,
	deleteEquipment,
	deleteLabour,
	deleteTags,
	getAllEquipmentList,
	getAllLabourList,
	getAllTags,
	getProjectDetails,
	updateEquipment,
	updateLabour,
	updateProjectSetting,
	updateCompanyProjectSetting,
	updateTags,
	getArchiveTaskTimeList,
	projectLogoUpload,
	archiveUnarchiveProject,
	getVendorsList,
	addVendor,
	updateVendor,
	deleteVendor,
} from '../../store/actions/projects';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import TimeZones from '../../commons/Timezone.json';
import Currency from '../../commons/Currency.json';
import CustomSelect from '../../components/SelectBox';
import Template from './template';
import {
	GET_ALL_EQUIPMENT_LIST,
	GET_ALL_LABOUR_LIST,
	GET_ALL_MATERIAL_LIST,
	GET_ALL_TAGS,
	GET_ALL_UNIT_BY_PROJECT_ID,
	GET_CATEGORY_LIST,
	GET_LOCATION_LIST,
	GET_VENDOR_LIST,
} from '../../store/actions/actionType';
import {
	createlocation,
	CreateTaskCategory,
	deleteCategory,
	deleteLocation,
	GetCategoryList,
	getLocationList,
	updatelocation,
	updateTaskCategory,
} from '../../store/actions/Task';
import {
	createUnit,
	deleteMaterial,
	deleteUnit,
	getAllMaterialList,
	getAllUnitByProjectId,
	updateMaterial,
	updateUnit,
} from '../../store/actions/storeroom';
import AddMaterial from '../Material/Components/addMaterial';
import Nodata from '../../components/nodata';

function Projectsetting(props) {
	const navigate = useNavigate();
	const userId = getUserId();
	const dispatch = useDispatch();
	const { project_id } = useParams();
	const [archiveTaskTime, setArchiveTaskTime] = useState([]);
	const [projectLogo, setProjectLogo] = useState('');
	const [categoryModel, setCategoryModel] = useState(false);
	const [locationModel, setLocationModel] = useState(false);
	const [tagsModel, setTagsModel] = useState(false);
	const [materialModel, setMaterialModel] = useState(false);
	const [labourModel, setLabourModel] = useState(false);
	const [equipmentModel, setEquipmentModel] = useState(false);
	const [unitModel, setUnitModel] = useState(false);
	const [templateModel, setTemplateModel] = useState(false);
	const [vendorModel, setVendorModel] = useState(false);

	const [searchCategory, setSearchCategory] = useState('');
	const [searchLocation, setSearchLocation] = useState('');
	const [searchTags, setSearchTags] = useState('');
	const [searchMaterial, setSearchMaterial] = useState('');
	const [searchLabour, setSearchLabour] = useState('');
	const [searchEquipment, setSearchEquipment] = useState('');
	const [searchUnit, setSearchUnit] = useState('');

	const projectDetails = useSelector((state) => {
		return state?.project?.GET_PROJECT_DETAILS?.result || {};
	});

	const vendorList = useSelector((state) => {
		return state?.project?.GET_VENDOR_LIST?.result || {};
	});

	useEffect(() => {
		if (!projectDetails?._id) {
			dispatch(getProjectDetails(project_id, userId));

			dispatch(
				getArchiveTaskTimeList((data) => {
					if (data && Array.isArray(data) && data.length > 0) {
						setArchiveTaskTime(
							data.map((item) => {
								return { value: item, label: item };
							}),
						);
					} else {
						setArchiveTaskTime([]);
					}
				}),
			);
		}
		dispatch(getVendorsList(project_id));
	}, []);
	const [editLocation, setEditLocation] = useState(null);
	const [editCategory, setEditCategory] = useState(null);
	const [categoryHiden, setCategoryHiden] = useState(null);
	const [edittags, setEdittags] = useState(null);
	const [editUnit, setEditUnit] = useState(null);
	const [editLabour, setEditLabour] = useState(null);
	const [editMaterial, setEditMaterial] = useState(null);
	const [editEquipment, setEditEquipment] = useState(null);
	const [infoCategoryAndLocation, setInfoCategoryAndLocation] = useState({
		user_id: userId,
		project_id: project_id,
		name: '',
		unit: '',
	});
	const [vendorFormShow, setvendorFormShow] = useState(false);
	const [vendorFormData, setVendorFormData] = useState({});

	const [inputData, setInputData] = useState({});

	const tags = useSelector((state) => {
		return state?.project?.[GET_ALL_TAGS]?.result || [];
	});
	useEffect(() => {
		if (tags?.length <= 0) {
			dispatch(getAllTags(project_id));
		}
	}, [tags?.length, dispatch]);
	const project_locations = useSelector(
		(state) => state?.task?.[GET_LOCATION_LIST]?.result || [],
		shallowEqual,
	);
	useEffect(() => {
		dispatch(getLocationList(project_id, userId));
	}, []);
	const materialData = useSelector((state) => {
		return state?.storeroom?.[GET_ALL_MATERIAL_LIST]?.result || [];
	});
	useEffect(() => {
		if (materialData?.length <= 0) {
			dispatch(getAllMaterialList(project_id));
		}
	}, [materialData?.length, dispatch]);
	const labourData = useSelector((state) => {
		return state?.project?.[GET_ALL_LABOUR_LIST]?.result || [];
	});
	useEffect(() => {
		if (labourData?.length <= 0) {
			dispatch(getAllLabourList(project_id));
		}
	}, [labourData?.length, dispatch]);
	const unit = useSelector((state) => {
		return state?.storeroom?.[GET_ALL_UNIT_BY_PROJECT_ID]?.result || [];
	});
	useEffect(() => {
		if (unit?.length <= 0) {
			dispatch(getAllUnitByProjectId(project_id));
		}
	}, [unit?.length, dispatch]);
	const equipmentData = useSelector((state) => {
		return state?.project?.[GET_ALL_EQUIPMENT_LIST]?.result || [];
	});
	useEffect(() => {
		if (equipmentData?.length <= 0) {
			dispatch(getAllEquipmentList(project_id));
		}
	}, [equipmentData?.length, dispatch]);

	const category = useSelector((state) => {
		return state?.task?.[GET_CATEGORY_LIST]?.result || [];
	});
	useEffect(() => {
		if (category?.length <= 0) {
			dispatch(GetCategoryList(project_id, userId));
		}
	}, [category?.length, dispatch]);

	const handleCategoryModel = () => setCategoryModel(!categoryModel);
	const handleLocationModel = () => setLocationModel(!locationModel);
	const handleTagsModel = () => setTagsModel(!tagsModel);
	const handleMaterialsModel = () => setMaterialModel(!materialModel);
	const handleLaboursModel = () => setLabourModel(!labourModel);
	const handleEquipmentsModel = () => setEquipmentModel(!equipmentModel);
	const handleUnitsModel = () => setUnitModel(!unitModel);
	const handleTemplateModel = () => setTemplateModel(!templateModel);

	const handleVendorModel = () => setVendorModel(!vendorModel);
	const handleFormData = (e) => {
		setVendorFormData({
			...vendorFormData,
			[e.target.name]: e.target.value,
		});
	};

	const [project, setProject] = useState({
		user_id: userId,
		project_id: project_id,
		name: '',
		code: '',
		address: '',
		timezone: '',
		currency: '',
		manpower_unit: '',
		archive_task_time: '',
		logo: '',
	});
	const submitTags = (tags) => {
		const post = {
			project_id: project_id,
			tag_id: tags._id,
			name: tags?.name,
			user_id: userId,
		};
		dispatch(updateTags(post));
	};
	const submitUnit = (unit) => {
		const post = {
			project_id: project_id,
			unit_id: unit._id,
			unit: unit?.name,
			user_id: userId,
		};
		dispatch(updateUnit(post));
	};
	const submitEquipment = (equipment) => {
		const post = {
			project_id: project_id,
			equipment_id: equipment._id,
			name: equipment?.name,
			user_id: userId,
		};
		dispatch(updateEquipment(post));
	};
	const submitLabour = (labour) => {
		const post = {
			project_id: project_id,
			labour_id: labour._id,
			name: labour?.name,
			user_id: userId,
		};
		dispatch(updateLabour(post));
	};
	const submitLocation = (location) => {
		const post = {
			user_id: userId,
			project_id: project_id,
			location_id: location?._id,
			name: location?.name,
		};
		dispatch(updatelocation(post));
	};
	const submitCategory = (cat) => {
		const post = {
			user_id: userId,
			project_id: project_id,
			category_id: cat?._id,
			name: cat?.name,
		};
		dispatch(updateTaskCategory(post));
	};
	const handleChangeCategory = (name, value) => {
		setInfoCategoryAndLocation({
			...infoCategoryAndLocation,
			[name]: value,
		});
	};
	const handleLogoChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('module_key', project_id);
			formData.append('module_type', 'project_logo');
			dispatch(
				projectLogoUpload(formData, (data) => {
					if (data) {
						setProjectLogo(data);
						setProject({
							...project,
							logo: data,
						});
					}
				}),
			);
		}
	};

	const deleteLogo = () => {
		setProjectLogo('');
		setProject({
			...project,
			logo: '',
		});
	};

	const createInfo = () => {
		if (categoryHiden === 'category') {
			dispatch(CreateTaskCategory(infoCategoryAndLocation));
		} else if (categoryHiden === 'location') {
			dispatch(createlocation(infoCategoryAndLocation));
		} else if (categoryHiden === 'tags') {
			dispatch(createTag(infoCategoryAndLocation));
		} else if (categoryHiden === 'labour') {
			dispatch(createLabour(infoCategoryAndLocation));
		} else if (categoryHiden === 'equipment') {
			dispatch(createEquipment(infoCategoryAndLocation));
		} else if (categoryHiden === 'unit') {
			dispatch(createUnit(infoCategoryAndLocation));
		}
		setInfoCategoryAndLocation({
			...infoCategoryAndLocation,
			name: '',
			unit: '',
		});
	};

	const handleChange = useCallback(
		(e) => {
			const name = e.target.name;
			const value = e.target.value;
			setProject({
				...project,
				[name]: value,
			});
		},
		[project],
	);
	const updateProject = useCallback(
		(e) => {
			e.preventDefault();
			const post = {
				user_id: userId,
				project_id: project_id,
				name: project?.name,
				code: project?.code,
				address: project?.address,
				timezone: project?.timezone,
				currency: project?.currency,
				manpower_unit: project?.manpower_unit,
				date_formate: project?.date_formate,
				archive_task_time: project?.archive_task_time,
				logo: project?.logo,
			};
			dispatch(updateProjectSetting(post));
		},
		[project, dispatch],
	);
	useEffect(() => {
		if (
			[
				'name',
				'code',
				'address',
				'timezone',
				'currency',
				'manpower_unit',
			].every((p) => project[p] === '' && projectDetails?._id)
		) {
			setProjectLogo(projectDetails?.logo);
			setProject({
				user_id: userId,
				project_id: project_id,
				name: projectDetails?.name,
				code: projectDetails?.code,
				address: projectDetails?.address,
				timezone: projectDetails?.timezone,
				currency: projectDetails?.currency,
				manpower_unit: projectDetails?.manpower_unit,
				date_formate: projectDetails?.date_formate,
				archive_task_time: projectDetails?.archive_task_time,
				logo: projectDetails?.logo,
				is_archived: projectDetails?.is_archived,
				company_name: projectDetails?.company_name,
				company_address: projectDetails?.company_address,
				gstin: projectDetails?.gstin,
				company_email: projectDetails?.company_email,
				company_mobile: projectDetails?.company_mobile,
			});
		}
	}, [projectDetails, project]);

	const saveVendor = () => {
		if (vendorFormData._id) {
			let postData = {
				...vendorFormData,
				user_id: userId,
			};
			dispatch(
				updateVendor(postData, () => {
					dispatch(getVendorsList(project_id));
					setVendorFormData({
						project_id,
						user_id: userId,
					});
					setvendorFormShow(false);
				}),
			);
		} else {
			let postData = {
				...vendorFormData,
				project_id,
				user_id: userId,
			};
			dispatch(
				addVendor(postData, () => {
					dispatch(getVendorsList(project_id));
					setVendorFormData({
						project_id,
						user_id: userId,
					});
					setvendorFormShow(false);
				}),
			);
		}
	};

	const deleteVendorHandle = (vD) => {
		let deleteData = {
			_id: vD._id,
			user_id: userId,
			project_id: vD.project_id,
		};
		if (deleteData._id) {
			dispatch(
				deleteVendor(deleteData, () => {
					dispatch(getVendorsList(project_id));
					setVendorFormData({
						project_id,
						user_id: userId,
					});
					setvendorFormShow(false);
				}),
			);
		}
	};

	const updateProjectCompany = () => {
		let post = {
			user_id: userId,
			project_id: project_id,
			company_name: project?.company_name,
			company_address: project?.company_address,
			gstin: project?.gstin,
			company_email: project?.company_email,
			company_mobile: project?.company_mobile,
		};
		dispatch(updateCompanyProjectSetting(post));
	};

	const scrollDownById = (id) => {
		const element = document.getElementById(id);
		setTimeout(() => {
			element.scrollTop = element.scrollHeight + 40;
		}, 1000);
	};
	// if (!projectDetails?.length && projectDetails?.length !== 0) {
	//   return <Loading />
	// }
	const {
		icon_delete,
		icon_edit,
		add_Location,
		add_category,
		add_Tags,
		add_Laborur,
		add_Equipment,
		add_Unit,
		project_settings,
		setting_list,
		project_name,
		project_code,
		address,
		timezone,
		currency,
		manpower_unit,
		date_format,
		archive_task_time,
		project_logo,
		category_name,
		manage_category,
		Location,
		manage_localtion,
		tags_name,
		manage_tags,
		material,
		manage_material,
		laborur,
		manage_labour,
		equipment,
		manage_equipment,
		setting_name,
		dashboard,
		unit_name,
		manage_unit,
		manage_vendor,
		template,
		manage_template,
		remove,
		remove_logo,
		company_setting,
		company_name,
		company_address,
		GSTIN,
		company_email,
		company_mobile,
		search_category,
		search_tags,
		enter_tag,
		search_material,
		search_labour,
		labour_name,
		equipment_name,
		search_unit,
		unit_name_text,
		location_name,
		vendor_name,
		contact_names
	} = getSiteLanguageData('setting');

	const { save, email } = getSiteLanguageData('profile');
	const { close } = getSiteLanguageData('commons');
	const { archive_project, unarchive_project, archive, project_text } =
		getSiteLanguageData('projects');

	const { contact_number } = getSiteLanguageData('components/planbillinginfo');
	const { vendor } = getSiteLanguageData('storeroom');
	return (
		<Layout>
			<div id="page-content-wrapper">
				<div className="container p-5">
					<div className="row">
						<div className="col-sm-12">
							<div className="row">
								<div className="col-lg-9 col-md-9">
									<div className="col-12 white-box">
										<div className="row border-bottom">
											<div className="col-6">
												<label className="white-box-label">
													{project_settings?.text}
												</label>
											</div>
											<div className="col-6 text-end d-none d-sm-block">
												<button
													onClick={() =>
														sweetAlert(
															() =>
																dispatch(
																	archiveUnarchiveProject({
																		user_id: userId,
																		project_id: project_id,
																		is_archive: !project?.is_archived,
																	}),
																),
															project_text.text,
															!project?.is_archived
																? archive.text
																: unarchive_project.text,
															(data) => navigate(`/projects`),
														)
													}
													className="btn btn-block theme-btn">
													<i class="fa fa-archive pe-2	"></i>
													{!project?.is_archived
														? archive_project.text
														: unarchive_project?.text}
												</button>
											</div>
										</div>

										<Form>
											<Form.Group className="row my-3 align-items-center">
												<Form.Label htmlFor="Project Name" className="col-sm-12 col-md-4 col-lg-2">
													{project_name?.text}
												</Form.Label>
												<InputGroup className="col-sm-12 col-md-8 col-lg-10 w-auto flex-grow-1">
													<FormControl
														placeholder="Project Name"
														aria-label="Recipient's Project Name"
														className="py-2"
														type="text"
														name="name"
														autoComplete="off"
														// value={project?.name}
														onChange={(e) => handleChange(e)}
														value={project.name}
													/>
												</InputGroup>
											</Form.Group>
											<Form.Group className="row my-3 align-items-center">
												<Form.Label htmlFor="Project Code" className="col-sm-12 col-md-4 col-lg-2">
													{project_code?.text}
												</Form.Label>
												<InputGroup className="col-sm-12 col-md-8 col-lg-10 w-auto flex-grow-1">
													<FormControl
														placeholder="Project Code"
														aria-label="Recipient's Project Code"
														type="text"
														name="code"
														autoComplete="off"
														onChange={(e) => handleChange(e)}
														value={project.code}
													/>
												</InputGroup>
											</Form.Group>
											<Form.Group className="row my-3 align-items-center">
												<Form.Label htmlFor="Address" className="col-sm-12 col-md-4 col-lg-2">
													{address?.text}
												</Form.Label>
												<InputGroup className="col-sm-12 col-md-8 col-lg-10 w-auto flex-grow-1">
													<FormControl
														placeholder={address?.text}
														aria-label="Recipient's Address"
														as="textarea"
														name="address"
														autoComplete="off"
														onChange={(e) => handleChange(e)}
														value={project.address}
													/>
												</InputGroup>
											</Form.Group>
											<Form.Group className="row my-3 align-items-center">
												<Form.Label htmlFor="Timezone" className="col-sm-12 col-md-4 col-lg-2">
													{timezone?.text}{' '}
												</Form.Label>

												<CustomSelect
													name="timezone"
													className="col-sm-12 col-md-8 col-lg-10"
													onChange={(e) => {
														handleChange({
															target: {
																name: 'timezone',
																value: e.value,
															},
														});
													}}
													value={{
														label: project?.timezone
															? TimeZones.timezones.find(
																	(t) => t.value == project.timezone,
															  )?.text
															: project.timezone,
														value: project.timezone,
													}}
													options={TimeZones.timezones.map((t) => {
														return {
															value: t.value,
															label: t.text,
														};
													})}
												/>
											</Form.Group>
											<Form.Group className="row my-3 align-items-center">
												<Form.Label htmlFor="Currency" className="col-sm-12 col-md-4 col-lg-2">
													{currency?.text}
												</Form.Label>
												<CustomSelect
													name="currency"
													className="col-sm-12 col-md-8 col-lg-10"
													onChange={(e) => {
														handleChange({
															target: {
																name: 'currency',
																value: e.value,
															},
														});
													}}
													value={{
														label: project.currency,
														value: project.currency,
													}}
													options={Currency.currency.map((c) => {
														return {
															value: c.name,
															label: `${c.name} - ${c.code}`,
														};
													})}
												/>
											</Form.Group>
											<Form.Group className="row my-3 align-items-center">
												<Form.Label htmlFor="Manpower Unit" className="col-sm-12 col-md-4 col-lg-2">
													{manpower_unit?.text}
												</Form.Label>
												<CustomSelect
													name="manpower_unit"
													className="col-sm-12 col-md-8 col-lg-10"
													onChange={(e) => {
														handleChange({
															target: {
																name: 'manpower_unit',
																value: e.value,
															},
														});
													}}
													value={{
														label: project.manpower_unit,
														value: project.manpower_unit,
													}}
													options={['Man-Hours', 'Man-Days', 'Man-Months'].map(
														(c) => {
															return {
																value: c,
																label: c,
															};
														},
													)}
												/>
											</Form.Group>
											<Form.Group className="row my-3 align-items-center">
												<Form.Label htmlFor="Manpower Unit" className="col-sm-12 col-md-4 col-lg-2">
													{date_format?.text}
												</Form.Label>
												<CustomSelect
													name="date_formate"
													className="col-sm-12 col-md-8 col-lg-10"
													onChange={(e) => {
														handleChange({
															target: {
																name: 'date_formate',
																value: e.value,
															},
														});
													}}
													value={{
														label: project.date_formate,
														value: project.date_formate,
													}}
													options={[
														'DD-MM-YYYY',
														'MM-DD-YYYY',
														'YYYY-MM-DD',
														'DD/MM/YYYY',
														'MM/DD/YYYY',
														'YYYY/MM/DD',
													].map((c) => {
														return {
															value: c,
															label: c,
														};
													})}
												/>
											</Form.Group>

											<Form.Group className="row my-3 align-items-center">
												<Form.Label htmlFor="Manpower Unit" className="col-sm-12 col-md-4 col-lg-2">
													{archive_task_time?.text}
												</Form.Label>
												<CustomSelect
													name="archive_task_time"
													className="col-sm-12 col-md-8 col-lg-10"
													onChange={(e) => {
														handleChange({
															target: {
																name: 'archive_task_time',
																value: e.value,
															},
														});
													}}
													value={{
														label: project.archive_task_time,
														value: project.archive_task_time,
													}}
													options={archiveTaskTime}
												/>
											</Form.Group>
											<Form.Group className="row my-3 align-items-center">
												<div
													className="col-sm-12 col-md-4 col-lg-2">
													<Form.Label htmlFor="Project Code">
														{project_logo?.text}
													</Form.Label>
												</div>
												<div className="col-sm-12 col-md-8 col-lg-10">
													<div className="row align-items-center">
														<div className="col-lg-6 col-sm-12">
															<InputGroup>
																<FormControl
																	placeholder="Project logo"
																	aria-label="Project logo"
																	type="file"
																	name="logo"
																	accept="image/*"
																	onChange={(e) => handleLogoChange(e)}
																	// value={projectLogo}
																/>
															</InputGroup>
														</div>
														<div className="col-lg-6 col-sm-12">
															{projectLogo && projectLogo != '' && (
																<div className="form-group project-logo-wrapper col-sm-1 mt-3">
																	<img
																		src={projectLogo}
																		className={`project-logo-img`}
																		alt="project logo"
																	/>

																	<div
																		title={`${remove_logo.text}`}
																		onClick={deleteLogo}
																		className="project-logo-remove text-center">
																		{remove.text}
																	</div>
																</div>
															)}
														</div>
													</div>
												</div>
											</Form.Group>
											<div className="form-group col-sm-12 text-end">
												<Button
													onClick={updateProject}
													className="btn theme-btn mt-2">
													<i className="fa-solid fa-floppy-disk pe-2"></i>
													{save.text}
												</Button>
											</div>
										</Form>
									</div>
									<div className="white-box">
								<div className="row border-bottom">
									<div className="col-12">
										<label className="white-box-label">
											{company_setting.text}
										</label>
									</div>
								</div>
								<Form.Group className="row mt-4 mb-2 align-items-baseline">
									<Form.Label htmlFor="Project Name" className="col-sm-12 col-md-4 col-lg-3">
										{company_name.text}
									</Form.Label>
									<InputGroup className="col-sm-12 col-md-8 col-lg-9 w-auto flex-grow-1">
										<FormControl
											placeholder="Company Name"
											aria-label="Recipient's Project Name"
											className="py-2"
											type="text"
											name="company_name"
											autoComplete="off"
											// value={project?.name}
											onChange={(e) => handleChange(e)}
											value={project.company_name}
										/>
									</InputGroup>
								</Form.Group>

								<Form.Group className="row mt-4 mb-2 align-items-baseline">
									<Form.Label className="col-sm-12 col-md-4 col-lg-3">
										{company_address.text}
									</Form.Label>
									<InputGroup className="col-sm-12 col-md-8 col-lg-9 w-auto flex-grow-1">
										<FormControl
											placeholder={company_address.text}
											aria-label="Company address"
											className="py-2"
											type="text"
											name="company_address"
											autoComplete="off"
											// value={project?.name}
											onChange={(e) => handleChange(e)}
											value={project.company_address}
										/>
									</InputGroup>
								</Form.Group>

								<Form.Group className="row mt-4 mb-2 align-items-baseline">
									<Form.Label className="col-sm-12 col-md-4 col-lg-3">{GSTIN.text}</Form.Label>
									<InputGroup className="col-sm-12 col-md-8 col-lg-9 w-auto flex-grow-1">
										<FormControl
											placeholder={GSTIN.text}
											aria-label="GSTIN"
											className="py-2"
											type="text"
											name="gstin"
											autoComplete="off"
											// value={project?.name}
											onChange={(e) => handleChange(e)}
											value={project.gstin}
										/>
									</InputGroup>
								</Form.Group>

								<Form.Group className="row mt-4 mb-2 align-items-baseline">
									<Form.Label className="col-sm-12 col-md-4 col-lg-3">
										{company_email.text}
									</Form.Label>
									<InputGroup className="col-sm-12 col-md-8 col-lg-9 w-auto flex-grow-1">
										<FormControl
											placeholder={company_email.text}
											aria-label={company_email.text}
											className="py-2"
											type="text"
											name="company_email"
											autoComplete="off"
											// value={project?.name}
											onChange={(e) => handleChange(e)}
											value={project.company_email}
										/>
									</InputGroup>
								</Form.Group>

								<Form.Group className="row mt-4 mb-2 align-items-baseline">
									<Form.Label className="col-sm-12 col-md-4 col-lg-3">
										{company_mobile.text}
									</Form.Label>
									<InputGroup className="col-sm-12 col-md-8 col-lg-9 w-auto flex-grow-1">
										<FormControl
											placeholder={company_mobile.text}
											aria-label="Company Mobile"
											className="py-2"
											type="text"
											name="company_mobile"
											autoComplete="off"
											// value={project?.name}
											onChange={(e) => handleChange(e)}
											value={project.company_mobile}
										/>
									</InputGroup>
								</Form.Group>

								<div className="form-group col-sm-12 text-end">
									<Button
										onClick={updateProjectCompany}
										className="btn theme-btn mt-2">
										<i className="fa-solid fa-floppy-disk pe-2"></i>
										{save.text}
									</Button>
								</div>
							</div>
								</div>

								<div className="col-lg-3 col-md-3">
									<div className="col-12 white-box">
										<label className="white-box-label">
											{setting_list?.text}
										</label>
										<div className="row">
											<ul className="ms-2">
												<li className="mt-2 mb-3 pb-3 border-bottom">
													<span
														onClick={handleTemplateModel}
														className="hover-theme-color lf-link-cursor">
														<i className="fa-solid fa-rectangle-list pe-1"></i>{' '}
														{manage_template?.text}
													</span>
												</li>
												<li className="my-3">
													<span
														onClick={handleCategoryModel}
														className="hover-theme-color lf-link-cursor">
														<i className="fa-solid fa-layer-group pe-1"></i>{' '}
														{manage_category?.text}
													</span>
												</li>
												<li className="my-3">
													<span
														onClick={handleLocationModel}
														className="hover-theme-color lf-link-cursor">
														<i className="fa-solid fa-location-dot pe-1"></i>{' '}
														{manage_localtion?.text}
													</span>
												</li>
												<li className="my-3 pb-3 border-bottom">
													<span
														onClick={handleTagsModel}
														className="hover-theme-color lf-link-cursor">
														<i className="fa-solid fa-tag pe-1"></i>{' '}
														{manage_tags?.text}
													</span>
												</li>
												<li className="my-3">
													<span
														onClick={handleMaterialsModel}
														className="hover-theme-color lf-link-cursor">
														<i className="fa-solid fa-boxes-stacked pe-1"></i>{' '}
														{manage_material?.text}
													</span>
												</li>
												<li className="my-3">
													<span
														onClick={handleLaboursModel}
														className="hover-theme-color lf-link-cursor">
														<i className="fa-solid fa-person-digging pe-1"></i>{' '}
														{manage_labour?.text}
													</span>
												</li>
												<li className="my-3">
													<span
														onClick={handleEquipmentsModel}
														className="hover-theme-color lf-link-cursor">
														<i className="fa-solid fa-tractor pe-1"></i>{' '}
														{manage_equipment?.text}
													</span>
												</li>
												<li className="my-3">
													<span
														onClick={handleUnitsModel}
														className="hover-theme-color lf-link-cursor">
														<i className="fa-solid fa-scale-balanced pe-1"></i>{' '}
														{manage_unit?.text}
													</span>
												</li>
												<li className="my-3">
													<span
														onClick={handleVendorModel}
														className="hover-theme-color lf-link-cursor">
														<i className="fa-solid fa-user pe-1"></i>{' '}
														{manage_vendor?.text}
													</span>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-sm-9">
							
						</div>
					</div>
				</div>
			</div>
			{/* Category Model */}
			<Modal show={categoryModel} onHide={handleCategoryModel}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{manage_category?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body
					id={`category-model-body`}
					style={{
						maxHeight: '70vh',
						minHeight: '50vh',
						overflow: 'auto',
					}}>
					<div className="row">
						<div className="col-sm-12">
							<FormControl
								className="me-1 lf-formcontrol-height "
								placeholder={search_category.text}
								type="text"
								name="name"
								autoComplete="off"
								onChange={(e) => setSearchCategory(e.target.value)}
								value={searchCategory}
								// onBlur={() => setCategoryHiden(null)}
							/>
							<div className="col-sm-12 mt-3"></div>
							{category && category.length > 0 && (
								<Table hover size="sm">
									<thead>
										<tr className="border-0">
											<th className="border-0">#</th>
											<th className="border-0">Name</th>
											<th className="text-end border-0">Action</th>
										</tr>
									</thead>
									<tbody className="border-0">
										{category
											?.filter((v) => {
												if (searchCategory && searchCategory.trim()) {
													if (
														v.name
															.toLowerCase()
															.search(searchCategory.toLowerCase()) > -1
													) {
														return v;
													}
												} else {
													return v;
												}
											})
											?.map((c, k) => {
												return (
													<tr
														key={`category-${k}`}
														className={`${
															editCategory && editCategory == c?._id
																? 'bg-light'
																: 'bg-transparent'
														}`}>
														<td className="border-0">{k + 1}</td>
														<td className="border-0">
															{editCategory == c?._id ? (
																<FormControl
																	type="text"
																	name="name"
																	autoComplete="off"
																	onChange={(e) => {
																		const { value } = e.target;
																		setInputData({ category: value });
																	}}
																	onKeyPress={(e) => {
																		const name = e.target.value;
																		if (e.key === 'Enter') {
																			submitCategory({
																				...c,
																				name,
																			});
																			setTimeout(() => {
																				setEditCategory(null);
																			}, 100);
																		}
																	}}
																	defaultValue={c?.name}
																/>
															) : (
																<>
																	<span>{c?.name}</span>
																</>
															)}
														</td>
														<td className="border-0 text-end">
															{!c?.is_default ? (
																editCategory == c?._id ? (
																	<>
																		<div className="d-flex flex-row justify-content-end">
																			<span className={`btn px-0 w-25`}>
																				<i
																					onClick={(e) => {
																						const name = inputData?.category;
																						submitCategory({
																							...c,
																							name,
																						});
																						setTimeout(() => {
																							setEditCategory(null);
																						}, 100);
																					}}
																					style={{
																						color: 'blue',
																						fontSize: '15px',
																					}}
																					className="fas fa-check theme-btnbg theme-secondary"></i>
																			</span>
																			{` `}
																			<span className={`btn px-0 w-25`}>
																				<i
																					onClick={() => {
																						setEditCategory(null);
																					}}
																					style={{
																						color: 'red',
																						fontSize: '15px',
																					}}
																					className="fas fa-times theme-btnbg theme-secondary"></i>
																			</span>
																		</div>
																	</>
																) : (
																	<>
																		<span
																			className="d-inline float-end"
																			tooltip={icon_delete.tooltip}
																			flow={icon_delete.tooltip_flow}>
																			<i
																				className="far fa-trash-alt  float-end  mt-2 theme-btnbg theme-secondary"
																				onClick={() =>
																					sweetAlert(
																						() =>
																							dispatch(
																								deleteCategory({
																									user_id: userId,
																									project_id: project_id,
																									category_id: c?._id,
																								}),
																							),
																						'Category',
																					)
																				}></i>
																		</span>
																		<span
																			className=""
																			tooltip={icon_edit.tooltip}
																			flow={icon_edit.tooltip_flow}>
																			<i
																				className="fas fa-edit  me-3 mt-2 theme-btnbg theme-secondary"
																				onClick={(e) =>
																					setEditCategory(c._id)
																				}></i>
																		</span>
																	</>
																)
															) : (
																''
															)}
														</td>
													</tr>
												);
											})}
									</tbody>
								</Table>
							)}
							{categoryHiden === 'category' ? (
								<>
									<Table striped hover size="sm">
										<tbody className="border-0">
											<tr className={`theme-table-data-row bg-white border-0`}>
												<td className="border-0">
													<FormControl
														placeholder={`Enter ${category_name.text}`}
														type="text"
														name="name"
														autoComplete="off"
														onChange={(e) =>
															handleChangeCategory('name', e.target.value)
														}
														onKeyPress={(e) => {
															if (e.key === 'Enter') {
																createInfo();
															}
														}}
														value={infoCategoryAndLocation.name}
													/>
												</td>
												<div className="d-flex flex-row justify-content-end">
													<span className={`btn px-0 w-50`}>
														<i
															onClick={createInfo}
															style={{
																color: 'blue',
																fontSize: '15px',
															}}
															className="fas fa-check theme-btnbg theme-secondary"></i>
													</span>
													{` `}
													<span className={`btn px-0 w-50`}>
														<i
															onClick={() => {
																setCategoryHiden(null);
															}}
															style={{
																color: 'red',
																fontSize: '15px',
															}}
															className="fas fa-times theme-btnbg theme-secondary"></i>
													</span>
												</div>{' '}
											</tr>
										</tbody>
									</Table>
								</>
							) : (
								''
							)}
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer className="justify-content-center">
					<Button
						variant="light"
						className="light-border btn-block"
						onClick={() => {
							handleCategoryModel();
							setEditCategory(null);
							setCategoryHiden('');
						}}>
						<i className="fa-solid fa-xmark pe-2"></i>
						{close.text}
					</Button>
					<Button
						className="btn theme-btn btn-primary"
						tooltip={add_category.tooltip}
						flow={add_category.tooltip_flow}
						onClick={() => {
							setCategoryHiden('category');
							handleChangeCategory('name', '');
							scrollDownById('category-model-body');
						}}>
						<i className={'fas fa-plus'} />
						{add_category?.text}{' '}
					</Button>
				</Modal.Footer>
			</Modal>

			{/* Location */}
			<Modal show={locationModel} onHide={handleLocationModel}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{manage_localtion?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body
					id={`location-model-body`}
					style={{
						maxHeight: '70vh',
						minHeight: '50vh',
						overflow: 'auto',
						padding: 0,
					}}>
					<div className="">
						{project_locations.length !== 0 && (
							<div className="py-2 px-4">
								<FormControl
									className="me-1 lf-formcontrol-height "
									placeholder="Search location"
									type="text"
									name="name"
									autoComplete="off"
									onChange={(e) => setSearchLocation(e.target.value)}
									value={searchLocation}
									// onBlur={() => setCategoryHiden(null)}
								/>
							</div>
						)}
						<div className="col-sm-12">
							{project_locations && project_locations.length > 0 ? (
								<div className="py-2 px-4">
									<Table hover size="sm">
										<thead>
											<tr className="border-0">
												<th className="border-0">#</th>
												<th className="border-0">Name</th>
												<th className={`text-end border-0`}>Action</th>
											</tr>
										</thead>
										<tbody className="border-0">
											{project_locations
												?.filter((v) => {
													if (searchLocation && searchLocation.trim()) {
														if (
															v.name
																.toLowerCase()
																.search(searchLocation.toLowerCase()) > -1
														) {
															return v;
														}
													} else {
														return v;
													}
												})
												?.map((tc, k) => {
													return (
														<tr
															key={`category-${k}`}
															className={`${
																editLocation && editLocation == tc?._id
																	? 'bg-light'
																	: 'bg-transparent'
															}`}>
															<td className="border-0">{k + 1}</td>
															<td className="border-0">
																{editLocation == tc?._id ? (
																	<FormControl
																		type="text"
																		name="name"
																		autoComplete="off"
																		onChange={(e) => {
																			const { value } = e.target;
																			setInputData({ location: value });
																		}}
																		onKeyPress={(e) => {
																			const name = e.target.value;
																			if (e.key === 'Enter') {
																				submitLocation({
																					...tc,
																					name,
																				});
																				setTimeout(() => {
																					setEditLocation(null);
																				}, 100);
																			}
																		}}
																		defaultValue={tc?.name}
																	/>
																) : (
																	<>
																		<span className="col-8">{tc?.name}</span>
																	</>
																)}
															</td>
															<td className="border-0">
																{editLocation == tc?._id ? (
																	<>
																		<div className="d-flex flex-row justify-content-between">
																			<span className={`btn px-0 w-50`}>
																				<i
																					onClick={(e) => {
																						const name = inputData?.location;
																						submitLocation({
																							...tc,
																							name,
																						});
																						setTimeout(() => {
																							setEditLocation(null);
																						}, 100);
																					}}
																					style={{
																						color: 'blue',
																						fontSize: '15px',
																					}}
																					className="fas fa-check theme-btnbg theme-secondary"></i>
																			</span>
																			{` `}
																			<span className={`btn px-0 w-50`}>
																				<i
																					onClick={() => {
																						setEditLocation(null);
																					}}
																					style={{
																						color: 'red',
																						fontSize: '15px',
																					}}
																					className="fas fa-times theme-btnbg theme-secondary"></i>
																			</span>
																		</div>
																	</>
																) : (
																	<>
																		<span
																			className="d-inline float-end"
																			tooltip={icon_delete.tooltip}
																			flow={icon_delete.tooltip_flow}>
																			<i
																				className="far fa-trash-alt float-end mt-2 theme-btnbg theme-secondary"
																				onClick={() =>
																					sweetAlert(
																						() =>
																							dispatch(
																								deleteLocation({
																									user_id: userId,
																									project_id: project_id,
																									location_id: tc?._id,
																								}),
																							),
																						'Location',
																					)
																				}></i>
																		</span>
																		<span
																			className="float-end d-inline"
																			tooltip={icon_edit.tooltip}
																			flow={icon_edit.tooltip_flow}>
																			<i
																				className="fas fa-edit float-end me-3 mt-2 theme-btnbg theme-secondary"
																				onClick={(e) =>
																					setEditLocation(tc._id)
																				}></i>
																		</span>
																	</>
																)}
															</td>
														</tr>
													);
												})}
										</tbody>
									</Table>
								</div>
							) : (
								<>
									{' '}
									<Nodata type="location" className="mt-0"></Nodata>
								</>
							)}
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer className="justify-content-center py-2">
					<div className="container">
						<div className="row">
							{categoryHiden === 'location' ? (
								<Table striped hover size="sm">
									<tbody className="border-0">
										<tr className={`theme-table-data-row bg-white border-0`}>
											<td className="border-0">
												<FormControl
													// className="fw-bold me-1 lf-formcontrol-height"
													placeholder={`Enter ${location_name.text}`}
													type="text"
													name="name"
													autoComplete="off"
													onChange={(e) =>
														handleChangeCategory('name', e.target.value)
													}
													onKeyPress={(e) => {
														if (e.key === 'Enter') {
															createInfo();
														}
													}}
													value={infoCategoryAndLocation.name}
												/>
											</td>
											<div className="d-flex flex-row justify-content-end">
												<span className={`btn px-0 w-50`}>
													<i
														onClick={createInfo}
														style={{
															color: 'blue',
															fontSize: '15px',
														}}
														className="fas fa-check theme-btnbg theme-secondary"></i>
												</span>
												{` `}
												<span className={`btn px-0 w-50`}>
													<i
														onClick={() => {
															setCategoryHiden('');
															handleChangeCategory('name', '');
															scrollDownById('location-model-body');
														}}
														style={{
															color: 'red',
															fontSize: '15px',
														}}
														className="fas fa-times theme-btnbg theme-secondary"></i>
												</span>
											</div>{' '}
										</tr>
									</tbody>
								</Table>
							) : (
								''
							)}
						</div>
					</div>
					<div className="row justify-content-center align-items-center">
						<div className="col-auto">
							<Button
								variant="light"
								className="light-border btn-block"
								onClick={() => {
									setEditLocation(null);
									handleLocationModel();
									setCategoryHiden('');
								}}>
								<i className="fa-solid fa-xmark pe-2"></i>
								{close.text}
							</Button>
						</div>

						<div className="col-auto">
							<Button
								className="btn theme-btn btn-primary"
								tooltip={add_Location.tooltip}
								flow={add_Location.tooltip_flow}
								onClick={() => {
									setCategoryHiden('location');
									handleChangeCategory('name', '');
									scrollDownById('location-model-body');
								}}>
								<i className={'fas fa-plus'} />
								{add_Location?.text}{' '}
							</Button>
						</div>
					</div>
				</Modal.Footer>
			</Modal>

			{/* Tags */}
			<Modal show={tagsModel} onHide={handleTagsModel}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{manage_tags?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body
					id={`tags-model-body`}
					style={{
						maxHeight: '70vh',
						minHeight: '50vh',
						overflow: 'auto',
						padding: 0,
					}}>
					<div className="">
						{tags && tags.length !== 0 && (
							<div className="py-2 px-4">
								<FormControl
									className="me-1 lf-formcontrol-height "
									placeholder={search_tags.text}
									type="text"
									name="name"
									autoComplete="off"
									onChange={(e) => setSearchTags(e.target.value)}
									value={searchTags}
									// onBlur={() => setCategoryHiden(null)}
								/>
							</div>
						)}

						<div className="">
							{tags && tags.length > 0 ? (
								<div className="py-2 px-4">
									<Table hover size="sm">
										<thead>
											<tr className="border-0">
												<th className="border-0">#</th>
												<th className="border-0">Name</th>
												<th className={`text-end border-0`}>Action</th>
											</tr>
										</thead>
										<tbody className="border-0">
											{tags
												?.filter((v) => {
													if (searchTags && searchTags.trim()) {
														if (
															v.name
																.toLowerCase()
																.search(searchTags.toLowerCase()) > -1
														) {
															return v;
														}
													} else {
														return v;
													}
												})
												?.map((tc, k) => {
													return (
														<tr
															key={`category-${k}`}
															className={`${
																edittags && edittags == tc?._id
																	? 'bg-light'
																	: 'bg-transparent'
															}`}>
															<td className="border-0">{k + 1}</td>
															<td className="border-0">
																{edittags == tc?._id ? (
																	<FormControl
																		type="text"
																		name="name"
																		autoComplete="off"
																		onChange={(e) => {
																			const { value } = e.target;
																			setInputData({ tags: value });
																		}}
																		onKeyPress={(e) => {
																			const name = e.target.value;
																			if (e.key === 'Enter') {
																				submitTags({
																					...tc,
																					name,
																				});
																				setTimeout(() => {
																					setEdittags(null);
																				}, 100);
																			}
																		}}
																		defaultValue={tc?.name}
																	/>
																) : (
																	<>
																		<span className="col-8">{tc?.name}</span>
																	</>
																)}
															</td>
															<td className="border-0">
																{edittags == tc?._id ? (
																	<div className="d-flex flex-row justify-content-end">
																		<span className={`btn px-0 w-25`}>
																			<i
																				onClick={(e) => {
																					const name = inputData?.tags;
																					submitTags({
																						...tc,
																						name,
																					});
																					setTimeout(() => {
																						setEdittags(null);
																					}, 100);
																				}}
																				style={{
																					color: 'blue',
																					fontSize: '15px',
																				}}
																				className="fas fa-check theme-btnbg theme-secondary"></i>
																		</span>
																		{` `}
																		<span className={`btn px-0 w-25`}>
																			<i
																				onClick={() => {
																					setEdittags(null);
																				}}
																				style={{
																					color: 'red',
																					fontSize: '15px',
																				}}
																				className="fas fa-times theme-btnbg theme-secondary"></i>
																		</span>
																	</div>
																) : (
																	<>
																		<span
																			className="d-inline float-end"
																			tooltip={icon_delete.tooltip}
																			flow={icon_delete.tooltip_flow}>
																			<i
																				className="far fa-trash-alt mt-2 theme-btnbg theme-secondary"
																				onClick={() =>
																					sweetAlert(
																						() =>
																							dispatch(
																								deleteTags({
																									user_id: userId,
																									project_id: project_id,
																									tag_id: tc?._id,
																								}),
																							),
																						'Tag',
																					)
																				}></i>
																		</span>
																		<span
																			className="float-end d-inline"
																			tooltip={icon_edit.tooltip}
																			flow={icon_edit.tooltip_flow}>
																			<i
																				className="fas fa-edit float-end me-3 mt-2 theme-btnbg theme-secondary"
																				onClick={(e) =>
																					setEdittags(tc._id)
																				}></i>
																		</span>
																	</>
																)}
															</td>
														</tr>
													);
												})}
										</tbody>
									</Table>
								</div>
							) : (
								<>
									{' '}
									<Nodata type="tags" className="mt-0"></Nodata>{' '}
								</>
							)}
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer className="justify-content-center">
					<div className="container">
						<div className="row">
							{categoryHiden === 'tags' ? (
								<Table striped hover size="sm">
									<tbody className="border-0">
										<tr className={`theme-table-data-row bg-white border-0`}>
											<td className="border-0">
												<FormControl
													placeholder={enter_tag.text}
													type="text"
													name="name"
													autoComplete="off"
													onChange={(e) =>
														handleChangeCategory('name', e.target.value)
													}
													onKeyPress={(e) => {
														if (e.key === 'Enter') {
															createInfo();
														}
													}}
													value={infoCategoryAndLocation.name}
												/>
											</td>
											<div className="d-flex flex-row justify-content-end">
												<span className={`btn px-0 w-50`}>
													<i
														onClick={createInfo}
														style={{
															color: 'blue',
															fontSize: '15px',
														}}
														className="fas fa-check theme-btnbg theme-secondary"></i>
												</span>
												{` `}
												<span className={`btn px-0 w-50`}>
													<i
														onClick={() => {
															setCategoryHiden('');
															handleChangeCategory('name', '');
															scrollDownById('tags-model-body');
														}}
														style={{
															color: 'red',
															fontSize: '15px',
														}}
														className="fas fa-times theme-btnbg theme-secondary"></i>
												</span>
											</div>{' '}
										</tr>
									</tbody>
								</Table>
							) : (
								''
							)}
						</div>

						<div className="row justify-content-center align-items-center">
							<div className="col-auto">
								<Button
									variant="light"
									className="light-border btn-block"
									onClick={() => {
										setEdittags(null);
										handleTagsModel();
										setCategoryHiden('');
									}}>
									<i className="fa-solid fa-xmark pe-2"></i>
									{close.text}
								</Button>
							</div>
							<div className="col-auto">
								<Button
									className="btn theme-btn btn-primary"
									tooltip={add_Tags.tooltip}
									flow={add_Tags.tooltip_flow}
									onClick={() => {
										setCategoryHiden('tags');
										handleChangeCategory('name', '');
										scrollDownById('tags-model-body');
									}}>
									<i className={'fas fa-plus'} /> {add_Tags?.text}
								</Button>
							</div>
						</div>
					</div>
				</Modal.Footer>
			</Modal>

			{/* Materials */}
			<Modal show={materialModel} onHide={handleMaterialsModel}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{manage_material?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body
					style={{
						maxHeight: '70vh',
						minHeight: '50vh',
						overflow: 'auto',
						padding: 0,
					}}>
					<div className="">
						{materialData?.length !== 0 && (
							<div className="py-2 px-4">
								<FormControl
									className="me-1 lf-formcontrol-height "
									placeholder={search_material.text}
									type="text"
									name="name"
									autoComplete="off"
									onChange={(e) => setSearchMaterial(e.target.value)}
									value={searchMaterial}
									// onBlur={() => setCategoryHiden(null)}
								/>
							</div>
						)}
						<div className="">
							{materialData && materialData.length > 0 ? (
								<div className="py-2 px-4">
									<Table hover size="sm">
										<thead>
											<tr className="border-0">
												<th className="border-0">#</th>
												<th className="border-0">Name</th>
												<th className={`text-end border-0`}>Action</th>
											</tr>
										</thead>
										<tbody className="border-0">
											{materialData
												?.filter((v) => {
													if (searchMaterial && searchMaterial.trim()) {
														if (
															(
																v.type.toLowerCase() + v?.unit.toLowerCase()
															).search(searchMaterial.toLowerCase()) > -1
														) {
															return v;
														}
													} else {
														return v;
													}
												})
												?.map((tc, k) => {
													return (
														<tr key={`category-${k}`}>
															<td className="border-0">{k + 1}</td>
															<td className="border-0">
																{tc?.type} ({tc?.unit})
															</td>
															<td className="border-0">
																<span
																	className="d-inline float-end"
																	tooltip={icon_delete.tooltip}
																	flow={icon_delete.tooltip_flow}>
																	<i
																		className="far fa-trash-alt mt-2 theme-btnbg theme-secondary"
																		onClick={() =>
																			sweetAlert(
																				() =>
																					dispatch(
																						deleteMaterial({
																							project_id: project_id,
																							user_id: userId,
																							material_id: tc?._id,
																						}),
																					),
																				'Material',
																			)
																		}></i>
																</span>
																<AddMaterial data={tc} />
															</td>
														</tr>
													);
												})}
										</tbody>
									</Table>
								</div>
							) : (
								<Nodata type="material" className="mt-0"></Nodata>
							)}
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer className="justify-content-center">
					<Button
						variant="light"
						className="light-border btn-block"
						onClick={handleMaterialsModel}>
						<i className="fa-solid fa-xmark pe-2"></i>
						Close
					</Button>

					<AddMaterial className="btn theme-btn btn-primary" />
				</Modal.Footer>
			</Modal>

			{/* Labour Model */}
			<Modal show={labourModel} onHide={handleLaboursModel}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{manage_labour?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body
					id={`labour-model-body`}
					style={{
						maxHeight: '70vh',
						minHeight: '50vh',
						overflow: 'auto',
						padding: 0,
					}}>
					<div className="">
						{labourData?.length !== 0 && (
							<div className="py-2 px-4">
								<FormControl
									className="me-1 lf-formcontrol-height "
									placeholder={search_labour.text}
									type="text"
									name="name"
									autoComplete="off"
									onChange={(e) => setSearchLabour(e.target.value)}
									value={searchLabour}
									// onBlur={() => setCategoryHiden(null)}
								/>
							</div>
						)}
						<div className="col-sm-12">
							{labourData?.length > 0 ? (
								<div className="py-2 px-4">
									<Table hover size="sm">
										<thead>
											<tr className="border-0">
												<th className="border-0">#</th>
												<th className="border-0">Name</th>
												<th className={`text-end border-0`}>Action</th>
											</tr>
										</thead>
										<tbody className="border-0">
											{labourData
												?.filter((v) => {
													if (searchLabour && searchLabour.trim()) {
														if (
															v.name
																.toLowerCase()
																.search(searchLabour.toLowerCase()) > -1
														) {
															return v;
														}
													} else {
														return v;
													}
												})
												?.map((tc, k) => {
													return (
														<tr
															key={`category-${k}`}
															className={`${
																editLabour && editLabour == tc?._id
																	? 'bg-light'
																	: 'bg-transparent'
															}`}>
															<td className="border-0">{k + 1}</td>
															<td className="border-0">
																{editLabour == tc?._id ? (
																	<FormControl
																		type="text"
																		name="name"
																		autoComplete="off"
																		onChange={(e) => {
																			const { value } = e.target;
																			setInputData({ labour: value });
																		}}
																		onKeyPress={(e) => {
																			const name = e.target.value;
																			if (e.key === 'Enter') {
																				submitLabour({
																					...tc,
																					name,
																				});
																				setTimeout(() => {
																					setEditLabour(null);
																				}, 100);
																			}
																		}}
																		defaultValue={tc?.name}
																	/>
																) : (
																	<>
																		<span className="col-lg-8">{tc?.name}</span>
																	</>
																)}
															</td>
															<td className="border-0">
																{tc?.is_default == true ? (
																	''
																) : editLabour == tc?._id ? (
																	<>
																		<div className="d-flex flex-row justify-content-between">
																			<span className={`btn px-0 w-25`}>
																				<i
																					onClick={(e) => {
																						const name = inputData?.labour;
																						submitLabour({
																							...tc,
																							name,
																						});
																						setTimeout(() => {
																							setEditLabour(null);
																						}, 100);
																					}}
																					style={{
																						color: 'blue',
																						fontSize: '15px',
																					}}
																					className="fas fa-check theme-btnbg theme-secondary"></i>
																			</span>
																			{` `}
																			<span className={`btn px-0 w-25`}>
																				<i
																					onClick={() => {
																						setEditLabour(null);
																					}}
																					style={{
																						color: 'red',
																						fontSize: '15px',
																					}}
																					className="fas fa-times theme-btnbg theme-secondary"></i>
																			</span>
																		</div>
																	</>
																) : (
																	<>
																		<span
																			className="d-inline float-end"
																			tooltip={icon_delete.tooltip}
																			flow={icon_delete.tooltip_flow}>
																			<i
																				className="far fa-trash-alt mt-2 theme-btnbg theme-secondary"
																				onClick={() =>
																					sweetAlert(
																						() =>
																							dispatch(
																								deleteLabour({
																									project_id: project_id,
																									user_id: userId,
																									labour_id: tc?._id,
																								}),
																							),
																						'Labour',
																					)
																				}></i>
																		</span>
																		<span
																			className="float-end d-inline"
																			tooltip={icon_edit.tooltip}
																			flow={icon_edit.tooltip_flow}>
																			<i
																				className="fas fa-edit float-end me-3 mt-2 theme-btnbg theme-secondary"
																				onClick={(e) =>
																					setEditLabour(tc._id)
																				}></i>
																		</span>
																	</>
																)}
															</td>
														</tr>
													);
												})}
										</tbody>
									</Table>
								</div>
							) : (
								<Nodata type="labour" className="mt-0"></Nodata>
							)}
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer className="justify-content-center">
					<div className="container">
						<div className="row">
							{categoryHiden === 'labour' ? (
								<Table striped hover size="sm">
									<tbody className="border-0">
										<tr className={`theme-table-data-row bg-white border-0`}>
											<td className="border-0">
												<FormControl
													// className="fw-bold me-1 lf-formcontrol-height"
													placeholder={`Enter ${labour_name.text}`}
													type="text"
													name="name"
													autoComplete="off"
													onChange={(e) =>
														handleChangeCategory('name', e.target.value)
													}
													onKeyPress={(e) => {
														if (e.key === 'Enter') {
															createInfo();
														}
													}}
													value={infoCategoryAndLocation.name}
												/>
											</td>
											<div className="d-flex flex-row justify-content-end">
												<span className={`btn px-0 w-50`}>
													<i
														onClick={createInfo}
														style={{
															color: 'blue',
															fontSize: '15px',
														}}
														className="fas fa-check theme-btnbg theme-secondary"></i>
												</span>
												{` `}
												<span className={`btn px-0 w-50`}>
													<i
														onClick={() => {
															setCategoryHiden('');
															handleChangeCategory('name', '');
															scrollDownById('labour-model-body');
														}}
														style={{
															color: 'red',
															fontSize: '15px',
														}}
														className="fas fa-times theme-btnbg theme-secondary"></i>
												</span>
											</div>{' '}
										</tr>
									</tbody>
								</Table>
							) : (
								''
							)}
						</div>

						<div className="row justify-content-center align-items-center">
							<div className="col-auto">
								<Button
									variant="light"
									className="light-border btn-block"
									onClick={() => {
										setEditLabour(null);
										handleLaboursModel();
										setCategoryHiden('');
									}}>
									<i className="fa-solid fa-xmark pe-2"></i>
									{close.text}
								</Button>
							</div>
							<div className="col-auto">
								<Button
									className="btn theme-btn btn-primary"
									tooltip={add_Laborur.tooltip}
									flow={add_Laborur.tooltip_flow}
									onClick={() => {
										setCategoryHiden('labour');
										handleChangeCategory('name', '');
										scrollDownById('labour-model-body');
									}}>
									<i className={'fas fa-plus'} /> {add_Laborur?.text}
								</Button>
							</div>
						</div>
					</div>
				</Modal.Footer>
			</Modal>

			{/* Equipment Model */}
			<Modal show={equipmentModel} onHide={handleEquipmentsModel}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{manage_equipment?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body
					id={`equipment-model-body`}
					style={{
						maxHeight: '70vh',
						minHeight: '50vh',
						overflow: 'auto',
						padding: 0,
					}}>
					<div className="">
						{equipmentData?.length !== 0 && (
							<div className="py-2 px-4">
								<FormControl
									className="me-1 lf-formcontrol-height "
									placeholder="Search equipment"
									type="text"
									name="name"
									autoComplete="off"
									onChange={(e) => setSearchEquipment(e.target.value)}
									value={searchEquipment}
									// onBlur={() => setCategoryHiden(null)}
								/>
							</div>
						)}
						<div className="">
							{equipmentData?.length > 0 ? (
								<div className="py-2 px-4">
									<Table hover size="sm">
										<thead>
											<tr className="border-0">
												<th className="border-0">#</th>
												<th className="border-0">Name</th>
												<th className={`text-end border-0`}>Action</th>
											</tr>
										</thead>
										<tbody className="border-0">
											{equipmentData
												?.filter((v) => {
													if (searchEquipment && searchEquipment.trim()) {
														if (
															v.name
																.toLowerCase()
																.search(searchEquipment.toLowerCase()) > -1
														) {
															return v;
														}
													} else {
														return v;
													}
												})
												?.map((tc, k) => {
													return (
														<tr
															key={`category-${k}`}
															className={`${
																editEquipment && editEquipment == tc?._id
																	? 'bg-light'
																	: 'bg-transparent'
															}`}>
															<td className="border-0">{k + 1}</td>
															<td className="border-0">
																{editEquipment == tc?._id ? (
																	<FormControl
																		type="text"
																		name="name"
																		autoComplete="off"
																		onChange={(e) => {
																			const { value } = e.target;
																			setInputData({ equipment: value });
																		}}
																		onKeyPress={(e) => {
																			const name = e.target.value;
																			if (e.key === 'Enter') {
																				submitEquipment({
																					...tc,
																					name,
																				});
																				setTimeout(() => {
																					setEditEquipment(null);
																				}, 100);
																			}
																		}}
																		defaultValue={tc?.name}
																	/>
																) : (
																	<>
																		<span className="col-md-8">{tc?.name}</span>
																	</>
																)}
															</td>
															<td className="border-0">
																{tc?.is_default == true ? (
																	''
																) : editEquipment == tc?._id ? (
																	<>
																		<div className="d-flex flex-row justify-content-between">
																			<span className={`btn px-0 w-25`}>
																				<i
																					onClick={(e) => {
																						const name = inputData?.equipment;
																						submitEquipment({
																							...tc,
																							name,
																						});
																						setTimeout(() => {
																							setEditEquipment(null);
																						}, 100);
																					}}
																					style={{
																						color: 'blue',
																						fontSize: '15px',
																					}}
																					className="fas fa-check theme-btnbg theme-secondary"></i>
																			</span>
																			{` `}
																			<span className={`btn px-0 w-25`}>
																				<i
																					onClick={() => {
																						setEditEquipment(null);
																					}}
																					style={{
																						color: 'red',
																						fontSize: '15px',
																					}}
																					className="fas fa-times theme-btnbg theme-secondary"></i>
																			</span>
																		</div>
																	</>
																) : (
																	<>
																		<span
																			className="d-inline float-end"
																			tooltip={icon_delete.tooltip}
																			flow={icon_delete.tooltip_flow}>
																			<i
																				className="far fa-trash-alt mt-2 theme-btnbg theme-secondary"
																				onClick={() =>
																					sweetAlert(
																						() =>
																							dispatch(
																								deleteEquipment({
																									user_id: userId,
																									project_id: project_id,
																									equipment_id: tc?._id,
																								}),
																							),
																						'Equipment',
																					)
																				}></i>
																		</span>
																		<span
																			className="float-end d-inline"
																			tooltip={icon_edit.tooltip}
																			flow={icon_edit.tooltip_flow}>
																			<i
																				className="fas fa-edit float-end me-3 mt-2 theme-btnbg theme-secondary"
																				onClick={(e) =>
																					setEditEquipment(tc._id)
																				}></i>
																		</span>
																	</>
																)}
															</td>
														</tr>
													);
												})}
										</tbody>
									</Table>
								</div>
							) : (
								<Nodata type="equipment" className="mt-0"></Nodata>
							)}
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer className="justify-content-center py-2">
					<div className="container">
						<div className="row">
							{categoryHiden === 'equipment' ? (
								<Table striped hover size="sm">
									<tbody className="border-0">
										<tr className={`theme-table-data-row bg-white border-0`}>
											<td className="border-0">
												<FormControl
													placeholder={`Enter ${equipment_name.text}`}
													type="text"
													name="name"
													autoComplete="off"
													onChange={(e) =>
														handleChangeCategory('name', e.target.value)
													}
													onKeyPress={(e) => {
														if (e.key === 'Enter') {
															createInfo();
														}
													}}
													value={infoCategoryAndLocation.name}
												/>
											</td>
											<div className="d-flex flex-row justify-content-end">
												<span className={`btn px-0 w-50`}>
													<i
														onClick={createInfo}
														style={{
															color: 'blue',
															fontSize: '15px',
														}}
														className="fas fa-check theme-btnbg theme-secondary"></i>
												</span>
												{` `}
												<span className={`btn px-0 w-50`}>
													<i
														onClick={() => {
															setCategoryHiden('');
															handleChangeCategory('name', '');
															scrollDownById('equipment-model-body');
														}}
														style={{
															color: 'red',
															fontSize: '15px',
														}}
														className="fas fa-times theme-btnbg theme-secondary"></i>
												</span>
											</div>{' '}
										</tr>
									</tbody>
								</Table>
							) : (
								''
							)}
						</div>
						<div className="row justify-content-center align-items-center">
							<div className="col-auto">
								<Button
									variant="light"
									className="light-border btn-block"
									onClick={() => {
										setEditEquipment(null);
										handleEquipmentsModel();
										setCategoryHiden('');
									}}>
									<i className="fa-solid fa-xmark pe-2"></i>
									{close.text}
								</Button>
							</div>
							<div className="col-auto">
								<Button
									className="btn theme-btn btn-primary"
									tooltip={add_Equipment.tooltip}
									flow={add_Equipment.tooltip_flow}
									onClick={() => {
										setCategoryHiden('equipment');
										handleChangeCategory('name', '');
										scrollDownById('equipment-model-body');
									}}>
									<i className={'fas fa-plus'} />
									{add_Equipment?.text}{' '}
								</Button>
							</div>
						</div>
					</div>
				</Modal.Footer>
			</Modal>

			{/* Unit Model */}
			<Modal show={unitModel} onHide={handleUnitsModel}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{manage_unit?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body
					id={`unit-model-body`}
					style={{
						maxHeight: '70vh',
						minHeight: '50vh',
						overflow: 'auto',
						padding: 0,
					}}>
					<div className="">
						{unit.length !== 0 && (
							<div className="py-2 px-4">
								<FormControl
									className="me-1 lf-formcontrol-height "
									placeholder={search_unit.text}
									type="text"
									name="name"
									autoComplete="off"
									onChange={(e) => setSearchUnit(e.target.value)}
									value={searchUnit}
									// onBlur={() => setCategoryHiden(null)}
								/>
							</div>
						)}
						<div className="col-sm-12">
							{unit?.length > 0 ? (
								<div className="py-2 px-4">
									<Table hover size="sm">
										<thead>
											<tr className="border-0">
												<th className="border-0">#</th>
												<th className="border-0">Name</th>
												<th className={`text-end border-0`}>Action</th>
											</tr>
										</thead>
										<tbody className="border-0">
											{unit
												?.filter((v) => {
													if (searchUnit && searchUnit.trim()) {
														if (
															v.unit
																.toLowerCase()
																.search(searchUnit.toLowerCase()) > -1
														) {
															return v;
														}
													} else {
														return v;
													}
												})
												?.map((tc, k) => {
													return (
														<tr
															key={`category-${k}`}
															className={`${
																editUnit && editUnit == tc?._id
																	? 'bg-light'
																	: 'bg-transparent'
															}`}>
															<td className="border-0">{k + 1}</td>
															<td className="border-0">
																{editUnit == tc?._id ? (
																	<FormControl
																		type="text"
																		name="unit"
																		autoComplete="off"
																		onChange={(e) => {
																			const { value } = e.target;
																			setInputData({ unit: value });
																		}}
																		onKeyPress={(e) => {
																			const name = e.target.value;
																			if (e.key === 'Enter') {
																				submitUnit({
																					...tc,
																					name,
																				});
																				setTimeout(() => {
																					setEditUnit(null);
																				}, 100);
																			}
																		}}
																		defaultValue={tc?.unit}
																	/>
																) : (
																	<>
																		<span className="col-lg-8">{tc?.unit}</span>
																	</>
																)}
															</td>
															<td className="border-0">
																{tc?.is_default == true ? (
																	''
																) : editUnit == tc?._id ? (
																	<>
																		<div className="d-flex flex-row justify-content-end">
																			<span className={`btn px-0 w-25`}>
																				<i
																					onClick={(e) => {
																						const name = inputData?.unit;
																						submitUnit({
																							...tc,
																							name,
																						});
																						setTimeout(() => {
																							setEditUnit(null);
																						}, 100);
																					}}
																					style={{
																						color: 'blue',
																						fontSize: '15px',
																					}}
																					className="fas fa-check theme-btnbg theme-secondary"></i>
																			</span>
																			{` `}
																			<span className={`btn px-0 w-25`}>
																				<i
																					onClick={() => {
																						setEditUnit(null);
																					}}
																					style={{
																						color: 'red',
																						fontSize: '15px',
																					}}
																					className="fas fa-times theme-btnbg theme-secondary"></i>
																			</span>
																		</div>
																	</>
																) : (
																	<>
																		<span
																			className="d-inline float-end"
																			tooltip={icon_delete.tooltip}
																			flow={icon_delete.tooltip_flow}>
																			<i
																				className="far fa-trash-alt float-end me-2 mt-2 theme-btnbg theme-secondary"
																				onClick={() =>
																					sweetAlert(
																						() =>
																							dispatch(
																								deleteUnit({
																									user_id: userId,
																									project_id: project_id,
																									unit_id: tc?._id,
																								}),
																							),
																						'Unit',
																					)
																				}></i>
																		</span>
																		<span
																			className="float-end d-inline"
																			tooltip={icon_edit.tooltip}
																			flow={icon_edit.tooltip_flow}>
																			<i
																				className="fas fa-edit float-end me-3 mt-2 theme-btnbg theme-secondary"
																				onClick={(e) =>
																					setEditUnit(tc?._id)
																				}></i>
																		</span>
																	</>
																)}
															</td>
														</tr>
													);
												})}
										</tbody>
									</Table>
								</div>
							) : (
								<Nodata type="unit" className="mt-0"></Nodata>
							)}
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer className="justify-content-center">
					<div className="container">
						<div className="row">
							{categoryHiden === 'unit' ? (
								<Table striped hover size="sm">
									<tbody className="border-0">
										<tr className={`theme-table-data-row bg-white border-0`}>
											<td className="border-0">
												<FormControl
													placeholder={`Enter ${unit_name_text.text}`}
													type="text"
													name="unit"
													autoComplete="off"
													onChange={(e) =>
														handleChangeCategory('unit', e.target.value)
													}
													onKeyPress={(e) => {
														if (e.key === 'Enter') {
															createInfo();
														}
													}}
													value={infoCategoryAndLocation.unit}
												/>
											</td>
											<div className="d-flex flex-row justify-content-end">
												<span className={`btn px-0 w-50`}>
													<i
														onClick={createInfo}
														style={{
															color: 'blue',
															fontSize: '15px',
														}}
														className="fas fa-check theme-btnbg theme-secondary"></i>
												</span>
												{` `}
												<span className={`btn px-0 w-50`}>
													<i
														onClick={() => {
															setCategoryHiden('');
															handleChangeCategory('unit', '');
															scrollDownById('unit-model-body');
														}}
														style={{
															color: 'red',
															fontSize: '15px',
														}}
														className="fas fa-times theme-btnbg theme-secondary"></i>
												</span>
											</div>{' '}
										</tr>
									</tbody>
								</Table>
							) : (
								''
							)}
						</div>

						<div className="row justify-content-center align-items-center">
							<div className="col-auto">
								<Button
									variant="light"
									className="light-border btn-block"
									onClick={() => {
										setEditUnit(null);
										handleUnitsModel();
										setCategoryHiden('');
									}}>
									<i className="fa-solid fa-xmark pe-2"></i>
									{close.text}
								</Button>
							</div>
							<div className="col-auto">
								<Button
									className="btn theme-btn btn-primary"
									tooltip={add_Unit.tooltip}
									flow={add_Unit.tooltip_flow}
									onClick={() => {
										setCategoryHiden('unit');
										handleChangeCategory('name', '');
										scrollDownById('unit-model-body');
									}}>
									<i className={'fas fa-plus'} />
									{add_Unit?.text}{' '}
								</Button>
							</div>
						</div>
					</div>
				</Modal.Footer>
			</Modal>

			{/* Template Model */}
			<Modal
				show={templateModel}
				centered
				className=""
				onHide={handleTemplateModel}>
				<Template handleTemplateModel={handleTemplateModel} />
			</Modal>

			{/* Vendor Model */}
			<Modal size="lg" show={vendorModel} onHide={handleVendorModel}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{manage_vendor?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body
					id={`vendor-model-body`}
					style={{
						maxHeight: '70vh',
						overflow: 'auto',
					}}
					className="pb-0">
					{!vendorFormShow && (
						<div className="row">
							<div className="col-sm-12">
								<FormControl
									className="me-1 lf-formcontrol-height "
									placeholder="Search vendor"
									type="text"
									name="name"
									autoComplete="off"
									onChange={(e) => setSearchUnit(e.target.value)}
									value={searchUnit}
									// onBlur={() => setCategoryHiden(null)}
								/>
							</div>
							<div className="col-sm-12 mt-3">
								<div
									// style={{
									// 	minWidth:'120%',
									// 	overflow:'auto'
									// }}
									className="theme-table-wrapper shadow-none border-0 rounded-0 mb-0 pb-3">
									<table className="table  table-hover theme-table">
										<thead className="">
											<tr className="border-divider">
												<th className="lfwpr-3">#</th>
												<th className="lfwpr-20">Vendor Name</th>
												<th className="lfwpr-12">Contact Name</th>
												<th className="lfwpr-15">Email</th>
												<th className="lfwpr-12">Contact No.</th>
												<th className="lfwpr-20">Address</th>
												<th className={`lfwpr-3 text-end`}>Action</th>
											</tr>
										</thead>
										<tbody className="border-0">
											{Array.isArray(vendorList) &&
												vendorList
													?.filter((v) => {
														if (searchUnit && searchUnit.trim()) {
															if (
																v.vendor_name
																	.toLowerCase()
																	.search(searchUnit.toLowerCase()) > -1
															) {
																return v;
															}
														} else {
															return v;
														}
													})
													?.map((tc, k) => {
														return (
															<tr
																key={`category-${k}`}
																className={`${
																	editUnit && editUnit == tc?._id
																		? 'bg-light border-divider'
																		: 'bg-transparent border-divider'
																}`}>
																<td className="">{k + 1}</td>
																<td className="">
																	<span>{tc?.vendor_name}</span>
																</td>
																<td className="text-secondary">
																	<span>{tc?.contact_name}</span>
																</td>
																<td className="text-secondary">
																	<span>{tc?.email}</span>
																</td>
																<td className="text-secondary">
																	<span>{tc?.contact_number}</span>
																</td>
																<td className="text-secondary">
																	<span>{tc?.address}</span>
																</td>
																<td className="text-end">
																	{tc?.is_default == true ? (
																		''
																	) : (
																		<>
																			<span
																				tooltip={icon_edit.tooltip}
																				flow={icon_edit.tooltip_flow}>
																				<i
																					className="fas fa-edit me-2 mt-2 theme-btnbg theme-secondary"
																					onClick={(e) => {
																						setVendorFormData(tc);
																						setvendorFormShow(true);
																					}}></i>
																			</span>
																			{` `}
																			<span
																				tooltip={icon_delete.tooltip}
																				flow={icon_delete.tooltip_flow}>
																				<i
																					className="far fa-trash-alt mt-2 theme-btnbg theme-secondary"
																					onClick={() =>
																						sweetAlert(
																							() =>
																								dispatch(
																									deleteVendorHandle(tc),
																								),
																							'Vendor',
																						)
																					}></i>
																			</span>
																		</>
																	)}
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
					{vendorFormShow ? (
						<div className="row align-items-baseline">
							<div className="col-6">
								<Form.Label htmlFor="templatename" className="mb-0">
									{vendor_name.text}
								</Form.Label>
								<FormControl
									className="lf-formcontrol-height"
									placeholder={vendor_name.text}
									type="text"
									name="vendor_name"
									autoComplete="off"
									onChange={(e) => handleFormData(e)}
									value={vendorFormData.vendor_name}
								/>
								{vendorFormData && !vendorFormData.vendor_name ? (
									<div className="text-danger">{`Please enter ${vendor_name.text}`}</div>
								) : (
									''
								)}
							</div>
							<div className="col-6 mt-2">
								<Form.Label htmlFor="templatename" className="mb-0">
									{contact_names.text}
								</Form.Label>
								<FormControl
									className="lf-formcontrol-height"
									placeholder={contact_names.text}
									type="text"
									name="contact_name"
									autoComplete="off"
									onChange={(e) => handleFormData(e)}
									value={vendorFormData.contact_name}
								/>
							</div>
							<div className="col-6 mt-2">
								<Form.Label htmlFor="templatename" className="mb-0">
									{email.text}
								</Form.Label>
								<FormControl
									className="lf-formcontrol-height"
									placeholder={email.text}
									type="email"
									name="email"
									autoComplete="off"
									onChange={(e) => handleFormData(e)}
									value={vendorFormData.email}
								/>
							</div>
							<div className="col-6 mt-2">
								<Form.Label htmlFor="templatename" className="mb-0">
									{contact_number.text}
								</Form.Label>
								<FormControl
									className="lf-formcontrol-height"
									placeholder={contact_number.text}
									type="number"
									name="contact_number"
									autoComplete="off"
									onChange={(e) => handleFormData(e)}
									value={vendorFormData.contact_number}
								/>
							</div>
							<div className="col-6 mt-2 mb-4">
								<Form.Label htmlFor="templatename" className="mb-0">
									{address?.text}
								</Form.Label>
								<FormControl
									className="lf-formcontrol-height"
									placeholder={address?.text}
									type="text"
									name="address"
									autoComplete="off"
									onChange={(e) => handleFormData(e)}
									value={vendorFormData.address}
								/>
							</div>
						</div>
					) : (
						''
					)}
				</Modal.Body>
				<Modal.Footer className="justify-content-center">
					{!vendorFormShow ? (
						<>
							<Button
								variant="light"
								className="light-border btn-block"
								onClick={handleVendorModel}>
								<i className="fa-solid fa-xmark pe-2"></i>
								{close.text}
							</Button>
							<Button
								className="btn theme-btn btn-primary"
								tooltip={add_Unit.tooltip}
								flow={add_Unit.tooltip_flow}
								onClick={() => {
									setvendorFormShow(true);
								}}>
								<i className={'fas fa-plus'} />
								{`Add ${vendor.text} `}
							</Button>
						</>
					) : (
						<>
							<Button
								variant="light"
								className="light-border btn-block"
								onClick={() => setvendorFormShow(false)}>
								<i className="fa-solid fa-xmark pe-2"></i>
								Cancel
							</Button>
							<Button
								className="btn theme-btn btn-primary"
								tooltip={`Add new vendor`}
								disabled={!vendorFormData.vendor_name}
								flow={`down`}
								onClick={saveVendor}>
								<i className={'fas fa-plus'} />
								{` `}
								{`Save ${vendor.text} `}
							</Button>
						</>
					)}
				</Modal.Footer>
			</Modal>
		</Layout>
	);
}

export default Projectsetting;
