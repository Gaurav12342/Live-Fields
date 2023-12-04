import React, { Fragment } from 'react';
import Layout from '../../components/layout';
// import ReactQuill from 'react-quill';
import TextareaAutosize from 'react-textarea-autosize';
// import '../../../node_modules/react-quill/dist/quill.snow.css';
// import '../../App.css';
import {
	FormControl,
	InputGroup,
	Overlay,
	Dropdown,
	Modal,
	Toast,
} from 'react-bootstrap';
import getUserId, { getSiteLanguageData, imageExtensions } from '../../commons';
import { CHAT_URL } from '../../commons/constants';
import Loading from '../../components/loadig';
import Upload from '../../components/upload';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
	setLightBoxImageData,
	setLightBoxImageDefaultUrl,
	toggleLightBoxView,
} from '../../store/actions/imageLightBox';
import { connect } from 'react-redux';
import withRouter from '../../components/withrouter';
import { clearUploadFile } from '../../store/actions/Utility';
import { loadChat } from '../../store/actions/projects';
const { io } = require('socket.io-client');

// const socket = io("ws://localhost:2002", {
//     auth: {
//         token: window.localStorage.getItem('token')
//     },
// });

// import getUserId from '../../commons';
// const userId = getUserId()
// import { People, getAllRoleWisePeople } from '../../store/actions/people';
// const _id = window.localStorage.getItem('_id')
const FILE_TYPE_GROUP = {
	image: [
		'png',
		'jpeg',
		'jpg',
		'gif',
		'bmp',
		'tiff',
		'tif',
		'tn3',
		'tp3',
		'svg',
		'webp'
	],
	audio: ['avi', 'ogg', 'wav', 'mp3'],
	video: ['webm', 'mov', 'mp4', 'mpg', 'f4v', 'wmv', 'flv', 'mkv'],
	other: [
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
	],
	compress: ['7z', 'zip', 'zipx', 'rar'],
	presantation: ['ppt', 'pptx', 'pps', 'key', 'odp'],
	spreadsheet: ['xlsx', 'xls', 'xltx', 'xlt', 'xlsm', 'ods', 'numbers', 'csv'],
	doc: ['doc', 'docx', 'pages', 'odt', 'odf', 'txt', 'rtf'],
	pdf: ['pdf'],
};
const FILE_ICONS = {
	audio:
		'https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/Audio.png',
	other:
		'https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/Otherfiles.png',
	spreadsheet:
		'https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/Spreadsheet.png',
	compress:
		'https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/compress.png',
	doc: 'https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/doc.png',
	image:
		'https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/image.png',
	pdf: 'https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/pdf.png',
	presantation:
		'https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/presantation.png',
	video:
		'https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/video.png',
};
class Chat extends React.Component {
	constructor(props) {
		super(props);
		this.socket = io(CHAT_URL);
		this.project_id = this.props.router?.params?.project_id;
		this.userId = getUserId();
		this.loading = false;
		this.chatBottomRef = React.createRef();
		this.overlayRef = React.createRef();
		this.chatSelectRef = React.createRef();
		this.loadRef = React.createRef();
		this.state = {
			data: {},
			newMessage: '',
			newMessageFiles: [],
			loading: true,
			show: false,
			target: null,
			image: null,
			project_users: [],
			plan_list: [],
			chatShow: this.props.chatShow || false,
			page:{
				page: 0,
				skip:10
			},
			isLoading : false
		};
	}
	// const { project_id } = useParams();
	componentDidMount() {
		this.socket.on('connect', () => {
			this.socket.emit('join', {
				name: this.userId,
				room: this.props.room || this.project_id,
				type: this.props.chat_from || 'project',
			});
			this.socket.on('usersList', (d) => {
				if (d?.project_users) {
					this.setState(
						{
							data: d,
							project_users: d.project_users,
							plan_list: d.plan_list,
							loading: false
						},
						() => this.executeScroll(),
					);
				}
			});
			this.socket.on('newMessage', (d) => {
				const messages = [...this.state.data.messages];
				messages.push({
					...d,
					message: d.text,
					sender_id: d.from,
				});
				this.setState(
					{
						data: {
							...this.state.data,
							messages,
						},
					},
					() => this.executeScroll(),
				);
			});
		});
		this.socket.on('disconnect', () => {
			console.log(this.socket.connected, 'disconnected'); // false
		});
	}

