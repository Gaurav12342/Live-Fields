import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { deleteDirectory } from '../../store/actions/projects';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import EditDirectory from './updateDirectory';
import CreatePlan from './Components/createPlan';
import SinglePlanList from './Components/SinglePlanList';
import { FormCheck } from 'react-bootstrap';
import Nodata from '../../components/nodata';

const SheetList = ({
	sortType,
	allTags,
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
	...props
}) => {
	const dispatch = useDispatch();
	const { project_id } = useParams();
	const userId = getUserId();
	const {
		btn_add_sheet,
		delete_directory,
		sheets_name,
		revision,
		task,
		file,
		tags,
		no_sheets_available,
	} = getSiteLanguageData('sheet/toolbar');
	const { action } = getSiteLanguageData('commons');
	return data?.length === 0 ? (
		<Nodata type="Plans"></Nodata>
	) : (
		<div className="container-fluid mt-3">
			<div className="theme-table-wrapper no-bg">
				<table className="table  table-hover theme-table">
					<thead className="theme-table-title bg-light">
						<tr className={`theme-table-data-row`}>
							<th className="text-center lf-w-70"></th>
							<th className="lf-w-400">{sheets_name?.text}</th>
							<th className="text-start lf-w-200">{revision?.text}</th>
							<th className="text-center lf-w-250">{task?.text}</th>
							<th className="text-center lf-w-250">{file?.text}</th>
							<th className="text-start lf-w-250">{tags?.text}</th>
							<th className="text-center lf-w-200">{action?.text}</th>
						</tr>
					</thead>
					<tbody>
						{data?.map((r) => {
							return (
								<Fragment>
									<tr
										className={`theme-table-data-row   ${
											!collapsibleData?.[r._id] ? 'bg-light' : 'bg-transparent'
										}`}>
										<td className="text-center">
											<FormCheck
												className={`d-inline-block align-middle  ${
													r?.plans?.length === 0 ? 'invisible' : 'visible'
												}`}
												type="checkbox"
												name="plan_id"
												onChange={({ target: { checked } }) => {
													let newArr = [...multiSelect];
													r?.plans?.forEach((p) => {
														if (checked === true) {
															newArr.push(p._id);
														} else {
															newArr = newArr.filter((d) => d !== p._id);
														}
													});
													handleMultiSelect(newArr);
												}}
												checked={r?.plans?.every((d) =>
													multiSelect.includes(d._id),
												)}
											/>
										</td>
										<td colSpan={6}>
											<h6
												className=" ms-1 lf-link-cursor text-dark d-inline-block "
												onClick={() =>
													manageCollapsibleData({
														...collapsibleData,
														[r._id]: !collapsibleData?.[r._id],
													})
												}>
												<i className="fa-regular fa-folder me-2"></i>
												<span className="text-capitalize fw-bold ls-md">
													{r?.name} ({r?.plans?.length})
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
											<span className="ms-2 lf-link-cursor rounded fa-sm ">
												{' '}
												<EditDirectory
													data={r}
													className="theme-bgcolor"
												/>{' '}
											</span>
											<span
												tooltip={delete_directory.tooltip}
												flow={delete_directory.tooltip_flow}
												className="p-2 text-secondary theme-bgcolor lf-link-cursor rounded fa-sm">
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
											<CreatePlan directory_id={r?._id}>
												<span
													className="ms-0 px-2 lf-common-btn text-secondary theme-bgcolor"
													tooltip={btn_add_sheet.tooltip}
													flow={btn_add_sheet.tooltip_flow}>
													<i className="fas fa-plus"></i> {btn_add_sheet?.text}
												</span>
											</CreatePlan>
										</td>
									</tr>
									{r?.plans?.length === 0 ? (
										<tr
											className={`theme-table-data-row bg-white text-center lf-text-vertical-align ${
												!collapsibleData?.[r._id] === true ? '' : 'd-none'
											}`}>
											<td className="text-capitalize" colSpan={10}>
												{no_sheets_available?.text}
											</td>
										</tr>
									) : (
										r?.plans
											?.sort((a, b) => {
												if (sortType === '1') {
													return a?.sheet_no.localeCompare(b?.sheet_no);
												}
												if (sortType === '2') {
													return b?.sheet_no.localeCompare(a?.sheet_no);
												}
												if (sortType === '3') {
													return (
														new Date(b.revision_no) - new Date(a.revision_no)
													);
												}
												if (sortType === '4') {
													return (
														new Date(a.revision_no) - new Date(b.revision_no)
													);
												}
												return true;
											})
											.map((p) => {
												return (
													<SinglePlanList
														allTags={allTags}
														hideRow={collapsibleData?.[r._id]}
														p={p}
														multiSelect={multiSelect}
														handleMultiSelect={handleMultiSelect}
														handleFileMultiSelect={handleFileMultiSelect}
														multiFileSelect={multiFileSelect}
														handleSharableLink={props.handleSharableLink}
														hendleShowShereModel={props.hendleShowShereModel}
													/>
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
	);
};
export default SheetList;
