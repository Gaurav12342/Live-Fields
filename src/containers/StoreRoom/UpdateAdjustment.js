import { useEffect, useState } from 'react';
import { Modal, Form, Button, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { useDispatch } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';

import {
	updateAdjustment,
	getStoreRoomListByStoreRoomId,
	getStoreRoom,
} from '../../store/actions/storeroom';

function UpdateAdjustment(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [adjustment, setAdjustment] = useState(
		props?.editAdjustmentData?.adujustment_quantity
			? props?.editAdjustmentData?.adujustment_quantity
			: null,
	);
	const [notes, setNotes] = useState(
		props?.editAdjustmentData?.notes ? props?.editAdjustmentData?.notes : '',
	);
	useEffect(() => {
		setNotes(props?.editAdjustmentData?.notes);
		setAdjustment(props?.editAdjustmentData?.adujustment_quantity);
	}, [props.editAdjustmentData]);

	const editAdjustment = () => {
		console.log(adjustment, 'adjustment');
		if (
			adjustment != null &&
			adjustment != '' &&
			String(adjustment).trim() != ''
		) {
			let aj = props.editAdjustmentData;

			const post = {
				adjusment_id: aj._id,
				user_id: userId,
				project_id: project_id,
				store_room_id: aj.store_room_id,
				material_id: aj.material_id,
				notes: notes,
				adjusment: adjustment,
				adjustment_date: props.date,
			};
			dispatch(
				updateAdjustment(post, (data) => {
					setAdjustment(null);
					dispatch(getStoreRoomListByStoreRoomId(aj.store_room_id, props.date));
					dispatch(getStoreRoom(project_id));
					props.handleAdjustmentModel({});
				}),
			);
		}
	};

	const { update_adjustment, adjustment_qty,notes:adjustmentNotes } = getSiteLanguageData('material');
	const { save } = getSiteLanguageData('commons');
	return (
		<>
			<Modal
				size={'md'}
				show={props.adjustmentModel}
				onHide={props.handleAdjustmentModel}
				animation={false}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{update_adjustment?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="row">
						<div className="col-sm-12">
							<Form.Label className={`mb-0`} htmlFor="templatename">
								{`Enter ${adjustment_qty.text}`}
							</Form.Label>
						</div>

						<div className="col-sm-12">
							<FormControl
								placeholder={`Enter ${adjustment_qty.text}`}
								type="number"
								name="adjustment"
								autoComplete="off"
								className="lf-formcontrol-height"
								onChange={(e) => setAdjustment(e.target.value)}
								value={adjustment}
								required
							/>
						</div>

						<div className="col-sm-12 mt-2">
							<Form.Label className={`mb-0`} htmlFor="templatename">
								{`Enter ${adjustmentNotes.text}s`}
							</Form.Label>
						</div>

						<div className="col-sm-12">
							<FormControl
								placeholder={`Enter ${adjustmentNotes.text}s`}
								type="text"
								name="notes"
								autoComplete="off"
								className="lf-formcontrol-height"
								onChange={(e) => setNotes(e.target.value)}
								value={notes}
								required
							/>
						</div>

						<div className="col-12 mt-2">
							<Button
								type="button"
								onClick={editAdjustment}
								className="btn btn-primary theme-btn float-end btn-block my-1 show-verify">
								<i className="fa-solid fa-floppy-disk pe-2"></i>
								{save?.text}
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default UpdateAdjustment;