	onScroll = () => {
		
		if (this.loadRef.current) {
		  const { scrollTop, scrollHeight, clientHeight } = this.loadRef.current;
		  if (scrollTop <= 10 && !this.loading) {
			this.loading = true;
			const pastScroll = scrollHeight;

			// DO SOMETHING WHAT YOU WANT
			this.props.dispatch(loadChat({
				name: this.userId,
				room: this.props.room || this.project_id,
				type: this.props.chat_from || 'project',
				page: this.state.page.page+1,
				skip: this.state.page.skip,
			},(resData)=>{
				
				if(resData.messages && resData.messages.length > 0){
					let newMsg = resData.messages.reverse();
					
					let messages = [...this.state.data.messages];

					newMsg.forEach((ele)=>{
						let check = messages.find((oc)=> oc._id === ele._id);
						if(!check || (check && !check._id)){
							messages.unshift(ele);
						}
					});


					this.setState(
						{
							data: {
								...this.state.data,
								messages,
							},
							page:{
								page:resData.page && resData.page.page ? resData.page.page : this.state.page.page+1, 
								skip : resData.page && resData.page.skip ? resData.page.skip : this.state.page.skip
							}
						},async ()=>{
							
							// this.loadRef.current.scrollTo(0, 100)
							// this.loadRef.current.scrollTop = 30;

							const currentScroll = (await this.loadRef.current.scrollHeight-pastScroll);
							await this.loadRef.current.scrollTo(0, currentScroll);
							setTimeout(()=>{
								this.loading = false;
							},100)
						}
					);
				}
				
			}));
			/* this.socket.emit('loadMore', {
				name: this.userId,
				room: this.props.room || this.project_id,
				type: this.props.chat_from || 'project',
				page: this.state.page.page+1,
				skip: this.state.page.skip,
			});
			this.setState({
				page:{
					page:this.state.page.page+1, 
					skip : 10
				}
			}) */
		  }else{
			this.loading = false;
		  }
		}
	};



	createMessage = () => {
		const { newMessage, newMessageFiles } = this.state;
		if (newMessageFiles.length === 0 && newMessage === '') {
			// alert('Enter The message');
			this.setState({
				show: true,
				toastShow: true,
			});
			return;
		}
		this.socket.emit('createMessage', {
			sender: this.userId,
			room: this.props.room || this.project_id,
			chat_from: this.props.chat_from || 'project',
			text: newMessage,
			files: newMessageFiles,
		});
		this.setState({
			newMessage: '',
			newMessageFiles: [],
		});
	};

	handleSuggestions = (e, suggetionValue) => {
		const { newMessage, show, data } = this.state;
		let updateShow = false;
		let suggestion = newMessage.split('@');
		const suggestionWord = suggestion[suggestion.length - 1];
		const stateToUpdate = {
			plan_list: [],
			project_users: [],
		};
		if (show) {
			stateToUpdate.plan_list = data?.plan_list.filter((p, k) => {
				return (
					p.sheet_no?.toLowerCase().includes(suggestionWord) ||
					suggestionWord === ''
				);
			});
			stateToUpdate.project_users = data?.project_users.filter((u, k) => {
				const first_name = u.first_name?.toLowerCase();
				const last_name = u.last_name?.toLowerCase();
				return (
					first_name.includes(suggestionWord) ||
					last_name.includes(suggestionWord) ||
					(first_name + ' ' + last_name).includes(suggestionWord) ||
					suggestionWord === ''
				);
			});
			updateShow = true;
			if (
				stateToUpdate.project_users.length === 0 &&
				stateToUpdate.plan_list.length === 0
			) {
				stateToUpdate.show = false;
				stateToUpdate.project_users = data.project_users;
				stateToUpdate.plan_list = data.plan_list;
			}
		}
		switch (e.type) {
			case 'keydown':
				if (e.key === 'Tab') {
					e.preventDefault();
					if (stateToUpdate.plan_list.length > 0) {
						stateToUpdate.newMessage =
							newMessage.slice(0, -suggestionWord.length) +
							stateToUpdate.plan_list[0].sheet_no;
						stateToUpdate.show = false;
					} else if (stateToUpdate.project_users.length > 0) {
						stateToUpdate.newMessage =
							newMessage.slice(0, -suggestionWord.length) +
							stateToUpdate.project_users[0].first_name +
							' ' +
							stateToUpdate.project_users[0].last_name;
						stateToUpdate.show = false;
					}
				}
				break;
			case 'click':
				if (suggestionWord.length > 0) {
					stateToUpdate.newMessage =
						newMessage.slice(0, -suggestionWord.length) + suggetionValue;
				} else {
					stateToUpdate.newMessage = newMessage + suggetionValue;
				}
				stateToUpdate.show = false;
				break;
		}
		if (e.key === '@') {
			if (show === false) {
				updateShow = true;
				stateToUpdate.show = true;
			}
		}

		if (updateShow === true) {
			this.setState(stateToUpdate);
		}
	};

