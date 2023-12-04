import { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import React from 'react';
import { getStoreRoomFullDetails } from '../../store/actions/storeroom';
import { GET_STORE_ROOM_FULL_DETAILS } from '../../store/actions/actionType';
import { useDispatch, useSelector } from 'react-redux';
import { getSiteLanguageData } from '../../commons';

function StoreRoomInfo(props) {
	const storeRoom_id = props?.data;
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleShow = () => setShow(true);
	const handleClose = () => setShow(false);
	const storeRoomInfo = useSelector((state) => {
		return state?.storeroom?.[GET_STORE_ROOM_FULL_DETAILS]?.result || [];
	});
	const {
		info,project_name
	} = getSiteLanguageData('reports/toolbar');
	const { store_room } = getSiteLanguageData('components');
	const {description,location} = getSiteLanguageData('commons');
	useEffect(() => {
		if (storeRoomInfo?.length <= 0) {
			dispatch(getStoreRoomFullDetails(storeRoom_id));
		}
	}, [storeRoomInfo?.length, dispatch]);
	return (
		<>
			<span
				type="submit"
				className="theme-secondary lf-common-btn btn mt-1 float-end"
				onClick={handleShow}>
				{info}
			</span>
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{`${store_room.text} Info`}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="row">
						<div className="col-sm-4">
							<label className="mb-0">{description.text}</label>
						</div>
						<div className="col-sm-8">
							<label className="mb-0">{storeRoomInfo?.description}</label>
						</div>
						<div className="col-sm-4">
							<label className="mb-0">{project_name.text}</label>
						</div>
						<div className="col-sm-8">
							<label className="mb-0">{storeRoomInfo?.project?.name}</label>
						</div>
						<div className="col-sm-4">
							<label className="mb-0"></label>
						</div>
						<div className="col-sm-8">
							<label className="mb-0">
								{storeRoomInfo?.assigee
									?.map((as) => {
										return ` ${as?.first_name} ${as?.last_name}`;
									})
									.join(',')}
							</label>
						</div>
						<div className="col-sm-4">
							<label className="mb-0">{location.text}</label>
						</div>
						<div className="col-sm-8">
							<label className="mb-0 text-break">
								{storeRoomInfo?.location
									?.map((l) => {
										return ` ${l?.name}`;
									})
									.join(',')}
							</label>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default StoreRoomInfo;
