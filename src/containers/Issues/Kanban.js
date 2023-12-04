import { useEffect, useState } from 'react';
import getUserId from '../../commons';
import Board from './Board';
import { GET_ISSUE_LIST } from '../../store/actions/actionType';
import { useDispatch } from 'react-redux';

function KanbanView(props) {
    const userId = getUserId();
    const dispatch = useDispatch();
    const [data, setData] = useState();

    useEffect(()=>{
        handleUpdateValue(props.data)
    },[props.data])

    const handleUpdateValue = (ogData) => {
        let dataVal = [
            {
                status_id:'Open',
                data:ogData ? ogData.filter((dt) => dt.status_id === "Open") : [],
                color_code:'#ffa500'
            },
            {
                status_id:'Closed',
                data:ogData ? ogData.filter((dt) => dt.status_id === "Closed") : [],
                color_code:'#008000'
            },
            {
                status_id:'Force closed',
                data:ogData ? ogData.filter((dt) => dt.status_id === "Force closed") : [],
                color_code:'#008000'
            }
        ];
        setData(dataVal);
    }

    const updateViewState = (issueId, newStatus) => {
        let newData = props.data.map((dt)=>{

            if(dt._id === issueId){
                dt.status_id = newStatus;
            }
            return dt;
        })

        handleUpdateValue(newData);

        /* dispatch({
            type: GET_ISSUE_LIST,
            [GET_ISSUE_LIST]: newData ? newData : [],
        }); */
    }

    return (<div className="container-fluid mt-3">
        <div className="lf-task-board-kanban-wrapper">

            {
                data?.map((kb, ini) => {
                    return <Board key={ini+'-view'} kb={kb} userId={userId} handleMultiSelect={props.handleMultiSelect} project_id={props.project_id} handleTaskSelect={props.handleTaskSelect} setSelectetdTask={props.setSelectetdTask} multiSelect={props.multiSelect} updateViewState={updateViewState} getIssueData={props.getIssueData}
                    />
                })}
        </div>
    </div>);
}

export default KanbanView;