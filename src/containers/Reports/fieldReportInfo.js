import { Component,useState,useEffect } from 'react';
import { connect } from 'react-redux';
import { OverlayTrigger } from 'react-bootstrap';
import Layout from '../../components/layout';
import getUserId, {
	getSiteLanguageData,
	sweetAlert,
	getIconByType,
} from '../../commons';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import {
	GET_SURVEY_REPORT_LIST_BY_SURVEY_ID,
	GET_SURVEY_REQUEST_DETAILS_BY_ID,
	GET_PROJECT_DETAILS,
	GET_ALL_TEMPLATE,
} from '../../store/actions/actionType';
import {
	downloadSurveyReport,
	getSurveyReportListBySurveyId,
	getSurveyRequestDetails,
	signSurveyReport,
	saveQuestionSurveyReport,
	unlockReport,
} from '../../store/actions/report';
import TextareaAutosize from 'react-textarea-autosize';
import { getParameterByName } from '../../helper';
import Signature from '../../components/signature';
import Upload from '../../components/upload';
import OpenAttachement from './openAttechmentphotos';
import moment from 'moment';
import { errorNotification } from '../../commons/notification';
import DatePicker from 'react-datepicker';
import {
	setLightBoxImageData,
	setLightBoxImageDefaultUrl,
	toggleLightBoxView,
} from '../../store/actions/imageLightBox';
import withRouter from '../../components/withrouter';
import SurveyReportInfo from './Components/surveyReportInfo';
import { getAllTemplateWithFullDetails } from '../../store/actions/projects';
import CustomSelect from '../../components/SelectBox';
import CustomDate from '../../components/CustomDate';
import matchers from '@testing-library/jest-dom/matchers';
import GenerateSurveyReport from './Components/GenerateSurveyReport';
import Loading from '../../components/loadig';
import {useSelector,useDispatch} from 'react-redux';
import { useParams, useNavigate } from 'react-router';

