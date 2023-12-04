import { Alert, FormCheck } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../../commons';
import { deletePlan, sharePlans } from '../../../store/actions/projects';
import MoveDirectory from '../moveDirectory';
import Swal from 'sweetalert2';
import SheetDetailsInfo from '../sheetInfo';

const SinglePlanGrid = ({
	p,
	multiSelect,
	handleMultiSelect,
	handleFileMultiSelect,
	multiFileSelect,
	...props
}) => {
	const dispatch = useDispatch();
	const { project_id } = useParams();
	const userId = getUserId();
	const { sheet_share, sheet_delete, delete_text } =
		getSiteLanguageData('sheet/toolbar');
	return (
		<div className={`col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 mx-3 mx-md-0 mt-2`}>
			<div className="sheet-grid-box position-relative ">
				<a href={`/sheets/${project_id}/sheetInfo/${p._id}`}>
					<div className="row">
						<div className="col-12 position-relative text-center">
							<FormCheck
								type="checkbox"
								name="plan_id"
								onChange={({ target: { checked } }) => {
									let newArr = [...multiSelect];
									let newFileArray = [...multiFileSelect];
									if (checked === true) {
										newArr.push(p._id);
										newFileArray.push( p.original_file || p.file);
									} else {
										newFileArray = newFileArray.filter(
											(file) => (file !== p.file || file !== p.original_file),
										);
										newArr = newArr.filter((d) => d !== p._id);
									}
									handleMultiSelect(newArr);
									handleFileMultiSelect(newFileArray);
								}}
								checked={multiSelect.includes(p._id)}
								value={p._id}
								className={`position-absolute mx-2 my-1 ${
									multiSelect.length > 0 ? 'visible' : ''
								}`}
							/>
							<div
								className="lf-sheets-grid-sheetimg sheet-grid-bg"
								style={{
									background: `url(${
										p.thumbnail ? p.thumbnail : '/images/sheets/sheets_demo.png'
									})`,
									backgroundRepeat: 'no-repeat',

									// backgroundSize: "300px 100px"
								}}>
								{/* <img
									alt={p.name}
									src={p.thumbnail || '/images/sheets/sheets_demo.png'}
									className="image-full float-end lf-sheet-gridimg"
								/> */}
							</div>
							<div className="sheet-grid-box-footer pt-1 lf-h-50">
								<div
									title={p.sheet_no}
									className="text-dark fw-bold overflow-hidden text-nowrap text-truncate mt-1">
									{p.sheet_no}
									<div
										title={p.description}
										className="text-secondary fw-normal overflow-hidden text-nowrap text-truncate m-0">
										{p.description}
									</div>
								</div>
							</div>
						</div>
					</div>
				</a>
				<div className="sheet-grid-box-actions-plan pe-1">
					<MoveDirectory plan_id={p._id} />
					<br />
					<span
						href="/dashboard"
						tooltip={sheet_share.tooltip}
						flow={sheet_share.tooltip_flow}>
						<i
							className="fas fa-share-alt mt-1 lf-link-cursor"
							onClick={() => {
								props.hendleShowShereModel();
								let orFiles = p.original_file ? p.original_file : p?.file; 
								dispatch(
									sharePlans(
										{
											plans: [orFiles],
											project_id: project_id,
										},
										props.handleSharableLink,
									),
								);
							}}></i>
					</span>
					<br />
					<SheetDetailsInfo planData={p} type="grid" />
					<br />
					<span tooltip={sheet_delete.tooltip} flow={sheet_delete.tooltip_flow}>
						<i
							className="fas fa-trash-alt mt-1 lf-link-cursor"
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
									html: '<span>You are about to permanently delete 1 Sheet.</span>',
									type: 'input',
									input: 'checkbox',
									inputPlaceholder:
										'I understand this will permanently delete 1 sheet.',
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
							}></i>
					</span>
				</div>
			</div>
		</div>
	);
};
export default SinglePlanGrid;
