import React from 'react';
import { Col, FormCheck, Row } from 'react-bootstrap';
import { DragSource, DropTarget } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { errorNotification } from '../../commons/notification';
import { updateKanbanStatus, updateTask } from '../../store/actions/Task';
import AddCreateTask from './addCreateTask';

const BoxCard = ({
	name,
	filterData,
	isDragging,
	connectDragSource,
	setSelectetdTask,
	handleTaskSelect,
	multiSelect,
	t,
	taskCat,
	kb,
}) => {
	// const opacity = isDragging ? 0.4 : 1;
	return (
		<>
			<div
				ref={connectDragSource}
				role={'Box'}
				data-testid={`box-${name}`}
				className=" my-2 mx-1 p-2 lf-knban-left-border row"
				style={
					t.type === 'issue'
						? { borderLeft: '3px solid grey' }
						: { borderLeft: '3px solid #ffffff' }
				}>
				<div className="row px-1 theme-table-data-row lf-link-cursor sheet-grid-box-kanban position-relative">
					<span className="col-2" onClick={() => setSelectetdTask(t)}>
						<div
							className="kanban-task-img text-center mt-2 text-white text-uppercase"
							style={{
								backgroundColor: t.board?.color_code,
								fontSize: '11px',
								paddingTop: '3px',
							}}>
							<span className=" align-middle">
								{taskCat === 'nodata'
									? ''
									: `${taskCat.charAt(0)}${taskCat.charAt(1)}`}
							</span>
						</div>
					</span>
					<div className="col-10">
						<div
							className="lf-task-kanban-title ms-1 "
							onClick={() => setSelectetdTask(t)}>
							<span className="text-secondary">
								#{t?.task_no} | @{' '}
								{t?.assigee?.map((a) => {
									return <>{a.first_name}</>;
								})}
							</span>
							<br />
							<span className="lf-task-color">{t.title}</span>
						</div>
					</div>

					<FormCheck
						className={`lf-sheetsdetails-checkbox-kanban ${
							multiSelect.length > 0 ? 'd-block' : ''
						}`}
						type="checkbox"
						name="task_id"
						onChange={(e) => handleTaskSelect(e, t)}
						checked={multiSelect.includes(t._id)}
						value={t._id}
					/>
				</div>
			</div>
		</>
	);
};

export const Box = DragSource(
	'BOX',
	{
		beginDrag: (props, monitor) => {
			return { name: props.name };
		},
		endDrag(props, monitor) {
			// const item = monitor.getItem();
			const dropResult = monitor.getDropResult();
			let allowDrop = true;
			if((dropResult?.kb?.kanban_status === "Completed" || dropResult?.kb?.name === "Completed") && ( props.t && typeof props.t.allowCompleted != "undefined" && props.t.allowCompleted === false)){
				allowDrop = false;
			}else if((dropResult?.kb?.kanban_status === "Verified" || dropResult?.kb?.name === "Verified") && ( props.t && typeof props.t.allowVerified != "undefined" && props.t.allowVerified === false)){
				allowDrop = false;
			}
			if(allowDrop){
				if (props?.kb?.name) {
					if (dropResult) {
						const post = {
							task_id: props?.t?._id,
							current_Board: props?.kb?.name,
							board_id: dropResult?.board_id,
							project_id: dropResult?.project_id,
							user_id: dropResult?.user_id,
						};
						// props.clearTaskFilter()
						props.dispatch(updateTask(post, false, 'board', props?.filterData));
					}
				} else {
					if (dropResult) {
						const post = {
							task_id: props?.t?._id,
							current_kanban_status: props?.kb?.kanban_status,
							new_kanban_status: dropResult?.name,
							project_id: dropResult?.project_id,
							user_id: dropResult?.user_id,
						};
						if (
							props?.kb?.possible_kanban_status?.some(
								(k) => k === post?.new_kanban_status,
							)
						) {
							props.dispatch(updateKanbanStatus(post, props?.filterData));
						} else {
							errorNotification(
								`Can not move task from "${post?.current_kanban_status}" to "${post?.new_kanban_status}"`,
							);
						}
					}
				}
			}else{
				errorNotification(
					`You don't have permission to mark task as completed and verified`,
				);
			}
			
		},
	},
	(connect, monitor) => {
		return {
			connectDragSource: connect.dragSource(),
			isDragging: monitor.isDragging(),
		};
	},
)(BoxCard);

