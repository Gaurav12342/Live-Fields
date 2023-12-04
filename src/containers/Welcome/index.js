// import { useState } from 'react';
import { getSiteLanguageData } from '../../commons';
import Layout from '../../components/layout';

function Welcome() {
	// const [mode] = useState('welcome')
	const {
		welcome_to,
		lvefield,
		livefield_gmail,
		we_are_suggesting_you_to,
		skip_do_it_later,
		verify_now,
	} = getSiteLanguageData('welcome');
	return (
		<Layout nosidebar={true}>
			<section className="grey-bg">
				<div className="container-fluid">
					<div className="row">
						<div className="col-sm-12 main-area">
							<div className="col-sm-8 offset-sm-2 text-center mb-4 mt-5">
								<svg
									className="verify-tick"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 52 52">
									<circle
										className="verify-tick__circle"
										cx="26"
										cy="26"
										r="25"
										fill="none"
									/>
									<path
										className="verify-tick__check"
										fill="none"
										d="M14.1 27.2l7.1 7.2 16.7-16.8"
									/>
								</svg>
								<div className="col-sm-12 mt-4">
									<h2>
										{welcome_to?.text} <strong>{lvefield?.text}</strong>
									</h2>
									<h5>{livefield_gmail?.text}</h5>
									<div className="col-sm-10 offset-sm-1 welcome-verify-box mt-4">
										<h6>{we_are_suggesting_you_to?.text}</h6>
										<button
											type="button"
											className="btn theme-btn mt-3 ps-5 pe-5">
											{verify_now?.text}
										</button>
										<br />
										<br />
										<a href="projects" className="theme-color theme-link-hover">
											{skip_do_it_later?.text}
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</Layout>
	);
}

export default Welcome;
