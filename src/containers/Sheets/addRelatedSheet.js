import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Modal, Form, Button } from 'react-bootstrap';
import getUserId, { getSiteLanguageData } from '../../commons';
import { GET_ALL_SHEETS } from '../../store/actions/actionType';
import { addRelatedSheet, getAllSheets } from '../../store/actions/projects';
import CustomSelect from '../../components/SelectBox';

function AddRelatedSheet(props) {
	const userId = getUserId();
	const plan_id = props?.plan_id;
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		plan_id: plan_id,
		related_plans: props.selectedSheet,
	});

	const handleChange = (name, value) => {
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitSheet = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(addRelatedSheet(info));
	};
	const sheets = useSelector((state) => {
		return state?.project?.[GET_ALL_SHEETS]?.result || [];
	});
	useEffect(() => {
		if (sheets?.length <= 0) {
			dispatch(getAllSheets(project_id));
		}
	}, [sheets?.length, dispatch]);
	const sheetInfo = [];
	sheets?.forEach((a) => {
		(a?.plans).forEach((s) => {
			if(plan_id != s._id){
				let lbl = s.sheet_no;
				if(s.description){
					lbl += " - " +s.description
				}
				sheetInfo.push({ label: lbl, value: s._id });
			}
		});
	});

	const { add_related_sheet, add_related_sheet_btn } = getSiteLanguageData(
		'sheet/addrelatedsheet',
	);
	const { sheet_list } = getSiteLanguageData(
		'sheet',
	);
	return (
		<>
			<div className='btn btn-block bg-white w-100 mt-3 border-0' onClick={() => handleShow()}>
				<span title="Link Sheet" className="theme-color lf-link-cursor">
					<i className="fas fa-plus pe-1"></i> {add_related_sheet?.text}
				</span>
			</div>
			<Modal show={show} onHide={handleClose} animation={false}>
				<Modal.Header className="bg-light pb-2" closeButton>
					<Modal.Title>{add_related_sheet?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitSheet}>
						<div className="row p-3">
							<div className="col-sm-12">
								<div className="form-group">
									<label>{sheet_list.text}</label>
									<CustomSelect
										placeholder="Sheets..."
										isMulti
										name="related_plans"
										onChange={(e) =>
											handleChange(
												'related_plans',
												e?.map((w) => w.value),
											)
										}
										options={sheetInfo}
										closeMenuOnSelect={false}
										value={sheetInfo?.filter((sheet) =>
											info.related_plans?.some((w) => w === sheet.value),
										)}
									/>
								</div>
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block mt-3 show-verify float-end">
									<i class="fas fa-plus pe-1"></i>
									{add_related_sheet_btn?.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default AddRelatedSheet;
