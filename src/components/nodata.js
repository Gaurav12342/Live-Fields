import PropTypes from 'prop-types';
import { getSiteLanguageData } from '../commons';
function Nodata(props) {
	const {
		and_explore_the_functionality,
		Please_add_a,
		currently_you_have_no_added,
	} = getSiteLanguageData('components/nodata');
	return (
		<>
			<section className="grey-bg container-fluid" style={{minHeight: 'calc(100vh - 175px)'}}>
				<div className="row">
					<div className="col-sm-12">
						<div className="text-center main-area">
							<img
								alt="livefield"
								src="/images/projects/nodata.png"
								className="image-max-full mb-4"
								style={{maxHeight: '200px'}}
							/>
							<h3 className="mt-2">
								Hey <strong>{props?.first_name}</strong>,{' '}
								{currently_you_have_no_added?.text} {props?.type}.
							</h3>
							<h5 className="text-muted my-2 mb-4">
								{Please_add_a?.text}
								{props?.type} {and_explore_the_functionality?.text}
							</h5>
							{props?.children}
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

Nodata.propTypes = {
	children: PropTypes.node,
	type: PropTypes.string,
};

export default Nodata;
