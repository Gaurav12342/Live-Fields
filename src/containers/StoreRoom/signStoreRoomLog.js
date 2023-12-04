import { useState } from 'react';
import { Modal, Form, Button, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { useDispatch } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import { getParameterByName } from '../../helper';
import Upload from '../../components/upload';
import Signature from '../../components/signature';
import { signStoreRoomLog } from '../../store/actions/storeroom';

function SignStoreRoomLog() {
	const userId = getUserId();
	const { project_id, store_room_id } = useParams();
	const date = getParameterByName('store_room_log_date');
	const {
		sign_storeroom_log_report
	} = getSiteLanguageData('storeroom');
	const {
		submit
	} = getSiteLanguageData('commons');
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		store_room_id: store_room_id,
		user_id: userId,
		project_id: project_id,
		report_date: date,
		general_notes: '',
		attachement: [],
		signature_url: '',
		signed_by: userId,
	});
	const handleChange = (name, value) => {
		setInfo({
			...info,
			[name]: value,
		});
	};

	const handleDelete = (link) => {
		const newArr = info?.attachement?.filter((item) => {
			return item !== link;
		});
		handleChange('attachement', newArr);
	};
	const signStoreRoom = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(signStoreRoomLog(info));
	};
	return (
		<>
			<span
				type="submit"
				className="lf-common-btn theme-secondary mt-1 float-end"
				onClick={handleShow}>
				{submit.text}
			</span>
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{sign_storeroom_log_report.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={signStoreRoom}>
						<div className="row p-3 ">
							{/* <div className="col-sm-12 mb-2">
                <Form.Label className="mb-0">Notes:</Form.Label>
                <FormControl
                  placeholder="Notes.. "
                  as="textarea"
                  name="general_notes"
                  rows="3"
                  onChange={(e) => handleChange("general_notes", e.target.value)}
                  value={info?.general_notes}
                />
              </div>
              <div className="col-sm-12 px-3">
                <Upload className="col-sm-2" fileType="StoreRoom_photo" fileKey={store_room_id} onFinish={(file) => {
                  const fileList = info?.attachement;
                  fileList.push(file)
                  handleChange('attachement', fileList)
                }}>
                  <span className="theme-color lf-link-cursor" >
                    <i className="fas fa-plus" /> file
                  </span>
                </Upload>
                <div className="card mt-2 lf-load-more-attechment">
                  <span className="ms-3 my-1 d-inline-block">
                    {info?.attachement.length > 0 ?
                      info?.attachement.map(f => {
                        return <>
                          <img alt="livefield" src={f} style={{ width: '40px', height: '40px' }} />
                          <i className="fas fa-times fa-xs lf-icon" onClick={handleDelete.bind(this, f)}></i>
                        </>
                      }
                      )
                      : null
                    }
                  </span>
                </div>
              </div> */}
							<div className="col-sm-12 mt-2 ms-1">
								<span className=" theme-btnbg theme-secondary rounded theme-btnbold">
									<Signature
										setUrl={handleChange}
										url={info?.signature_url}
										signReport={signStoreRoom}
									/>
								</span>
							</div>
							{/* <div className="col-sm-12 pt-2">
                <Button
                  type="submit"
                  className="btn btn-primary theme-btn btn-block float-end show-verify">
                  Sign Report
                </Button>
              </div> */}
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default SignStoreRoomLog;
