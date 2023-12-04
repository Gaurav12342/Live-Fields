import Layout from '../../components/layout';
import { FormControl, Form, Button } from 'react-bootstrap';

function MyProfile() {
	return (
		<Layout>
			<div id="page-content-wrapper">
				<div className="container">
					<div className="row">
						<div className="col-sm-12 main-area">
							<div className="row">
								<div className="col-sm-3">
									<div className="col-sm-12 white-box text-center">
										<img
											alt="livefield"
											src="/images/users/profile_user.png"
											className="profile-page-photo"
										/>
										<div className="col-sm-12">
											<a href="/dashboard" className="small-line-btn">
												<img alt="livefield" src="/images/edit.svg" />
											</a>
											<a href="/dashboard" className="small-line-btn">
												<img alt="livefield" src="/images/delete.svg" />
											</a>
										</div>
									</div>
								</div>
								<div className="col-sm-9">
									<div className="col-sm-12 white-box">
										<label className="white-box-label">Personal Details</label>
										<form className="row">
											<div className="form-group col-sm-4">
												<label>First Name</label>
												<input
													type="text"
													className="form-control"
													value="Dhaval"
												/>
											</div>
											<div className="form-group col-sm-4">
												<label>Last Name</label>
												<input
													type="text"
													className="form-control"
													value="Khatri"
												/>
											</div>
											<div className="form-group col-sm-4">
												<label>Job Title</label>
												<input type="text" className="form-control" value="" />
											</div>
											<div className="form-group col-sm-4">
												<label>Email</label>
												<input
													type="email"
													className="form-control"
													value="dhavalkhatri@mail.com"
												/>
											</div>
											<div className="form-group col-sm-4">
												<label>Mobile No</label>
												<input
													type="text"
													className="form-control"
													value="+91 97900-12345"
												/>
											</div>
											<div className="form-group col-sm-4">
												<label>Company</label>
												<input
													type="text"
													className="form-control"
													value="Redsun Infotech"
												/>
											</div>
										</form>
									</div>
									<div className="col-sm-12 white-box">
										<h4 className="mb-4">Settings</h4>
										<h6 className="theme-color">Email Notification Settings</h6>
										<div className="custom-control custom-switch">
											<FormControl
												type="checkbox"
												className="custom-control-input"
												id="customSwitches"
											/>
											<Form.Label
												className="custom-control-label"
												htmlFor="customSwitches">
												When a New sheet is uploaded.
											</Form.Label>
										</div>

										<div className="custom-control custom-switch">
											<FormControl
												type="checkbox"
												className="custom-control-input"
												id="customSwitchesChecked"
											/>
											<Form.Label
												className="custom-control-label"
												htmlFor="customSwitchesChecked">
												hen a new project is created or deleted.
											</Form.Label>
										</div>
										<div className="custom-control custom-switch">
											<FormControl
												type="checkbox"
												className="custom-control-input"
												id="toggleSwitch"
											/>
											<Form.Label
												className="custom-control-label"
												htmlFor="toggleSwitch">
												When New task is assigned.
											</Form.Label>
										</div>

										<h6 className="theme-color mt-3">
											SMS Notification Settings
										</h6>

										<div className="custom-control custom-switch">
											<FormControl
												type="checkbox"
												className="custom-control-input"
												id="newsheetupload"
											/>
											<Form.Label
												className="custom-control-label"
												htmlFor="newsheetupload">
												When a New sheet is uploaded.
											</Form.Label>
										</div>

										<div className="custom-control custom-switch">
											<FormControl
												type="checkbox"
												className="custom-control-input"
												id="projectCreateDelete"
											/>
											<Form.Label
												className="custom-control-label"
												htmlFor="projectCreateDelete">
												When a new project is created or deleted.
											</Form.Label>
										</div>
										<div className="custom-control custom-switch">
											<FormControl
												type="checkbox"
												className="custom-control-input"
												id="taskAssign"
											/>
											<Form.Label
												className="custom-control-label"
												htmlFor="taskAssign">
												When New task is assigned.
											</Form.Label>
										</div>
									</div>
									<div className="col-sm-12 text-end">
										<Button type="submit" className="theme-btn btn btn-primary">
										<i class="fa-solid fa-floppy-disk pe-2"></i>
											Save
										</Button>
									</div>
									{/* <div className="col-sm-12 white-box">
                  <h4 className="mb-4">Change Password</h4>
                  <form className="row">
                    <div className="form-group col-sm-4">
                      <label>Old Password</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-sm-4">
                      <label>New Password</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-sm-4">
                      <label>Confirm Passowrd</label>
                      <input type="text" className="form-control" />
                    </div>
                  </form>
                </div>
                <div className="col-sm-12 text-end">
                  <button type="submit" className="btn theme-btn">Save Changes</button>
                </div> */}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}

export default MyProfile;
