import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import CustomDate from '../../components/CustomDate';
import { FormCheck } from 'react-bootstrap';
import { Fragment } from 'react';
import { getParameterByName } from '../../helper';
import { issueDelete } from '../../store/actions/Issues';
import { Link } from 'react-router-dom';
const userId = getUserId();

const { title, statusbar, assigee, issueNo, created_date, task } =
	getSiteLanguageData('task/update');
const { icon_delete, action, start_date, end_date } =
	getSiteLanguageData('commons');

function IssuesListView({
	data,
	sortType,
	multiSelect,
	handleTaskSelect,
	handleMultiSelect,
	tasks,
	setSelectetdTask,
	project_id,
	dispatch,
	...props
}) {
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
							<th className="lf-w-100 text-start">{issueNo.text}</th>
							<th className="lf-w-250 text-start">{title?.text} </th>
							<th className="lf-w-100 text-start">{statusbar?.text}</th>
							<th className="lf-w-180 text-start">{assigee?.text}</th>
							<th className="lf-w-100 text-start px-2">{end_date?.text}</th>
							<th className="lf-w-100 text-start px-2">{created_date.text}</th>
							<th className="lf-w-160 text-start">{task.text}</th>
							<th className="lf-w-80 text-end pe-4">{action?.text}</th>
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
														backgroundColor: t?.color_code,
														padding: '6px 0px',
													}}>
													{taskCat?.charAt(0)}
													{taskCat?.charAt(1)}
												</span>
											</td>

											<td
												className="lf-w-100 text-secondary text-start align-middle"
												onClick={() => setSelectetdTask(t)}>
												<span>#{t.issue_no}</span>
											</td>
											<td
												className="lf-w-250 text-start align-middle pe-3"
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
												{t?.status_id}
											</td>
											<td
												className="lf-w-180 text-secondary text-nowrap text-start text-capitalize align-middle"
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
												className="lf-w-100 text-secondary text-nowrap text-start align-middle"
												onClick={() => setSelectetdTask(t)}>
												<span className="px-2">
													{t.end_date ? <CustomDate date={t.end_date} /> : ''}
												</span>
											</td>
											<td
												className="lf-w-100 text-secondary text-nowrap text-start align-middle"
												onClick={() => setSelectetdTask(t)}>
												<span className="px-2">
													{t.createdAt ? <CustomDate date={t.createdAt} /> : ''}
												</span>
											</td>

											<td className="lf-w-160 text-start align-middle">
												{t.task && t.task[0] ? (
													<Link
														title={t.task[0].title}
														to={`/tasks/${project_id}/${t?.task?.[0]?._id}`}>
														{`#${t?.task?.[0]?.task_no} - ${
															t.task[0].title.length > 16
																? t.task[0].title.substring(0, 16) + '...'
																: t.task[0].title
														}`}
													</Link>
												) : (
													''
												)}
											</td>
											<td className=" text-end text-nowrap lf-w-80 align-middle pe-4">
												<span
													className="p-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold"
													tooltip={icon_delete.tooltip}
													flow={icon_delete.tooltip_flow}
													onClick={() =>
														sweetAlert(
															() =>
																dispatch(
																	issueDelete(
																		{
																			project_id: project_id,
																			user_id: userId,
																			_id: [t?._id],
																		},
																		(resData) => {
																			props.getIssueData();
																		},
																	),
																),
															'issue',
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

export default IssuesListView;
