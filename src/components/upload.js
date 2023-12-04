import React, { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getSiteLanguageData, variableValidator } from '../commons';
import { getBase64, getWebPImage } from '../commons/getBase64';
import {
	FILE_UPLOAD_LOADING,
	UPLOAD_FILE_DATA
} from '../store/actions/actionType';
import { clearUploadFile, UploadFile } from '../store/actions/Utility';
import PropTypes from 'prop-types';
import { UploadProfileImage } from '../store/actions/Profile';
import { startLoading, stopLoading } from '../store/actions/loading';
import { errorNotification } from '../commons/notification';
import Dropzone from 'react-dropzone';
import { InputGroup } from 'react-bootstrap';
import { ProgressBar } from 'react-bootstrap';
import Loading from './loadig';
let fileDropZonExtModule = {
    plan:[
        'jpg', 'pdf', 'png'
    ],
    plan_photo:[
        'png',
        'jpeg',
        'jpg',
		'webp',
        'gif',
        'bmp',
        'tiff',
        'tif',
        'tn3',
        'tp3',
        'svg'
    ],
    project_photo:[
        'png',
        'jpeg',
        'jpg',
		'webp',
        'gif',
        'bmp',
        'tiff',
        'tif',
        'tn3',
        'tp3',
        'svg'
    ],
    project_file:[
        'png',
        'jpeg',
        'jpg',
		'webp',
        'gif',
        'bmp',
        'tiff',
        'tif',
        'tn3',
        'tp3',
        'svg',
        'avi',
        'ogg',
        'wav',
        'mp3',
        'webm',
        'mov',
        'mp4',
        'mpg',
        'f4v',
        'wmv',
        'flv',
        'mkv',
        'rvt',
        'dwg',
        'dxf',
        'kmz',
        'dgn',
        'kml',
        'dwf',
        'dwfx',
        'ifc',
        'nwd',
        'mpp',
        'pan',
        'rd3',
        'xer',
        '7z',
        'zip',
        'zipx',
        'rar',
        'ppt',
        'pptx',
        'pps',
        'key',
        'odp',
        'xlsx',
        'xls',
        'xltx',
        'xlt',
        'xlsm',
        'ods',
        'numbers',
        'csv',
        'doc',
        'docx',
        'pages',
        'odt',
        'odf',
        'pdf',
        'txt',
        'rtf'
    ],

}
const Upload = (props) => {
		const { isLoading, setIsLoading } = props;
	const [progress, setProgress] = useState(0);
	
	const fileUrl = useSelector((state) => {
		return state?.utility?.[UPLOAD_FILE_DATA]?.result || '';
	}, shallowEqual);
	const iconURL = useSelector((state) => {
		return state?.utility?.[UPLOAD_FILE_DATA]?.icon || '';
	}, shallowEqual);
	const fileName = useSelector((state) => {
		return state?.utility?.[UPLOAD_FILE_DATA]?.name || '';
	}, shallowEqual);
	const module_type = useSelector((state) => {
		return state?.utility?.[UPLOAD_FILE_DATA]?.module_type;
	}, shallowEqual);
	const dispatch = useDispatch();

	useEffect(() => {
		if (variableValidator(fileUrl) && module_type === props.fileType) {
			if (props.onFinish !== undefined) {
				dispatch(stopLoading(FILE_UPLOAD_LOADING));
				props.onFinish(fileUrl, fileName, props.fileType, iconURL, props);
				dispatch(clearUploadFile());
			}
		}
	}, [fileUrl, module_type]);

	const imageUpload = useCallback((e) => {
		for (let i = 0; i < e.length; i++) {
			let file = e[i];
			const fname = file.name;
			const ext = fname.split('.').slice(-1).join('.');
			if (props.fileType === 'plan') {
				
				if (ext === 'jpg' || ext === 'jpeg' || ext === 'pdf' || ext === 'png' || ext==='webp') {
					if((file.size / 1024 / 1024) < 10){
						getBase64(file, (result) => {
							dispatch(
								UploadFile({
									module_type: props?.fileType,
									module_key: props?.fileKey,
									file: result,
									name: file?.name,
								}, (progressRate)=>{
									setProgress(progressRate);
								}),
							);
						});
					}else{
						console.log((file.size / 1024 / 1024), "file.size")
						errorNotification('Max file size 10 MB accepted');
					}					
				} else {
					errorNotification('Please Upload JPG , PDF or PNG file');
					return;
				}
			} else if (
				props.fileType === 'plan_photo' ||
				props.fileType === 'project_photo'
			) {
				if (
					ext === 'png' ||
					ext === 'jpeg' ||
					ext === 'jpg' ||
					ext === 'gif' ||
					ext === 'bmp' ||
					ext === 'tiff' ||
					ext === 'tif' ||
					ext === 'tn3' ||
					ext === 'tp3' ||
					ext === 'svg' ||
					ext==='webp'
				) {
					setIsLoading(true);
					getWebPImage(file, (result) => {
						if(Object.values(result).length > 0){
							setIsLoading(false);
							dispatch(
								UploadFile({
									module_type: props?.fileType,
									module_key: props?.fileKey,
									file: result?.webpDataURL,
									name: result?.webpFileName,
								},(progressRate)=>{
									setProgress(progressRate);
								}),
							);
						}else{
							setIsLoading(true);
						}
						
					});
				} else {
					errorNotification('You can upload only image');
					return;
				}
			} else if(props.fileType === 'invoice_photo' || props.fileType === 'PO_photo'){
				if(['png','jpeg','jpg','gif','webp','bmp'].includes(String(ext).toLowerCase())){
					setIsLoading(true);
					getWebPImage(file, (result) => {
						if(Object.values(result).length > 0){
							setIsLoading(false);
							dispatch(
								UploadFile({
									module_type: props?.fileType,
									module_key: props?.fileKey,
									file: result?.webpDataURL,
									name: result?.webpFileName,
								},(progressRate)=>{
									setProgress(progressRate);
								}),
							);
						}else{
							setIsLoading(true);
						}
						
					});
					
				}else{
					errorNotification('You can upload only image and pdf');
					return;
				}
			} else if(props.fileType === 'survey_genral_attachment') {
				if(
					ext==='png' ||
					ext==='jpeg' ||
					ext==='jpg' ||
					ext==='gif' ||
					ext==='bmp' ||
					ext==='webp'
				){
					setIsLoading(true);
					getWebPImage(file, (result) => {
						if(Object.values(result).length > 0){
							setIsLoading(false);
							dispatch(
								UploadFile({
									module_type: props?.fileType,
									module_key: props?.fileKey,
									file: result?.webpDataURL,
									name: result?.webpFileName,
								},(progressRate)=>{
									setProgress(progressRate);
								}),
							);
						}else{
							setIsLoading(true);
						}
						
					});
				}else{
					errorNotification('You can upload only image');
					return;
				}
				
			} else if (props.fileType === 'project_file' ||
			props.fileType === 'rfi_files' || props.fileType === 'rfi_attachment') {
				if (
					ext==='png' ||
					ext==='jpeg' ||
					ext==='jpg' ||
					ext==='webp' ||
					ext==='gif' ||
					ext==='bmp' ||
					ext==='tiff' ||
					ext==='tif' ||
					ext==='tn3' ||
					ext==='tp3' ||
					ext==='svg' ||
					ext==='avi' ||
					ext==='ogg' ||
					ext==='wav' ||
					ext==='mp3' ||
					ext==='webm' ||
					ext==='mov' ||
					ext==='mp4' ||
					ext==='mpg' ||
					ext==='f4v' ||
					ext==='wmv' ||
					ext==='flv' ||
					ext==='mkv' ||
					ext==='rvt' ||
					ext==='dwg' ||
					ext==='dxf' ||
					ext==='kmz' ||
					ext==='dgn' ||
					ext==='kml' ||
					ext==='dwf' ||
					ext==='dwfx' ||
					ext==='ifc' ||
					ext==='nwd' ||
					ext==='mpp' ||
					ext==='pan' ||
					ext==='rd3' ||
					ext==='xer' ||
					ext==='7z' ||
					ext==='zip' ||
					ext==='zipx' ||
					ext==='rar' ||
					ext==='ppt' ||
					ext==='pptx' ||
					ext==='pps' ||
					ext==='key' ||
					ext==='odp' ||
					ext==='xlsx' ||
					ext==='xls' ||
					ext==='xltx' ||
					ext==='xlt' ||
					ext==='xlsm' ||
					ext==='ods' ||
					ext==='numbers' ||
					ext==='csv' ||
					ext==='doc' ||
					ext==='docx' ||
					ext==='pages' ||
					ext==='odt' ||
					ext==='odf' ||
					ext==='pdf' ||
					ext==='txt' ||
					ext==='rtf'
				) {
					getBase64(file, (result) => {
						dispatch(
							UploadFile({
								module_type: props?.fileType,
								module_key: props?.fileKey,
								file: result,
								name: file?.name,
							} ,(progressRate)=>{
								setProgress(progressRate);
							}),
						);
					});
				} else {
					errorNotification(
						'Unsupported file format',
					);
					return;
				}
			} else {
				if (file) {
					getBase64(file, (result) => {
						if (props.fileType === 'profile') {
							dispatch(startLoading(FILE_UPLOAD_LOADING));
							dispatch(
								UploadProfileImage({
									user_id: props?.fileKey,
									file: result,
								}),
							);
						} else {
							// setFileName(file?.name)
							setIsLoading(true);
							getWebPImage(file, (result) => {
								if (Object.values(result).length > 0) {
									setIsLoading(false);
									dispatch(
										UploadFile(
											{
												module_type: props?.fileType,
												module_key: props?.fileKey,
												file: result?.webpDataURL,
												name: result?.webpFileName,
											},
											(progressRate) => {
												setProgress(progressRate);
											},
										),
									);
								} else {
									setIsLoading(true);
								}
							});
						}
					});
				}
			}
		}
	});
	/* accept={
			(typeof fileDropZonExtModule[props.fileType] != "undefined" ? fileDropZonExtModule[props.fileType] : "*")
		} */
	return (
		<>
			{isLoading && !["survey_genral_attachment","PO_photo", "invoice_photo"].includes(props.fileType) && <Loading />}
			<Dropzone disabled={isLoading} onDrop={(e) => imageUpload(e)}>
				{({ getRootProps, getInputProps }) => (
					<section className="inner-chat-button">
						<div {...getRootProps()}>
							<input {...getInputProps()} />
							<UploadInner isLoading={isLoading} type={props.fileType} fileUrl={fileUrl} />
							{/* <div className="lf-dashed text-center">
				{/* <span className="btn border border">
				<i className="fas fa-upload" /> upload file 
				</span> * /}
				<i className="fas fa-upload fa-3x mt-2" />
				<div className="text-center mt-1 fs-4 font-weight-bold">Drag and Drop file</div>
				<div className="text-center mt-1">Or</div>
				<span className="btn border border mt-3 rounded-pill p-2 mb-2 bg-danger text-white">
					Browse for file
				</span>
				</div> */}
						</div>
					</section>
				)}
			</Dropzone>
			{progress != 0 && <ProgressBar now={progress} label={`${progress}%`} />}
		</>
		
	);
};

