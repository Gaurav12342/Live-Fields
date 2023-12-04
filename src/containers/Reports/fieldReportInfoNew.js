import { Component } from 'react';
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
class SurveyReport extends Component {
	constructor(props) {
		super(props);
		const { data } = this.props;

		this.userId = getUserId();
		this.project_id = this.props.router?.params.project_id;
		this.date = getParameterByName('report_date');
		this.survey_report_request_id =
			this.props.router?.params.survey_report_request_id;
		this.state = {
			newDate: this.date,
			edit: true,
			tempalteId: '',
			useTemplate: false,
			answers: data?.questionlist?.map((m) => {
				return {
					answer: m.answer,
					question_text: m.question_text,
					description: m.description,
					file: m?.file,
					question: m?.question,
					survey_report_question_id: m?._id,
				};
			}),
			info: {
				project_id: this.project_id,
				user_id: this.userId,
				survey_report_id: data?._id,
				answers: [],
				general_notes: '',
				attachement: [],
				signature_url: '',
				signed_by: this.userId,
				survey_report_request_id: this.survey_report_request_id,
				date: this.date,
			},
			showShareModel: false,
			shareLink: null,
			reportDetails: {},
		};
	}

	componentDidMount() {
		const { dispatch } = this.props;
		const { newDate } = this.state;

		dispatch(
			getSurveyReportListBySurveyId(
				this.survey_report_request_id,
				moment(newDate).format('YYYY-MM-DD'),
			),
		);

		dispatch(
			getSurveyRequestDetails(this.survey_report_request_id, (rD) => {
				this.setState({ reportDetails: rD?.result?.[0] });
			}),
		);
		dispatch(getAllTemplateWithFullDetails(this.project_id));
	}
	componentDidUpdate(prevProps, prevState) {
		const { data } = this.props;
		let signatureUrl = this.state?.info?.signature_url;
		if (prevProps.data !== data) {
			if (!!data?._id) {
				this.setState({
					newDate: this.date,
					answers: data?.questionlist?.map((m) => {
						return {
							answer: m.answer,
							question_text: m.question_text,
							description: m.description,
							file: m?.file,
							question: m?.question,
							survey_report_question_id: m?._id,
						};
					}),
					info: {
						project_id: this.project_id,
						user_id: this.userId,
						survey_report_id: data?._id,
						answers: [],
						general_notes: data?.general_notes,
						attachement: data?.attachement,
						signature_url: signatureUrl,
						signed_by: this.userId,
						survey_report_request_id: this.survey_report_request_id,
						date: this.date,
					},
				});
			}
		}
	}

	hendleShowShereModel = () => {
		this.setState({ showShareModel: !this.state.showShareModel });
	};

	setNewDate = (newDate) => {
		this.setState({ newDate });
	};
	setAnswers = (answers) => {
		this.setState({ answers });
	};
	setTemplate = (tempalteId) => {
		this.setState({ tempalteId });
	};
	setInfo = (info) => {
		this.setState({ info });
	};
	setUseTemplate = (useTemplate) => {
		this.setState({ useTemplate });
	};
	setEdit = (edit) => {
		this.setState({ edit });
		// if(edit){
		this.props.dispatch(
			saveQuestionSurveyReport({
				...this.state.info,
				answers: this.state.answers,
			}),
		);
		// }
	};
	handleDelete = (link) => {
		const newArr = this.state.info?.attachement?.filter((item) => {
			return item !== link;
		});
		this.handleChange('attachement', newArr);
	};
	handleChangeAnswers = (name, val, k) => {
		const arr = this.state.answers;
		arr[k] = {
			...arr[k],
			[name]: val,
		};
		this.setAnswers([...arr]);
	};
	handleChange = (name, value, k) => {
		this.setInfo({
			...this.state.info,
			[name]: value,
		});
	};

	handleChangeSignature = (signature) => {
		this.setInfo({
			...this.state.info,
			signature_url: signature,
		});
	};

	submitSurvey = (e) => {
		e.preventDefault();
		if (this.state.info?.signature_url) {
			this.props.dispatch(
				signSurveyReport({ ...this.state.info, answers: this.state.answers }),
			);
		} else {
			errorNotification('Please first sign the report');
		}
	};
	handleSortType = (sortType) => {
		this.setState(sortType);
	};
	handleQuestion = (index = null) => {
		if (index) {
			const arr = this.state.answers.filter((item, k) => {
				return k + 1 !== index;
			});
			this.setAnswers(arr);
		} else {
			let arr = this.state.answers ? [...this.state.answers] : [];
			arr.push({
				answer: 'N/A',
				question_text: '',
				description: '',
				file: [],
				survey_report_question_id: 'undefined',
			});
			this.setAnswers(arr);
		}
	};
	handleCalncel = () => {
		const { data } = this.props;
		this.setState({
			newDate: this.date,
			answers: data?.questionlist?.map((m) => {
				return {
					answer: m.answer,
					question_text: m.question_text,
					description: m.description,
					file: m?.file,
					question: m?.question,
					survey_report_question_id: m?._id,
				};
			}),
			info: {
				project_id: this.project_id,
				user_id: this.userId,
				survey_report_id: data?._id,
				answers: [],
				general_notes: data?.general_notes,
				attachement: data?.attachement,
				signature_url: data?.signature_url,
				signed_by: this.userId,
				survey_report_request_id: this.survey_report_request_id,
				date: this.date,
			},
		});
	};
	renderDayContents = (day, date, fr) => {
		const cdate = moment(date).format('YYYY-MM-DD');
		const vb = fr?.filter((x) => moment(x).format('YYYY-MM-DD') === cdate);
		return (
			<span>
				{moment(date).date()}
				{vb.length > 0 ? <span className="fw-icon-dot"></span> : ''}
			</span>
		);
	};

