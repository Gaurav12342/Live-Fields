import Layout from '../../components/layout';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
	archiveUnarchiveProject,
	deleteProject,
	leaveProject,
} from '../../store/actions/projects';
import getUserId, { getSiteLanguageData } from '../../commons';
const userId = getUserId();

function ProjectsNodata(props) {
	const [setShow] = useState(false);
	// const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [selectedProject, handleSelectedProject] = useState(false);
	const dispatch = useDispatch();

	const {
		hey,
		akshay,
		currently_you_have_no_added,
		Please_add_a_project_and_explore_the_functionality,
		new_project,
		project_setting,
		project_name,
		project_code,
		add_to_archive,
		leave_project,
	} = getSiteLanguageData('projectsnodata/index');

	const { delete_project } = getSiteLanguageData('projects');
	return (
		<Layout nosidebar={true}>
			<section className="grey-bg">
				<div className="container-fluid">
					<div className="row">
						<div className="col-sm-12 main-area">
							<div className="col-md-6 offset-sm-3 text-center">
								<img
									alt="livefield"
									src="/images/projects/nodata.png"
									className="image-max-full mb-4"
								/>
								<h3>
									{hey?.text} <strong>{akshay?.text}</strong>,{' '}
									{currently_you_have_no_added?.text}
									{props?.type}.
								</h3>
								<h5 className="text-muted">
									{Please_add_a_project_and_explore_the_functionality?.text}
								</h5>
								<Link
									className="btn theme-btn"
									data-target="#add-project"
									onClick={handleShow}>
									{new_project?.text}
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* project setting */}
			<Modal
				show={selectedProject?.name !== undefined}
				onHide={() => handleSelectedProject({})}
				animation={false}>
				{/* <Modal show={show} onHide={handleClose} animation={false}> */}

				<Modal.Header closeButton>
					<Modal.Title>{project_setting?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="row">
						<div className="col-sm-4 text-center">
							<img
								alt="livefield"
								src="/images/projects/no-image.jpg"
								className="image-full"
							/>
							<a
								href="/dashboard"
								className="small-line-btn project-photo-upload-btn mt-1">
								<img alt="livefield" src="/images/camera.svg" />
							</a>
						</div>
						<div className="col-sm-8">
							<div className="form-group">
								<label htmlFor="projectname">{project_name?.text}</label>
								<input
									type="text"
									className="form-control"
									id="projectname"
									defaultValue={selectedProject?.name}
									readOnly
								/>
							</div>
							<div className="form-group">
								<label htmlFor="projectcode">{project_code?.text}</label>
								<input
									type="text"
									className="form-control"
									id="projectcode"
									defaultValue={selectedProject?.code}
									readOnly
								/>
							</div>
						</div>
						<div className="col-sm-12 mt-2">
							<hr />
							<div className="row">
								<div className="col-sm-4">
									<button
										onClick={() =>
											dispatch(
												archiveUnarchiveProject({
													user_id: userId,
													project_id: selectedProject?._id,
													is_archive: true,
												}),
											)
										}
										className="btn btn-block theme-btn">
										<i className="fa-solid fa fa-archive px-2" />
										{add_to_archive?.text}
									</button>
								</div>
								<div className="col-sm-4">
									<button
										onClick={() =>
											dispatch(
												leaveProject({
													user_id: userId,
													project_id: selectedProject?._id,
												}),
											)
										}
										className="btn btn-block btn-secondary">
										<i className="fa-solid fa-user-minus px-2" />
										{leave_project?.text}
									</button>
								</div>
								<div className="col-sm-4">
									<button
										onClick={() =>
											dispatch(
												deleteProject({
													user_id: userId,
													project_id: selectedProject?._id,
												}),
											)
										}
										className="btn btn-block btn-danger">
										<i className="fas fa-trash-alt px-2" />
										{delete_project.text}
									</button>
								</div>
							</div>
						</div>
					</div>
				</Modal.Body>
			</Modal>

			{/* <Modal show={show} onHide={handleClose} animation={false}>
<Modal.Header closeButton>
<Modal.Title>Add New Project</Modal.Title>
</Modal.Header>
<Form>
      <div className="row p-3">
        <div className="col-sm-4 text-center">
          <img alt="livefield"  src="/images/projects/no-image.jpg" className="image-full" />
          <a href="/dashboard" className="small-line-btn project-photo-upload-btn mt-1"><img alt="livefield"  src="/images/camera.svg" /></a>
        </div>
        <div className="col-sm-8">
          <div className="form-group">
            <Form.Label htmlFor="projectname">Project Name</Form.Label>
            <InputGroup className="mb-3">
                      <FormControl
                        placeholder="Title"
                        aria-label="Recipient's Title"
                        //
                        type="text"
                        name="ProjectName"
                        // id="exampleInputEmail1"
                        // aria-describedby="emailHelp"
                        onChange={e => handleChange(e)} value={data.ProjectName}
                      />
              </InputGroup>
          </div>
          <div className="form-group">
            <Form.Label htmlFor="projectcode">Project Code</Form.Label>
            <InputGroup className="mb-3">
                      <FormControl
                        placeholder="Project Code"
                        aria-label="Recipient's Project Code"
                        //
                        type="text"
                        name="ProjectCode"
                        // id="exampleInputEmail1"
                        // aria-describedby="emailHelp"
                        onChange={e => handleChange(e)} value={data.ProjectCode}
                      />
             </InputGroup>
          </div>
        </div>
        <hr/>
        <div className="col-sm-12 mt-2">
         <hr />
            <Button type="submit" className="btn  theme-btn btn-block" >+ Create Project</Button>
          </div>
        </div>
        </Form>
  
</Modal> */}
		</Layout>
	);
}

export default ProjectsNodata;
