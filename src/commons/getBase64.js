export function getBase64(file, cb, removeDataType = false) {
	let reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function () {
		if (removeDataType === true) {
			cb(reader.result.split(',')[1]);
		} else {
			cb(reader.result);
		}
	};
	reader.onerror = function (error) {
		console.log('Error: ', error);
	};
}

export function getWebPImage(file, cb) {
	let reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function () {
		const img = new Image();
		img.src = reader.result;

		img.onload = function () {
			const canvas = document.createElement('canvas');
			let width = img.width;
			let height = img.height;

			// If the image size exceeds the default maximum size in pixels, resize it while maintaining aspect ratio
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0);

			// Convert the canvas image to WebP format
			const webpOptions = { quality: 0.8 }; // Adjust quality as needed
			const webpDataURL = canvas.toDataURL('image/webp', webpOptions);

			const fileName = file.name;

			const webpFileName = `${fileName.replace(/\.[^/.]+$/, '')}.webp`;

			const response = {
				webpDataURL,
				webpFileName,
			};

			cb(response);
		};
	};
	reader.onerror = function (error) {
		console.log('Error: ', error);
	};
}
  