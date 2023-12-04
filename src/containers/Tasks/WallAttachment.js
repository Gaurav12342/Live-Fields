import React from 'react';
import { useParams } from 'react-router';

import getUserId, { getSiteLanguageData } from '../../commons';
import Upload from '../../components/upload';

function WallAttachment(props) {
	const userId = getUserId();
	const { file:attachmentFile} =
		getSiteLanguageData('equiqment');

	return (		
		<>
            <Upload
				{...props}
				fileType="PO_photo"
				fileKey={props.task_id}
				onFinish={(file) => {
					console.log(file, "file file file")
					props.setGeneralImage(file);
				}}>
				<span className="theme-color lf-link-cursor ms-1">
					<i className="fas fa-plus" /> {attachmentFile.text}
				</span>
			</Upload>
        </>		
	);
}
export default WallAttachment;