const BoardCard = ({
	canDrop,
	clearTaskFilter,
	filterData,
	isOver,
	handleMultiSelect,
	connectDropTarget,
	setSelectetdTask,
	handleTaskSelect,
	multiSelect,
	kb,
	sortType,
}) => {
	// const isActive = canDrop && isOver;
	const dispatch = useDispatch();
	// let backgroundColor = '#222';
	// if (isActive) {
	//     backgroundColor = 'darkgreen';
	// }
	// else if (canDrop) {
	//     backgroundColor = 'darkkhaki';
	// }
	return (
		<span className="mx-1 lf-task-data" ref={connectDropTarget} role="Dustbin">
			{/* {isActive ? 'Release to drop' : 'Drag a box here'} */}
			<Row
				className=" mt-1 mx-1 p-2 lf-knban-to-border"
				// style={kb.name === "Completed" ? { borderTop: "3px solid #4caf50" }
				//     : kb.name === "Verified" ? { borderTop: "3px solid #00bcd4" }
				//         : kb.name === "Priority 1" ? { borderTop: "3px solid #bf0707" }
				//             : kb.name === "Priority 2" ? { borderTop: "3px solid #ffa707" }
				//                 : kb.name === "Priority 3" ? { borderTop: "3px solid #919687" }
				//                     : kb.kanban_status === "Overdue" ? { borderTop: "3px solid red" }
				//                         : kb.kanban_status === "Completed" ? { borderTop: "3px solid #4caf50" }
				//                             : kb.kanban_status === "Verified" ? { borderTop: "3px solid #00bcd4" }
				//                                 : { borderTop: "3px solid yellow" }}
				style={{ borderTop: `3px solid ${kb.color_code}` }}>
				<Col sm={12} className="font-title-kanban ">
					{/* <h6> */}
					{kb.name ? kb.name : kb.kanban_status}{' '}
					<span className="border border-1 ms-1 px-2 lf-border">
						{kb?.task?.length}
					</span>
					{/* <span className="theme-table-data-row">
                    {
                        kb?.task?.length > 0 ?
                            <label className="check d-inline lf-task-checkbox  float-end">
                                <input
                                    type="checkbox"
                                    name="Task"
                                    onChange={({ target: { checked } }) => {
                                        let newArr = [...multiSelect];
                                        kb?.task?.forEach(p => {
                                            if (checked === true) {
                                                newArr.push(p._id)
                                            }
                                            else {
                                                newArr = newArr.filter(d => d !== p._id)
                                            }
                                        })
                                        handleMultiSelect(newArr)
                                    }}
                                    checked={kb?.task?.every(d => multiSelect.includes(d._id))}
                                // value={r._id}
                                />
                                <span className="checkmark ms-3"></span>
                            </label> : ''
                    }
                </span> */}
					<FormCheck
						type="checkbox"
						className={`${
							kb?.task?.length > 0 ? 'visible' : 'invisible'
						} d-inline-block float-end`}
						name="Task"
						onChange={({ target: { checked } }) => {
							let newArr = [...multiSelect];
							kb?.task?.forEach((p) => {
								if (checked === true) {
									newArr.push(p._id);
								} else {
									newArr = newArr.filter((d) => d !== p._id);
								}
							});
							handleMultiSelect(newArr);
						}}
						checked={kb?.task?.every((d) => multiSelect.includes(d._id))}
					/>
				</Col>
			</Row>
			<div className="lf-task-board-kanban-col pb-5 mt-2">
				<div className="p-1">
					<div className="row my-2 px-3">
						<AddCreateTask
							filterData={filterData}
							kanban={kb?.kanban_status}
							task_view_type={kb.name ? 'board' : 'kanban'}
							board_id={kb._id}
							className=""
						/>
					</div>
					{kb?.task
						?.sort((a, b) => {
							if (sortType === '1') {
								return a?.title.localeCompare(b?.title);
							}
							if (sortType === '2') {
								return b?.title.localeCompare(a?.title);
							}
							if (sortType === '3') {
								return new Date(b.createdAt) - new Date(a.createdAt);
							}
							if (sortType === '4') {
								return new Date(a.createdAt) - new Date(b.createdAt);
							}
							return true;
						})
						.map((t) => {
							// var p = t.title
							// var matches = p.match(/\b(\w)/g)
							// var status = matches.join("")
							var taskCategory = t?.category?.map((x) => x.name);
							var taskCat = taskCategory[0] || 'nodata';
							return (
								<Box
									t={t}
									filterData={filterData}
									clearTaskFilter={clearTaskFilter}
									taskCat={taskCat}
									setSelectetdTask={setSelectetdTask}
									handleTaskSelect={handleTaskSelect}
									multiSelect={multiSelect}
									kb={kb}
									dispatch={dispatch}
								/>
							);
						})}
				</div>
			</div>
		</span>
	);
};

const Board = DropTarget(
	'BOX',
	{
		drop: (props) => {
			return {
				name: props?.kb?.kanban_status,
				board_id: props?.kb?._id,
				board: props?.kb?.name,
				kb: props?.kb,
				project_id: props?.project_id,
				user_id: props?.userId,
			};
		},
	},
	(connect, monitor) => ({
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop(),
	}),
)(BoardCard);

export default Board;
