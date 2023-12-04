import moment from 'moment';
import React, { PureComponent } from 'react';
import DataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import { connect } from 'react-redux';

import getUserId, { getSiteLanguageData } from '../../commons';
import withRouter from '../../components/withrouter';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_ALL_TASK_BOARD_LIST,
	GET_CATEGORY_LIST,
	GET_LOCATION_LIST,
} from '../../store/actions/actionType';
import { getAllRoleWisePeople } from '../../store/actions/projects';
import {
	createTask,
	getBoardList,
	GetCategoryList,
	getLocationList,
} from '../../store/actions/Task';
import './taskImport.scss';
// import Select from 'react-select'
// import { ENTER_KEY, TAB_KEY } from './keys'

// import {
//     colDragSource, colDropTarget,
//     rowDragSource, rowDropTarget
// } from './drag-drop.js'

class TaskImport extends PureComponent {
	constructor(props) {
		super(props);
		this.userId = getUserId();
		this.project_id = this.props.router?.params.project_id;
		this.handleSelect = this.handleSelect.bind(this);
		this.handleSelectAllChanged = this.handleSelectAllChanged.bind(this);
		this.handleSelectChanged = this.handleSelectChanged.bind(this);
		this.handleCellsChanged = this.handleCellsChanged.bind(this);

		this.sheetRenderer = this.sheetRenderer.bind(this);
		this.rowRenderer = this.rowRenderer.bind(this);
		this.cellRenderer = this.cellRenderer.bind(this);

		this.state = {
			as: 'table',
			columns: [
				{ label: 'Task Name', width: '20%' },
				{ label: 'Status', width: '10%' },
				{ label: 'Assignee', width: '10%' },
				{ label: 'Type of work', width: '10%' },
				{ label: 'Category', width: '10%' },
				{ label: 'Location', width: '10%' },
				{ label: 'Start Date', width: '10%' },
				{ label: 'End Date', width: '10%' },
				{ label: 'Tags', width: '10%' },
			],
			grid: [
				[
					{ value: 'Title' },
					{ value: 'Priority 1' },
					{ value: 'Purushotam Chhuchhiya' },
					{ value: 'Planned' },
					{ value: 'Test' },
					{ value: 'Building A' },
					{ value: '01-03-2021' },
					{ value: '02-03-2021' },
					{ value: 'Web' },
				],
			],
			selections: [
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
			],
			loader: {
				total: null,
				completed: null,
			},
		};
	}
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(getBoardList(this.project_id, this.userId));
		dispatch(getAllRoleWisePeople(this.project_id));
		dispatch(GetCategoryList(this.project_id, this.userId));
		dispatch(getLocationList(this.project_id, this.userId));
	}

	handleSelect(e) {
		this.setState({ as: e.target.value });
	}

	handleSelectAllChanged(selected) {
		const selections = this.state.selections.map((s) => selected);
		this.setState({ selections });
	}

	handleSelectChanged(index, selected) {
		const selections = [...this.state.selections];
		selections[index] = selected;
		this.setState({ selections });
	}

	handleCellsChanged(changes, additions) {
		const grid = this.state.grid.map((row) => [...row]);
		changes.forEach(({ cell, row, col, value }) => {
			grid[row][col] = { ...grid[row][col], value };
		});
		// paste extended beyond end, so add a new row
		additions &&
			additions.forEach(({ cell, row, col, value }) => {
				if (!grid[row]) {
					grid[row] = [
						{ value: '' },
						{ value: '' },
						{ value: '' },
						{ value: '' },
						{ value: '' },
						{ value: '' },
						{ value: '' },
						{ value: '' },
						{ value: '' },
					];
				}
				if (grid[row][col]) {
					grid[row][col] = { ...grid[row][col], value };
				}
			});
		this.setState({ grid });
	}

	sheetRenderer(props) {
		const { columns, selections } = this.state;
		switch (this.state.as) {
			case 'list':
				return (
					<SheetRenderer
						columns={columns}
						selections={selections}
						onSelectAllChanged={this.handleSelectAllChanged}
						as="segment"
						headerAs="div"
						bodyAs="ul"
						rowAs="div"
						cellAs="div"
						{...props}
					/>
				);
			case 'div':
				return (
					<SheetRenderer
						columns={columns}
						selections={selections}
						onSelectAllChanged={this.handleSelectAllChanged}
						as="div"
						headerAs="div"
						bodyAs="div"
						rowAs="div"
						cellAs="div"
						{...props}
					/>
				);
			default:
				return (
					<SheetRenderer
						columns={columns}
						selections={selections}
						onSelectAllChanged={this.handleSelectAllChanged}
						as="table"
						headerAs="thead"
						bodyAs="tbody"
						rowAs="tr"
						cellAs="th"
						{...props}
					/>
				);
		}
	}

	rowRenderer(props) {
		const { selections } = this.state;
		switch (this.state.as) {
			case 'list':
				return (
					<RowRenderer
						as="li"
						cellAs="div"
						selected={selections[props.row]}
						onSelectChanged={this.handleSelectChanged}
						className="data-row"
						{...props}
					/>
				);
			case 'div':
				return (
					<RowRenderer
						as="div"
						cellAs="div"
						selected={selections[props.row]}
						onSelectChanged={this.handleSelectChanged}
						className="data-row"
						{...props}
					/>
				);
			default:
				return (
					<RowRenderer
						as="tr"
						cellAs="td"
						selected={selections[props.row]}
						onSelectChanged={this.handleSelectChanged}
						className="data-row"
						{...props}
					/>
				);
		}
	}

	cellRenderer(props) {
		switch (this.state.as) {
			case 'list':
				return (
					<CellRenderer as="div" columns={this.state.columns} {...props} />
				);
			case 'div':
				return (
					<CellRenderer as="div" columns={this.state.columns} {...props} />
				);
			default:
				return <CellRenderer as="td" columns={this.state.columns} {...props} />;
		}
	}
	submitImportTask = (e) => {
		e.preventDefault();
		const { boardList, assignee, category, taskLocation, tag, sheets } =
			this.props;
		const location = taskLocation?.map((tl) => {
			return { label: tl.name, value: tl._id };
		});
		const categories = category?.map((c) => {
			return { label: c.name, value: c._id };
		});
		const board = boardList?.map((b) => {
			return { label: b.name, value: b._id };
		});
		const projectUsers = [];
		assignee?.forEach((a) => {
			(a?.users).forEach((u) => {
				projectUsers.push({ label: u.first_name, value: u._id });
			});
		});
		const workTypes = [
			{ name: 'Planned', value: 'planned' },
			{ name: 'Issue', value: 'issue' },
		];
		const typeOfWork = workTypes?.map((b) => {
			return { label: b.name, value: b.value };
		});
		let tasks = [];
		for (let i = 0; i < this.state.grid.length; i++) {
			//Here Only (Day-Month-Year) This Formated Date is Supported

			if (this.state.grid[i][6].value) {
				let splitdate = this.state.grid[i][6].value.split('-');
				let smonth = splitdate[1];
				let sday = splitdate[0];
				let syear = splitdate[2];
				var finalstartdate = smonth.concat('/', sday, '/', syear);
			}
			if (this.state.grid[i][7].value) {
				let splitedate = this.state.grid[i][7].value.split('-');
				let emonth = splitedate[1];
				let eday = splitedate[0];
				let eyear = splitedate[2];
				var finalenddate = emonth.concat('/', eday, '/', eyear);
			}

			const task = {
				user_id: this.userId,
				project_id: this.project_id,
				title: this.state.grid[i][0].value,
				board_id: this.state.grid[i][1].value
					? board?.filter(
							(x) =>
								x.label.toLowerCase() ===
								this.state.grid[i][1].value.toLowerCase(),
					  )[0]?.value
					: '',
				assigee_id: this.state.grid[i][2].value
					? projectUsers?.filter(
							(x) =>
								x.label.toLowerCase() ===
								this.state.grid[i][2].value.toLowerCase(),
					  )[0]?.value
					: '',
				type: this.state.grid[i][3].value
					? typeOfWork?.filter(
							(x) =>
								x.label.toLowerCase() ===
								this.state.grid[i][3].value.toLowerCase(),
					  )[0]?.value
					: '',
				category_id: this.state.grid[i][4].value
					? categories?.filter(
							(x) =>
								x.label.toLowerCase() ===
								this.state.grid[i][4].value.toLowerCase(),
					  )[0]?.value
					: '',
				location_id: this.state.grid[i][5].value
					? location?.filter(
							(x) =>
								x.label.toLowerCase() ===
								this.state.grid[i][5].value.toLowerCase(),
					  )[0]?.value
					: '',
				start_date: this.state.grid[i][6].value ? new Date(finalstartdate) : '',
				end_date: this.state.grid[i][7].value ? new Date(finalenddate) : '',
			};
			tasks.push(task);
		}
		this.dispatchCreateTaskForMultiImport(tasks, 0);
	};

	dispatchCreateTaskForMultiImport = (tasks, i) => {
		const importOptions = {
			i,
			cb: (i) => {
				const tmpI = i + 1;
				const loader = {
					total: tasks.length,
					completed: tmpI,
				};
				if (tmpI < tasks.length) {
					this.dispatchCreateTaskForMultiImport(tasks, tmpI);
				} else {
					loader.total = null;
					loader.completed = null;
				}
				this.setState({ loader });
			},
		};
		this.props.dispatch(
			createTask(
				tasks[i],
				'unset',
				this.props.task_view_type,
				this.props.filterData,
				this.props.router?.navigate,
				importOptions,
			),
		);
	};

	render() {
		const { cancel, save } = getSiteLanguageData('task/update');
		return (
			<div className="p-2">
				<div
					className="position-sticky bg-light d-block w-100 top-0 text-end pe-3"
					style={{ height: 'fit-content', zIndex: 1 }}>
					<span
						className="btn lf-common-btn "
						onClick={() => this.props.setImportMode(false)}>
						{cancel?.text}
					</span>
					<span className="btn lf-main-button" onClick={this.submitImportTask}>
						{save?.text}
					</span>
				</div>
				{/* <div>
                    <label>
                        Render with:&nbsp;
                        <select value={this.state.as} onChange={this.handleSelect}>
                            <option value='table'>Table</option>
                            <option value='list'>List</option>
                            <option value='div'>Div</option>
                        </select>
                    </label>
                </div> */}
				<div>
					{this.state.loader?.total
						? `${this.state.loader?.total} tasks going to be create`
						: null}
					<br />
					{this.state.loader?.completed
						? `${this.state.loader?.completed} tasks created successfully`
						: null}
				</div>
				<DataSheet
					data={this.state.grid}
					className="custom-sheet"
					sheetRenderer={this.sheetRenderer}
					// headerRenderer={this.headerRenderer}
					// bodyRenderer={this.bodyRenderer}
					rowRenderer={this.rowRenderer}
					cellRenderer={this.cellRenderer}
					onCellsChanged={this.handleCellsChanged}
					valueRenderer={(cell) => cell.value}
				/>
			</div>
		);
	}
}

