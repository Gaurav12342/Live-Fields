import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import { connect } from 'react-redux';
import {
	LIGHTBOX_DEFAULT_URL,
	LIGHTBOX_IMAGES,
	LIGHTBOX_VIEW_STATUS,
} from '../store/actions/actionType';
import {
	setLightBoxImageData,
	setLightBoxImageDefaultUrl,
	toggleLightBoxView,
} from '../store/actions/imageLightBox';

// const images = [
//   '//placekitten.com/1500/500',
//   '//placekitten.com/4000/3000',
//   '//placekitten.com/800/1200',
//   '//placekitten.com/1500/1500',
// ];

class ImageLightBox extends Component {
	constructor(props) {
		super(props);

		this.state = {
			photoIndex: 0,
			isOpen: false,
		};
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.url !== this.props.url) {
			const { images, url } = this.props;
			if (url?.url) {
				const index = images.findIndex((u) => u?.url === url?.url);
				if (index > 0) {
					this.setState({
						photoIndex: index,
					});
				}
			} else {
				const index = images.findIndex((u) => u === url);
				if (index > 0) {
					this.setState({
						photoIndex: index,
					});
				}
			}
		}
	}

	handleCloseView = () => {
		this.setState({ photoIndex: 0 });
		this.props.dispatch(toggleLightBoxView(false));
		this.props.dispatch(setLightBoxImageData([]));
		this.props.dispatch(setLightBoxImageDefaultUrl(''));
	};

	render() {
		const { photoIndex } = this.state;
		const { isOpen, images } = this.props;
		const lightBoxAttr = {
			mainSrc: images[photoIndex],
			nextSrc: images[(photoIndex + 1) % images.length],
			prevSrc: images[(photoIndex + images.length - 1) % images.length],
		};
		if (images?.[0]?.url) {
			lightBoxAttr.mainSrc = images[photoIndex]?.url;
			lightBoxAttr.nextSrc = images[(photoIndex + 1) % images.length]?.url;
			lightBoxAttr.prevSrc = images[(photoIndex + images.length - 1) % images.length]?.url;
			lightBoxAttr.imageTitle = images[(photoIndex + images.length) % images.length]?.imageTitle;
			lightBoxAttr.imageCaption = images[(photoIndex + images.length) % images.length]?.imageCaption;
			lightBoxAttr.uploadAt = images[(photoIndex + images.length) % images.length]?.uploadAt;
			lightBoxAttr.uploadBy = images[(photoIndex + images.length) % images.length]?.uploadBy;
			console.log(lightBoxAttr.imageCaption, "lightBoxAttr.imageCaption")
		}

		return (
			<>
				{isOpen && images.length > 0 ? (
					<Lightbox
						mainSrc={lightBoxAttr.mainSrc}
						nextSrc={lightBoxAttr.nextSrc}
						prevSrc={lightBoxAttr.prevSrc}
						imageTitle={lightBoxAttr.imageTitle}
						imageCaption={lightBoxAttr.imageCaption}
						uploadAt={lightBoxAttr.uploadAt}
						uploadBy={lightBoxAttr.uploadBy}
						onCloseRequest={() => this.handleCloseView()}
						onMovePrevRequest={() =>
							this.setState({
								photoIndex: (photoIndex + images.length - 1) % images.length,
							})
						}
						onMoveNextRequest={() =>
							this.setState({
								photoIndex: (photoIndex + 1) % images.length,
							})
						}
						reactModalStyle={{
							zIndex: '1056',
						}}
					/>
				) : (
					''
				)}
			</>
		);
	}
}

export default connect((state) => {
	return {
		images: state?.image_lightbox?.[LIGHTBOX_IMAGES],
		isOpen: state?.image_lightbox?.[LIGHTBOX_VIEW_STATUS],
		url: state?.image_lightbox?.[LIGHTBOX_DEFAULT_URL],
	};
})(ImageLightBox);
