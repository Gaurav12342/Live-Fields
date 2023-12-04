import { useEffect, useState } from 'react';
import { Button, Form, FormControl, InputGroup, Modal } from "react-bootstrap";
// import '../App.css';
import getUserId, { getSiteLanguageData } from "./../commons";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { createlocation, getLocationList } from '../store/actions/Task';
import Creatable from 'react-select/creatable';
import { GET_ALL_ROLE_WISE_PEOPLE, GET_LOCATION_LIST } from '../store/actions/actionType';
import CustomSelect from './SelectBox';

const userId = getUserId();

const { ph_assignee } = getSiteLanguageData('components/projectUserSelect');

function ProjectUsersSelect({ defaultValue, captureValue, captureEventType }) {
    const { project_id } = useParams();
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const handleCloseLocation = () => setShow(false);
    const handleShowLocation = () => setShow(true);
    const [info, setInfo] = useState({
        user_id: userId,
        project_id: project_id,
        name: "",
    });

    const project_users = useSelector(state => {
        return state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || []
    }, shallowEqual)

    // useEffect(() => {
    //     dispatch(getLocationList(project_id, userId));
    // }, [])

    const users = []
    project_users?.forEach((a) => {
        (a?.users).forEach((u) => {
            users.push({ ...u, label: u.first_name, value: u._id })
        })
    });

    return (<>
        <CustomSelect
            placeholder={ph_assignee?.text}
            // name="assigee_id"
            onChange={(e) => {
                if (captureEventType === 'onChange') {
                    captureValue(e.value, e)
                }
            }}
            options={users}
            value={users?.filter(u => {
                if (Array.isArray(defaultValue)) {
                    return defaultValue.includes(u.value)
                }
                return u.value === defaultValue
            })}
            // value={info.assigee_id}
            // isMulti
            closeMenuOnSelect={false}
        />
    </>)
}

export default ProjectUsersSelect;