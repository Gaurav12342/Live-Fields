import { getSiteLanguageData } from '../../commons';
import Layout from '../../components/layout';
import { useNavigate } from 'react-router-dom';
const NotFound = () => {
	let navigate = useNavigate();
	const { notFoundText, sorryText, goBackMessage,goBackText } = getSiteLanguageData('notFound');
	return (
		<Layout>
			<div id="page-content-wrapper">
				<div className="container-fluid mt-4">
					<div className="row align-items-center justify-content-center">
						<div className="col-lg-5 col-md-6">
							<div className="error-page-content-wrap">
								<h2 className="error-404 text-danger">{notFoundText.text}</h2>
								<h1 className="display-5 fw-bold">{sorryText.text}</h1>
								<p className="lead mt-2">
									{goBackMessage.text}
								</p>
								{/*           <p className="lead mt-2">
                                    Uh Oh, We can't seem to find the data you're looking for. Try going back to the previous page. or see our<a className="theme-color" href="https://livefield.app/guide"> Help Center</a> for more information. 
                                </p> */}
								<div className="text-center">
									<button
										type="button"
										className="lf-main-button mt-4"
										onClick={() => navigate(-1)}>
										<i className="fa-solid fa-arrow-left px-2"></i>{goBackText.text}
									</button>
								</div>
							</div>
						</div>
						<div className="col-lg-6 col-md-8 d-none d-md-block d-lg-block">
							<div className="hero-img position-relative circle-shape-images">
								<img
									src="https://livefield.app/404.png"
									alt="Page not found"
									className="img-fluid position-relative z-5"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default NotFound;