Upload.propTypes = {
	fileType: PropTypes.string.isRequired,
	fileKey: PropTypes.string.isRequired,
};

export default Upload;

const { attachement, drag_and_drop_file, upload_file, browse_for_file_n, or,browse_for_image_n } =
	getSiteLanguageData('components/upload');
const UploadInner = ({ type, fileUrl,isLoading }) => {
	switch (type) {
		case 'report_photo':
			return (
				<span className="theme-color lf-link-cursor float-end me-4">
					<i className="fa-solid fa-paperclip" /> {attachement?.text}
				</span>
			);
		case 'survey_genral_attachment':
			return (
				<span className="theme-color lf-link-cursor float-end me-4">
					<i className="fa-solid fa-paperclip" /> {attachement?.text}
				</span>
			);
		case 'attachement_photo':
			return (
				<span className="theme-color lf-link-cursor float-end ">
					<i className="fas fa-plus me-1" />
				</span>
			);
		case 'rfi_files':
			return (
				<span className="theme-color lf-link-cursor float-end ">
					<i className="fas fa-plus me-1" /> {attachement?.text}
				</span>
			);
		case 'rfi_attachment':
			return (
				<span className="theme-color lf-link-cursor float-end ">
					<i className="fas fa-plus me-1" /> {attachement?.text}
				</span>
			);
		case 'profile':
			return (
				<span className="theme-btnbg theme-secondary rounded lf-link-cursor ms-5">
					<i className="fas fa-edit lf-sheet-icon fa-lg mt-2"></i>
				</span>
			);

		case 'plan_photo':
			return (
				<>
					{fileUrl ? (
						<span className="btn border border">
							<i className="fas fa-upload" /> {upload_file?.text}
						</span>
					) : (
						<div className="lf-dashed text-center mt-3">
							<i className="fas fa-upload fa-3x mt-2" />
							<div className="my-2 fs-4">{browse_for_file_n?.text}</div>
							<div className="mt-1">{drag_and_drop_file?.text}</div>
						</div>
					)}
				</>
			);

		case 'invoice_photo':
			return (
				<>
					<div className="text-center lf-dull-color">
						<div><i className="fas fa-plus fa-3x" /></div>
						<div>{isLoading ? "Loading..." : browse_for_image_n.text}</div>
					</div>
				</>
			);

		case 'PO_photo':
			return (
				<>
					<span className={`text-end ${isLoading ? 'disabled' : ''}`}>
						+ {attachement?.text}
					</span>
				</>
			)
		default:
			if (type.indexOf('_chat') !== -1) {
				return (
					<div className="">
						<i className="fa-solid fa-circle-plus fa-2xl theme-color p-1"></i>
					</div>
				);
			}
			return (
				<div className="lf-dashed text-center mt-3">
					<i className="fas fa-upload fa-3x mt-2" />
					<div className="my-2 fs-4">{browse_for_file_n?.text}</div>
					<div className="mt-1">{drag_and_drop_file?.text}</div>
				</div>
			);
	}
};
