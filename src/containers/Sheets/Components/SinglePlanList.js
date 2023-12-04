import { FormCheck } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../../commons';
import { deletePlan, sharePlans } from '../../../store/actions/projects';
import Swal from 'sweetalert2';
import MoveDirectory from '../moveDirectory';
import SheetDetailsInfo from '../sheetInfo';

const SinglePlanList = ({
	p,
	allTags,
	multiSelect,
	handleMultiSelect,
	handleFileMultiSelect,
	multiFileSelect,
	hideRow,
	handleSharableLink,
	hendleShowShereModel,
	...props
}) => {
	const dispatch = useDispatch();
	const { project_id } = useParams();
	const userId = getUserId();

	const { icon_share, icon_delete, delete_text } =
		getSiteLanguageData('sheet/toolbar');
	return (
		<tr
			className={`theme-table-data-row lf-task-color bg-white lf-text-vertical-align ${
				hideRow ? 'd-none' : ' '
			}`}>
			<td className="text-center lf-w-40 ">
				<FormCheck
					type="checkbox"
					className={`align-middle ${multiSelect.length > 0 ? 'visible' : ''}`}
					name="plan_id"
					onChange={({ target: { checked } }) => {
						let newArr = [...multiSelect];
						let newFileArray = Array.isArray(multiFileSelect)
							? [...multiFileSelect]
							: [];

						if (checked === true) {
							newArr.push(p._id);
							newFileArray.push(p.original_file || p.file);
						} else {
							newFileArray = newFileArray.filter((file) => (file !== p.file || file !== p.original_file));
							newArr = newArr.filter((d) => d !== p._id);
						}
						handleFileMultiSelect(newFileArray);
						handleMultiSelect(newArr);
					}}
					checked={multiSelect.includes(p._id)}
					value={p._id}
				/>
			</td>
			<td
				title={p.sheet_no}
				className="text-start lf-w-335"
				onClick={() => {
					window.location.href = `/sheets/${project_id}/sheetInfo/${p._id}`;
				}}>
				<span className="lf-text-overflow-335 align-middle">
					{p.sheet_no}
					{`${p.description ? ' - ' + p.description : ''}`}
				</span>
			</td>
			<td
				className="text-secondary text-start text-nowrap lf-w-200 align-middle"
				onClick={() => {
					window.location.href = `/sheets/${project_id}/sheetInfo/${p._id}`;
				}}>
				<span className="lf-text-overflow-110 align-middle">
					{p.revision_no}
				</span>
			</td>
			<td
				className="text-secondary text-center lf-w-100 align-middle"
				onClick={() => {
					window.location.href = `/sheets/${project_id}/sheetInfo/${p._id}`;
				}}>
				{p?.related_task?.length}
			</td>
			<td
				className="text-secondary text-center lf-w-100 align-middle"
				onClick={() => {
					window.location.href = `/sheets/${project_id}/sheetInfo/${p._id}`;
				}}>
				{p?.related_files?.length}
			</td>
			<td
				className="text-secondary text-start align-middle"
				title={p?.tags
					?.map((t) => {
						const tag = allTags?.filter((tt) => tt._id === t)[0];
						return tag?.name;
					})
					.join(', ')}
				onClick={() => {
					window.location.href = `/sheets/${project_id}/sheetInfo/${p._id}`;
				}}>
				<span className="lf-text-overflow-200 align-middle">
					{p?.tags
						?.map((t) => {
							const tag = allTags?.filter((tt) => tt._id === t)[0];
							return tag?.name;
						})
						.join(', ')}
				</span>
			</td>
			<td className="text-center text-nowrap" style={{ width: '150px' }}>
				<span className="p-2 lf-link-cursor rounded theme-btnbg text-secondary align-middle">
					<MoveDirectory plan_id={p._id} view="list" />
				</span>
				<span
					className="p-2 lf-link-cursor rounded theme-btnbg text-secondary align-middle"
					tooltip={icon_share.tooltip}
					flow={icon_share.tooltip_flow}
					onClick={() => {
						let orFiles = p.original_file ? p.original_file : p?.file;
						hendleShowShereModel();
						dispatch(
							sharePlans(
								{
									plans: [orFiles],
									project_id: project_id,
								},
								handleSharableLink,
							),
						);
					}}>
					<i className="fas fa-share-alt align-middle"></i>
				</span>
				<SheetDetailsInfo planData={p} type="list" view="list" />
				<span
					className="p-2 lf-link-cursor rounded theme-btnbg text-secondary align-middle"
					tooltip={icon_delete.tooltip}
					flow={icon_delete.tooltip_flow}
					onClick={() =>
						Swal.fire({
							title: 'Permanently delete this sheet?',
							icon: 'question',
							showCancelButton: true,
							confirmButtonColor: '#dc3545',
							cancelButtonColor: '#28a745',
							reverseButtons: true,
							width: '500px',
							confirmButtonText: `Yes, Delete it!`,
							html:
								'<ul style="list-style-type:disc">' +
								'<li >You are about to permanently delete 0 files(s) and 1 folder(s).</li>' +
								'<li>This will affect all users on the project and there is no way to undo this.</li>' +
								'</ul>',
							type: 'input',
							input: 'checkbox',
							inputPlaceholder:
								'I understand this will permanently delete 1 document(s).',
							borderRadius: '4px',
							inputValidator: (result) => {
								return !result && delete_text?.text;
							},
						}).then((result) => {
							if (result.isConfirmed) {
								if (result.value) {
									dispatch(
										deletePlan({
											user_id: userId,
											project_id: project_id,
											plan_id: [p._id],
										}),
									);
								}
							}
						})
					}>
					{' '}
					<i className="fas fa-trash-alt"></i>
				</span>
			</td>
		</tr>
	);
};

export default SinglePlanList;