	handleImageView = (val) => {
		const images = [];
		this.state.info?.attachement.forEach((d) => {
			images.push(d);
		});
		this.props.dispatch(setLightBoxImageData(images));
		this.props.dispatch(toggleLightBoxView(true));
		this.props.dispatch(setLightBoxImageDefaultUrl(val));
	};

	render() {
		const { data, reportData, template } = this.props;
		const { answers, edit, useTemplate } = this.state;
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

		// const maxCDate = new Date();// reportData && Array.isArray(reportData) && reportData.length > 0 && Array.isArray(reportData[0]?.final_date) && reportData[0].final_date[0] ? new Date(moment(new Date(reportData[0]?.final_date.pop())).format("YYYY-MM-DD")) : new Date();

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
		return (
			<Layout>
				<div id="page-content-wrapper">
					<div className="lf-dashboard-toolbar field-report-toolbar">
						<section className="px-3">
							<div className="row align-items-center">
								<div className="col-md-3">
									<div className="d-flex align-items-center">
										<span className="py-1">
											<a
												className="lf-common-btn"
												href={`/reports/${this.project_id}`}>
												<i className="fa fa-arrow-left" aria-hidden="true"></i>
											</a>
										</span>
										<h3 className="text-nowrap">
											{' '}
											{/* {survey_observations?.text}{' '} */}
											{this.props.reportData &&
											Array.isArray(this.props.reportData) &&
											this.props.reportData.length > 0
												? this.props.reportData[0].description
												: ''}{' '}
										</h3>
									</div>
								</div>
								<div className="col-md-9 text-nowrap lf-field-report-header-res">
									<nav aria-label="breadcrumb ">
										<ul className="breadcrumb float-end">
											<li>
												<span className="p-sm-2 lf-reports-store-room-stocks-mobile theme-secondary">
													<i
														className="fas fa-less-than"
														onClick={() => {
															const arr = reportDate
																?.filter((d) => d !== this.date)
																?.filter((c) => c < this.date);
															if (arr?.length !== 0) {
																window.location.href = `/reports/${
																	this.project_id
																}/fieldReportInfo/${
																	this.survey_report_request_id
																}?report_date=${moment(
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
															selected={moment(this.date).toDate()}
															customInput={
																<span>
																	<i className="far fa-calendar-alt" />{' '}
																	<CustomDate date={this?.date} />
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
																	window.location.href = `/reports/${this.project_id}/fieldReportInfo/${this.survey_report_request_id}?report_date=${date}`;
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
														className="fas fa-greater-than p-1 ps-2"
														onClick={() => {
															const arr = reportDate
																?.filter((d) => d !== this.date)
																?.filter((c) => c > this.date);

															if (
																arr?.length !== 0 &&
																new Date(arr[0]) <= new Date()
															) {
																window.location.href = `/reports/${
																	this.project_id
																}/fieldReportInfo/${
																	this.survey_report_request_id
																}?report_date=${moment(arr[0]).format(
																	'YYYY-MM-DD',
																)}`;
															}
															// errorNotification(`Date is out of Frequncy`);
														}}
													/>
												</span>
											</li>
											<li>
												{/* <ReportInfo
													data={this.survey_report_request_id}
													type="Survey Report"
												/> */}
												<SurveyReportInfo
													data={this.survey_report_request_id}
													type="Survey Report"
													hideBtn={true}
													onlyinfo={'onlyinfo'}
												/>
											</li>
											<li>
												{this.props?.projectDetails?.role?.access?.field_report
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
																			this.setTemplate(e?.value);
																			const temp = template
																				?.filter(
																					(tem) => tem?._id === e?.value,
																				)?.[0]
																				?.checklist?.map((ch) => ch?.title);
																			const arr = [...this.state.answers];
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
																			this.setAnswers(arr);
																		}}
																		options={templates}
																		value={templates?.filter(
																			(t) => t?.value === this.state.tempalteId,
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
											</li>
											<li>
												{typeof data?.is_locked != 'undefined' &&
													data?.is_locked != true && (
														<span
															className={' lf-common-btn'}
															disabled={data?.is_locked}
															onClick={() => this.setEdit(!edit)}>
															<i className="fa-solid fa-floppy-disk p-1"></i>
															{save?.text}
														</span>
													)}
												{!data?.is_locked && (
													<span
														className="lf-common-btn"
														onClick={() => this.handleCalncel()}>
														<i className="fa-solid fa-eraser p-1"></i>
														{discard?.text}
													</span>
												)}
											</li>
											{
												data?.is_locked === true ? (
													<>
														<li>
															<span
																type="submit"
																className="lf-common-btn"
																onClick={() => {
																	this.setState({ shareLink: null });
																	sweetAlert(
																		() => {
																			this.hendleShowShereModel();
																			this.props.dispatch(
																				downloadSurveyReport(
																					{
																						project_id: this.project_id,
																						user_id: this.userId,
																						survey_report_id: data?._id,
																					},
																					(repData) => {
																						if (repData?.data?.result?.file) {
																							this.setState({
																								shareLink:
																									repData?.data?.result?.file,
																							});
																						} else {
																							this.setState({
																								shareLink: null,
																							});
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
																			this.props.dispatch(
																				unlockReport({
																					survey_report_request_id:
																						this.survey_report_request_id,
																					report_date: this.date,
																					project_id: this.project_id,
																					user_id: this.userId,
																					report_name:
																						this.props?.reportData?.[0]
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
														</li>
													</>
												) : (
													<>
														{new Date() >= new Date(this.date) && (
															<li>
																<Signature
																	setUrl={this.handleChangeSignature}
																	url={this.state.info?.signature_url}
																	signReport={this.submitSurvey}
																/>
															</li>
														)}
													</>
												)
												// <span type="submit" className="lf-common-btn mt-1"
												//   onClick={this.submitSurvey}
												// >{submit?.text}</span>
											}
										</ul>
									</nav>
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
												console.log(
													this.props?.projectDetails?.role?.access
														?.field_report,
													(!data?.is_locked &&
														edit &&
														this.props?.projectDetails?.role?.access
															?.field_report?.fill_report != 1) ||
														this.props?.reportData?.[0]?.createdBy?._id ==
															this.userId,
													'Permisssion',
												);
												return (
													<>
														<tr className="align-top" key={k}>
															<td
																className="text-center lf-w-40"
																style={{
																	paddingTop: '1rem',
																}}>
																<span
																	className="theme-color"
																	style={
																		data?.is_locked ||
																		(edit &&
																			this.props?.projectDetails?.role?.access
																				?.field_report?.fill_report != 1 &&
																			this.props?.reportData?.[0]?.createdBy
																				?._id != this.userId)
																			? {
																					pointerEvents: 'none',
																					opacity: 0.8,
																			  }
																			: {}
																	}>
																	<i
																		onClick={() => this.handleQuestion(k + 1)}
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
																		this.handleChangeAnswers(
																			'question_text',
																			e.target.value,
																			k,
																		)
																	}
																	value={
																		sr?.question_text
																			? sr?.question_text
																			: sr?.question?.question
																	}
																	disabled={
																		data?.is_locked
																			? true
																			: this.props?.projectDetails?.role?.access
																					?.field_report?.fill_report
																			? false
																			: this.props?.reportData?.[0]?.createdBy
																					?._id != this.userId
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
																			this.handleChangeAnswers(
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
																			this.handleChangeAnswers(
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
																			this.handleChangeAnswers(
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
																		this.handleChangeAnswers(
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
																					this.handleChangeAnswers
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
																					this.handleChangeAnswers
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
									{this.props?.projectDetails?.role?.access?.field_report
										?.create_report == 1 &&
										data?.is_locked != true && (
											<span
												onClick={() => this.handleQuestion()}
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
												this.handleChange('general_notes', e.target.value)
											}
											value={this.state.info?.general_notes}
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
													fileType="survey_genral_attachment"
													fileKey={data?._id}
													onFinish={(file) => {
														const fileList = this.state.info?.attachement;
														fileList.push(file);
														this.handleChange('attachement', fileList);
													}}
												/>
											)}
										</div>
									</div>

									<div className="col-12">
										<div className="card lf-load-more-attechment">
											<span className="p-2 d-inline-block">
												{this.state.info?.attachement?.length > 0
													? this.state.info.attachement.map((f, k) => {
															return (
																<>
																	<img
																		alt="livefield"
																		src={getIconByType(f.split('.').pop())}
																		onClick={() => this.handleImageView(f)}
																		className={`me-2`}
																		style={{ height: '40px' }}
																	/>
																	{data?.is_locked === true ? (
																		''
																	) : (
																		<i
																			className="fas fa-times fa-xs lf-icon"
																			onClick={this.handleDelete.bind(
																				this,
																				f,
																			)}></i>
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
					open={this.state.showShareModel}
					project_id={this.project_id}
					shareLink={this.state.shareLink}
					handleClose={this.hendleShowShereModel}
				/>
			</Layout>
		);
	}
}
export default withRouter(
	connect((state) => {
		return {
			data: state?.report?.[GET_SURVEY_REPORT_LIST_BY_SURVEY_ID]?.result || [],
			reportData:
				state?.report?.[GET_SURVEY_REQUEST_DETAILS_BY_ID]?.result || [],
			projectDetails: state?.project?.[GET_PROJECT_DETAILS]?.result || [],
			template: state?.project?.[GET_ALL_TEMPLATE]?.result || [],
		};
	})(SurveyReport),
);
