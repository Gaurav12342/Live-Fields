import { Component } from 'react';
import {
	Modal,
	Form,
	Button,
	InputGroup,
	FormControl,
	Dropdown,
} from 'react-bootstrap';

import React from 'react';
import { connect } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import {
	GET_ALL_MATERIAL_LIST,
	GET_ALL_UNIT,
} from '../../store/actions/actionType';
import {
	getAllMaterialList,
	updateMaterial,
} from '../../store/actions/storeroom';
import { getAllUnit } from '../../store/actions/storeroom';
import CustomSelect from '../../components/SelectBox';
import withRouter from '../../components/withrouter';

class UpdateMaterial extends Component {
	constructor(props) {
		super(props);
		this.project_id = this.props.router?.params.project_id;
		this.store_room_id = this.props.router?.params.store_room_id;
		this.userId = getUserId();
		this.state = {
			show: false,
			singleMaterial: {},
			info: {
				user_id: this.userId,
				project_id: this.project_id,
				material_id: '',
				type: '',
				unit: '',
				minimum_quantity: '',
				notes: '',
			},
		};
	}
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(getAllMaterialList(this.project_id));
		dispatch(getAllUnit());
	}
	componentDidUpdate(prevProps, prevState) {
		const { materialData } = this.props;
		const mat = materialData?.filter(
			(m) => m._id === prevState?.singleMaterial,
		);
		if (mat?._id !== prevState?.singleMaterial) {
			if (mat?._id) {
				this.setState({
					info: {
						user_id: this.userId,
						project_id: this.project_id,
						material_id: '',
						type: '',
						unit: '',
						minimum_quantity: '',
						notes: '',
					},
				});
			}
		}
	}
	handleClose = (show) => {
		this.setState({ show });
	};
	handleShow = (show) => {
		this.setState({ show });
	};
	setSingleMaterial = (singleMaterial) => {
		this.setState({ singleMaterial });
	};
	handleChange = (name, value) => {
		this.setInfo({
			...this.state.info,
			[name]: value,
		});
	};
	submitEditMaterial = (e) => {
		e.preventDefault();
		this.handleClose();
		this.props.dispatch(updateMaterial(this.state.info));
	};

	render() {
		const { unit, materialData } = this.props;
		const { info, singleMaterial } = this.state;
		const materials = materialData?.map((tg) => {
			return { label: tg.type, value: tg._id };
		});
		const units = unit?.map((u) => {
			return { label: u.unit, value: u.unit };
		});

		const { update_material } = getSiteLanguageData(
			'material/components/editmaterial',
		);
	
		const { ph_selectMaterial } = getSiteLanguageData('material');
		const { name,save } = getSiteLanguageData('commons');
		const { manage_unit,minimum_quantity } = getSiteLanguageData('setting');
		return (
			<>
				<Dropdown.Item
					className="lf-layout-profile-menu"
					onClick={this.handleShow}>
					{update_material.text}
				</Dropdown.Item>
				<Modal
					className="lf-modal"
					show={this.state.show}
					onHide={this.handleClose}
					animation={true}>
					<Modal.Header className="py-2 bg-light" closeButton>
						<Modal.Title>{update_material.text}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={this.submitEditMaterial}>
							<div className="row p-3 ">
								<div className="col-sm-12">
									<Form.Label>{ph_selectMaterial.text}</Form.Label>
									<CustomSelect
										// onChange={(e) => handleChangeSingle('material_id', e.value)}
										onChange={(e) => this.setSingleMaterial(e.value)}
										placeholder="Select Material"
										options={materials}
										required
									/>
								</div>
								<div className="col-sm-12 mt-2">
									<Form.Label htmlFor="templatename">{name.text}</Form.Label>
								</div>

								<div className="col-sm-12">
									<InputGroup>
										<FormControl
											placeholder={`Enter ${name.text}`}
											type="text"
											name="type"
											className="lf-formcontrol-height"
											autoComplete="off"
											onChange={(e) =>
												this.handleChange('type', e.target.value)
											}
											value={info?.type}
											required
										/>
									</InputGroup>
								</div>
								<div className="col-sm-12 mt-2">
									<Form.Label htmlFor="templatename">{manage_unit.text}</Form.Label>
								</div>

								<CustomSelect
									placeholder={`${manage_unit.text}...`}
									name="unit"
									onChange={(e) => this.handleChange('unit', e.value)}
									options={units}
									value={units?.filter((u) => u.value === info?.unit)}
								/>

								<div className="col-sm-12 mt-2">
									<Form.Label htmlFor="templatename">
									{minimum_quantity.text}
									</Form.Label>
									<InputGroup>
										<FormControl
											placeholder="Enter text"
											type="number"
											pattern="[0-9]"
											name="minimum_quantity"
											autoComplete="off"
											className="lf-formcontrol-height"
											onChange={(e) =>
												this.handleChange('minimum_quantity', e.target.value)
											}
											value={info?.minimum_quantity}
											required
										/>
									</InputGroup>
								</div>

								<div className="col-12 mt-3">
									<Button
										type="submit"
										className="btn btn-primary theme-btn btn-block my-1 float-end show-verify">
										{save.text}
									</Button>
								</div>
							</div>
						</Form>
					</Modal.Body>
				</Modal>
			</>
		);
	}
}
export default withRouter(
	connect((state) => {
		return {
			materialData: state?.storeroom?.[GET_ALL_MATERIAL_LIST]?.result || [],
			unit: state?.storeroom?.[GET_ALL_UNIT]?.result || [],
		};
	})(UpdateMaterial),
);
