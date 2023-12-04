import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { deleteDirectory } from '../../store/actions/projects';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import EditDirectory from './updateDirectory';
import CreatePlan from './Components/createPlan';
import SinglePlanGrid from './Components/SinglePlanGrid';
import SinglePlanList from './Components/SinglePlanList';
import { FormCheck } from 'react-bootstrap';
import Nodata from '../../components/nodata';

const SheetGrid = ({
	sortType,
	sortingList,
	handleSortType,
	view,
	setView,
	SheetsFilter,
	SheetDirectory,
	multiSelect,
	deletePlans,
	MoveDirectory,
	data,
	handleMultiSelect,
	handleFileMultiSelect,
	multiFileSelect,
	manageCollapsibleData,
	collapsibleData,
	handleDirSelect,
	...props
}) => {
	const dispatch = useDispatch();
	const { project_id } = useParams();
	const userId = getUserId();
	const { btn_new_paln } = getSiteLanguageData('sheet/toolbar');
	const { icon_delete } = getSiteLanguageData('commons');
	return data?.length === 0 ? (
		<Nodata type="Plans"></Nodata>
	) : (
		<div className="container-fluid mt-2 ">
			<div className="row">
				<div className="col-sm-12">
					{data?.map((r) => {
						return (
							<div className="mt-2" key={r._id}>
								<div className="row">
									<div className="col-12">
										{
											<FormCheck
												className={`d-inline-block align-middle ms-3 ms-md-0  ${
													r?.plans?.length === 0 ? 'invisible' : ''
												}`}
												type="checkbox"
												name="plan_id"
												onChange={({ target: { checked } }) => {
													let newArr = [...multiSelect];
													let newFileArray = [...multiFileSelect];
													r?.plans?.forEach((p) => {
														if (checked === true) {
															newArr.push(p._id);
															newFileArray.push(p.original_file || p.file)
														} else {
															newArr = newArr.filter((d) => d !== p._id);
														}
													});
													handleMultiSelect(newArr);
													handleDirSelect(r._id);
													handleFileMultiSelect(newFileArray)
												}}
												checked={r?.plans?.every((d) =>
													multiSelect.includes(d._id),
												)}
											/>
										}
										<h6
											className=" ms-2 lf-link-cursor text-dark d-inline-block "
											onClick={() =>
												manageCollapsibleData({
													...collapsibleData,
													[r._id]: !collapsibleData?.[r._id],
												})
											}>
											<span className="text-capitalize fw-bold align-middle sheet-dir-title ls-md">
												<i className="fa-regular fa-folder me-2 my-1"></i>
												{r?.name} ({r?.plans?.length}){' '}
											</span>
											<span className="ms-1 ">
												<i
													className={
														!collapsibleData?.[r._id]
															? 'fas  fa-caret-down p-1 text-secondary'
															: 'fas fa-caret-right text-secondary ms-1 p-1'
													}></i>
											</span>
										</h6>
										<span className="ms-2 lf-link-cursor rounded text-secondary fa-sm dir-icon-link">
											{' '}
											<EditDirectory data={r} className="theme-bgcolor" />{' '}
										</span>
										<span
											className="p-2 theme-bgcolor lf-link-cursor rounded text-secondary fa-sm dir-icon-link "
											tooltip={icon_delete.tooltip}
											flow={icon_delete.tooltip_flow}>
											<i
												className="fas fa-trash-alt"
												onClick={() =>
													sweetAlert(
														() =>
															dispatch(
																deleteDirectory({
																	user_id: userId,
																	project_id: project_id,
																	directory_id: [r?._id],
																}),
															),
														'Plan Directory',
													)
												}
											/>
										</span>
									</div>
								</div>

								<div
									className={`row ${
										!collapsibleData?.[r._id] ? ' ' : 'd-none'
									}`}
									style={{
										marginLeft: '22px',
									}}>
									{r?.plans
										?.sort((a, b) => {
											if (sortType === '1') {
												return a?.sheet_no.localeCompare(b?.sheet_no);
											}
											if (sortType === '2') {
												return b?.sheet_no.localeCompare(a?.sheet_no);
											}
											if (sortType === '3') {
												return new Date(b.crtd_dt) - new Date(a.crtd_dt);
											}
											if (sortType === '4') {
												return new Date(a.crtd_dt) - new Date(b.crtd_dt);
											}
											return true;
										})
										.map((p, pi) => {
											if (view === 'grid') {
												return (
													<SinglePlanGrid
														p={p}
														pi={pi}
														multiSelect={multiSelect}
														handleMultiSelect={handleMultiSelect}
														handleFileMultiSelect={handleFileMultiSelect}
														multiFileSelect={multiFileSelect}
														handleSharableLink={props.handleSharableLink}
														hendleShowShereModel={props.hendleShowShereModel}
													/>
												);
											} else {
												return (
													<SinglePlanList
														p={p}
														multiSelect={multiSelect}
														handleMultiSelect={handleMultiSelect}
														handleFileMultiSelect={handleFileMultiSelect}
														multiFileSelect={multiFileSelect}
														handleSharableLink={props.handleSharableLink}
														hendleShowShereModel={props.hendleShowShereModel}
													/>
												);
											}
										})}
									<div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 mx-3 mx-md-0 theme-link-hover theme-color mt-2">
										{/* this section for add plan New grid view */}
										<CreatePlan directory_id={r?._id}>
											<div className="col-sm-12  lf-sheet-grid-add lf-link-cursor lf-h-153">
												<span className="lf-sheet-grid-newplan p-0 m-0">
													{btn_new_paln?.text}
												</span>
											</div>
										</CreatePlan>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
export default SheetGrid;
