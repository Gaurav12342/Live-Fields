import moment from 'moment';
import React, { useEffect, useState, useRef } from 'react';
import { InputGroup, OverlayTrigger } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { getSiteLanguageData } from '../commons';
import SignPoOrder from '../containers/StoreRoom/signPoOrder';
import SignPoOrderInfo from '../containers/StoreRoom/signPoOrderInfo';
import { getParameterByName } from '../helper';
import { GET_ALL_ROLE_WISE_PEOPLE } from '../store/actions/actionType';
import {
	setLightBoxImageData,
	setLightBoxImageDefaultUrl,
	toggleLightBoxView,
} from '../store/actions/imageLightBox';
import { getAllRoleWisePeople } from '../store/actions/projects';
import withRouter from './withrouter';

const CustomSearch = ({ manageTaskFilter, dataSource, ...props }) => {
	const task_view_type = getParameterByName('v') || 'list';
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [searchString, setSearchString] = useState(
		props.seachText ? props.seachText : '',
	);
	const [searchedTask, setSearchedTask] = useState([]);
	const projectUserList = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [];
	});

	const [isOptionOpen, setIsOptionOpen] = useState(false);
	const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);

	const scrollToRef = useRef(null);

	useEffect(() => {
		if (scrollToRef.current) {
			scrollToRef.current.scrollIntoView({ block: 'nearest' });
		}
	}, [selectedOptionIndex]);

	useEffect(() => {
		if (projectUserList?.length <= 0) {
			dispatch(getAllRoleWisePeople(project_id));
		}
	}, [projectUserList, project_id, dispatch]);
	const projectUsers = [];
	projectUserList?.forEach((a) => {
		(a?.users).forEach((u) => {
			projectUsers.push({ label: u.first_name, value: u._id, ...u });
		});
	});

	// Just putted as commented if we need this in future that's why.

	// useEffect(() => {
	// 	if (
	// 		searchString !== '' &&
	// 		typeof props.storeRoollogTextHandle != 'function' &&
	// 		typeof props.suggestion != 'undefined' &&
	// 		!(props.suggestion === false)
	// 	) {
	// 		setIsOptionOpen(true);
	// 	}
	// }, [
	// 	searchString,
	// 	props.storeRoollogTextHandle,
	// 	props.suggestion,
	// 	setIsOptionOpen,
	// ]);

	const searchedUsers = projectUsers?.filter((u) => {
		const first_name = u.first_name?.toLowerCase();
		const last_name = u.last_name?.toLowerCase();
		const suggestionWord = searchString?.toLowerCase();
		return (
			first_name.includes(suggestionWord) ||
			last_name?.includes(suggestionWord) ||
			(first_name + ' ' + last_name)?.includes(suggestionWord) ||
			suggestionWord === ''
		);
	});

	const filterOnTaskList = (taskArr) => {
		return taskArr.filter((t) => {
			const title = t?.title?.toLowerCase();
			const task_no = t?.task_no?.toLowerCase();
			const task_no_with_hash = `#${t?.task_no}`;
			const suggestionWord = searchString?.toLowerCase();
			return (
				title?.includes(suggestionWord) ||
				task_no?.includes(suggestionWord) ||
				task_no_with_hash?.includes(suggestionWord)
			);
		});
	};

	const filterOnIssueList = (taskArr) => {
		return taskArr.filter((t) => {
			const title = t?.title?.toLowerCase();
			const task_no = t?.task_no?.toLowerCase();
			const task_no_with_hash = `#${t?.task_no}`;
			const suggestionWord = searchString?.toLowerCase();
			return (
				title?.includes(suggestionWord) ||
				task_no?.includes(suggestionWord) ||
				task_no_with_hash?.includes(suggestionWord)
			);
		});
	};

	const filterOnSheetList = (sheetArr) => {
		return sheetArr?.filter((t) => {
			const title = t.description?.toLowerCase();
			const sheet_no = t.sheet_no?.toLowerCase();
			// const tags = t?.tags?.map(t => {
			//     const tag = props?.allTags?.filter(tt => tt._id === t)[0]
			//     return tag?.name
			// }).join(',');
			const suggestionWord = searchString?.toLowerCase();
			return (
				title?.includes(suggestionWord) || sheet_no?.includes(suggestionWord)
			);
		});
	};
	const filterOnPeopleList = (peopleArr) => {
		return peopleArr?.filter((t) => {
			const first_name = t?.first_name?.toLowerCase();
			const last_name = t?.last_name?.toLowerCase();
			const email = t?.email?.toLowerCase();
			const suggestionWord = searchString?.toLowerCase();
			return (
				first_name.includes(suggestionWord) ||
				last_name?.includes(suggestionWord) ||
				(first_name + ' ' + last_name)?.includes(suggestionWord) ||
				email?.includes(suggestionWord) ||
				suggestionWord === ''
			);
		});
	};
	const filterOnReportList = (reportArr) => {
		return reportArr?.filter((t) => {
			const title = t?.description?.toLowerCase();
			const suggestionWord = searchString?.toLowerCase();
			return title?.includes(suggestionWord);
		});
	};
	const filterOnFileList = (fileArr) => {
		return fileArr?.filter((t) => {
			const title = t.file_name?.toLowerCase();
			const suggestionWord = searchString?.toLowerCase();
			return title?.includes(suggestionWord);
		});
	};

	const filterOnPhotoList = (photoArr) => {
		return photoArr?.filter((t) => {
			const title = t.title?.toLowerCase();
			const suggestionWord = searchString?.toLowerCase();
			return title?.includes(suggestionWord);
		});
	};
	const filterOnMeetingList = (meetingArr) => {
		return meetingArr?.filter((t) => {
			const title = t.meeting_name?.toLowerCase();
			const suggestionWord = searchString?.toLowerCase();
			return title?.includes(suggestionWord);
		});
	};
	const filterOnTemplateList = (templateArr) => {
		return templateArr?.filter((t) => {
			const title = t.title?.toLowerCase();
			const suggestionWord = searchString?.toLowerCase();
			return title?.includes(suggestionWord);
		});
	};
	const filterOnMaterialLogList = (materiallogArr) => {
		return materiallogArr?.filter((t) => {
			const title = t.type?.toLowerCase();
			const suggestionWord = searchString?.toLowerCase();
			return title?.includes(suggestionWord);
		});
	};
	const filterOnStoreRoomLogList = (storeroomlogArr) => {
		return storeroomlogArr?.filter((t) => {
			const title = t.type?.toLowerCase();
			const suggestionWord = searchString?.toLowerCase();
			return title?.includes(suggestionWord);
		});
	};
	const filterOnStoreRoomLogPOList = (storeroomPOArr) => {
		return storeroomPOArr?.filter((t) => {
			const title = t?.order_no?.toLowerCase();
			const vendor = t?.vendor_data?.vendor_name?.toLowerCase();
			const suggestionWord = searchString?.toLowerCase();
			return (
				title?.includes(suggestionWord) || vendor?.includes(suggestionWord)
			);
		});
	};
	const filterOnProjectData = (projectDataArr) => {
		return projectDataArr?.filter((t) => {
			const title = t.name?.toLowerCase();
			const code = t.code?.toLowerCase();
			const suggestionWord = searchString?.toLowerCase();
			return (
				(title?.includes(suggestionWord) || code?.includes(suggestionWord)) &&
				!t.is_archived
			);
		});
	};

	let searchedTasks = [],
		searchedIssues = [],
		searchedSheets = [],
		searchedPeoples = [],
		searchedReports = [],
		searchedFiles = [],
		searchedPhotos = [],
		searchedMeetings = [],
		searchedTemplates = [],
		searchedMaterialLogs = [],
		searchedStoreRoomLogs = [],
		searchedStoreRoomPO = [],
		projectData = [];
	if (dataSource.task) {
		searchedTasks = filterOnTaskList(dataSource.task);
	}

	if (dataSource.issues) {
		searchedIssues = filterOnIssueList(dataSource.issues);
	}
	if (dataSource.sheet) {
		searchedSheets = filterOnSheetList(dataSource.sheet);
	}
	if (dataSource.people) {
		searchedPeoples = filterOnPeopleList(dataSource.people);
	}
	if (dataSource.report) {
		searchedReports = filterOnReportList(dataSource.report);
	}
	if (dataSource.file) {
		searchedFiles = filterOnFileList(dataSource.file);
	}
	if (dataSource.photo) {
		searchedPhotos = filterOnPhotoList(dataSource.photo);
	}
	if (dataSource.meeting) {
		searchedMeetings = filterOnMeetingList(dataSource.meeting);
	}
	if (dataSource.template) {
		searchedTemplates = filterOnTemplateList(dataSource.template);
	}
	if (dataSource.materiallog) {
		searchedMaterialLogs = filterOnMaterialLogList(dataSource.materiallog);
	}
	if (dataSource.storeroomlog) {
		searchedStoreRoomLogs = filterOnStoreRoomLogList(dataSource.storeroomlog);
	}
	if (dataSource.storeroomPO) {
		searchedStoreRoomPO = filterOnStoreRoomLogPOList(dataSource.storeroomPO);
	}
	if (dataSource.projects) {
		projectData = filterOnProjectData(dataSource.projects);
	}
	const {
		issues,
		users,
		tasks,
		sheets,
		Peoples,
		reports,
		files,
		meetings,
		templates,
		material_logs,
		store_room_logs,
		store_room_po,
		project,
		no_task,
		no_user,
		no_files,
		no_plans,
		no_photo,
		no_report,
		no_meeting,
		no_templates,
		no_material,
		no_storeroom,
		no_storeroom_po,
		no_project,
		search,
		photos
	} = getSiteLanguageData('components/customsearch');
	const handleImageViewer = (url) => {
		const images = [];
		searchedPhotos?.forEach((d) => {
			images.push({
				url: d?.file,
				imageCaption: d?.description,
				imageTitle: d?.title,
			});
		});
		dispatch(setLightBoxImageData(images));
		dispatch(toggleLightBoxView(true));
		dispatch(setLightBoxImageDefaultUrl(url));
	};

	const handleKeyDown = (e) => {
		if (e.keyCode === 38 || e.keyCode === 40) {
			e.preventDefault();

			if (!isOptionOpen) {
				setIsOptionOpen(true);
			} else {
				if (e.keyCode === 38) {
					if (searchedSheets.length) {
						setSelectedOptionIndex((prevIndex) =>
							prevIndex > 0 ? prevIndex - 1 : searchedSheets.length - 1,
						);
					} else if (searchedTasks.length) {
						setSelectedOptionIndex((prevIndex) =>
							prevIndex > 0 ? prevIndex - 1 : searchedTasks.length - 1,
						);
					} else if (searchedIssues.length) {
						setSelectedOptionIndex((prevIndex) =>
							prevIndex > 0 ? prevIndex - 1 : searchedIssues.length - 1,
						);
					} else if (searchedFiles.length) {
						setSelectedOptionIndex((prevIndex) =>
							prevIndex > 0 ? prevIndex - 1 : searchedFiles.length - 1,
						);
					} else if (searchedPhotos.length) {
						setSelectedOptionIndex((prevIndex) =>
							prevIndex > 0 ? prevIndex - 1 : searchedPhotos.length - 1,
						);
					} else if (searchedPeoples.length) {
						setSelectedOptionIndex((prevIndex) =>
							prevIndex > 0 ? prevIndex - 1 : searchedPeoples.length - 1,
						);
					} else if (searchedReports.length) {
						setSelectedOptionIndex((prevIndex) =>
							prevIndex > 0 ? prevIndex - 1 : searchedReports.length - 1,
						);
					} else if (projectData.length) {
						setSelectedOptionIndex((prevIndex) =>
							prevIndex > 0 ? prevIndex - 1 : projectData.length - 1,
						);
					} else if (searchedStoreRoomLogs.length) {
						setSelectedOptionIndex((prevIndex) =>
							prevIndex > 0 ? prevIndex - 1 : searchedStoreRoomLogs.length - 1,
						);
					} else {
						setSelectedOptionIndex((prevIndex) =>
							prevIndex > 0 ? prevIndex - 1 : searchedStoreRoomPO.length - 1,
						);
					}
				} else if (e.keyCode === 40) {
					if (searchedSheets.length) {
						setSelectedOptionIndex((prevIndex) =>
							prevIndex < searchedSheets.length - 1 ? prevIndex + 1 : 0,
						);
					} else if (searchedTasks.length) {
						setSelectedOptionIndex((prevIndex) =>
							prevIndex < searchedTasks.length - 1 ? prevIndex + 1 : 0,
						);
					} else if (searchedIssues.length) {
						setSelectedOptionIndex((prevIndex) =>
							prevIndex < searchedIssues.length - 1 ? prevIndex + 1 : 0,
						);
					} else if (searchedFiles.length) {
						setSelectedOptionIndex((prevIndex) =>
							prevIndex < searchedFiles.length - 1 ? prevIndex + 1 : 0,
						);
					} else if (searchedPhotos.length) {
						setSelectedOptionIndex((prevIndex) =>
							prevIndex < searchedPhotos.length - 1 ? prevIndex + 1 : 0,
						);
					} else if (searchedPeoples.length) {
						setSelectedOptionIndex((prevIndex) =>
							prevIndex < searchedPeoples.length - 1 ? prevIndex + 1 : 0,
						);
					} else if (searchedReports.length) {
						setSelectedOptionIndex((prevIndex) =>
							prevIndex < searchedReports.length - 1 ? prevIndex + 1 : 0,
						);
					} else if (projectData.length) {
						setSelectedOptionIndex((prevIndex) =>
							prevIndex < projectData.length - 1 ? prevIndex + 1 : 0,
						);
					} else if (searchedStoreRoomLogs.length) {
						setSelectedOptionIndex((prevIndex) =>
							prevIndex < searchedStoreRoomLogs.length - 1 ? prevIndex + 1 : 0,
						);
					} else {
						setSelectedOptionIndex((prevIndex) =>
							prevIndex < searchedStoreRoomPO.length - 1 ? prevIndex + 1 : 0,
						);
					}
				}

				// Scroll to the selected option
				const selectedOptionElement = document.querySelector(
					'.lf-layout-profile-menu.selected',
				);
				if (selectedOptionElement) {
					selectedOptionElement.scrollIntoView({ block: 'nearest' });
				}
			}
		} else if (e.keyCode === 13) {
			// Enter key
			e.preventDefault();

			if (
				selectedOptionIndex >= 0 &&
				selectedOptionIndex < searchedSheets.length
			) {
				const selectedRecordId = searchedSheets[selectedOptionIndex]._id;
				window.location.href = `/sheets/${project_id}/sheetInfo/${selectedRecordId}`;
			} else if (
				selectedOptionIndex >= 0 &&
				selectedOptionIndex < searchedTasks.length
			) {
				const selectedRecordId = searchedTasks[selectedOptionIndex]._id;
				window.location.href = `/tasks/${project_id}/${selectedRecordId}?v=${task_view_type}`;
			} else if (
				selectedOptionIndex >= 0 &&
				selectedOptionIndex < searchedIssues.length
			) {
				const selectedRecordId = searchedIssues[selectedOptionIndex]._id;
				window.location.href = `/issues/${project_id}/${selectedRecordId}`;
			} else if (
				selectedOptionIndex >= 0 &&
				selectedOptionIndex < searchedFiles.length
			) {
				const selectedRecordId = searchedFiles[selectedOptionIndex].file;
				window.open(decodeURI(selectedRecordId), '_blank');
			} else if (
				selectedOptionIndex >= 0 &&
				selectedOptionIndex < searchedPhotos.length
			) {
				const selectedRecordId = searchedPhotos[selectedOptionIndex];
				handleImageViewer({
					url: selectedRecordId?.file,
					imageCaption: selectedRecordId?.description,
					imageTitle: selectedRecordId?.title,
				});
			} else if (
				selectedOptionIndex >= 0 &&
				selectedOptionIndex < searchedPeoples.length
			) {
				const selectedRecordId = searchedPeoples[selectedOptionIndex];
				props.handlePeopleModal(selectedRecordId);
			} else if (
				selectedOptionIndex >= 0 &&
				selectedOptionIndex < searchedReports.length
			) {
				const selectedRecordId = searchedReports[selectedOptionIndex];
				const datet = selectedRecordId?.final_date
					?.filter((x) => moment(x).toDate() < new Date())
					.slice(-1);
				if (selectedRecordId?.report_type === 'survey report') {
					window.location.href = `/reports/${project_id}/${
						selectedRecordId?.log_name
					}/${selectedRecordId?._id}?${selectedRecordId?.log_date}=${moment(
						datet[0],
					).format('YYYY-MM-DD')}`;
				} else {
					window.location.href = `/reports/${project_id}/${
						selectedRecordId?.log_name
					}/${selectedRecordId?._id}?${selectedRecordId?.log_date}=${moment(
						new Date(),
					).format('YYYY-MM-DD')}`;
				}
			} else if (
				selectedOptionIndex >= 0 &&
				selectedOptionIndex < projectData.length
			) {
				const selectedRecordId = projectData[selectedOptionIndex];
				window.open(`/dashboard/${selectedRecordId._id}`, '_self');
			} else if (
				selectedOptionIndex >= 0 &&
				selectedOptionIndex < searchedStoreRoomPO.length
			) {
				const selectedRecordId = searchedStoreRoomPO[selectedOptionIndex];
				props.setSelectetdPoOrderDetails(selectedRecordId);
			} else {
				setIsOptionOpen(false);
			}
		} else if (e.keyCode === 27) {
			setIsOptionOpen(false);
		}
	};

	const handleKeyUp = (e) => {
		if (e.keyCode === 38 || e.keyCode === 40) {
			e.preventDefault();
		}

		if (e.keyCode === 27) {
			setIsOptionOpen(false);
		}
	};

	const handleInputChange = (e) => {
		setSearchString(e.target.value);
		if (typeof props.storeRoollogTextHandle == 'function') {
			props.storeRoollogTextHandle(e.target.value);
		} else if (typeof props.teamUserName == 'function') {
			props.teamUserName(e.target.value);
		} else if (typeof props.projectSearchText == 'function') {
			props.projectSearchText(e.target.value);
		}
		if (dataSource.task) {
			let sTask = filterOnTaskList(dataSource.task);
			setSearchedTask(sTask);
		}
		if (e.keyCode === 38) {
			// Up arrow key
			e.preventDefault();
			if (searchedSheets.length) {
				setSelectedOptionIndex((prevIndex) =>
					prevIndex > 0 ? prevIndex - 1 : searchedSheets.length - 1,
				);
			} else if (searchedTasks.length) {
				setSelectedOptionIndex((prevIndex) =>
					prevIndex > 0 ? prevIndex - 1 : searchedTasks.length - 1,
				);
			} else if (searchedIssues.length) {
				setSelectedOptionIndex((prevIndex) =>
					prevIndex > 0 ? prevIndex - 1 : searchedIssues.length - 1,
				);
			} else if (searchedFiles.length) {
				setSelectedOptionIndex((prevIndex) =>
					prevIndex > 0 ? prevIndex - 1 : searchedFiles.length - 1,
				);
			} else if (searchedPhotos.length) {
				setSelectedOptionIndex((prevIndex) =>
					prevIndex > 0 ? prevIndex - 1 : searchedPhotos.length - 1,
				);
			} else if (searchedPeoples.length) {
				setSelectedOptionIndex((prevIndex) =>
					prevIndex > 0 ? prevIndex - 1 : searchedPeoples.length - 1,
				);
			} else if (searchedReports.length) {
				setSelectedOptionIndex((prevIndex) =>
					prevIndex > 0 ? prevIndex - 1 : searchedReports.length - 1,
				);
			} else if (projectData.length) {
				setSelectedOptionIndex((prevIndex) =>
					prevIndex > 0 ? prevIndex - 1 : projectData.length - 1,
				);
			} else if (searchedStoreRoomLogs.length) {
				setSelectedOptionIndex((prevIndex) =>
					prevIndex > 0 ? prevIndex - 1 : searchedStoreRoomLogs.length - 1,
				);
			} else {
				setSelectedOptionIndex((prevIndex) =>
					prevIndex > 0 ? prevIndex - 1 : searchedStoreRoomPO.length - 1,
				);
			}
		} else if (e.keyCode === 40) {
			// Down arrow key
			e.preventDefault();
			if (searchedSheets.length) {
				setSelectedOptionIndex((prevIndex) =>
					prevIndex < searchedSheets.length - 1 ? prevIndex + 1 : 0,
				);
			} else if (searchedTasks.length) {
				setSelectedOptionIndex((prevIndex) =>
					prevIndex < searchedTasks.length - 1 ? prevIndex + 1 : 0,
				);
			} else if (searchedIssues.length) {
				setSelectedOptionIndex((prevIndex) =>
					prevIndex < searchedIssues.length - 1 ? prevIndex + 1 : 0,
				);
			} else if (searchedFiles.length) {
				setSelectedOptionIndex((prevIndex) =>
					prevIndex < searchedFiles.length - 1 ? prevIndex + 1 : 0,
				);
			} else if (searchedPhotos.length) {
				setSelectedOptionIndex((prevIndex) =>
					prevIndex < searchedPhotos.length - 1 ? prevIndex + 1 : 0,
				);
			} else if (searchedPeoples.length) {
				setSelectedOptionIndex((prevIndex) =>
					prevIndex < searchedPeoples.length - 1 ? prevIndex + 1 : 0,
				);
			} else if (searchedReports.length) {
				setSelectedOptionIndex((prevIndex) =>
					prevIndex < searchedReports.length - 1 ? prevIndex + 1 : 0,
				);
			} else if (projectData.length) {
				setSelectedOptionIndex((prevIndex) =>
					prevIndex < projectData.length - 1 ? prevIndex + 1 : 0,
				);
			} else if (searchedStoreRoomLogs.length) {
				setSelectedOptionIndex((prevIndex) =>
					prevIndex < searchedStoreRoomLogs.length - 1 ? prevIndex + 1 : 0,
				);
			} else {
				setSelectedOptionIndex((prevIndex) =>
					prevIndex < searchedStoreRoomPO.length - 1 ? prevIndex + 1 : 0,
				);
			}
		}
	};

	const handleBlurEvent = (e) => {
		setTimeout(() => {
			if (typeof props.storeRoollogTextHandle != 'function') {
				// setSearchString('');
			}
		}, 100);
		setIsOptionOpen(false);
	};

	const handleInputClick = () => {
		setIsOptionOpen(!isOptionOpen);
	};

	return (
		<>
			<InputGroup className="toolbar-search toolbar-line-after">
				<InputGroup.Text>
					<i className="fas fa-search text-secondary"></i>
				</InputGroup.Text>
				<OverlayTrigger
					trigger="focus"
					show={isOptionOpen}
					placement="bottom"
					onToggle={() => {
						setIsOptionOpen(isOptionOpen);
						setSelectedOptionIndex(-1);
					}}
					overlay={
						<div
							style={{
								zIndex: '111',
								width: '220px',
								maxHeight: '200px',
								overflow: 'auto',
								background: 'white',
							}}
							className="p-2 lf-task-left shadow">
							{dataSource.task ? (
								searchedTasks?.length > 0 ? (
									<>
										<div className="fs-6 fw-bolder rounded-3 lf-task-serch-color mb-2 p-1">
											{tasks?.text}
										</div>

										<ul className="task-lf">
											{searchedTasks?.map((t, k) => {
												const isSelected = k === selectedOptionIndex;
												return (
													<li
														key={k}
														className={`lf-layout-profile-menu dropdown-item ${
															isSelected ? 'selected' : ''
														}`}
														onClick={() => setSelectedOptionIndex(k)}
														ref={isSelected ? scrollToRef : null}>
														{' '}
														<i className="fas fa-tasks me-2"></i>
														<a
															href={`/tasks/${project_id}/${t?._id}?v=${task_view_type}`}>
															#{t?.task_no} {t?.title}{' '}
															{t?.assigee?.length > 0 ? (
																<>
																	by{' '}
																	{t?.assigee?.map(
																		(u) => u.first_name + ' ' + u.last_name,
																	)}
																</>
															) : (
																''
															)}
														</a>
													</li>
												);
											})}
										</ul>
									</>
								) : (
									<h6 className="text-center">{no_task?.text}</h6>
								)
							) : (
								''
							)}

							{dataSource.issues ? (
								searchedIssues?.length > 0 ? (
									<>
										<div className="fs-6 fw-bolder rounded-3 lf-task-serch-color mb-2  p-1">
											{issues?.text}
										</div>

										<ul className="task-lf">
											{searchedIssues?.map((t, k) => {
												const isSelected = k === selectedOptionIndex;
												return (
													<li
														key={k}
														className={`lf-layout-profile-menu dropdown-item ${
															isSelected ? 'selected' : ''
														}`}
														onClick={() => setSelectedOptionIndex(k)}
														ref={isSelected ? scrollToRef : null}
														// className="lf-layout-profile-menu dropdown-item"
													>
														{' '}
														<i className="fa-solid fa-triangle-exclamation me-2"></i>
														<a href={`/issues/${project_id}/${t?._id}`}>
															#{t?.issue_no} {t?.title}{' '}
															{t?.assigee?.length > 0 ? (
																<>
																	by{' '}
																	{t?.assigee?.map(
																		(u) => u.first_name + ' ' + u.last_name,
																	)}
																</>
															) : (
																''
															)}
														</a>
													</li>
												);
											})}
										</ul>
									</>
								) : (
									<h6 className="text-center">{no_task?.text}</h6>
								)
							) : (
								''
							)}

							{dataSource.sheet ? (
								searchedSheets?.length > 0 ? (
									<>
										<div className="fs-6 fw-bolder rounded-3 lf-task-serch-color mb-2  p-1">
											{sheets?.text}
										</div>

										<ul className="task-lf">
											{searchedSheets?.map((t, k) => {
												const isSelected = k === selectedOptionIndex;
												return (
													<Link to={`/sheets/${project_id}/sheetInfo/${t._id}`}>
														<li
															key={k}
															className={`lf-layout-profile-menu dropdown-item ${
																isSelected ? 'selected' : ''
															}`}
															onClick={() => setSelectedOptionIndex(k)}
															ref={isSelected ? scrollToRef : null}>
															<img
																alt="livefield"
																className={`me-1`}
																src="/images/plan_black.svg"></img>{' '}
															{/* <i className="fas fa-tags me-2"></i> */}
															{t?.sheet_no}
															{t?.description ? ` - ${t?.description}` : ''}
														</li>
													</Link>
												);
											})}
										</ul>
									</>
								) : (
									<h6 className="text-center">{no_plans?.text}</h6>
								)
							) : (
								''
							)}
							{dataSource.people ? (
								searchedPeoples?.length > 0 ? (
									<>
										<div className="fs-6 fw-bolder rounded-3 lf-task-serch-color mb-2  p-1">
											{Peoples?.text}
										</div>

										<ul className="task-lf ">
											{searchedPeoples.map((u, k) => {
												const isSelected = k === selectedOptionIndex;
												return (
													<li
														key={k}
														onClick={() => {
															if (manageTaskFilter) {
																manageTaskFilter('assignee', u._id);
															}
															setSearchString('');
															setSelectedOptionIndex(k);
															const selectedRecordId = searchedPeoples[k];
															props.handlePeopleModal(selectedRecordId);
														}}
														className={`lf-layout-profile-menu dropdown-item ${
															isSelected ? 'selected' : ''
														}`}
														ref={isSelected ? scrollToRef : null}>
														<i className="fas fa-user m-1"></i> {u.first_name}{' '}
														{u.last_name}
													</li>
												);
											})}
										</ul>
									</>
								) : (
									<h6 className="text-center">{no_user?.text}</h6>
								)
							) : (
								''
							)}
							{dataSource.report ? (
								searchedReports?.length > 0 ? (
									<>
										<div className="fs-6 fw-bolder rounded-3 lf-task-serch-color mb-2  p-1">
											{reports?.text}
										</div>

										<ul className="task-lf ">
											{searchedReports.map((u, k) => {
												const datet = u?.final_date
													?.filter((x) => moment(x).toDate() < new Date())
													.slice(-1);

												const isSelected = k === selectedOptionIndex;

												return (
													<li
														key={k}
														// className="lf-layout-profile-menu dropdown-item lf-link-cursor"
														className={`lf-layout-profile-menu dropdown-item lf-link-cursor ${
															isSelected ? 'selected' : ''
														}`}
														ref={isSelected ? scrollToRef : null}
														onClick={() => {
															setSelectedOptionIndex(k);
															if (u?.report_type === 'survey report') {
																window.location.href = `/reports/${project_id}/${
																	u?.log_name
																}/${u?._id}?${u?.log_date}=${moment(
																	datet[0],
																).format('YYYY-MM-DD')}`;
															} else {
																window.location.href = `/reports/${project_id}/${
																	u?.log_name
																}/${u?._id}?${u?.log_date}=${moment(
																	new Date(),
																).format('YYYY-MM-DD')}`;
															}
														}}>
														{' '}
														<i className="fas fa-file me-2"></i>
														{u.description}
													</li>
												);
											})}
										</ul>
									</>
								) : (
									<h6 className="text-center">{no_report?.text}</h6>
								)
							) : (
								''
							)}
							{dataSource.file ? (
								searchedFiles?.length > 0 ? (
									<>
										<div className="fs-6 fw-bolder rounded-3 lf-task-serch-color mb-2  p-1">
											{files?.text}
										</div>

										<ul className="task-lf ">
											{searchedFiles.map((u, k) => {
												const isSelected = k === selectedOptionIndex;
												return (
													<li
														key={k}
														className={`lf-layout-profile-menu dropdown-item ${
															isSelected ? 'selected' : ''
														}`}
														onClick={() => setSelectedOptionIndex(k)}
														ref={isSelected ? scrollToRef : null}>
														{' '}
														<i className="fas fa-file me-2"></i>
														<a href={u?.file} target="_blank">
															{decodeURI(u?.file_name)}
														</a>
													</li>
												);
											})}
										</ul>
									</>
								) : (
									<h6 className="text-center">{no_files?.text}</h6>
								)
							) : (
								''
							)}
							{dataSource.photo ? (
								searchedPhotos?.length > 0 ? (
									<>
										<div className="fs-6 fw-bolder rounded-3 lf-task-serch-color mb-2  p-1">
											{photos?.text}
										</div>

										<ul className="task-lf ">
											{searchedPhotos.map((u, k) => {
												const isSelected = k === selectedOptionIndex;
												return (
													<li
														key={k}
														className={`lf-layout-profile-menu dropdown-item ${
															isSelected ? 'selected' : ''
														}`}
														ref={isSelected ? scrollToRef : null}
														onClick={() => {
															handleImageViewer({
																url: u?.file,
																imageCaption: u?.description,
																imageTitle: u?.title,
															});
															setSelectedOptionIndex(k);
														}}>
														{' '}
														<i className="fas fa-image me-2"></i>
														{u?.title}
													</li>
												);
											})}
										</ul>
									</>
								) : (
									<h6 className="text-center">{no_photo?.text}</h6>
								)
							) : (
								''
							)}
							{dataSource.meeting ? (
								searchedMeetings?.length > 0 ? (
									<>
										<div className="fs-6 fw-bolder rounded-3 lf-task-serch-color mb-2  p-1">
											{meetings?.text}
										</div>

										<ul className="task-lf ">
											{searchedMeetings.map((u, k) => {
												return (
													<li
														key={k}
														className="lf-layout-profile-menu dropdown-item">
														{' '}
														<i className="fas fa-group me-2"></i>
														{u.meeting_name}
													</li>
												);
											})}
										</ul>
									</>
								) : (
									<h6 className="text-center">{no_meeting?.text}</h6>
								)
							) : (
								''
							)}
							{dataSource.template ? (
								searchedTemplates?.length > 0 ? (
									<>
										<div className="fs-6 fw-bolder rounded-3 lf-task-serch-color mb-2  p-1">
											{templates?.text}
										</div>

										<ul className="task-lf ">
											{searchedTemplates.map((u, k) => {
												return (
													<li
														key={k}
														className="lf-layout-profile-menu dropdown-item">
														{' '}
														<i className="fas fa-group me-2"></i>
														{u.title}
													</li>
												);
											})}
										</ul>
									</>
								) : (
									<h6 className="text-center">{no_templates?.text}</h6>
								)
							) : (
								''
							)}
							{dataSource.materiallog ? (
								searchedMaterialLogs?.length > 0 ? (
									<>
										<div className="fs-6 fw-bolder rounded-3 lf-task-serch-color mb-2  p-1">
											{material_logs?.text}
										</div>

										<ul className="task-lf ">
											{searchedMaterialLogs.map((u, k) => {
												return (
													<li
														key={k}
														className="lf-layout-profile-menu dropdown-item">
														{' '}
														<i className="fas fa-group me-2"></i>
														{u.type}
													</li>
												);
											})}
										</ul>
									</>
								) : (
									<h6 className="text-center">{no_material?.text}</h6>
								)
							) : (
								''
							)}
							{dataSource.storeroomlog ? (
								searchedStoreRoomLogs?.length > 0 ? (
									<>
										<div className="fs-6 fw-bolder rounded-3 lf-task-serch-color mb-2  p-1">
											{store_room_logs?.text}
										</div>

										<ul className="task-lf ">
											{searchedStoreRoomLogs.map((u, k) => {
												const isSelected = k === selectedOptionIndex;
												return (
													<li
														onClick={() => {
															setSelectedOptionIndex(k);
														}}
														key={k}
														className={`lf-layout-profile-menu dropdown-item ${
															isSelected ? 'selected' : ''
														}`}
														ref={isSelected ? scrollToRef : null}>
														<i className="fas fa-group me-2"></i>
														{u.type}
													</li>
												);
											})}
										</ul>
									</>
								) : (
									<h6 className="text-center">{no_storeroom?.text}</h6>
								)
							) : (
								''
							)}
							{dataSource.storeroomPO ? (
								searchedStoreRoomPO?.length > 0 ? (
									<>
										<div className="fs-6 fw-bolder rounded-3 lf-task-serch-color mb-2 p-1">
											{store_room_po?.text}
										</div>

										<ul className="task-lf ">
											{searchedStoreRoomPO.map((u, k) => {
												const isSelected = k === selectedOptionIndex;
												return (
													<>
														{u?.is_locked === true ? (
															<li
																onClick={() => {
																	props.setSelectetdPoOrderDetails(u);
																	setSelectedOptionIndex(k);
																}}
																key={k}
																className={`lf-layout-profile-menu dropdown-item ${
																	isSelected ? 'selected' : ''
																}`}
																ref={isSelected ? scrollToRef : null}>
																{' '}
																<i className="fas fa-store me-2" />
																{u?.order_no}
															</li>
														) : (
															<li
																key={k}
																onClick={() => props.setSelectetdPoOrder(u)}
																className="lf-layout-profile-menu dropdown-item">
																{' '}
																<i className="fas fa-store me-2" />
																{u?.order_no}
															</li>
														)}
													</>
												);
											})}
										</ul>
									</>
								) : (
									<h6 className="text-center">{no_storeroom_po?.text}</h6>
								)
							) : (
								''
							)}
							{dataSource.projects ? (
								projectData?.length > 0 ? (
									<>
										<div className="fs-6 fw-bolder rounded-3 lf-task-serch-color mb-2  p-1">
											{project?.text}
										</div>

										<ul className="task-lf ">
											{projectData.map((u, k) => {
												const isSelected = k === selectedOptionIndex;
												return (
													<>
														<Link to={'/dashboard/' + u._id}>
															<li
																key={k}
																// className="lf-layout-profile-menu dropdown-item"
																className={`lf-layout-profile-menu dropdown-item ${
																	isSelected ? 'selected' : ''
																}`}
																onClick={() => {
																	setSelectedOptionIndex(k);
																}}
																ref={isSelected ? scrollToRef : null}>
																{u?.code ? `${u?.code} - ` : ''}
																{u.name}
															</li>
														</Link>
													</>
												);
											})}
										</ul>
									</>
								) : (
									<h6 className="text-center">{no_project?.text}</h6>
								)
							) : (
								''
							)}
						</div>
					}>
					{/* <i className="fas fa-search lf-all-icon-size p-0 mt-2"></i>                     */}
					<input
						type="text"
						className="d-block form-control bg-transparent border border-0 ps-0"
						placeholder={search?.text}
						onBlur={handleBlurEvent}
						onClick={handleInputClick}
						value={searchString}
						onKeyDown={handleKeyDown}
						onKeyUp={handleKeyUp}
						onKeyEsa
						onChange={handleInputChange}
					/>
				</OverlayTrigger>
			</InputGroup>
		</>
	);
};

export default withRouter(CustomSearch);
