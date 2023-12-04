import { useEffect, useState } from 'react';
import { Button, Form, FormControl, InputGroup, Modal } from "react-bootstrap";
// import '../App.css';
import getUserId, { getSiteLanguageData } from "./../commons";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { createlocation, getLocationList } from '../store/actions/Task';
import Creatable from 'react-select/creatable';
import { GET_LOCATION_LIST } from '../store/actions/actionType';

const {
    ph_location_name
} = getSiteLanguageData('components/locationm');

const userId = getUserId();

function Location({ defaultValue, captureValue, captureEventType }) {
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

    const project_locations = useSelector(state => state?.task?.[GET_LOCATION_LIST]?.result || [], shallowEqual)
    useEffect(() => {
        dispatch(getLocationList(project_id, userId));
    }, [])


    const handleChange = (name, value) => {
        // const name = e.target.name;
        // const value = e.target.value;
        setInfo({
            ...info,
            [name]: value,
        });
    };
    const submitLocation = (e) => {
        e.preventDefault();
        dispatch(createlocation(info));
    };

    const locations = project_locations?.map((l) => {
        return { ...l, label: l.name, value: l._id }
    })

    return (<>
        <Creatable
            placeholder={ph_location_name?.text}
            name="location_id"
            onChange={(e) => {
                if (e.__isNew__) {
                    dispatch(createlocation({
                        user_id: userId,
                        project_id: project_id,
                        name: e.value
                    }))
                }
                if (captureEventType === 'onChange') {
                    captureValue(e.value, e)
                }
            }}
            options={locations}
            value={locations?.filter(loc => {
                if (Array.isArray(defaultValue)) {
                    return defaultValue.includes(loc.value)
                }
                return loc.value === defaultValue
            })}
        />
    </>)
}

export default Location;