const SurveyReport = (props) => {
	const dispatch = useDispatch();
	const params = useParams();
	const userId = getUserId();
	const navigate = useNavigate();

	const project_id = params.project_id;
	const date = getParameterByName('report_date');
	const survey_report_request_id = params.survey_report_request_id;

	const data = useSelector((state)=> {
		return state?.report?.[GET_SURVEY_REPORT_LIST_BY_SURVEY_ID]?.result || []
	});
	
	const reportData = useSelector((state)=> {
		return state?.report?.[GET_SURVEY_REQUEST_DETAILS_BY_ID]?.result || []
	});

	const projectDetails = useSelector((state)=> {
		return state?.project?.[GET_PROJECT_DETAILS]?.result || []
	});

	const template = useSelector((state)=> {
		return state?.project?.[GET_ALL_TEMPLATE]?.result || []
	});

	const minDate =
		reportData &&
		Array.isArray(reportData) &&
		reportData.length > 0 &&
		Array.isArray(reportData[0]?.final_date) &&
		reportData[0].final_date[0]
			? new Date(
					moment(new Date(reportData[0]?.final_date[0])).format('YYYY-MM-DD'),
			  )
			: new Date();

	let dtArr = reportData?.[0]?.final_date?.[0]
		? reportData?.[0]?.final_date?.map((d) => new Date(d))
		: [new Date()];

	const maxCDate = new Date(Math.max.apply(null, dtArr));

	const templates = template?.map((tl) => {
		return { label: tl.name, value: tl._id };
	});

	const reportDate = [];
	reportData[0]?.final_date?.forEach((d) => {
		reportDate.push(moment(d).format('YYYY-MM-DD'));
	});

	const {
		cancel,
		save,
		discard,
		submit,
		survey_observations,
		sn,
		question,
		yes,
		no,
		na,
		notes,
		Photos,
		download,
		unlock,
	} = getSiteLanguageData('reports/toolbar');

	const { general_notes, attachement, signed_by, survey_questions } =
		getSiteLanguageData('reports/components/fieldreportinfo');
	const { new_n } = getSiteLanguageData('commons');

	const [newDate, setNewDate] = useState(date);
	const [edit, setEdit] = useState(true);
	const [tempalteId, setTempalteId] = useState('');
	const [useTemplate, setUseTemplate] = useState(false);
	const [answers, setAnswers] = useState(data?.questionlist || []);

	const [info, setInfo] = useState({
		project_id,
		user_id: userId,
		survey_report_id: data?._id,
		answers: [],
		general_notes: '',
		attachement: [],
		signature_url: '',
		signed_by: userId,
		survey_report_request_id,
		date,
	});
	const [showShareModel, setShowShareModel] = useState(false);
	const [shareLink, setShareLink] = useState(null);
	const [reportDetails, setReportDetails] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [backButtonClicked, setBackButtonClicked] = useState(false);

	useEffect(() => {
		const handleBackButton = () => {
		  if (!backButtonClicked) {
			setBackButtonClicked(true);
			navigate(`/reports/${project_id}`);
			window.location.reload();
		  }
		};
		
		window.addEventListener('popstate', handleBackButton);
	
		return () => {
		  window.removeEventListener('popstate', handleBackButton);
		  
		};
	  }, [backButtonClicked]);


	useEffect(() => {
		dispatch(
			getSurveyReportListBySurveyId(
				survey_report_request_id,
				moment(newDate).format('YYYY-MM-DD'),
			),
		);
		dispatch(
			getSurveyRequestDetails(survey_report_request_id, (rD) => {
				setReportDetails(rD?.result?.[0]);
			}),
		);
		dispatch(getAllTemplateWithFullDetails(project_id));
	}, [newDate, dispatch, project_id, survey_report_request_id]);

	useEffect(() => {
		let signatureUrl = info?.signature_url;
		if (data) {
			const result = [];
			data?.questionlist?.map((m) => {
				result.push({
					answer: m.answer,
					question_text: m.question_text,
					description: m.description,
					file: m?.file,
					question: m?.question,
					survey_report_question_id: m?._id,
				});
			});
			setNewDate(date);
			setAnswers(result);

			setInfo({
				project_id,
				user_id: userId,
				survey_report_id: data?._id,
				answers: [],
				general_notes: data?.general_notes,
				attachement: data?.attachement,
				signature_url: signatureUrl,
				signed_by: userId,
				survey_report_request_id: survey_report_request_id,
				date,
			});
		}
	}, [data]);

	const hendleShowShereModel = () => {
		setShowShareModel(!showShareModel);
	};

	const handleDelete = (link)=>{
		const newArr = info?.attachement?.filter((item) => {
			return item !== link;
		});
		handleChange('attachement', newArr);
	}

	const handleChangeAnswers = (name, val, k) => {
		const arr = answers;
		arr[k] = {
			...arr[k],
			[name]: val,
		};
		setAnswers([...arr]);
	};

	const handleChange = (name, value, k) => {
		setInfo({
			...info,
			[name]: value,
		});
	};

	const handleChangeSignature = (signature) => {
		setInfo({
			...info,
			signature_url: signature,
		});
	};

	const submitSurvey = (e) => {
		e.preventDefault();
		if (info?.signature_url) {
			dispatch(
				signSurveyReport({ ...info, answers: answers, survey_report_id : data?._id }),
			);
		} else {
			errorNotification('Please first sign the report');
		}
	};

	const handleQuestion = (index = null) => {
		if (index) {
			const arr = answers.filter((item, k) => {
				return k + 1 !== index;
			});
			setAnswers(arr);
		} else {
			let arr = answers ? [...answers] : [];
			arr.push({
				answer: 'N/A',
				question_text: '',
				description: '',
				file: [],
				survey_report_question_id: 'undefined',
			});
			setAnswers(arr);
		}
	};

	const handleCalncel = () => {
		setNewDate(date);
		const result = [];
		data?.questionlist?.map((m) => {
			result.push({
				answer: m.answer,
				question_text: m.question_text,
				description: m.description,
				file: m?.file,
				question: m?.question,
				survey_report_question_id: m?._id,
			});
		});
		setAnswers(result);

		setInfo({
			project_id: project_id,
			user_id: userId,
			survey_report_id: data?._id,
			answers: [],
			general_notes: data?.general_notes,
			attachement: data?.attachement,
			signature_url: data?.signature_url,
			signed_by: userId,
			survey_report_request_id: survey_report_request_id,
			date: date,
		});

	};
	const renderDayContents = (day, date, fr) => {
		const cdate = moment(date).format('YYYY-MM-DD');
		const vb = fr?.filter((x) => moment(x).format('YYYY-MM-DD') === cdate);
		return (
			<span>
				{moment(date).date()}
				{vb.length > 0 ? <span className="fw-icon-dot"></span> : ''}
			</span>
		);
	};

	const handleImageView = (val) => {
		const images = [];
		info?.attachement.forEach((d) => {
			images.push(d);
		});
		dispatch(setLightBoxImageData(images));
		dispatch(toggleLightBoxView(true));
		dispatch(setLightBoxImageDefaultUrl(val));
	};

	const handleEdit = () => {
		setEdit(!edit);
		dispatch(
			saveQuestionSurveyReport({
				...info,
				survey_report_id: data?._id,
				answers: answers,
			}),
		);
	};

	return (
		<>
			<Layout>
				<div id="page-content-wrapper">
					<div className="lf-dashboard-toolbar field-report-toolbar">
						<section className="px-3">
							<div className="row align-items-center">
								<div className="col-sm-12">
									<div className="d-flex">

									
									<div className="d-flex align-items-center mt-1">
										<div className="float-start d-none d-md-inline-block">
											<a
												className="lf-common-btn"
												href={`/reports/${project_id}`}>
												<i className="fa fa-arrow-left" aria-hidden="true"></i>
											</a>
										</div>
										<div className="float-start d-none d-lg-inline-block">
											<span className="lf-text-overflow-350 text-nowrap mt-1">
												{' '}
												{/* {survey_observations?.text}{' '} */}
												{reportData &&
												Array.isArray(reportData) &&
												reportData.length > 0
													? reportData[0].description
													: ''}{' '}
											</span>
										</div>
									</div>
									<div className="ms-auto d-flex float-end d-md-inline-block text-middle">
										<div className="d-flex align-items-center float-start mt-1">
											<span className="p-sm-2 lf-reports-store-room-stocks-mobile theme-secondary">
												<i
													className="fas fa-less-than"
													onClick={() => {
														const arr = reportDate
															?.filter((d) => d !== date)
															?.filter((c) => c < date);
														if (arr?.length !== 0) {
															window.location.href = `/reports/${project_id}/fieldReportInfo/${survey_report_request_id}?report_date=${moment(
																arr[arr.length - 1],
															).format('YYYY-MM-DD')}`;
														} else {
															// errorNotification(`Date is out of Frequncy`);
														}
													}}
												/>

												<span
													style={{
														display: 'inline-block',
														width: '82px',
													}}
													className="theme-btnbg mx-1 react-datepicker__input-container text-nowrap theme-secondary rounded lf-link-cursor">
													<DatePicker
														tooltip="Calender"
														flow="down"
														className="d-inline-block"
														selected={moment(date).toDate()}
														customInput={
															<span>
																<i className="far fa-calendar-alt" />{' '}
																<CustomDate date={date} />
															</span>
														}
														filterDate={(date) => {
															let dtArrs = reportData?.[0]?.final_date?.map(
																(dd) => moment(dd).format('YYYY-MM-DD'),
															);
															return (
																dtArrs &&
																Array.isArray(dtArrs) &&
																dtArrs.includes(
																	moment(date).format('YYYY-MM-DD'),
																)
															);
														}}
														onChange={(e) => {
															const date = moment(e).format('YYYY-MM-DD');
															const vb = reportDate?.filter(
																(x) =>
																	moment(x).format('YYYY-MM-DD') === date,
															);
															if (vb.length > 0) {
																window.location.href = `/reports/${project_id}/fieldReportInfo/${survey_report_request_id}?report_date=${date}`;
															} else {
																errorNotification('Please Select valid date');
															}
														}}
														minDate={new Date(minDate)}
														maxDate={
															maxCDate && new Date(maxCDate) > new Date()
																? new Date()
																: maxCDate
														}
													/>
												</span>

												<i
													className="fas fa-greater-than ps-1"
													onClick={() => {
														const arr = reportDate
															?.filter((d) => d !== date)
															?.filter((c) => c > date);

														if (
															arr?.length !== 0 &&
															new Date(arr[0]) <= new Date()
														) {
															window.location.href = `/reports/${
																project_id
															}/fieldReportInfo/${
																survey_report_request_id
															}?report_date=${moment(arr[0]).format(
																'YYYY-MM-DD',
															)}`;
														}
														// errorNotification(`Date is out of Frequncy`);
													}}
												/>
											</span>
										</div>

										<div className="d-flex float-start mt-1 d-none d-md-block">
											<SurveyReportInfo
												data={survey_report_request_id}
												type="Survey Report"
												hideBtn={true}
												onlyinfo={'onlyinfo'}
											/>
										</div>

										<div className="d-flex float-start mt-1">

											{projectDetails?.role?.access?.field_report
														?.create_report == 1 &&
														!data?.is_locked && (
															<OverlayTrigger
																trigger="click"
																placement="bottom-start"
																rootClose={true}
																overlay={
																	<div
																		style={{
																			zIndex: '9999',
																			width: '300px',
																			maxHeight: '300px',
																			background: 'white',
																		}}
																		className="p-2 border">
																		<CustomSelect
																			placeholder="Select Template..."
																			onChange={(e) => {
																				setTempalteId(e?.value);
																				const temp = template
																					?.filter(
																						(tem) => tem?._id === e?.value,
																					)?.[0]
																					?.checklist?.map((ch) => ch?.title);
																				const arr = [...answers];
																				temp?.map((tt) =>
																					arr.push({
																						answer: 'N/A',
																						question_text: tt,
																						description: '',
																						file: [],
																						survey_report_question_id:
																							'undefined',
																					}),
																				);
																				setAnswers(arr);
																			}}
																			options={templates}
																			value={templates?.filter(
																				(t) => t?.value === tempalteId,
																			)}
																			required
																		/>
																	</div>
																}>
																<span
																	// tooltip={`${filter_by_tags?.text} ${tagsFilter.length > 0 ? `(${tagsFilter.length})` : ''}`}
																	flow={`down`}
																	className={`lf-common-btn`}>
																	<i className="fas fa-plus lf-all-icon-size" />
																	{` Question `}
																	{/* {filter_by_tags?.text}
														{tagsFilter.length > 0 ? `(${tagsFilter.length})` : ''} */}
																</span>
															</OverlayTrigger>
														)}
										</div>

										<div className="d-flex float-start mt-1">
											{typeof data?.is_locked != 'undefined' &&
												data?.is_locked != true && (
													<span
														className={'lf-common-btn d-none d-md-block'}
														disabled={data?.is_locked}
														onClick={handleEdit}>
														<i className="fa-solid fa-floppy-disk p-1"></i>
														{save?.text}
													</span>
												)}
											{!data?.is_locked && (
												<span
													className="lf-common-btn d-none d-md-block"
													onClick={() => handleCalncel()}>
													<i className="fa-solid fa-eraser p-1"></i>
													{discard?.text}
												</span>
											)}
										</div>

										<div className="d-flex float-start">

										

										{
												data?.is_locked === true ? (
													<>
													<div className="mt-1">
													<span
																type="submit"
																className="lf-common-btn"
																onClick={() => {
																	setShareLink(null);
																	sweetAlert(
																		() => {
																			hendleShowShereModel();
																			dispatch(
																				downloadSurveyReport(
																					{
																						project_id: project_id,
																						user_id: userId,
																						survey_report_id: data?._id,
																					},
																					(repData) => {
																						if (repData?.data?.result?.file) {
																							setShareLink(repData?.data?.result?.file);
																						} else {
																							setShareLink(null);
																						}
																					},
																				),
																			);
																		},
																		'Survey Report',
																		'Download',
																	);
																}}>
																<i className="fa-solid fa-download pe-2"></i>
																{download?.text}
															</span>
															<span
																className="lf-common-btn"
																onClick={() =>
																	sweetAlert(
																		() =>
																			dispatch(
																				unlockReport({
																					survey_report_request_id:
																						survey_report_request_id,
																					report_date: date,
																					project_id: project_id,
																					user_id: userId,
																					report_name:
																						reportData?.[0]
																							?.description,
																					report_id: data?._id,
																					report_type: 'SurveyReport',
																				}),
																			),
																		'Survey Report',
																		'Unlock',
																	)
																}>
																<i className="fa-solid fa-lock-open pe-2"></i>
																{unlock?.text}
															</span>
													</div>

													</>
												) : (
													<>
														{new Date() >= new Date(date) && (
															
															<Signature
																setUrl={handleChangeSignature}
																url={info?.signature_url}
																signReport={submitSurvey}
															/>
															
														)}
													</>
												)
												// <span type="submit" className="lf-common-btn mt-1"
												//   onClick={this.submitSurvey}
												// >{submit?.text}</span>
											}
										</div>	

									</div>
									</div>
								</div>

								
							</div>
						</section>
					</div>

					<div className="container-fluid mt-2">
						<div className="row">
							<div className="col-12">
								<div className="my-2 ms-4">
									<span className="theme-secondary fw-bold d-inline-block">
										{survey_questions.text}
									</span>
								</div>
								<div className="theme-table-wrapper card mx-3">
									<table className="table table-hover theme-table">
										<thead className="theme-table-title text-nowrap bg-light">
											<tr className="bg-light text-nowrap text-capitalize col-12">
												<th className="text-center lf-w-40">{sn?.text}</th>
												<th className="text-center lf-w-320">
													{question?.text}
												</th>

												{/* <th style={{ width: '320px' }}>{question?.text}</th> */}
												<th className="text-center lf-w-40">{yes?.text}</th>
												<th className="text-center lf-w-40">{no?.text}</th>
												<th className="text-center lf-w-40">{na?.text}</th>
												<th className="text-center lf-w-320">{notes?.text}</th>
												<th className="text-center lf-w-80">{Photos?.text}</th>
												<th className=""></th>
											</tr>
										</thead>
										<tbody>
																						{answers?.map((sr, k) => {
																								return (
													<>
														<tr className="align-top" key={k}>
															<td
																className="text-center pt-auto pb-auto lf-w-40"
																style={{
																	paddingTop: '',
																}}>
																<span
																	className="theme-color"
																	style={
																		data?.is_locked ||
																		(edit &&
																			projectDetails?.role?.access
																				?.field_report?.fill_report != 1 &&
																			reportData?.[0]?.createdBy
																				?._id != userId)
																			? {
																					pointerEvents: 'none',
																					opacity: 0.8,
																			  }
																			: {}
																	}>
																	<i
																		onClick={() => handleQuestion(k + 1)}
																		title="Remove"
																		className="fas fa-minus-circle mt-2"></i>
																</span>{' '}
																{k + 1}
															</td>
															<td className="text-start pt-auto pb-auto lf-w-320">
																<TextareaAutosize
																	style={{ width: '100%' }}
																	type="text"
																	as={`textarea`}
																	// rows={Math.ceil(
																	// 	(sr?.question_text
																	// 		? sr?.question_text
																	// 		: (sr?.question?.question ? sr?.question?.question : "")
																	// 	)?.length / 60,
																	// )}
																	minRows={1}
																	maxRows={6}
																	name="question_text"
																	autoComplete="off"
																	onChange={(e) =>
																		handleChangeAnswers(
																			'question_text',
																			e.target.value,
																			k,
																		)
																	}
																	value={
																		sr?.question_text ?? sr?.question?.question ?? ""
																	}
																	disabled={
																		data?.is_locked
																			? true
																			: projectDetails?.role?.access
																					?.field_report?.fill_report
																			? false
																			: reportData?.[0]?.createdBy
																					?._id != userId
																			? true
																			: false
																	}
																/>
															</td>
															<td
																className="lf-w-40 pt-auto pb-auto"
																style={{
																	paddingTop: '0.875rem',
																}}>
																<label className="checkgreen">
																	<input
																		type="radio"
																		id={k}
																		onChange={(e) =>
																			handleChangeAnswers(
																				'answer',
																				e.target.value,
																				k,
																			)
																		}
																		value="Yes"
																		checked={sr?.answer === 'Yes'}
																		disabled={data?.is_locked}
																	/>
																	<span className="checkmarkgreen ms-3 border border-secondary"></span>
																</label>
															</td>
															<td
																className="lf-w-40"
																style={{
																	paddingTop: '0.875rem',
																}}>
																<label className="checkred">
																	<input
																		type="radio"
																		id={k}
																		onChange={(e) =>
																			handleChangeAnswers(
																				'answer',
																				e.target.value,
																				k,
																			)
																		}
																		value="No"
																		checked={sr?.answer === 'No'}
																		disabled={data?.is_locked}
																	/>
																	<span className="checkmarkred ms-3 border border-secondary"></span>
																</label>
															</td>
															<td
																className="text-center lf-w-40"
																style={{
																	paddingTop: '0.875rem',
																}}>
																<label className="checkgray ">
																	<input
																		type="radio"
																		id={k}
																		onChange={(e) =>
																			handleChangeAnswers(
																				'answer',
																				e.target.value,
																				k,
																			)
																		}
																		value="N/A"
																		checked={sr?.answer === 'N/A'}
																		disabled={data?.is_locked}
																	/>
																	<span className="checkmarkgray ms-3 border border-secondary"></span>
																</label>
															</td>
															<td className="lf-w-320">
																<TextareaAutosize
																	style={{ width: '100%' }}
																	type="text"
																	as={`textarea`}
																	minRows={1}
																	maxRows={6}
																	name="description"
																	autoComplete="off"
																	onChange={(e) =>
																		handleChangeAnswers(
																			'description',
																			e.target.value,
																			k,
																		)
																	}
																	value={sr?.description}
																	disabled={data?.is_locked}></TextareaAutosize>
															</td>
															<td
																className="lf-w-80"
																style={{
																	paddingTop: '0.5rem',
																}}>
																<div className="row m-0">
																	<div className="col-6">
																		{sr?.file?.length > 0 ? (
																			<OpenAttachement
																				file={sr?.file}
																				k={k}
																				handleChangeAnswers={
																					handleChangeAnswers
																				}
																				data={data?.is_locked}>
																				<span className="fw-bolder ms-4 text-nowrap d-inline-block">
																					<img
																						alt="livefield"
																						src={sr?.file[0]}
																						className="lf-priority-report"></img>
																					+{sr?.file?.length}
																				</span>
																			</OpenAttachement>
																		) : data?.is_locked ? (
																			<span className=" lf-link-cursor d-inline-block mt-1 ms-5 text-secondary ">
																				<i className="fas fa-plus" />
																			</span>
																		) : (
																			<OpenAttachement
																				file={sr?.file}
																				k={k}
																				handleChangeAnswers={
																					handleChangeAnswers
																				}
																				data={data?.is_locked}>
																				<span className=" lf-link-cursor d-inline-block mt-1 ms-5 text-secondary ">
																					<i className="fas fa-plus" />
																				</span>
																			</OpenAttachement>
																		)}
																	</div>
																	{/* --------------------------------------------- */}
																	{/* old Upload function */}
																	{/* <div className="col-6">
                                  <div className="mt-1">
                                    <Upload className="d-inline-block" fileType="attachement_photo" fileKey={sr?.survey_report_question_id} onFinish={(file) => {
                                      const fileList = sr?.file;
                                      fileList.push(file)
                                      this.handleChangeAnswers('file', fileList, k)
                                    }}>
                                      <span className="theme-color lf-link-cursor" >
                                        <i className="fas fa-plus" />
                                      </span>
                                    </Upload>
                                  </div>
                                </div> */}
																	{/* --------------------------------------------- */}
																</div>
															</td>
															<td className="text-center lf-w-20 p-1">
																{/* <button
																	className={
																		edit === k
																			? 'float-end btn lf-common-btn'
																			: ' float-end lf-main-button'
																	}
																	disabled={data?.is_locked}
																	onClick={() => this.setEdit(k)}>
																	Edit
																</button> */}
															</td>
														</tr>
													</>
												);
											})}
										</tbody>
									</table>
									{projectDetails?.role?.access?.field_report
										?.create_report == 1 &&
										data?.is_locked != true && (
											<span
												onClick={() => handleQuestion()}
												className="lf-common-btn ms-5 text-nowrap"
												style={
													data?.is_locked === true
														? { pointerEvents: 'none', opacity: 0.8 }
														: {}
												}>
												<i className={'fas fa-plus mx-1'} />
												{new_n.text}
											</span>
										)}
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-6 ms-3">
								<strong className="theme-secondary ms-2">
									{general_notes?.text}
								</strong>
								<div className="mt-2">
									<InputGroup className="">
										<FormControl
											placeholder={`${general_notes.text}.. `}
											as="textarea"
											name="general_notes"
											autoComplete="off"
											rows="6"
											onChange={(e) =>
												handleChange('general_notes', e.target.value)
											}
											value={info?.general_notes}
											disabled={data?.is_locked === true}
										/>
									</InputGroup>
								</div>
							</div>
							<div className="col-lg-5 me-3">
								<div className="row">
									<div
										className="col-12 d-flex"
										style={
											data?.is_locked === true
												? { pointerEvents: 'none', opacity: 0.8 }
												: {}
										}>
										<div className="col-6 mb-2">
											<span className="theme-secondary fw-bold d-inline-block">
												{attachement.text}
											</span>
										</div>
										<div className="col-6 ms-4 me-0 mb-2">
											{data && typeof data._id != 'undefined' && (
												<Upload
													isLoading={isLoading} 
													setIsLoading={setIsLoading}
													fileType="survey_genral_attachment"
													fileKey={data?._id}
													onFinish={(file) => {
														const fileList = info?.attachement || [];
														fileList?.push(file);
														handleChange('attachement', fileList);
													}}
												/>
											)}
										</div>
									</div>

									<div className="col-12">
										<div className="card lf-load-more-attechment">
											{isLoading && <Loading />}
											<span className="p-2 d-inline-block">
												{info?.attachement?.length > 0
													? info.attachement.map((f, k) => {
															return (
																<>
																	<img
																		alt="livefield"
																		src={getIconByType(f.split('.').pop())}
																		onClick={() => handleImageView(f)}
																		className={`me-2`}
																		style={{ height: '40px' }}
																	/>
																	{data?.is_locked === true ? (
																		''
																	) : (
																		<i
																			className="fas fa-times fa-xs lf-icon"
																			onClick={()=>handleDelete(f)}></i>
																	)}
																</>
															);
													  })
													: null}
											</span>
										</div>
									</div>
									<div className="mt-3">
										{/* <Signature setUrl={this.handleChange} url={this.state.info?.signature_url} /> */}
									</div>
								</div>
							</div>
						</div>
						{data &&
							data.is_locked == true &&
							data.signedby &&
							Array.isArray(data.signedby) &&
							data.signedby.length > 0 && (
								<div className="row my-4">
									<div className="col-6">
										<div className="ms-3">
											<span className="theme-secondary fw-bold d-inline-block">
												{signed_by.text}
											</span>
										</div>
										<div className="card ms-3 p-3">
											<div className="d-flex align-items-center">
												<div className="w-50">
													<img
														className="top-pofile-pic"
														src={data?.signedby[0].thumbnail}></img>
													{data.signedby[0].first_name}{' '}
													{data.signedby[0].last_name}
												</div>
												<div style={{ width: '30%' }}>
													{moment(data.signed_date).format('YYYY-MM-DD')}
												</div>
												<div style={{ width: '20%' }}>
													<img
														style={{ height: '40px' }}
														src={data?.signature_url}></img>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
					</div>
				</div>

				<GenerateSurveyReport
					open={showShareModel}
					project_id={project_id}
					shareLink={shareLink}
					handleClose={hendleShowShereModel}
				/>
			</Layout>
		</>
	);
};

export default withRouter(SurveyReport);

// export default withRouter(
// 	connect((state) => {
// 		return {
// 			data: state?.report?.[GET_SURVEY_REPORT_LIST_BY_SURVEY_ID]?.result || [],
// 			reportData:
// 				state?.report?.[GET_SURVEY_REQUEST_DETAILS_BY_ID]?.result || [],
// 			projectDetails: state?.project?.[GET_PROJECT_DETAILS]?.result || [],
// 			template: state?.project?.[GET_ALL_TEMPLATE]?.result || [],
// 		};
// 	})(SurveyReport),
// );
