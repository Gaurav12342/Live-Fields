import React from 'react';
import { useParams } from 'react-router';

import getUserId, { getSiteLanguageData } from '../../commons';
import Upload from '../../components/upload';

function GeneralAttachment(props) {
	const userId = getUserId();
	const { project_id, store_room_id, store_room_log_date } = useParams();
	
	const { file:fileAttechment } = getSiteLanguageData('sheet/toolbar');
	const {isLoading,setIsLoading} = props;


	return (		
		<>
            <Upload
				fileType="PO_photo"
				fileKey={store_room_id}
				isLoading={isLoading} 
				setIsLoading={setIsLoading}
				onFinish={(file) => {
					console.log(file, "file file file")
					props.setGeneralImage(file);
				}}>
				<span className="theme-color lf-link-cursor ms-1">
					<i className="fas fa-plus" /> {fileAttechment.text}
				</span>
			</Upload>
        </>		
	);
}
export default GeneralAttachment;
