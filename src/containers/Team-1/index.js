import { useCallback, useState } from 'react';
import { InputGroup, Modal, FormControl, Form, Button } from 'react-bootstrap';
import Layout from '../../components/layout';
import Nodata from '../../components/nodata';

// import '../../App.css';
import { Link } from 'react-router-dom';
import { getSiteLanguageData } from '../../commons';

function Team() {
	const [useAccount, handleUseAccount] = useState(false);
	const [useProject, handleUseProject] = useState(false);

	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [role] = useState([
		{
			name: 'Total People',
			id: 0,
		},
		{
			name: 'Account Owner',
			id: 1,
		},
		{
			name: 'Account Manager ',
			id: 2,
		},
		{
			name: 'Account User',
			id: 3,
		},
		{
			name: 'Guest User',
			id: 4,
		},
		{
			name: 'Pending',
			id: 5,
		},
	]);

	const [data, setData] = useState([
		{
			role: 1,
			name: 'Akshay Sheth',
			email: 'akshaysheth@mail.com',
			mobile: '+91 98998-25644',
			title: 'Livefield',
		},
		{
			role: 2,
			name: 'Sagar Kothiya	',
			email: 'akshaysheth@mail.com',
			mobile: '+91 98998-25644',
			title: 'Livefield',
		},
		{
			role: 2,
			name: 'Sagar Kothiya	',
			email: 'akshaysheth@mail.com',
			mobile: '+91 98998-25644',
			title: 'Livefield',
		},
		{
			role: 3,
			name: 'Akshay Sheth',
			email: 'akshaysheth@mail.com',
			mobile: '+91 98998-25644',
			title: 'Livefield',
		},
		{
			role: 4,
			name: 'Akshay Sheth',
			email: 'akshaysheth@mail.com',
			mobile: '+91 98998-25644',
			title: 'Livefield',
		},
		{
			role: 4,
			name: 'Akshay Sheth',
			email: 'akshaysheth@mail.com',
			mobile: '+91 98998-25644',
			title: 'Livefield',
		},
		{
			role: 5,
			name: 'Akshay Sheth',
			email: 'akshaysheth@mail.com',
			mobile: '+91 98998-25644',
			title: 'Livefield',
		},
	]);
	const handleChange = useCallback(
		(e) => {
			const name = e.target.name;
			const value = e.target.value;
			setData({
				...data,
				[name]: value,
			});
		},
		[data],
	);

	const {
		team
	} = getSiteLanguageData('projects');

	const {
		save
	} = getSiteLanguageData('commons');

	const {
		role_management,dashboard,invite_people
	} = getSiteLanguageData('team/rolelist');

	const {
		export_list
	} = getSiteLanguageData('team/createrole');

	const {
		to_the_account,to_project,insert_email_mobile
	} = getSiteLanguageData('team/index');

	return (
		<Layout nosidebar={true}>
			{data?.length === 0 ? (
				<Nodata type={team.tooltip} />
			) : (
				<div id="page-content-wrapper">
					<section className="lf-dashboard-toolbar">
						<div className="container">
							<div className="row">
								<div className="col-sm-6">
									<div className="col-sm-12">
										<h3>{team.tooltip}</h3>
									</div>
								</div>
								<div className="col-sm-6">
									<div className="col-sm-12">
										<nav aria-label="breadcrumb text-end">
											<ol className="breadcrumb">
												<li className="breadcrumb-item">
													<a href="/dashboard">{dashboard.text}</a>
												</li>
												<li
													className="breadcrumb-item active"
													aria-current="page">
													{team.tooltip}
												</li>
											</ol>
										</nav>
									</div>
								</div>
							</div>
						</div>
					</section>
					<div className="container">
						<div className="col-sm-12 pt-4">
							<div className="row">
								<div className="col-sm-5">
									<div className="row">
										<div className="col-sm-7">
											<input
												type="text"
												className="form-control search-box"
												name=""
												placeholder="Search Project.."
											/>
										</div>
										<div className="col-sm-5">
											<select className="form-control search-box">
												<option value={undefined}>Sort : Default</option>
												<option value={1}>Name : A Z</option>
												<option value={2}>Name : Z A</option>
												<option value={3}>Date : New Old</option>
												<option value={4}>Date : Old New</option>
											</select>
										</div>
									</div>
								</div>
								<div className="col-sm-7 text-end">
									<a
										href="/dashboard"
										className="me-4 theme-color theme-link-hover">
										{export_list.text}
									</a>
									{/* <a href="/dashboard" className="btn theme-btn" data-toggle="modal" data-target="#add-project">+ invite people</a> */}
									<Link
										className="btn theme-btn"
										data-target="#add-project"
										onClick={handleShow}>
										{invite_people.text}
									</Link>
								</div>
							</div>
						</div>
					</div>
					<div className="container ">
						<div className="row mx-7">
							<div className="col-sm-12   main-area">
								{role?.map((r) => {
									return (
										<div className="col-sm-10" key={r.id}>
											<h6 className="mb-3 ms-5 ">
												<strong>
													{r?.name} (
													{data?.filter((u) => u.role === r.id).length})
												</strong>
												<span>
													<i className="fas fa-caret-right ms-2 "></i>
												</span>
											</h6>
											<table className="table table-hover mx-5 white-table">
												<tbody>
													{data
														?.filter((u) => u.role === r.id)
														.map((u) => {
															return (
																<tr
																	className="my-5"
																	key={u.name + r.id + Math.random()}>
																	<td>
																		<span className="ps-5"></span>
																		<img
																			alt="livefield"
																			src={
																				u.profile ||
																				'/images/users/profile_user.png'
																			}
																			className="image-sm"
																		/>
																	</td>
																	{/* <td><img alt="livefield" src="/images/wallet2.svg" width="20px" /></td> */}
																	<td className="col-2">{u.name}</td>
																	<td className="col-4">{u.email}</td>
																	<td className="col-3">{u.mobile}</td>
																	<td>
																		<Link to="#">{u.title}</Link>
																	</td>
																	{/* <td>{new Date(u.createdAt).toLocaleDateString()}</td> */}
																	<td>{u.createdAt}</td>
																	{/* <td><a href="/dashboard" className="btn-blue"><img alt="livefield"  src="/images/edit-white.svg" width="15px" /></a>
                        <a href="/dashboard" className="btn-red"><img alt="livefield"  src="/images/delete-white.svg" width="15px" /></a></td> */}
																	{/* <td>{u.totalAmount}</td> */}
																	<td>
																		<select
																			aria-label="Default select example"
																			className=" col-sm-12 form-control">
																			<option>Select Role</option>
																			<option value="1">Account Owner</option>
																			<option value="2">Account Manager</option>
																			<option value="3">Account User</option>
																			<option value="4">Guest User</option>
																		</select>
																	</td>
																</tr>
															);
														})}
												</tbody>
											</table>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			)}
			{/* edit data modal */}
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{invite_people.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="row  mb-2">
						{/* <Form.Check inline type="radio" value="To The Account" name="radios" label="To The Account" variant="#f97316" /> */}
						{/* <Form.Check inline type="radio" value="To a Project" name="radios" label="To a Project" /> */}
						<label className="radio-orange">
							{to_the_account.text}
							<input type="radio" name="radio2" />
							<span
								className="radiokmark mt-2"
								onClick={() => handleUseAccount(!useAccount)}></span>
						</label>
						<label className="radio-orange ms-2">
							{to_project.text}
							<input type="radio" name="radio2" />
							<span className="radiokmark mt-2"></span>
						</label>
					</div>
					{!useAccount ? (
						<Form>
							<div className="form-group">
								<Form.Label htmlFor="Email">{insert_email_mobile.text}</Form.Label>
								<InputGroup className="mb-3">
									<FormControl
										placeholder=""
										aria-label="Email"
										autoComplete="off"
										//
										type="text"
										name="username"
										id="exampleInputEmail1"
										aria-describedby="emailHelp"
										onChange={(e) => handleChange(e)}
										value={data.username}
									/>
								</InputGroup>
								<small id="emailHelp" className="form-text text-muted">
									Type Email / Mobile number and press enter to add another.
								</small>
							</div>
							<hr />
							<span>
								<Link href="#" className="me-3">
									X
								</Link>
							</span>
							<span>myemailaddress@mail.com</span>
							<select className="float-end form-control col-md-5">
								<option>Account Manager</option>
								<option>Account User</option>
								<option>other</option>
							</select>
							<hr />
							<span>
								<Link href="#" className="me-3">
									X
								</Link>
							</span>
							<span>myemailaddress@mail.com</span>
							<select className="float-end form-control col-md-5 ">
								<option>Account Manager</option>
								<option>Account User</option>
								<option>other</option>
							</select>
							<hr />

							<Button type="submit" className="btn  theme-btn  btn-block ">
							<i class="fa-solid fa-floppy-disk pe-2"></i>
								Save{' '}
							</Button>
						</Form>
					) : (
						<Form>
							<Form.Label>Select project(s)</Form.Label>
							<select
								aria-label="Default select example"
								className="col-sm-12 form-control">
								<option>Select project</option>
								<option value="1">One</option>
								<option value="2">Two</option>
								<option value="3">Three</option>
							</select>

							<hr />
							<div className="form-group">
								<Form.Label htmlFor="Title">{insert_email_mobile.text}</Form.Label>
								<InputGroup className="mb-3">
									<FormControl
										placeholder="Title"
										autoComplete="off"
										//
										type="text"
										name="username"
										// id="exampleInputEmail1"
										// aria-describedby="emailHelp"
										onChange={(e) => handleChange(e)}
										value={data.username}
									/>
								</InputGroup>
								<small id="emailHelp" className="form-text text-muted">
									Type Email / Mobile number and press enter to add another.
								</small>
							</div>
							<hr />
							<span>
								<Link href="#" className="me-3">
									X
								</Link>
							</span>
							<span>myemailaddress@mail.com</span>
							<select className="float-end form-control col-md-5">
								<option>Account Manager</option>
								<option>Account User</option>
								<option>other</option>
							</select>
							<hr />
							<span>
								<Link href="#" className="me-3">
									X
								</Link>
							</span>
							<span>myemailaddress@mail.com</span>
							<select className="float-end form-control col-md-5">
								<option>Account Manager</option>
								<option>Account User</option>
								<option>other</option>
							</select>
							<hr />
							<Button type="submit" className="btn  theme-btn  btn-block ">
							<i class="fa-solid fa-floppy-disk pe-2"></i>
								{save.text}
							</Button>
						</Form>
					)}
				</Modal.Body>
				<Modal.Footer></Modal.Footer>
			</Modal>
		</Layout>
	);
}
export default Team;
