// import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Profile from './containers/Profile';
import Projects from './containers/Projects';
import Files from './containers/Files';
import People from './containers/People';
import Photos from './containers/Photos';
import NotFound from './containers/General/NotFound';
// import ProjectsNodata from './containers/ProjectsNodata';
import Projectnodata from './containers/ProjectsNodata';
import Sheets from './containers/Sheets';
// import RFI from './containers/RFI';
// import CreateRFI from './containers/RFI/Create';
import SheetInfo from './containers/Sheets/sheetDetails';
import PhotoGallarySheets from './containers/Sheets/photogallarysheets';
import Tasks from './containers/Tasks';
import Welcome from './containers/Welcome';
import Forgot from './containers/Forgotpassword';
import Reset from './containers/Resetpassword';
import Projectdetails from './containers/Projectdetails';
import Setting from './containers/Setting';
import Team from './containers/Team';
import Myprofile from './containers/MyProfile';
import ProjectTemplate from './containers/ProjectTemplate';
import Chat from './containers/Chat';
import Subscription from './containers/Subscription';
import BuyPlan from './containers/BuyPlan';
import PaymentLink from './containers/BuyPlan/PaymentLink';
import KanbanTasks from './containers/Tasks/kanban';
import BoardTasks from './containers/Tasks/boardView';
import RoleList from './containers/People/roleList';
import RoleManagement from './containers/People/roleManagement';
import UserRoleCreate from './containers/People/createRole';
import Meeting from './containers/Meeting';
import Login from './containers/Auth/login';
import Registration from './containers/Auth/register';
import EmailVerify from './containers/Auth/emailVerification';
import MobileVerify from './containers/Auth/mobileVerification';
import Support from './containers/Support';
import Material from './containers/Material';
import Equipment from './containers/Equipment';
import Labour from './containers/Labour';
import LabourLog from './containers/Labour/labourLog';
import EquipmentLog from './containers/Equipment/equipmentLog';
import TimeSheet from './containers/TimeSheet';
import Inspection from './containers/Inspection';
import Storeroom from './containers/StoreRoom';
import Storeinfo from './containers/StoreRoom/storeinfo';
import Wallet from './containers/wallet';
import SurveyReport from './containers/SurveyReport';
import Reports from './containers/Reports';
import FieldReportInfo from './containers/Reports/fieldReportInfo';
import StoreRoomInfo from './containers/StoreRoom/storeRoomOrderList';
import PurchaseOrder from './containers/StoreRoom/PurchaseOrder';
import StoreRoomStock from './containers/StoreRoom/storeRoomStock';
// import StoreRoomStock from './containers/Reports/storeRoomStock';
import MaterialLog from './containers/Material/materialLog';
import { resetAuthToken } from './commons';
import Terms from './components/termsModal';
import Issues from './containers/Issues';
const AppRouter = () => {
	return (
		<BrowserRouter basename={'/'}>
			<Routes>
				{/* <Route exact path={`/`} element={<Login />} /> */}
				<Route index path={`/`} element={<Login />} />
				{/* <Navigate  exact from="/" to="/auth/login" /> */}
				<Route exact path={`/auth/login`} element={<Login />} />
				<Route exact path={`/auth/register`} element={<Registration />} />
				<Route exact path={`/auth/verify-email`} element={<EmailVerify />} />
				<Route
					exact
					path={`/auth/verify-email/:email`}
					element={<EmailVerify />}
				/>
				<Route exact path={`/auth/verify-mobile`} element={<MobileVerify />} />
				<Route exact path={`/welcome`} element={<Welcome />} />
				<Route exact path={`/term-Condition`} element={<Terms />} />
				<Route exact path={`/profile/:project_id`} element={<Profile />} />
				<Route exact path={`/profile`} element={<Profile />} />
				<Route exact path={`/projects`} element={<Projects />} />
				<Route exact path={`/dashboard`} element={<Projects />} />
				<Route
					exact
					path={`/dashboard/:project_id`}
					element={<Projectdetails />}
				/>
				<Route exact path={`/files/:project_id`} element={<Files />} />
				<Route exact path={`/people/:project_id`} element={<People />} />
				<Route
					exact
					path={`/people/:project_id/roles/create`}
					element={<UserRoleCreate />}
				/>
				<Route
					exact
					path={`/people/:project_id/roles/:role_id`}
					element={<RoleManagement />}
				/>
				<Route
					exact
					path={`/people/:project_id/roles`}
					element={<RoleList />}
				/>
				<Route exact path={`/photos/:project_id`} element={<Photos />} />
				<Route exact path={`/sheets/:project_id`} element={<Sheets />} />
				{/* <Route exact path={`/rfi/:project_id`} element={<RFI />} />
				<Route exact path={`/rfi/:project_id/create`} element={<CreateRFI />} />
				<Route exact path={`/rfi/:project_id/update/:rfi_id`} element={<CreateRFI />}  />*/}
				<Route
					exact
					path={`/sheets/:project_id/sheetInfo/:plan_id`}
					element={<SheetInfo />}
				/>
				{/* <Route exact path={`/sheets/:project_id/sheetInfo/:plan_id/:task_id`} element={<Tasks />} /> */}
				<Route
					exact
					path={`/sheets/:project_id/sheetInfo/:plan_id/sheetphotos`}
					element={<PhotoGallarySheets />}
				/>

				<Route exact path={`/tasks/:project_id`} element={<Tasks />} />
				<Route exact path={`/tasks/:project_id/:task_id`} element={<Tasks />} />

				<Route exact path={`/issues/:project_id`} element={<Issues />} />
				<Route exact path={`/issues/:project_id/:issue_id`} element={<Issues />} />

				<Route exact path={`/projectsNodata`} element={<Projectnodata />} />
				<Route exact path={`/forgotpassword`} element={<Forgot />} />
				<Route exact path={`/reset-password`} element={<Reset />} />
				<Route exact path={`/setting/:project_id`} element={<Setting />} />
				<Route
					exact
					path={`/project/:project_id/details`}
					element={<projectdetails />}
				/>
				<Route exact path={`/team`} element={<Team />} />
				<Route exact path={`/my-profile`} element={<Myprofile />} />
				<Route exact path={`/support`} element={<Support />} />
				<Route
					exact
					path={`/template/:project_id`}
					element={<ProjectTemplate />}
				/>
				<Route exact path={`/chat/:project_id`} element={<Chat />} />
				<Route exact path={`/Subscription`} element={<Subscription />} />
				<Route exact path={`/cart`} element={<BuyPlan />} />
				<Route exact path={`/payment/:link_id`} element={<PaymentLink />} />
				<Route exact path={`/meeting/:project_id`} element={<Meeting />} />
				<Route exact path={`/material/:project_id`} element={<Material />} />
				<Route exact path={`/storeroom/:project_id`} element={<Storeroom />} />
				<Route
					exact
					path={`/surveyreport/:project_id`}
					element={<SurveyReport />}
				/>
				<Route exact path={`/reports/:project_id`} element={<Reports />} />
				<Route
					exact
					path={`/reports/:project_id/fieldReportInfo/:survey_report_request_id/report_date:date`}
					element={<FieldReportInfo />}
				/>
				<Route
					exact
					path={`/reports/:project_id/fieldReportInfo/:survey_report_request_id`}
					element={<FieldReportInfo />}
				/>
				<Route
					exact
					path={`/reports/:project_id/storeRoomLog/:store_room_id/store_room_log_date:date`}
					element={<StoreRoomStock />}
				/>
				<Route
					exact
					path={`/reports/:project_id/storeRoomLog/:store_room_id`}
					element={<StoreRoomStock />}
				/>
				<Route
					exact
					path={`/storeroom/:project_id/storeRoomOrderList/:store_room_id/store_room_log_date:date`}
					element={<StoreRoomInfo />}
				/>
				<Route
					exact
					path={`/storeroom/:project_id/storeRoomOrderList/:store_room_id`}
					element={<StoreRoomInfo />}
				/>
				<Route
					exact
					path={`/storeroom/:project_id/store-room-order-manage/:store_room_id/:store_room_log_date`}
					element={<PurchaseOrder />}
				/>
				<Route
					exact
					path={`/storeroom/:project_id/store-room-order-manage/:store_room_id/order/:order_id/:store_room_log_date`}
					element={<PurchaseOrder />}
				/>
				<Route
					exact
					path={`/storeroom/:project_id/store-room-order-manage/:store_room_id/fill_po/:order_id/:store_room_log_date`}
					element={<PurchaseOrder />}
				/>
				{/* <Route exact path={`/storeroom/:project_id/storeRoomStock/:store_room_id`} element={<StoreRoomStock />}/> */}
				<Route
					exact
					path={`/reports/:project_id/materialLog/:material_id`}
					element={<MaterialLog />}
				/>
				<Route
					exact
					path={`/reports/:project_id/materialLog/:material_id/material_date:date`}
					element={<MaterialLog />}
				/>
				<Route
					exact
					path={`/reports/:project_id/labourlLog`}
					element={<LabourLog />}
				/>
				<Route
					exact
					path={`/reports/:project_id/labourlLog/labour_log_date:date`}
					element={<LabourLog />}
				/>
				<Route exact path={`/wallet/:project_id`} element={<Wallet />} />
				<Route
					exact
					path={`/reports/:project_id/labour_log/:labour_equipment_log_id/labour_equipment_log_date:date`}
					element={<LabourLog />}
				/>
				<Route
					exact
					path={`/reports/:project_id/labour_log/:labour_equipment_log_id`}
					element={<LabourLog />}
				/>
				<Route
					exact
					path={`/reports/:project_id/equipment_log/:labour_equipment_log_id/labour_equipment_log_date:date`}
					element={<EquipmentLog />}
				/>
				<Route
					exact
					path={`/reports/:project_id/equipment_log/:labour_equipment_log_id`}
					element={<EquipmentLog />}
				/>
				<Route
					exact
					path={`/storeroom/:project_id/storeinfo/:store_id`}
					element={<Storeinfo />}
				/>
				<Route exact path={`/Equipment/:project_id`} element={<Equipment />} />
				<Route exact path={`/Labour/:project_id`} element={<Labour />} />
				<Route exact path={`/TimeSheet/:project_id`} element={<TimeSheet />} />
				<Route
					exact
					path={`/Inspection/:project_id`}
					element={<Inspection />}
				/>
				{/* <Route exact path={`/VerifyForgotOtp`} element={<VerifyForgotOtp />} /> */}
				<Route exact path={`/logout`} element={<Logout />} />
				<Route exact path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
};

export default AppRouter;

const Logout = () => {
	resetAuthToken();
	return <Navigate to="/auth/login" />;
};