	selectSuggestion = (val, e) => {
		// this.setState({
		//     newMessage: this.state.newMessage + val,
		//     show: false
		// })
		this.handleSuggestions(e, val);
	};

	executeScroll = () => {
		// if (!this.props.wrapperclassName) {
		if (this.chatBottomRef.scrollIntoView) {
			this.chatBottomRef.scrollIntoView();
		}
		// }
	};

	handleImageView = (val) => {
		// this.setState({
		//     image: val
		// })
		const images = [];
		this.state.data?.messages?.forEach((msg) => {
			if (msg?.files?.length > 0) {
				msg?.files.forEach((f) => {
					images.push(f);
				});
			}
		});
		this.props.dispatch(setLightBoxImageData(images));
		this.props.dispatch(toggleLightBoxView(true));
		this.props.dispatch(setLightBoxImageDefaultUrl(val));
	};

	toggleChatShow = () => {
		if(!this.state.chatShow){
			let chatIds = this.state.data?.messages?.filter(c=> c._id && Array.isArray(c.read_by) && !c.read_by.includes(this.userId));
			chatIds = chatIds?.map(c=>c._id);
			if(chatIds && chatIds.length){
				this.socket.emit('onRead', {
					read_by: this.userId,
					room: this.props.room || this.project_id,
					chat_from: this.props.chat_from || 'project',
					chat_id:chatIds
				});
			}
		}
		this.setState(
			{
				chatShow: !this.state.chatShow,
			},
			() => this.executeScroll(),
		);
	};

	getIconByType = (type) => {
		let groupType = '';
		const groups = Object.entries(FILE_TYPE_GROUP);
		for (let i = 0; i < groups.length; i++) {
			const group = groups[i];
			if (group[1].includes(type)) {
				groupType = group[0];
				break;
			}
		}

		if (!groupType) groupType = 'other';

		return FILE_ICONS[groupType];
	};

	handleEnterKey = (e) => {
		if (e.keyCode === 13 && !e.shiftKey) {
		  e.preventDefault();
		  this.createMessage()
		}
	  };

