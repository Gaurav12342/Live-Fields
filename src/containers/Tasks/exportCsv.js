import { CSVLink } from 'react-csv';
import moment from 'moment';
import { getSiteLanguageData } from '../../commons';
const { btn_export } = getSiteLanguageData('task/update');
const ExportToCsv = ({ dataSource, className, ...props }) => {
	let data = [],
		filename = 'data.csv',
		children = null;
	if (Array.isArray(dataSource.task)) {
		if (dataSource.task.length > 0) {
			data = dataSource.task?.map((task) => {
				return {
					'Task No': task.task_no,
					'Task Name': task.title,
					Status: task?.board?.name,
					Assignee: task?.assigee?.[0]?.first_name,
					'Type of work': task?.type,
					// "Code": task?.code,
					Category: task?.category?.[0]?.name,
					Location: task?.location?.[0]?.name,
					'Start Date': moment(task?.start_date).format('YYYY-MM-DD'),
					'End Date': moment(task?.end_date).format('YYYY-MM-DD'),
					Sheet: task?.plan?.map((p)=>p.sheet_no+' - '+p.description),
					Manpower:task?.manpower ? task?.manpower : 0,
					Cost:task?.cost ? task?.cost : 0
					
				};
			});
			children = (
				<span tooltip={btn_export.tooltip} flow={btn_export.tooltip_flow}>
					{' '}
					<i className="fas fa-file-export"></i>
					<span className="ms-1"> {btn_export?.text}</span>
				</span>
			);
			filename = 'task-list.csv';
		}
	}

	return (
		<CSVLink
			className={className}
			data={data}
			filename={filename}
			target="_blank">
			{children}
		</CSVLink>
	);
};

export default ExportToCsv;
