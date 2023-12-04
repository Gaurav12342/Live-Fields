import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useParams } from 'react-router';
import PropTypes from 'prop-types';
import OpenNotificationModal from '../containers/Notification';
import moment from 'moment';

import Loading from './loadig';
import { useNavigate } from 'react-router-dom';

// import { getProjectDetails } from '../store/actions/projects';
import getUserId, { getSiteLanguageData } from '../commons';

function NobarLayout(props) {
	const userId = getUserId();
	const navigate = useNavigate();
	const { project_id } = useParams();
	const [open, setOpenNotification] = useState(false);
	const location = useLocation();
	const dispatch = useDispatch();

	useEffect(() => {
	
	}, []);
	
	

	return (
		<Fragment>
			<div className="row g-0 d-flex d-md-none">
				<div className="col-6">
					<a href="/projects">
						<img
							alt="livefield"
							className="ms-4 mt-2"
							src="/images/logo-sm.png"
						/>
					</a>
				</div>
				
			</div>
			
			<div className="">
				{props.children}
			</div>
			<OpenNotificationModal open={open} dashboard={props.nosidebar} />
		</Fragment>
	);
}
NobarLayout.propTypes = {
	children: PropTypes.node.isRequired,
	nosidebar: PropTypes.bool,
};

export default NobarLayout;
