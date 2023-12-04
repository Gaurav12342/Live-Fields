import { useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router';
// import '../App.css';
import getUserId, { getSiteLanguageData } from '../commons';
import { GET_ALL_PROJECT } from '../store/actions/actionType';
import { getAllProjects } from '../store/actions/projects';
import PropTypes from 'prop-types';
import sidebarMenu from '../commons/sidebarMenu.json';
import { Link } from 'react-router-dom';
import { clearTaskListBoradData } from '../store/actions/Task';
const userId = getUserId();

function Sidebar(props) {
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const location = useLocation();
	const data = useSelector((state) => {
		return state?.project?.[GET_ALL_PROJECT]?.result || [];
	});

	useEffect(() => {
		if (data?.length <= 0) {
			dispatch(getAllProjects(userId));
		}
	}, [data?.length, dispatch]);
	const { back_to_home } = getSiteLanguageData('components/sidebar');
	return (
		<div id="sidebar-wrapper">
			<div className="sidebar-container pt-0">
				<div className="btn-group menu-project-changer-main my-2">
					{/* <button type="button" className="btn menu-project-changer dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Project name 1
          </button>
          <div className="dropdown-menu">
            <a className="dropdown-item" href="/dashboard"><i className="fas fa-home me-2"></i>Back to Home</a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="/dashboard"><i className="far fa-folder me-2"></i>Project name 2</a>
            <a className="dropdown-item" href="/dashboard"><i className="far fa-folder me-2"></i>Project name 3</a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="/dashboard"><i className="fas fa-plus me-2"></i>Add New Project</a>
          </div> */}
					<Dropdown>
						{data
							?.filter((p) => p._id === project_id)
							.map((p) => {
								return (
									<Dropdown.Toggle
										key={p._id}
										variant="light"
										className="lf-text-overflow-200 ls mx-0 w-100">
										{p.name}
									</Dropdown.Toggle>
								);
							})}
						<Dropdown.Menu className="shadow mb-2 mt-5 lf-dropdown-animation bg-white rounded-7">
							{data
								?.filter((a) => a?.is_archived === false)
								?.map((p) => {
									return (
										<Dropdown.Item
											disabled={p?._id === project_id}
											key={p._id}
											href={'/dashboard/' + p._id}
											className="lf-text-overflow-200 mx-0 w-100">
											<i
												className={
													p?._id === project_id
														? `fas fa-check me-2`
														: `far fa-folder me-2`
												}
											/>
											{p.name}
										</Dropdown.Item>
									);
								})}
							{
								// data?.filter(p => p._id !== project_id).length > 0 ?
								// <hr />
								// :''
							}
							{/* {props?.children} */}
							{/* <Dropdown.Item href="#/action-3"><i className="fas fa-plus me-2 "></i>Add New Project{props?.children}</Dropdown.Item> */}
							<hr className="mb-1" />
							<Dropdown.Item href="/projects">
								<i className="fas fa-home me-2"></i>
								{back_to_home?.text}
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
				<ul className="sidebar-menu">
{/* 					{props?.toggled ? (
						<li>
							<Link to="/projects">
								<i className="fas fa-home me-2"></i>
							</Link>
						</li>
					) : null} */}
					{sidebarMenu.map((menu, k) => {
						return (
							<li
								key={k}
								className={
									location.pathname === (menu.url + project_id) || (menu.url.includes("task") && location.pathname === ('/issues/'+ project_id))  ? 'active' : ''
								}>
								<Link
									to={menu.url + project_id}
									onClick={() => {
										if (menu.name === 'Tasks' || menu.name === 'Dashboard') {
											dispatch(clearTaskListBoradData());
										}
									}}>
									<img alt="livefield" src={menu.icon} />
									<span className="toggle-menu-none">{menu.name}</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
Sidebar.propTypes = {
	children: PropTypes.node,
	type: PropTypes.string,
};

export default Sidebar;
