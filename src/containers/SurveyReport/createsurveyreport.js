import { useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import React from 'react';
import CustomSelect from '../../components/SelectBox';
import { getSiteLanguageData } from '../../commons';
function CreatSurveyReport() {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [Showcustom, setShowcustomtest] = useState(true);
	const [Showquetions, setShowquetions] = useState(true);
	const [counter, setCounter] = useState(0);
	const handleClick = () => {
		setCounter(counter + 1);
	};
	const handleremove = () => {
		setCounter(counter - 1);
	};

	const { survey_report,question } = getSiteLanguageData('reports/toolbar');
	const { name,start_date, end_date,frequency_name,assignee_name,location_name,next_btn } = getSiteLanguageData('commons');
	const {generate_report} = getSiteLanguageData("shareFile");

	return (
		<>
			<Button className="btn theme-btn" onClick={handleShow}>
				{survey_report.text}
			</Button>
			<Modal size={'md'} show={show} onHide={handleClose} animation={false}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{survey_report.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="row">
						<div className="col-sm-12 ">
							<Form.Label>{name.text}</Form.Label>
						</div>
						<div className="col-sm-12">
							<InputGroup>
								<FormControl
									placeholder={name.text}
									type="text"
									name="description"
									autoComplete="off"
									// onChange={(e) => handleChange('description', e.target.value)}
									// value={info.description}
								/>
							</InputGroup>
						</div>
						<div className="col-sm-12 mt-2">
							<div className="row">
								<div className="col-sm-6">
									{start_date?.text}
									<div className="col-12 p-0">
										<FormControl
											type="date"
											name={start_date?.text}
											autoComplete="off"
										/>
									</div>
								</div>
								<div className="col-sm-6">
								{end_date?.text}
									<div className="col-12 p-0">
										<FormControl
											type="date"
											name="End Date"
											autoComplete="off"
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="col-sm-12 mt-2">
							<Form.Label>{frequency_name.text}</Form.Label>
						</div>

						<div className="col-sm-12">
							<InputGroup>
								<CustomSelect name="type" required>
									<option>Daily</option>
									<option>First Day of Month</option>
									<option>Last Day of Month</option>
									<option>Every Month</option>
									<option onClick={() => setShowcustomtest(true)}>
										Custom Days
									</option>
								</CustomSelect>
							</InputGroup>
						</div>
						{Showcustom ? (
							<div className="col-sm-12 mt-2 ">
								<InputGroup>
									<FormControl
										placeholder="Enter your custom day"
										type="number"
										name="description"
										autoComplete="off"
										// onChange={(e) => handleChange('description', e.target.value)}
										// value={info.description}
									/>
								</InputGroup>
							</div>
						) : (
							''
						)}
						<div className="col-sm-12 mt-2">
							<CustomSelect
								placeholder={`${assignee_name.text}...`}
								name="assignee"
								// onChange={(e) => handleChangeInfo('assignee', e)}
								// options={projectUsers}
								// value={info.assignee}
							/>
						</div>
						<div className="col-sm-12 mt-2">
							<CustomSelect
								placeholder={`${location_name.text}...`}
								name="assignee"
								// onChange={(e) => handleChangeInfo('assignee', e)}
								// options={projectUsers}
								// value={info.assignee}
							/>
						</div>
					</div>
					<div className="col-sm-12 mt-2">
						<span className="float-end">
							<Button type="submit" className="btn theme-btn">
								{next_btn.text}
							</Button>
						</span>
					</div>
					<div className="row">
						<div className="col-sm-12 ">
							<Form.Label>{question.text}</Form.Label>
						</div>
						<div className="col-sm-8">
							<InputGroup>
								<FormControl
									placeholder={question.text}
									type="text"
									name="description"
									autoComplete="off"
									// onChange={(e) => handleChange('description', e.target.value)}
									// value={info.description}
								/>
							</InputGroup>
						</div>
						<div className="col-sm-4 ps-0">
							<span className="theme-color ">
								<i
									onClick={handleClick}
									className={
										setShowquetions ? 'fas fa-plus-circle d-block' : 'd-block'
									}></i>
							</span>
						</div>

						{/* <div className="col-sm-12 ">
              <Form.Label>Questions</Form.Label>
            </div> */}

						{Showquetions ? (
							<div className="col-12">
								{
									<>
										{Array.from(Array(counter)).map((c, index) => {
											return (
												<div className="row mt-2">
													<div className="col-sm-8 ">
														<InputGroup>
															<FormControl
																placeholder={question.text}
																type="text"
																name="description"
																autoComplete="off"
																// onChange={(e) => handleChange('description', e.target.value)}
																// value={info.description}
															/>
														</InputGroup>
													</div>

													<div className="col-sm-4 ps-0">
														<span className="theme-color ">
															<i
																onClick={handleClick}
																className="fas fa-plus-circle"></i>
														</span>

														<span className="theme-color ms-2">
															<i
																onClick={handleremove}
																className="fas fa-minus-circle"></i>
														</span>
													</div>
												</div>
											);
										})}
									</>
								}
							</div>
						) : (
							''
						)}
					</div>

					<div className="col-sm-12 mt-4 p-0">
						<Button
							type="submit"
							className="btn btn-primary theme-btn btn-block my-1 show-verify col-lg-12">
							{generate_report.text}
						</Button>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default CreatSurveyReport;
