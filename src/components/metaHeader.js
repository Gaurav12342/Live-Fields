import { Helmet } from 'react-helmet';

const MetaHead = (props) => {
	const { title } = getSiteLanguageData('components/metahead');
	return (
		<Helmet>
			<meta charSet="utf-8" />
			<title>{title.text}</title>
			<link rel="canonical" href="http://mysite.com/example" />
		</Helmet>
	);
};

export default MetaHead;
