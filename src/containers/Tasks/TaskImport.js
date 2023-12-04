import moment from 'moment';
import React, { useRef, useEffect } from 'react';
import jspreadsheet from 'jspreadsheet-ce';
import {
	errorNotification,
	successNotification,
} from '../../commons/notification';
import '../../../node_modules/jspreadsheet-ce/dist/jspreadsheet.css';
import './taskImport.scss';
// import '../../../node_modules/jsuites/dist/jsuites.css';
import { Button, Modal } from 'react-bootstrap';
import getUserId, { getSiteLanguageData } from '../../commons';
import { useDispatch, useSelector } from 'react-redux';

import {
	// createTask,
	// getBoardList,
	// GetCategoryList,
	// getLocationList,
	validateImportTasks,
} from '../../store/actions/Task';
import { getProjectDetails } from '../../store/actions/projects';
import { useParams } from 'react-router';

const TaskImport = (props) => {
	const jRef = useRef(null);

	const dispatch = useDispatch();

	const { project_id } = useParams();
	const userId = getUserId();
	const projectDetails = useSelector((state) => {
		return state?.project?.GET_PROJECT_DETAILS?.result || {};
	});
	const { add_row } = getSiteLanguageData('reports/toolbar');

	const { save } = getSiteLanguageData('commons');
	useEffect(() => {
		// dispatch(getProjectDetails(project_id, userId));
		const options = {
			data: [[]],
			minDimensions: [12, 15],
			columns: [
				{
					type: 'text',
					id: 'task',
					title: 'Task Name',
					width: 160,
					align: 'left',
				},
				{ type: 'text', id: 'status', title: 'Status', width: 100 },
				{
					type: 'text',
					id: 'assignee',
					title: 'Assignee \n(Email ID)',
					width: 160,
				},
				{ type: 'text', id: 'typeof_word', title: 'Type of work', width: 100 },
				{ type: 'text', id: 'category', title: 'Category', width: 100 },
				{ type: 'text', id: 'location', title: 'Location', width: 100 },
				{
					id: 'start_date',
					title: `Start Date \n ${
						projectDetails.date_formate
							? '(' + projectDetails.date_formate + ')'
							: ''
					}`,
					width: 120,
					type: 'text',
					/* options: {
						format: projectDetails.date_formate,
						fullscreen: false,
						readonly: false,
						// Today is default
						today: 1,
						// Show timepicker
						time: 0,
						// Show the reset button
						resetButton: true,
					}, */
				},
				{
					id: 'end_date',
					title: `End Date \n ${
						projectDetails.date_formate
							? '(' + projectDetails.date_formate + ')'
							: ''
					}`,
					width: 120,
					type: 'text',
					/* options: {
						format: projectDetails.date_formate,
						fullscreen: false,
						readonly: false,
						// Today is default
						today: 1,
						// Show timepicker
						time: 0,
						// Show the reset button
						resetButton: true,
					}, */
				},
				{ type: 'text', id: 'tags', title: 'Tags', width: 100 },
				{ type: 'text', id: 'sheet', title: 'Sheet No.', width: 100 },
				{
					type: 'text',
					id: 'manpower',
					title: `Manpower \n ${
						projectDetails.manpower_unit
							? '(' + projectDetails.manpower_unit + ')'
							: ''
					}`,
					width: 100,
				},
				{
					type: 'text',
					id: 'cost',
					title: `Cost \n ${
						projectDetails.currency ? '(' + projectDetails.currency + ')' : ''
					}`,
					width: 100,
				},
			],
			contextMenu: function () {
				return false;
			},
			/* style: [{ A1: 'text-align:left;' }], */
		};
		if (!jRef.current.jspreadsheet) {
			jspreadsheet(jRef.current, options);
		}
	}, []);

	const addRow = () => {
		jRef.current.jexcel.insertRow();
	};

	const getData = () => {
		const data = jRef.current.jexcel.getData();

		const postData = {
			user_id: localStorage.getItem('userId'),
			project_id: project_id,
			tasks: data,
		};

		let clrStyle = {};
		data.forEach((element, index) => {
			clrStyle['A' + (index + 1)] = 'background-color: #fff; color:#212529;';
			clrStyle['B' + (index + 1)] = 'background-color: #fff; color:#212529;';
			clrStyle['C' + (index + 1)] = 'background-color: #fff; color:#212529;';
			clrStyle['D' + (index + 1)] = 'background-color: #fff; color:#212529;';
			clrStyle['E' + (index + 1)] = 'background-color: #fff; color:#212529;';
			clrStyle['F' + (index + 1)] = 'background-color: #fff; color:#212529;';
			clrStyle['G' + (index + 1)] = 'background-color: #fff; color:#212529;';
			clrStyle['G' + (index + 1)] = 'background-color: #fff; color:#212529;';
			clrStyle['I' + (index + 1)] = 'background-color: #fff; color:#212529;';
			clrStyle['J' + (index + 1)] = 'background-color: #fff; color:#212529;';
			clrStyle['K' + (index + 1)] = 'background-color: #fff; color:#212529;';
			clrStyle['L' + (index + 1)] = 'background-color: #fff; color:#212529;';
		});

		jRef.current.jexcel.resetStyle(clrStyle);

		dispatch(
			validateImportTasks(postData, (res) => {
				if (
					typeof res.result.validation != 'undefined' &&
					res.result.validation.length > 0
				) {
					let setStyle = {};

					res.result.validation.forEach((element) => {
						if (element.task_name) {
							setStyle['A' + element.row_number] =
								'background-color:#FFC7CE; color:#9C0006';
						}

						if (element.task_status) {
							setStyle['B' + element.row_number] =
								'background-color:#FFC7CE; color:#9C0006';
						}

						if (element.assignee) {
							setStyle['C' + element.row_number] =
								'background-color:#FFC7CE; color:#9C0006';
						}

						if (element.type_of_work) {
							setStyle['D' + element.row_number] =
								'background-color:#FFC7CE; color:#9C0006';
						}

						if (element.task_category) {
							setStyle['E' + element.row_number] =
								'background-color:#FFC7CE; color:#9C0006';
						}

						if (element.task_location) {
							setStyle['F' + element.row_number] =
								'background-color:#FFC7CE; color:#9C0006';
						}

						if (element.start_date) {
							setStyle['G' + element.row_number] =
								'background-color:#FFC7CE; color:#9C0006';
						}

						if (element.end_date) {
							setStyle['H' + element.row_number] =
								'background-color:#FFC7CE; color:#9C0006';
						}

						if (element.tags) {
							setStyle['I' + element.row_number] =
								'background-color:#FFC7CE; color:#9C0006';
						}

						if (element.sheet_no) {
							setStyle['J' + element.row_number] =
								'background-color:#FFC7CE; color:#9C0006';
						}

						if (element.manpower) {
							setStyle['K' + element.row_number] =
								'background-color:#FFC7CE; color:#9C0006';
						}

						if (element.cost) {
							setStyle['L' + element.row_number] =
								'background-color:#FFC7CE; color:#9C0006';
						}
					});
					jRef.current.jexcel.setStyle(setStyle);
					errorNotification('Check format');
				} else if (res.success) {
					jRef.current.jexcel.resetStyle(clrStyle);
					props.closeImportMode(false);
					successNotification('Tasks imported successfully');
				} else {
					jRef.current.jexcel.resetStyle(clrStyle);
					props.closeImportMode(false);
					errorNotification('Something went wrong');
				}
			}),
		);
	};
	return (
		<div className="row">
			<div className="col-md-12 mb-2">
				<span
					variant="secondary"
					onClick={addRow}
					className="lf-common-btn btn">
					<i class="fas fa-plus pe-1"></i> {add_row.text}
				</span>
				<span
					variant="secondary"
					onClick={getData}
					className="mr-2 lf-common-btn btn">
					<i class="fa-solid fa-floppy-disk pe-1"></i> {save.text}
				</span>
			</div>
			<div className="col-md-12">
				<div
					style={{
						maxWidth: '100%',
						overflowY: 'auto',
					}}>
					<div ref={jRef} />
				</div>
			</div>
		</div>
	);
};

export default TaskImport;
