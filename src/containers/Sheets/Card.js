import { useRef, useState } from 'react';
import { FormControl } from 'react-bootstrap';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import getUserId, { sweetAlert } from '../../commons';
import { errorNotification } from '../../commons/notification';
import { deleteRevision, revisionRename } from '../../store/actions/sheetPlan';
const style = {
	// border: '1px dashed gray',
	// padding: '0.5rem 1rem',
	marginBottom: '.5rem',
	// backgroundColor: 'white',
	cursor: 'move',
};

export const Card = ({ k, lr, setShow, index, id, text, moveCard }) => {
	const ref = useRef(null);
	const { project_id, plan_id } = useParams();
	const dispatch = useDispatch();
	const [editRevision, setEditRevision] = useState(null);
	const userId = getUserId();
	const [{ handlerId }, drop] = useDrop({
		accept: 'card',
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId(),
			};
		},
		drop(item, monitor) {
			if (!ref.current) {
				return;
			}
			const dragIndex = item.index;
			const hoverIndex = index;
			if (dragIndex === hoverIndex) {
				return;
			}
			const hoverBoundingRect = ref.current?.getBoundingClientRect();
			const hoverMiddleY =
				(hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
			const clientOffset = monitor.getClientOffset();
			const hoverClientY = clientOffset.y - hoverBoundingRect.top;
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return;
			}
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return;
			}
			moveCard(dragIndex, hoverIndex);
			item.index = hoverIndex;
		},
	});
	const [{ isDragging }, drag] = useDrag({
		type: 'card',
		item: () => {
			return { id, index };
		},
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});
	const opacity = isDragging ? 0 : 1;
	drag(drop(ref));
	const submitRevision = (revision) => {
		const post = {
			project_id: project_id,
			plan_id: plan_id,
			revision_id: revision._id,
			revision_no: revision?.revision_no,
			user_id: userId,
		};
		dispatch(revisionRename(post));
	};
	return (
		<>
			<div className="col-12 mt-1 ">
				{
					<div
						className=" text-start text-break rounded-2 lf-Sheet-detail-hover"
						ref={ref}
						data-handler-id={handlerId}>
						<span
							className="col-8 m-1 d-inline-block"
							style={{ ...style, opacity }}>
							{editRevision == text?._id ? (
								<FormControl
									type="text"
									name="revision_no"
									autoComplete="off"
									onKeyPress={(e) => {
										const revision_no = e.target.value;
										if (e.key === 'Enter') {
											submitRevision({
												...text,
												revision_no,
											});
											setTimeout(() => {
												setEditRevision(null);
											}, 100);
										}
									}}
									onBlur={(e) => {
										const revision_no = e.target.value;
										submitRevision({
											...text,
											revision_no,
										});
										setTimeout(() => {
											setEditRevision(null);
										}, 100);
									}}
									defaultValue={text?.revision_no}
								/>
							) : (
								<>
									<span className="col-lg-8">{text?.revision_no}</span>
								</>
							)}
						</span>
						<span className="col-4">
							<span className="d-inline float-end">
								<i
									className="far fa-trash-alt float-end me-2 mt-2 theme-btnbg theme-secondary"
									onClick={() =>
										lr === 1
											? errorNotification('You can not delete last revision')
											: sweetAlert(
													() =>
														dispatch(
															deleteRevision({
																user_id: userId,
																project_id: project_id,
																plan_id: plan_id,
																revision_id: id,
															}),
														),
													'Revision',
											  )
									}></i>
							</span>
							<span className="float-end d-inline">
								<i
									className="fas fa-edit float-end me-3 mt-2 theme-btnbg theme-secondary"
									onClick={(e) => setEditRevision(text?._id)}></i>
							</span>
						</span>
					</div>
				}
			</div>
		</>
	);
};
