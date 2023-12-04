import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { getSiteLanguageData } from '../commons';
import Layout from './layout';

function Terms(props) {
	const [show, handleShow] = useState(false);
	const { terms_N, privacy_policy, terms_and_conditions, close } =
		getSiteLanguageData('components/teemsmodal');
	return props?.type === 'component' ? (
		<>
			<span
				className="btn theme-link text-bold show-login lf-register-mterms-res"
				onClick={() => handleShow(!show)}>
				{terms_N?.text} <span className="text-dark"> & </span>
				{privacy_policy?.text}
			</span>
			<Modal
				size="xl"
				show={show}
				onHide={() => handleShow(!show)}
				backdrop="static"
				keyboard={false}>
				<Modal.Header closeButton>
					<h3 className="ms-3 theme-color">{terms_and_conditions?.text}</h3>
				</Modal.Header>
				<Modal.Body>
					<TermsContent />
				</Modal.Body>
				<Modal.Footer>
					<Button className="theme-btn" onClick={() => handleShow(!show)}>
						{close?.text}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	) : (
		<Layout>
			<div className="container pt-4">
				<TermsContent />
			</div>
		</Layout>
	);
}

export default Terms;

const TermsContent = () => {
	return (
		<div className="row">
			<div className="col-sm-12">
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
					eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
					minim veniam, quis nostrud exercitation ullamco laboris nisi ut
					aliquip ex ea commodo consequat. Duis aute irure dolor in
					reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
					pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
					culpa qui officia deserunt mollit anim id est laborum.
				</p>
				<h6>
					<strong>
						Section 1.10.32 of "de Finibus Bonorum et Malorum", written by
						Cicero in 45 BC
					</strong>
				</h6>
				<p>
					Sed ut perspiciatis unde omnis iste natus error sit voluptatem
					accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
					ab illo inventore veritatis et quasi architecto beatae vitae dicta
					sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
					aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
					qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
					dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed
					quia non numquam eius modi tempora incidunt ut labore et dolore magnam
					aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
					exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex
					ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in
					ea voluptate velit esse quam nihil molestiae consequatur, vel illum
					qui dolorem eum fugiat quo voluptas nulla pariatur?
				</p>
				<h6>
					<strong>
						Section 1.10.32 of "de Finibus Bonorum et Malorum", written by
						Cicero in 45 BC
					</strong>
				</h6>
				<p>
					Sed ut perspiciatis unde omnis iste natus error sit voluptatem
					accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
					ab illo inventore veritatis et quasi architecto beatae vitae dicta
					sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
					aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
					qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
					dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed
					quia non numquam eius modi tempora incidunt ut labore et dolore magnam
					aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
					exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex
					ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in
					ea voluptate velit esse quam nihil molestiae consequatur, vel illum
					qui dolorem eum fugiat quo voluptas nulla pariatur? Sed ut
					perspiciatis unde omnis iste natus error sit voluptatem accusantium
					doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
					inventore veritatis et quasi architecto beatae vitae dicta sunt
					explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
					odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
					voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum
					quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam
					eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
					voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem
					ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
					consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate
					velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum
					fugiat quo voluptas nulla pariatur?
				</p>
			</div>
		</div>
	);
};