	render() {
		let lastId = '';
		const { chatShow } = this.state;
		const { wrapperclassName } = this.props;
		// if (this.state.loading) {
		//     // if (this.props.mode === 'component') {
		//     //     return ''
		//     // }
		//     return <Loading />
		// }
		this.executeScroll();
		const chatStyle = {
			height: this.props.height,
			overflowY: 'auto',
			overflowX: 'hidden',
			scrollbarWidth: 'none',
		};

		const unreadCount = this.state.data?.messages?.filter(msg=>{
			return msg && msg.read_by && msg.read_by.length > 0 && !msg.read_by.includes(this.userId)
		})?.length;
		
		if (this.props.mode === 'component') {
			const { enter_message_na } = getSiteLanguageData('chat');
			return (
				<div
					className={
						wrapperclassName ||
						`lf-chat-component-wrapper ${chatShow ? '' : 'closed'}`
					}>
					<div className="container px-2">
						{!wrapperclassName ? (
							<div className={` lf-chat-toggle ${chatShow ? 'd-none' : ''}`}>
								<div
									className="py-2 lf-link-cursor"
									title={this.props.title}
									onClick={this.toggleChatShow}>
									{/* {this.props.title} */}
									{/* <span className="float-end"> */}
									<i
										className="far fa-comment-dots"
										aria-hidden="true"
										title={this.props.title}></i>
									{
											unreadCount && unreadCount > 0 && (
										<span className={`chat-unread-badge`}>{unreadCount}</span>
									)
										}
									{/* </span> */}
								</div>
							</div>
						) : (
							''
						)}
						<div className={`row ${chatShow ? '' : 'd-none'}`}>
							{!wrapperclassName ? (
								<div
									className="col-12 ps-4 pe-2 py-3 white-box-label"
									style={{ boxShadow: '0 1px 2px RGBA(0,0,0,0.1),0 -1px RGBA(0,0,0,0.1) inset,0 2px 1px -1px rgba(255, 255, 255, 0.5) inset'}}>
									{this.props.title}
									<span
										className="float-end theme-btnbg theme-secondary rounded lf-link-cursor mx-4"
										onClick={this.toggleChatShow}>
										<i
											className="fa fa-times lf-sheet-icon"
											aria-hidden="true"></i>
									</span>
								</div>
							) : (
								''
							)}
							<div className="col-sm-12 ee" onScroll={(e)=>this.onScroll()} ref={this.loadRef}  style={chatStyle}>
								{this.state.data?.messages?.map((msg, k) => {
									let showImg = true;
									if (lastId === msg.sender_id) {
										showImg = false;
									}
									lastId = msg.sender_id;
									if (msg.sender_id === this.userId) {
										return (
											<Fragment key={msg._id || k}>
												<div className="w-100 mt-2 text-end">
													<div className="d-block ms-5">
														{msg?.files?.length > 0
															? msg?.files.map((f, fk) => {
																	const fname = f
																		.split('/')
																		.slice(-1)
																		.join('.');
																	const fext = fname
																		.split('.')
																		.slice(-1)
																		.join('.');
																	let iconURL = this.getIconByType(
																		f.split('.').pop(),
																	);
																	return (
																		<>
																			<span
																				key={fk+msg._id}
																				className="lf-chat-img p-1 d-inline-block">
																				{imageExtensions.some(
																					(ie) => ie === fext?.toLowerCase(),
																				) ? (
																					<div
																						src={f}
																						className="lf-chat-img-bg"
																						style={{
																							backgroundImage: `url(${f})`,
																						}}
																						onClick={() =>
																							this.handleImageView(f)
																						}
																						width="100"></div>
																				) : (
																					<>
																						<img
																							alt="livefield"
																							src={iconURL}
																							height="25px"
																						/>
																						&nbsp;
																						<a href={f} target="_blank">
																							{decodeURI(fname)}
																						</a>
																					</>
																				)}
																			</span>
																			<small className="d-block chat-msg-time">
																				{moment(msg.createdAt).format(
																					'DD MMM, HH:mm',
																				)}
																			</small>
																		</>
																	);
															  })
															: null}
														{msg.message && msg.message !== ' ' ? (
															<>
																<div className="py-2 text-end mb-1 chat-msg-wrapper">
																	<pre
																		className="card lf-chat-msg-theme-color border-0 p-2 mb-1"
																		dangerouslySetInnerHTML={
																			{__html: msg.message.trim()}
																		}
																	>
																		
																	</pre>
																	<small className="d-block chat-msg-time ps-2">
																		{moment(msg.createdAt).format(
																			'DD MMM, HH:mm',
																		)}
																	</small>
																</div>
															</>
														) : null}
													</div>
												</div>
												<div className="clearfix"></div>
											</Fragment>
										);
									} else {
										return (
											<Fragment key={k}>
												<div className="w-100 mt-2 text-start">
													<div className="d-block float-start">
														{showImg ? (
															<img
																alt="livefield"
																src={
																	msg.user_data?.profile ||
																	'/images/user-solid.svg'
																}
																className="image-sm-chat"
															/>
														) : (
															' '
														)}
													</div>
													<div className="d-block ms-5">
														{showImg ? (
															<small className="theme-color d-block">
																{msg.user_data?.first_name}{' '}
																{msg.user_data?.last_name}
															</small>
														) : (
															' '
														)}
														{msg?.files?.length > 0
															? msg?.files.map((f, fk) => {
																	const fname = f
																		.split('/')
																		.slice(-1)
																		.join('.');
																	const fext = fname
																		.split('.')
																		.slice(-1)
																		.join('.');
																	let iconURL = this.getIconByType(
																		f.split('.').pop(),
																	);
																	return (
																		<>
																			<span
																				key={msg._id+'files'+fk}
																				className="lf-chat-img p-1 d-inline-block">
																				{imageExtensions.some(
																					(ie) => ie === fext?.toLowerCase(),
																				) ? (
																					<div
																						src={f}
																						className="lf-chat-img-bg"
																						style={{
																							backgroundImage: `url(${f})`,
																						}}
																						onClick={() =>
																							this.handleImageView(f)
																						}
																						width="100"></div>
																				) : (
																					<>
																						<img
																							alt="livefield"
																							src={iconURL}
																							height="25px"
																						/>
																						&nbsp;
																						<a href={f} target="_blank">
																							{decodeURI(fname)}
																						</a>
																					</>
																				)}
																			</span>
																			<small className="d-block chat-msg-time">
																				{moment(msg.createdAt).format(
																					'DD MMM, HH:mm',
																				)}
																			</small>
																		</>
																	);
															  })
															: null}
														{msg.message && msg.message !== ' ' ? (
															<>
																<div className="py-2 text-justify chat-msg-wrapper">
																	<pre className="card lf-chat-msg border-0 p-2 mb-1"
																		dangerouslySetInnerHTML={
																			{__html: msg.message.trim()}
																		}
																	>
																		
																	</pre>
																	<small className="d-block chat-msg-time ps-2">
																		{moment(msg.createdAt).format(
																			'DD MMM, HH:mm',
																		)}
																	</small>
																</div>
															</>
														) : null}
													</div>
												</div>
												<div className="clearfix"></div>
											</Fragment>
										);
									}
								})}

								<div ref={(ref) => (this.chatBottomRef = ref)}></div>
							</div>
						</div>
						<div
							className={`row px-2 pb-2 ${chatShow ? '' : 'd-none'}`}
							style={{"position":"relative"}}
							ref={this.overlayRef}>
							<Overlay
								// show={true || this.state.show}
								show={true}
								target={this.overlayRef}
								placement="bottom-start"
								container={this.overlayRef}
								// containerPadding={20}
							>
								{({ placement, arrowProps, show: _show, popper, ...props }) => (
									<div {...props} className="ps-2">
										{this.state.toastShow ? (
											<Toast
												onClose={() =>
													this.setState({ toastShow: false, show: false })
												}
												show={this.state.toastShow}
												delay={1000}
												autohide>
												<Toast.Body className="bg-dark text-white">
													{enter_message_na?.text}
												</Toast.Body>
											</Toast>
										) : (
											<></>
										)}
									</div>
								)}
							</Overlay>
							<Dropdown
								drop="up"
								flip={'false'}
								className="w-50"
								size="lg"
								show={this.state.show}>
								<Dropdown.Toggle
									ref={(ref) => (this.chatSelectRef = ref)}
									style={{
										fontSize: '0px',
										padding: '0',
										visibility: 'hidden',
										margin: 0,
										lineHeight: 0,
									}}
								/>
								<Dropdown.Menu
									size="lg"
									style={{ maxHeight: '160px', overflowY: 'auto' }}>
									{this.state.plan_list.map((p, k) => {
										return (
											<Dropdown.Item
												key={k+p.sheet_no}
												onClick={(e) =>
													this.selectSuggestion(p.sheet_no, e)
												}>
												{p.sheet_no}
											</Dropdown.Item>
										);
									})}
									{this.state.project_users.map((u, k) => {
										return (
											<Dropdown.Item
												key={k+"user"+u?._id}
												onClick={(e) =>
													this.selectSuggestion(
														`${u.first_name} ${u.last_name}`,
														e,
													)
												}>{`${u.first_name} ${u.last_name}`}</Dropdown.Item>
										);
									})}
								</Dropdown.Menu>
							</Dropdown>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									this.createMessage();
								}}>
								<div className='d-flex align-items-end'>
									<div className='pb-3'>
										<Upload
											fileKey={this.props?.room || this.project_id}
											fileType={(this.props.chat_from || 'project') + '_chat'}
											setIsLoading={(val) => this.setState({ isLoading: val })}
											isLoading={this.state.isLoading}
											onFinish={(file, name, type) => {
												if (
													type ===
													(this.props.chat_from || 'project') + '_chat'
												) {
													this.setState(
														{
															newMessageFiles: [file],
														},
														() => this.createMessage(),
													);
												}
											}}>
											{/* <InputGroup.Text><i className="fas fa-camera theme-color"></i></InputGroup.Text> */}
										</Upload>
									</div>

									<InputGroup className="align-self-stretch mx-1">
										<TextareaAutosize
											style={{width:'100%',paddingRight:'38px'}}
											className="quill"
											value={this.state.newMessage}
											minRows={2}
											maxRows={4}
											onChange={(mh)=>{
												this.setState({ newMessage: mh.target.value })
											}}
											onKeyDown={this.handleEnterKey}
											// modules={{
											// 	toolbar:[

											// 	]
											// }}
											// theme={`bubble`}
										/>
										{/* <FormControl
											as="textarea"
											placeholder="Type a messege"
											value={this.state.newMessage}
											autoComplete="off"
											onChange={(e) =>
												this.setState({ newMessage: e.target.value })
											}
											// onKeyPress={e => this.handleSuggestions(e)}
											onKeyUp={(e) => this.handleSuggestions(e)}
											onKeyDown={(e) => this.handleSuggestions(e)}
										/> */}
										<div className='chat-buttons message-send-button pointer'>
											<InputGroup.Text className='msg-send' onClick={() => this.createMessage()}>
												<i className="fa-regular fa-paper-plane lf-sheet-icon"></i>
											</InputGroup.Text>
										</div>
									</InputGroup>

								</div>

								
								
								
								
							</form>
						</div>
					</div>
				</div>
			);
		}
		const { chat, dashboard, enter_message_na } = getSiteLanguageData('chat');
		return (
			<Layout>
				<Modal
					centered
					dialogClassName="lf-chat-img-modal"
					show={!!this.state.image}
					onHide={() => this.handleImageView(null)}>
					{/* <Modal.Title>Modal heading</Modal.Title> */}
					<Modal.Header closeButton className="p-2" />
					<Modal.Body className="p-1">
						{/* <Modal.Header closeButton className="p-2" /> Shifted to above body by akshay */}
						<img
							alt="livefield"
							src={this.state.image}
							className="img-fluid"
							style={{ maxHeight: Math.max(window.innerHeight, 550) - 200 }}
						/>
					</Modal.Body>
				</Modal>
				<div id="page-content-wrapper">
					<section className="lf-dashboard-toolbar">
						<div className="container">
							<div className="row">
								<div className="col-sm-12 lf-sheets-filenm-title-res">
									<h3 className="ms-5">{chat?.text}</h3>
								</div>
							</div>
						</div>
					</section>
					<div className="container">
						<div className="col-sm-12 pt-4">
							<div className="row">
								<div className="col-sm-5"></div>
							</div>
						</div>
					</div>
					<div className="container bg-white">
						<div className="row ">
							<div
								className="col-sm-12 main-area mx-3"
								style={{
									height: Math.max(window.innerHeight, 750) - 250 + 'px',
									overflowY: 'scroll',
									overflowX: 'hidden',
								}}>
								{this.state.data?.messages?.map((msg, k) => {
									let showImg = true;
									if (lastId === msg.sender_id) {
										showImg = false;
									}
									lastId = msg.sender_id;
									if (msg.sender_id === this.userId) {
										return (
											<Fragment key={k+"msg"+msg._id}>
												<div className="w-100 mt-2 text-end">
													<div className="d-block ms-5">
														{msg?.files?.length > 0
															? msg?.files.map((f, fk) => (
																	<span
																		className="lf-chat-img p-1 d-inline-block"
																		key={fk+"file"+k}>
																		<div
																			src={f}
																			className="lf-chat-img-bg"
																			style={{ backgroundImage: `url(${f})` }}
																			onClick={() => this.handleImageView(f)}
																			width="100"
																			key={fk}></div>
																	</span>
															  ))
															: null}
														{msg.message && msg.message !== ' ' ? (
															<>
																<div className="py-2 text-end">
																	<pre className="lf-chat-msg-theme-color p-2">
																		{msg.message.trim()}
																	</pre>
																</div>
																<small className="d-block">
																	{moment(msg.createdAt).fromNow()}
																</small>
															</>
														) : null}
													</div>
												</div>
												<div className="clearfix"></div>
											</Fragment>
										);
									} else {
										return (
											<Fragment key={k}>
												<div className="w-100 mt-2 text-start">
													<div className="d-block float-start">
														{showImg ? (
															<img
																alt="livefield"
																src={
																	msg.user_data?.profile ||
																	'/images/user-solid.svg'
																}
																className="image-sm"
															/>
														) : (
															' '
														)}
													</div>
													<div className="d-block ms-5">
														{showImg ? (
															<small className="theme-color d-block">
																{msg.user_data?.first_name}{' '}
																{msg.user_data?.last_name}
															</small>
														) : (
															' '
														)}
														{msg?.files?.length > 0
															? msg?.files.map((f, fk) => (
																	<span
																		key={fk+"file"+msg?.sender_id}
																		className="lf-chat-img p-1 d-inline-block">
																		<div
																			src={f}
																			className="lf-chat-img-bg"
																			style={{ backgroundImage: `url(${f})` }}
																			onClick={() => this.handleImageView(f)}
																			width="100"
																			key={fk}></div>
																	</span>
															  ))
															: null}
														{msg.message && msg.message !== ' ' ? (
															<>
																<div className="py-2 text-justify">
																	<pre className="lf-chat-msg p-2">
																		{msg.message.trim()}
																	</pre>
																</div>
																<small className="d-block">
																	{moment(msg.createdAt).fromNow()}
																</small>
															</>
														) : null}
													</div>
												</div>
												<div className="clearfix"></div>
											</Fragment>
										);
									}
								})}

								<div ref={(ref) => (this.chatBottomRef = ref)}></div>
							</div>
						</div>
						<div className="col-sm-12 p-2" ref={this.overlayRef}>
							<Overlay
								// show={true || this.state.show}
								show={'true'}
								target={this.overlayRef}
								placement="top-start"
								container={this.overlayRef}
								// containerPadding={20}
							>
								{({ placement, arrowProps, show: _show, popper, ...props }) => (
									<div {...props} className="w-50 ps-2">
										{this.state.toastShow ? (
											<Toast
												onClose={() =>
													this.setState({ toastShow: false, show: false })
												}
												show={this.state.toastShow}
												delay={1000}
												autohide>
												<Toast.Body className="bg-dark text-white">
													{enter_message_na?.text}
												</Toast.Body>
											</Toast>
										) : (
											<Dropdown
												drop="up"
												className="w-50"
												size="lg"
												show={this.state.show}>
												<Dropdown.Toggle
													ref={(ref) => (this.chatSelectRef = ref)}
													style={{
														fontSize: '0px',
														padding: '0',
														visibility: 'hidden',
													}}
												/>
												<Dropdown.Menu size="lg">
													{this.state.plan_list.map((p, k) => {
														return (
															<Dropdown.Item
																key={k+p.sheet_no}
																onClick={(e) =>
																	this.selectSuggestion(p.sheet_no, e)
																}>
																{p.sheet_no}
															</Dropdown.Item>
														);
													})}
													{this.state.project_users.map((u, k) => {
														return (
															<Dropdown.Item
																key={k + u._id}
																onClick={(e) =>
																	this.selectSuggestion(
																		`${u.first_name} ${u.last_name}`,
																		e,
																	)
																}>{`${u.first_name} ${u.last_name}`}</Dropdown.Item>
														);
													})}
												</Dropdown.Menu>
											</Dropdown>
										)}
									</div>
								)}
							</Overlay>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									this.createMessage();
								}}>
								<InputGroup className="mb-3 ">
									{/* <FormControl
										as="textarea"
										placeholder="Type a messege"
										value={this.state.newMessage}
										autoComplete="off"
										onChange={(e) =>
											this.setState({ newMessage: e.target.value })
										}
										// onKeyPress={e => this.handleSuggestions(e)}
										onKeyUp={(e) => this.handleSuggestions(e)}
										onKeyDown={(e) => this.handleSuggestions(e)}
									/> */}
									<Upload
										fileKey={this.project_id}
										fileType={'project_chat'}
										setIsLoading={(val) => this.setState({ isLoading: val })}
										isLoading={this.state.isLoading}
										onFinish={(file) => {
											this.setState(
												{
													newMessageFiles: [file],
												},
												() => this.createMessage(),
											);
										}}>
										{/* <InputGroup.Text><i className="fas fa-camera theme-color"></i></InputGroup.Text> */}
									</Upload>
									<InputGroup.Text onClick={() => this.createMessage()}>
												<i className="fa-regular fa-paper-plane lf-sheet-icon"></i>
									</InputGroup.Text>
								</InputGroup>
							</form>
						</div>
					</div>
				</div>
			</Layout>
		);
	}
}

Chat.propTypes = {
	height: PropTypes.string,
	room: PropTypes.string,
	chat_from: PropTypes.string,
	title: PropTypes.string,
	mode: PropTypes.string,
	chatShow: PropTypes.bool,
};
export default connect()(withRouter(Chat));
