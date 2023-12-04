import { copyTask, deleteTask } from '../../store/actions/Task';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import CustomDate from '../../components/CustomDate';
import { FormCheck } from 'react-bootstrap';
import { Fragment } from 'react';
import { getParameterByName } from '../../helper';
const userId = getUserId();

const { icon_copy, category, task_no, title, statusbar, assigee, sheets } =
	getSiteLanguageData('task/update');
const { icon_delete, action, start_date, end_date, location } =
	getSiteLanguageData('commons');

function TasksListView({
	data,
	sortType,
	filterData,
	multiSelect,
	handleTaskSelect,
	handleMultiSelect,
	tasks,
	setSelectetdTask,
	project_id,
	dispatch,
	...props
}) {
	const task_view_type = getParameterByName('v') || 'list';
	return (
		<div className="container-fluid">
			<div className=" theme-table-wrapper card mt-3 scroll-y mb-0">
				<table className="table theme-table table-hover">
					<thead className="theme-table-title text-nowrap text-center bg-light">
						<tr>
							<th className="lf-w-50">
								<FormCheck
									type="checkbox"
									name="task"
									className="visible mx-3"
									onChange={({ target: { checked } }) => {
										let newArr = [...multiSelect];
										data?.forEach((p) => {
											if (checked === true) {
												newArr.push(p._id);
											} else {
												newArr = newArr.filter((d) => d !== p._id);
											}
										});
										handleMultiSelect(newArr);
									}}
									checked={data?.every((d) => multiSelect.includes(d._id))}
								/>
							</th>
							<th className="lf-w-100">{/* {category?.text} */}</th>
							<th className="lf-w-100 text-start">{task_no?.text}</th>
							<th className="lf-w-300 text-start">{title?.text} </th>
							<th className=" lf-w-100 text-start">{statusbar?.text}</th>
							<th className=" lf-w-200 text-start">{assigee?.text}</th>
							<th className="lf-w-100 text-start">{start_date?.text}</th>
							<th className="lf-w-100 text-start px-2">{end_date?.text}</th>
							<th className="lf-w-150 text-start">{location?.text}</th>
							<th className="lf-w-150 text-start">{sheets?.text}</th>
							<th className="lf-w-110 text-end pe-4">{action?.text}</th>
						</tr>
					</thead>
					<tbody>
						{data
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
								const taskCategory = t?.category?.map((x) => x.name);
								const taskCat = taskCategory?.[0];
								return (
									<Fragment key={t._id}>
										<tr
											className=" theme-table-data-row align-items-center"
											key={'title-row' + t._id}>
											<td className="lf-w-50 text-center align-middle">
												<div className="p-2 p-md-0">
													<FormCheck
														className={`${
															multiSelect.length > 0 ? 'visible' : ''
														}`}
														type="checkbox"
														name="task_id"
														onChange={(e) => handleTaskSelect(e, t)}
														checked={multiSelect.includes(t._id)}
														value={tasks._id}
														key={'checkbox' + t._id}
													/>
												</div>
											</td>
											<td
												className="lf-w-100 text-center align-middle"
												onClick={() => setSelectetdTask(t)}>
												<span
													className="d-block task-img text-white text-uppercase"
													style={{
														backgroundColor: t?.board?.color_code,
														padding: '6px 0px',
													}}>
													{taskCat?.charAt(0)}
													{taskCat?.charAt(1)}
												</span>
											</td>
											<td
												className="lf-w-100 text-secondary text-start align-middle"
												onClick={() => setSelectetdTask(t)}>
												<span>#{t.task_no}</span>
											</td>
											<td
												className="lf-w-300 text-start align-middle pe-3"
												onClick={() => setSelectetdTask(t)}>
												<span
													className={`text-start lf-task-color-list  ${
														t.title?.split(' ').some((d) => d.length > 50)
															? 'text-break'
															: ''
													}`}>
													{t.title}
												</span>
											</td>
											<td
												className="lf-w-100 text-secondary text-start align-middle"
												onClick={() => setSelectetdTask(t)}>
												{t?.board?.name}
											</td>
											<td
												className="lf-w-100 text-secondary text-nowrap text-start text-capitalize align-middle"
												onClick={() => setSelectetdTask(t)}>
												<span className="">
													{t?.assigee?.map((a) => {
														return (
															<Fragment key={a._id + t._id}>
																{a.first_name} {a.last_name}
															</Fragment>
														);
													})}
												</span>
											</td>
											<td
												className="lf-w-100 text-secondary text-wrap text-start align-middle"
												onClick={() => setSelectetdTask(t)}>
												{t.start_date ? <CustomDate date={t.start_date} /> : ''}
											</td>
											<td
												className="lf-w-100 text-secondary text-nowrap text-start align-middle"
												onClick={() => setSelectetdTask(t)}>
												<span className="px-2">
													{t.end_date ? <CustomDate date={t.end_date} /> : ''}
												</span>
											</td>
											<td
												className="lf-w-100  text-secondary text-start text-capitalize align-middle"
												title={t?.location?.map((l) => {
													return l.name;
												})}
												onClick={() => setSelectetdTask(t)}>
												<span className="lf-text-overflow-100 align-middle">
													{t?.location?.map((l) => {
														return <Fragment key={l._id}>{l.name}</Fragment>;
													})}
												</span>
											</td>
											<td className="lf-w-150 text-start align-middle">
												{t?.plan?.map((p) => {
													return (
														<span
															className="lf-text-overflow-150 align-middle"
															key={p._id + t._id}>
															<a
																href={`/sheets/${project_id}/sheetInfo/${t.plan_id}`}
																target="_blank"
																rel="noopener noreferrer"
																className={`text-secondary text-decoration-underline`}
																title={p.sheet_no + ' ' + p.description}>
																{p.sheet_no}{' '}
																{p.description ? '- ' + p.description : ''}
															</a>
														</span>
													);
												})}
											</td>
											<td className=" text-end text-nowrap lf-w-110 align-middle pe-4">
												<span
													className="p-2 ms-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold"
													tooltip={icon_copy.tooltip}
													flow={icon_copy.tooltip_flow}
													onClick={() =>
														sweetAlert(
															() =>
																dispatch(
																	copyTask({
																		task_id: t?._id,
																		project_id: project_id,
																		user_id: userId,
																	}),
																),
															'task',
															'duplicate',
														)
													}>
													<i className="far fa-copy"></i>
												</span>
												<span
													className="p-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold"
													tooltip={icon_delete.tooltip}
													flow={icon_delete.tooltip_flow}
													onClick={() =>
														sweetAlert(
															() =>
																dispatch(
																	deleteTask(
																		{
																			project_id: project_id,
																			user_id: userId,
																			task_id: [t?._id],
																		},
																		task_view_type,
																		filterData,
																	),
																),
															'task',
														)
													}>
													<i className="far fa-trash-alt"></i>
												</span>
											</td>
										</tr>
									</Fragment>
								);
							})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default TasksListView;