// export default TaskImport
export default withRouter(
	connect((state) => {
		return {
			boardList: state?.task?.[GET_ALL_TASK_BOARD_LIST]?.result || [],
			assignee: state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [],
			category: state?.task?.[GET_CATEGORY_LIST]?.result || [],
			taskLocation: state?.task?.[GET_LOCATION_LIST]?.result || [],
		};
	})(TaskImport),
);

const SheetRenderer = (props) => {
	const {
		as: Tag,
		headerAs: Header,
		bodyAs: Body,
		rowAs: Row,
		cellAs: Cell,
		className,
		columns,
		selections,
		onSelectAllChanged,
	} = props;
	return (
		<Tag className={className}>
			<Header className="data-header">
				<Row>
					{/* <Cell className='action-cell cell'>
                        <input
                            type='checkbox'
                            checked={selections.every(s => s)}
                            onChange={e => onSelectAllChanged(e.target.checked)}
                        />
                    </Cell> */}
					{columns.map((column) => (
						<Cell
							className="cell"
							style={{ width: column.width }}
							key={column.label}>
							{column.label}
						</Cell>
					))}
				</Row>
			</Header>
			<Body className="data-body">{props.children}</Body>
		</Tag>
	);
};

const RowRenderer = (props) => {
	const {
		as: Tag,
		cellAs: Cell,
		className,
		row,
		selected,
		onSelectChanged,
	} = props;
	return (
		<Tag className={className}>
			{/* <Cell className='action-cell cell'>
                <input
                    type='checkbox'
                    checked={selected}
                    onChange={e => onSelectChanged(row, e.target.checked)}
                />
            </Cell> */}
			{props.children}
		</Tag>
	);
};

const CellRenderer = (props) => {
	const {
		as: Tag,
		cell,
		row,
		col,
		columns,
		attributesRenderer,
		selected,
		editing,
		updated,
		style,
		...rest
	} = props;

	// hey, how about some custom attributes on our cell?
	const attributes = cell.attributes || {};
	// ignore default style handed to us by the component and roll our own
	attributes.style = { width: columns[col].width };
	if (col === 0) {
		attributes.title = cell.label;
	}

	return (
		<Tag {...rest} {...attributes}>
			{props.children}
		</Tag>
	);
};
