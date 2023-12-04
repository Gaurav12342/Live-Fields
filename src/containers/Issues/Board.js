import React from 'react';
import { Col, FormCheck, Row } from 'react-bootstrap';
import { DragSource, DropTarget } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { issueUpdate } from '../../store/actions/Issues';

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
	
	return (
		<>
			<div
				ref={connectDragSource}
				key={t._id}
				role={'Box'}
				className=" my-2 mx-1 p-2 lf-knban-left-border row"
				style={{ borderLeft: '3px solid #ffffff' }}>
				<div className="row px-1 theme-table-data-row lf-link-cursor sheet-grid-box-kanban position-relative">					
					<span className="col-2" onClick={() => setSelectetdTask(t)}>
						<div
							className="kanban-task-img text-center mt-2 text-white text-uppercase"
							style={{
								backgroundColor: t?.color_code,
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
								#{t?.issue_no} | @{' '}
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
						style={{width:'auto'}}
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
			return { name: props.t.title };
		},
		endDrag(props, monitor) {
			const dropResult = monitor.getDropResult();
			if (props?.kb?.status_id) {
				if (dropResult) {
					const post = {
						_id: props?.t?._id,						
						status_id: dropResult?.board_id,
						project_id: dropResult?.project_id,
						user_id: dropResult?.user_id,
					};
					props.updateViewState(props?.t?._id, dropResult?.board_id)
					props.dispatch(issueUpdate(post))
				}
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
	updateViewState,
	getIssueData,
	userId,
	project_id
}) => {
	const dispatch = useDispatch();
	return (
		<span className="mx-1 lf-task-data" key={kb.status_id} ref={connectDropTarget} role="Dustbin">
			
			<Row
				className=" mt-1 mx-1 p-2 lf-knban-to-border"				
				style={{ borderTop: `3px solid ${kb.color_code}` }}>
				<Col sm={12} className="font-title-kanban ">
					
					{kb.status_id ? kb.status_id : '--'}{' '}
					<span className="border border-1 ms-1 px-2 lf-border">
						{kb?.data?.length}
					</span>
					
					<FormCheck
						type="checkbox"
						className={`${
							kb?.data?.length > 0 ? 'visible' : 'invisible'
						} d-inline-block float-end`}
						name="Task"
						onChange={({ target: { checked } }) => {
							let newArr = [...multiSelect];
							kb?.data?.forEach((p) => {
								if (checked === true) {
									newArr.push(p._id);
								} else {
									newArr = newArr.filter((d) => d !== p._id);
								}
							});
							handleMultiSelect(newArr);
						}}
						checked={kb?.data?.every((d) => multiSelect.includes(d._id))}
					/>
				</Col>
			</Row>
			<div className="lf-task-board-kanban-col pb-5 mt-2">
				<div className="p-1">
					
					{kb?.data
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
							var taskCategory = t?.category?.map((x) => x.name);
							var taskCat = taskCategory?.[0] || 'nodata';
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
									updateViewState={updateViewState}
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
				name: props?.kb?.status_id,
				board_id: props?.kb?.status_id,
				board: props?.kb?.status_id,
				kb: props?.kb,
				project_id: props?.project_id,
				user_id: props?.userId,
				updateViewState: props?.updateViewState
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
