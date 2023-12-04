import getUserId from '../../commons';
import Board from './dnd';

function KanbanTasks({filterData,clearTaskFilter,data,sortType,multiSelect,handleMultiSelect,handleTaskSelect,tasks,setSelectetdTask,project_id,dispatch,...props}) {
  const userId = getUserId();
 
  return ( <div className="container-fluid mt-3">
  <div className="lf-task-board-kanban-wrapper">
    
    {
      data?.map((kb) => {
        return <Board kb={kb} filterData={filterData} clearTaskFilter={clearTaskFilter} userId={userId} handleMultiSelect={handleMultiSelect} project_id={project_id} handleTaskSelect={handleTaskSelect} setSelectetdTask={setSelectetdTask} multiSelect={multiSelect} sortType={sortType} />
      })}
  </div>
</div>);
}

export default KanbanTasks;