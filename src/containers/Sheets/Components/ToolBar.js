import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Dropdown, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getSiteLanguageData, sweetAlert } from '../../../commons';
import CustomSearch from '../../../components/CustomSearch';
import CreatePlan from './createPlan';
import TagsFilter from './tagsFilter';
import Swal from 'sweetalert2';

import { deletePlan, sharePlans } from '../../../store/actions/projects';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';

const SheetToolBar = ({
	allTags,
	tagsFilter,
	setTagsFilter,
	history,
	handleHistory,
	sortType,
	projectId,
	handleMultiSelect,
	sortingList,
	handleSortType,
	view,
	setView,
	SheetsFilter,
	SheetDirectory,
	multiSelect,
	deletePlans,
	MoveDirectory,
	dirSelect,
	multiFileSelect,
	handleFileMultiSelect,
	...props
}) => {
	const dispatch = useDispatch();
	const { project_id } = useParams();
	let searchDataSource = [];
	props?.data?.forEach((slist) => {
		searchDataSource = searchDataSource.concat(slist?.plans);
	});
	const {
		btn_create_sheet,
		btn_create_dir,
		btn_grid,
		btn_list,
		sheet_history,
		delete_text,
		share_files,
	} = getSiteLanguageData('sheet/toolbar');

	const { sort_by, action, icon_delete } = getSiteLanguageData('commons');

	return (
		<section className="lf-dashboard-toolbar">
			<div className="row align-items-center">
				<div className="col-lg-2 col-md-3 col d-none d-md-inline-block">
					<CustomSearch
						suggestion={true}
						dataSource={{
							sheet: searchDataSource,
						}}
					/>
				</div>
				<div className="col-lg-4 col-md-3 col-5 text-nowrap ps-0">
					<button
						className="btn lf-common-btn ps-0 theme-secondary rounded-3 d-none d-lg-inline-block"
						tooltip={sheet_history.tooltip}
						disabled={(props.recentPlan?.length > 0) ? false : true}
						flow={sheet_history.tooltip_flow}
						onClick={() => handleHistory(history === false ? true : false)}>
						<i className="fas fa-history" />
					</button>
					<Dropdown className="d-none d-lg-inline-block">
						<span tooltip={sort_by.tooltip} flow={sort_by.tooltip_flow}>
							<Dropdown.Toggle
								variant="transparent"
								id="dropdown-basic"
								className="lf-common-btn btn-sort-dd px-0">
								<span>{sortingList[parseInt(sortType) - 1]}</span>
							</Dropdown.Toggle>
						</span>
						<Dropdown.Menu
							style={{ backgroundColor: '#73a47' }}
							className="shadow p-2 mb-2 bg-white rounded-7 dropdown-menu lf-dropdown-center lf-dropdown-animation">
							{sortingList.map((st, k) => {
								return (
									<Dropdown.Item
										key={k}
										className="lf-layout-profile-menu lf-dropdown-animation"
										onClick={() => handleSortType((k + 1).toString())}>
										{st}
									</Dropdown.Item>
								);
							})}
						</Dropdown.Menu>
					</Dropdown>
					<span className="d-none d-lg-inline-block">
						<TagsFilter
							allTags={allTags}
							tagsFilter={tagsFilter}
							setTagsFilter={setTagsFilter}
						/>
					</span>
				</div>
				<div className="col-lg-6 col-md-6 text-nowrap xs-ps-10 xs-text-end">
					
					<div className="float-end">
						
{/* 						<Dropdown className="d-md-none d-inline-block">
							<Dropdown.Toggle
								variant="transparent"
								id="dropdown-basic"
								className="ps-0 lf-notification-toggle">
								<i className="fas fa-ellipsis-v fa-md mt-1"></i>
							</Dropdown.Toggle>
							<Dropdown.Menu
								style={{ backgroundColor: '#73a47' }}
								className="shadow p-2  bg-white rounded-7 dropdown-menu lf-dropdown-center lf-dropdown-animation">

									<Dropdown.Item className="lf-layout-profile-menu lf-link-cursor lf-dropdown-animation my-1">
										<CreatePlan type="common">
											<span
												className="lf-link-cursor lf-common-btn mx-0"
												tooltip={btn_create_sheet.tooltip}
												flow={btn_create_sheet.tooltip_flow}>
												<i className="fas fa-plus pe-1"></i> {btn_create_sheet?.text}
											</span>
										</CreatePlan>
									</Dropdown.Item>
									<Dropdown.Item>
										<span
											className=" px-0 mx-0"
											tooltip={btn_create_dir.tooltip}
											flow={btn_create_dir.tooltip_flow}>
											<SheetDirectory />
										</span>
									</Dropdown.Item>
									<DropdownItem>
										<span className="d-inline-block">
											<TagsFilter
												allTags={allTags}
												tagsFilter={tagsFilter}
												setTagsFilter={setTagsFilter}
											/>
										</span>
									</DropdownItem>

							</Dropdown.Menu>
						</Dropdown> */}

						<CreatePlan type="common">
							<span
								className=" lf-link-cursor lf-main-button"
								tooltip={btn_create_sheet.tooltip}
								flow={btn_create_sheet.tooltip_flow}>
								<i className="fas fa-plus pe-1"></i> {btn_create_sheet?.text}
							</span>
						</CreatePlan>
						<span
							className="theme-btnbold"
							tooltip={btn_create_dir.tooltip}
							flow={btn_create_dir.tooltip_flow}>
							<SheetDirectory />
						</span>
						<Dropdown className="d-inline-block">
							<Dropdown.Toggle
								disabled={multiSelect.length === 0}
								variant="transparent"
								className="lf-common-btn">
								<span>{action?.text}</span>
							</Dropdown.Toggle>
							<Dropdown.Menu className="shadow px-2 bg-white rounded-7 dropdown-menu lf-dropdown-center lf-dropdown-animation">
								<Dropdown.Item
									className="lf-layout-profile-menu "
									// onClick={() =>
									// 	sweetAlert(() => deletePlans(), 'Project Plans')
									// }
									onClick={() =>
										Swal.fire({
											title: 'Permanently delete this sheet?',
											icon: 'question',
											showCancelButton: true,
											reverseButtons: true,
											confirmButtonColor: '#dc3545',
											cancelButtonColor: '#28a745',
											width: '500px',
											confirmButtonText: `Yes, Delete it!`,
											html:
												'<ul style="list-style-type:disc">' +
												'<li style="text-align:left">You are about to permanently delete ' +
												multiSelect.length +
												' Sheet(s) and ' +
												dirSelect.length +
												' folder(s).</li>' +
												'<li style="text-align:left">This will affect all users on the project and there is no way to undo this.</li>' +
												'</ul>',
											type: 'input',
											input: 'checkbox',
											inputPlaceholder:
												'I understand this will permanently delete ' +
												multiSelect.length +
												' document(s).',
											borderRadius: '4px',
											inputValidator: (result) => {
												return !result && delete_text?.text;
											},
										}).then((result) => {
											if (result.isConfirmed) {
												if (result.value) {
													deletePlans();
												}
											}
										})
									}>
									{' '}
									<i className="far fa-trash-alt p-2" />
									{icon_delete?.text}
								</Dropdown.Item>
								<MoveDirectory
									handleMultiSelect={handleMultiSelect}
									plan={multiSelect}
									className="lf-layout-profile-menu"
								/>
								<Dropdown.Item
									disabled={multiFileSelect.length === 0}
									className="lf-layout-profile-menu "
									onClick={() => {
										props.hendleShowShereModel();
										dispatch(
											sharePlans(
												{ plans: multiFileSelect, project_id: project_id },
												props.handleSharableLink,
											),
										);
									}}>
									<i className="fas fa-share-alt p-2 "></i>
									{share_files?.text}
								</Dropdown.Item>
								<Dropdown.Item
									className="lf-layout-profile-menu "
									onClick={() =>
										props.handleAttachTags()
									}>
									{' '}
									<i className="fas fa-tags p-2"></i>
									{'Add Tags'}
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
						<span className="btn-group d-inline-block d-none d-lg-inline-block">
							<Link
								to={`/sheets/${projectId}/?v=grid`}
								className={`px-1 ms-1 py-1 lf-link-cursor rounded theme-btnbg text-secondary  ${
									view === 'grid' ? 'lf-sheet-listgrid-active' : ''
								} `}
								tooltip={btn_grid.tooltip}
								flow={btn_grid.tooltip_flow}>
								{' '}
								<i
									className={`p-1 fa fa-th-large lf-sheets-list-grid`}></i>
							</Link>
							<Link
								to={`/sheets/${projectId}/?v=list`}
								className={`pe-1 py-1 ms-1 lf-link-cursor rounded theme-btnbg text-secondary me-2 ${
									view !== 'grid' ? ' lf-sheet-listgrid-active' : ''
								} `}
								tooltip={btn_list.tooltip}
								flow={btn_list.tooltip_flow}>
								{' '}
								<i className={`p-1 fa fa-bars lf-sheets-list-grid`}></i>
							</Link>
						</span>

						{/* 					<nav aria-label="breadcrumb">
						<ul className="breadcrumb">
							<li className="">

							</li>
							<li className="py-1">

							</li>
							<li className="">

							</li>

						</ul>
					</nav> */}
					</div>
				</div>
			</div>
		</section>
	);
};
export default SheetToolBar;
