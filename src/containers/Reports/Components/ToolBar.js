import CreatSurveyReport from './createsurveyreport';
import CreateStoreRoom from './createstoreroom';
import { Dropdown } from 'react-bootstrap';
import MaterialInfo from '../../Material/Components/materialInfo';
import CreateLabourEquipmentLog from './createLabourEquipmentLog';
import CustomSearch from '../../../components/CustomSearch';
import { getSiteLanguageData, sweetAlert } from '../../../commons';
const { btn_create_reports } = getSiteLanguageData('reports/toolbar');
const { sort_by, action, icon_delete } = getSiteLanguageData('commons');
const SheetToolBar = ({
	searchDataSource,
	handleSortType,
	sortingList,
	sortType,
	deleteReport,
	multiSelect,
	...props
}) => {
	return (
		<section className="lf-dashboard-toolbar">
			<div className="row">
				<div className="col-lg-2 col-md-3 lf-tasks-header-smobile col">
					<CustomSearch
						suggestion={true}
						dataSource={{
							report: searchDataSource,
						}}
					/>
				</div>
				<div className="col-4 lf-reports-header-smobilef d-none-xs">
					<Dropdown className="mt-1 lf-responsive-common">
						<span tooltip={sort_by.tooltip} flow={sort_by.tooltip_flow}>
							<Dropdown.Toggle
								variant="transparent"
								id="dropdown-basic"
								className="lf-common-btn">
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
										className="lf-layout-profile-menu"
										onClick={() => handleSortType((k + 1).toString())}>
										{st}
									</Dropdown.Item>
								);
							})}
						</Dropdown.Menu>
					</Dropdown>
				</div>
				{/* <div className="col-md-5 col-lg-6">
					<Dropdown className=" lf-reports-smobile">
						<Dropdown.Toggle
							disabled={multiSelect.length === 0}
							variant="transparent"
							className="lf-common-btn float-end ">
							{action?.text}
						</Dropdown.Toggle>
						<Dropdown.Menu className="shadow p-2 mb-2 bg-white rounded-7 dropdown-menu  dropdown-menu lf-dropdown-center lf-dropdown-animation">
							<Dropdown.Item
								className="lf-layout-profile-menu "
								onClick={() =>
									sweetAlert(() => deleteReport(), 'Survey Report')
								}>
								{' '}
								<i className="fas fa-trash-alt px-2" />
								{icon_delete?.text}
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					<nav>
						<ul className="breadcrumb">
							<li>
								<Dropdown className="rounded theme-btnbold ">
									<span
										tooltip={btn_create_reports.tooltip}
										flow={btn_create_reports.tooltip_flow}>
										<Dropdown.Toggle
											className="lf-main-button"
											variant="transparent"
											id="dropdown-basic">
											<span className="lf-link-cursor lf-dropdown-color">
												<i className="fas fa-plus px-1"></i>{' '}
												{btn_create_reports?.text}
											</span>
										</Dropdown.Toggle>
									</span>
									<Dropdown.Menu className="shadow p-2 mb-2 bg-white rounded-7 lf-dropdown-center lf-dropdown-animation">
										<CreatSurveyReport />
										<CreateStoreRoom />
										<MaterialInfo />
										<CreateLabourEquipmentLog />
									</Dropdown.Menu>
								</Dropdown>
							</li>
						</ul>
					</nav>
				</div> */}
			</div>
		</section>
	);
};

export default SheetToolBar;
