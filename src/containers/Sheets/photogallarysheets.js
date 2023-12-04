import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout from '../../components/layout';
import { GET_ALL_SHEETS_PHOTOS } from '../../store/actions/actionType';
import {
	deleteSheetRelatedPhotos,
	getAllSheetsPhotos,
} from '../../store/actions/projects';
import AddSheetsPhotos from './addsheetsphotos';
import OpenPhotoSheets from './opensheetsphotos';
import { FormCheck } from 'react-bootstrap';
import Loading from '../../components/loadig';
import Nodata from '../../components/nodata';
import {
	setLightBoxImageData,
	setLightBoxImageDefaultUrl,
	toggleLightBoxView,
} from '../../store/actions/imageLightBox';
import getUserId, { getSiteLanguageData } from '../../commons';

class PhotoGallarySheets extends Component {
	constructor(props) {
		super(props);
		this.userId = getUserId();
		this.plan_id = this.props.router?.params.plan_id;
		this.project_id = this.props.router?.params.project_id;
		this.state = {
			multiSelect: [],
		};
	}
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(getAllSheetsPhotos(this.plan_id));
	}
	handleMultiSelect = (multiSelect) => {
		this.setState({ multiSelect });
	};
	handleImageViewer = (url) => {
		const { data } = this.props;
		const images = [];
		data?.forEach((r) => {
			r?.file?.forEach((d) => {
				images.push({
					url: d,
					imageCaption: r.description,
					imageTitle: r.title,
				});
			});
		});
		this.props.dispatch(setLightBoxImageData(images));
		this.props.dispatch(toggleLightBoxView(true));
		this.props.dispatch(setLightBoxImageDefaultUrl(url));
	};
	render() {
		const { data } = this.props;
		const { multiSelect } = this.state;
		if (!data?.length && data?.length !== 0) {
			return <Loading />;
		}
		const { sheets_photos, back } = getSiteLanguageData(
			'sheet/photogallarysheets',
		);
		return (
			<Layout>
				{data?.length === 0 ? (
					<Nodata type="Sheet Photo">
						<AddSheetsPhotos plan_id={this.plan_id} />
					</Nodata>
				) : (
					<div id="page-content-wrapper">
						<section className="lf-dashboard-toolbar">
							<div className="container">
								<div className="row">
									<div className="col-sm-8 lf-sheets-filenm-title-res">
										<span className="m-3 d-inline-block">
											<a
												className=" text-secondary lf-link-cursor "
												href={`/sheets/${this.project_id}/sheetInfo/${this.plan_id}`}>
												<i className="fa fa-arrow-left" aria-hidden="true"></i>{' '}
												{back?.text}
											</a>
										</span>
										<h3 className="m-3 d-inline-block">
											{sheets_photos?.text}
										</h3>
									</div>
									<div className="col-sm-4 lf-sheets-header-title-res">
										<div className="col-sm-12">
											<nav aria-label="breadcrumb text-end">
												<div>
													<span className=" float-end me-3 mb-2">
														<AddSheetsPhotos plan_id={this.plan_id} />
													</span>
												</div>
											</nav>
										</div>
									</div>
								</div>
							</div>
						</section>

						<div className="container-fluid ">
							<div className="col-sm-12">
								<div className="row">
									<div className="col-sm-12 main-area">
										{data?.map((sp, k) => {
											return (
												<div className="" key={k}>
													{/* <FormCheck
                          className={` align-middle ${sp.data?.length === 0 ? 'invisible' : 'visible'} d-inline-block`}
                          type="checkbox"
                          name="Report"
                          onChange={({ target: { checked } }) => {
                            let newArr = [...multiSelect];
                            Object.values(sp?.file)?.forEach(p => {
                              if (checked === true) {
                                newArr.push(p)
                              }
                              else {
                                newArr = newArr.filter(d => d !== p)
                              }
                            })
                            this.handleMultiSelect(newArr)
                          }}
                          checked={Object.values(sp?.file).every(d => multiSelect.includes(d))}
                        /> */}
													<h6 className="mb-3">
														<i className="fa-regular fa-folder me-2"></i>
														<span className="fw-bold">{sp.description}</span>
													</h6>
													<div className="d-flex">
														{Object.values(sp?.file).map((f, pk) => {
															return (
																<>
																	<div className="p-1" key={pk}>
																		<div className="sheet-grid-box position-relative">
																			{/* <FormCheck
                                    type="checkbox"
                                    name="plan_photo"
                                    onChange={({ target: { checked } }) => {
                                      let newArr = [...multiSelect];
                                      if (checked === true) {
                                        newArr.push(f)
                                      }
                                      else {
                                        newArr = newArr.filter(d => d !== f)
                                      }
                                      this.handleMultiSelect(newArr)
                                    }}
                                    checked={multiSelect.includes(f)}
                                    value={f}
                                    className={`position-absolute mx-2 my-1 ${multiSelect.length > 0 ? 'visible' : ''}`}
                                  /> */}
																			<img
																				title={'Show Image'}
																				onClick={() =>
																					this.handleImageViewer(f)
																				}
																				alt="livefield"
																				src={
																					f || '/images/sheets/sheets_demo.png'
																				}
																				className="lf-photo-gridimg  lf-link-cursor"
																			/>
																			<div className="sheet-grid-box-actions-plan lf-link-cursor">
																				<span
																					data-toggle="tooltip"
																					data-placement="left"
																					title="Delete">
																					<i
																						className="fas fa-trash-alt mt-2 "
																						onClick={() => {
																							const isConfirmDelete =
																								window.confirm(
																									`are you sure to Delete Sheet Photo`,
																								);
																							if (isConfirmDelete) {
																								this.props.dispatch(
																									deleteSheetRelatedPhotos({
																										plan_id: this.plan_id,
																										user_id: this.userId,
																										photos: [
																											{
																												id: sp?._id,
																												url: [f],
																											},
																										],
																									}),
																								);
																							}
																						}}></i>
																				</span>
																			</div>
																		</div>
																	</div>
																</>
															);
														})}
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</Layout>
		);
	}
}
export default connect((state) => {
	return {
		forgotPasswordData: state.forgotPass,
		data: state?.project?.[GET_ALL_SHEETS_PHOTOS]?.result,
	};
})(PhotoGallarySheets);
