import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Modal, Form, Button } from 'react-bootstrap';
import {
	addRelatedTask,
	getAllTaskByProjectId,
} from '../../store/actions/Task';
import getUserId, { getSiteLanguageData } from '../../commons';
import { GET_TASK_LIST_BY_PROJRCT_ID } from '../../store/actions/actionType';
import CustomSelect from '../../components/SelectBox';

function AddRelatedTask(props) {
	const userId = getUserId();
	const task_id = props?.task_id;
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		user_id: userId,
		task_id: task_id,
		related_task: [],
	});

	const handleChange = (name, value) => {
		setInfo({
			...info,
			[name]: value,
		});
	};

	const submitRelatedTask = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(
			addRelatedTask({
				...info,
				related_task: (info?.related_task).map((t) => {
					return t.value;
				}),
			}),
		);
	};
	const relatedTask = useSelector((state) => {
		return state?.task?.[GET_TASK_LIST_BY_PROJRCT_ID]?.result || [];
	});
	useEffect(() => {
		if (relatedTask?.length <= 0) {
			dispatch(getAllTaskByProjectId(project_id));
		}
	}, [relatedTask?.length, dispatch]);
	const related = relatedTask?.map((rt) => {
		return { label: rt.title, value: rt._id };
	});
	const { add, add_related_task, task_list, add_related_task_btn } =
		getSiteLanguageData('task/update');

		const { task} =
		getSiteLanguageData('sheet/toolbar');
	return (
		<>
			{/* <span onClick={() => handleShow()} className="row col-lg-1 btn Add-related-task text-bold mt-2">
        <span className="glyphicon glyphicon-plus-sign licence-add  float-end ms-5">
          <i className="fas fa-plus-circle theme-color"></i>
        </span>
        <span className="text-end ms-1">Add</span>
      </span> */}
			<span onClick={() => handleShow()} className=" btn float-end text-bold ">
				<i className={'fas fa-plus-circle theme-color'}></i>
				<span className="ms-1">{add?.text}</span>
			</span>
			<Modal show={show} onHide={handleClose} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>{add_related_task?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitRelatedTask}>
						<div className="row p-3">
							<div className="col-sm-12 mt-2">
								<div className="form-group">
									<label>{task_list?.text}</label>
									<CustomSelect
										isClearable
										isMulti
										placeholder={`${task.text}...`}
										name="related_task"
										onChange={(e) => handleChange('related_task', e)}
										options={related}
										closeMenuOnSelect={false}
										value={info.related_task}
									/>
								</div>
								<Button
									type="submit"
									className="btn mt-2 btn-primary theme-btn btn-block float-end show-verify">
									{add_related_task_btn?.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default AddRelatedTask;
