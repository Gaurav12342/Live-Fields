import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
	Modal,
	Form,
	Button,
	InputGroup,
	FormControl,
	Dropdown,
	OverlayTrigger,
} from 'react-bootstrap';


import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import { getParameterByName } from '../../helper';
import { GET_ALL_MATERIAL_LIST, GET_PROJECT_DETAILS, GET_VENDOR_LIST } from '../../store/actions/actionType';
import {
	createStoreRoomPO,
	getAllMaterialList,
} from '../../store/actions/storeroom';
import { getProjectDetails, getVendorsList } from '../../store/actions/projects';
import CustomSelect from '../../components/SelectBox';
import { Link } from 'react-router-dom';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Upload from '../../components/upload';

function InvoicePhoto(props) {
	const {isLoading,setIsLoading} = props;
	const userId = getUserId();
	const { project_id, store_room_id, store_room_log_date } = useParams();
	const reportName = getParameterByName('name');
	const dispatch = useDispatch();
	const [selectedMaterial, handleSelectedMaterial] = useState([]);
	
	return (		
		<>
			<Upload
                fileType="invoice_photo"
                fileKey={store_room_id}
				isLoading={isLoading} 
				setIsLoading={setIsLoading}
                onFinish={(file) => {
                    console.log(file, "file")
                    // const fileList = this.state.info?.file;
                    // fileList.push(file);
                    // handleChange(fileList, 'file');
                    props.setInvoiceImage(file);
                }}>
            </Upload>
        </>		
	);
}
export default InvoicePhoto;
