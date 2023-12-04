import { useEffect, useState } from 'react';
import { Modal, Form, Button, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { useDispatch } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';

import {
	updateIssue,
	getStoreRoomListByStoreRoomId,
	getStoreRoom
} from '../../store/actions/storeroom';

function UpdateIssue(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [issue, setIssue] = useState(null);

	const editIssue = () => {
		if(issue != null && issue != "" && issue.trim() != ""){
			let aj = props.editIssueData;
		
			const post = {
				issue_id:aj._id,
				user_id:userId,
				project_id:project_id,
				store_room_id:aj.store_room_id,
				material_id:aj.material_id,
				issue:issue,
				issue_date:props.date
			}
			dispatch(updateIssue(post,(data)=>{
				setIssue(null);
				dispatch(getStoreRoomListByStoreRoomId(aj.store_room_id, props.date));
				dispatch(getStoreRoom(project_id));			
				props.handleIssueModel({})
			}));
		}
		
	}
	
	const { update_issue } = getSiteLanguageData('material');
	const { save } = getSiteLanguageData('commons');
	return (
		<>
			
			<Modal size={'md'} show={props.issueModel} onHide={props.handleIssueModel} animation={false}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{update_issue?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					
					<div className="row">
						<div className="col-sm-12">
							<Form.Label className={`mb-0`} htmlFor="templatename">Enter Value</Form.Label>
						</div>

						<div className="col-sm-12">
							
								<FormControl
									placeholder="Enter issue value"
									type="number"
									name="adjustment"
									autoComplete="off"
									className="lf-formcontrol-height"
									onChange={(e) =>
										setIssue(e.target.value)
									}
									value={issue}
									required
								/>
							
						</div>
						
						
						<div className="col-12 mt-2">
							<Button
								type="button"
								onClick={editIssue}
								className="btn btn-primary theme-btn float-end btn-block my-1 show-verify">
								{save?.text}
							</Button>
						</div>
					</div>
					
				</Modal.Body>
			</Modal>
		</>
	);
}
export default UpdateIssue;
