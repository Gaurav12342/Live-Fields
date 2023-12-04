import Layout from '../../components/layout';
import { Dropdown } from 'react-bootstrap';
import CreateTask from './createTask'
import { Link } from 'react-router-dom';
import { useParams } from "react-router";
import Filter from './filter';
import getUserId from '../../commons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { GetTaskListByBoard } from '../../store/actions/Task';
import { GET_TASK_LIST_BY_BOARD } from '../../store/actions/actionType';
import Board from './dnd';

function BoardTasks() {
  const userId = getUserId();
  const { project_id } = useParams();
  const dispatch = useDispatch();
  const [open, setOpenInfo] = useState(false)
  const data = useSelector((state) => {
    return state?.task?.[GET_TASK_LIST_BY_BOARD]?.result || [];
  });

  useEffect(() => {
    if (data?.length <= 0) {
      dispatch(GetTaskListByBoard(project_id, userId));
    }
  }, [data?.length, dispatch]);

  return (<div className="container-fluid mt-3">
  <div className="lf-task-board-kanban-wrapper">
    {
      data?.map((kb) => {
        // var p = kb.kanban_status
        // var matches = p.match(/\b(\w)/g)
        // var status = matches.join("")
        return <Board kb={kb} userId={userId} project_id={project_id} />
      })}
  </div>
</div>);
}

export default BoardTasks;