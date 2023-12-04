import React, { useRef, useEffect } from 'react';

import {
	errorNotification,
	successNotification,
} from '../../../commons/notification';
import jspreadsheet from 'jspreadsheet-ce';
import '../../../../node_modules/jspreadsheet-ce/dist/jspreadsheet.css';
// import './taskImport.scss';
// import '../../../node_modules/jsuites/dist/jsuites.css';
import getUserId, { getSiteLanguageData } from '../../../commons';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router';

const ImportQuestion = (props) => {
	const jRef = props.jRef; // useRef(null);
	console.log(jRef, 'jRef');
	const dispatch = useDispatch();

	const { project_id } = useParams();

	useEffect(() => {
		// dispatch(getProjectDetails(project_id, userId));
		let dtOp = [];
		if (props.selectedQuestions && Array.isArray(props.selectedQuestions)) {
			dtOp = props.selectedQuestions;
		}
		const options = {
			data: dtOp,
			minDimensions: [1, 10],
			columns: [
				{
					type: 'text',
					id: 'task',
					title: 'Survey Questions',
					width: 382,
					align: 'left',
				},
			],
			// style: { A1: 'text-align:left;' },
			contextMenu: function () {
				return false;
			},
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
		});

		jRef.current.jexcel.resetStyle(clrStyle);
	};
	const {
		start_date,
		end_date,
		name,
		frequency_name,
		assignee_name,
		next_btn,
		import_template,
	} = getSiteLanguageData('commons');

	const { save, add_row } = getSiteLanguageData('reports/toolbar');
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
					<i class="fas fa-file-import"></i> {save.text}
				</span>
				<span
					className="lf-link-cursor lf-common-btn text-center"
					tooltip={import_template.tooltip}
					flow={import_template.tooltip_flow}
					onClick={props.handleImportModel}>
					<i className="fas fa-plus px-1"></i>
					{import_template?.text}
				</span>
			</div>
			<div className="col-md-12">
				<div
					style={{
						maxWidth: '100%',
						width: '100%',
						overflowY: 'auto',
					}}>
					<div ref={jRef} />
				</div>
			</div>
		</div>
	);
};

export default ImportQuestion;
