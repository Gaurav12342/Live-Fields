import { useEffect, useState } from 'react';
import { Dropdown, Modal } from 'react-bootstrap';
// import '../App.css';
import getUserId, { getSiteLanguageData } from './../commons';
import { GET_USER_WALLET } from '../store/actions/actionType';
import { GetUserWalletDetails } from '../store/actions/Profile';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

function Wallet() {
	const userId = getUserId();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const dispatch = useDispatch();
	const data = useSelector((state) => {
		return state?.profile?.[GET_USER_WALLET]?.result || [];
	});

	useEffect(() => {
		if (!data || data?.length <= 0) {
			dispatch(GetUserWalletDetails(userId));
		}
	}, []);
	const { wallet, earned_amount, total_earned_amount } =
		getSiteLanguageData('components/wallet');
	return (
		<>
			<Dropdown.Item
				className="lf-layout-profile-menu"
				onClick={() => handleShow()}>
				<i className="fas fa-wallet me-2"></i>My Wallet
			</Dropdown.Item>
			{/* <span onClick={() => handleShow()}  ><i className="fas fa-wallet me-2"></i>My Wallet</span> */}
			<Modal show={show} onHide={handleClose} dialogclassName=" ">
				<Modal.Header closeButton>
					<div className="row">
						<div className="col mt-3 ">
							<span>
								<h4>{wallet?.text}</h4>
							</span>
						</div>
					</div>
				</Modal.Header>
				<Modal.Body>
					<div className="container">
						{data?.transactions?.length > 0
							? data?.transactions?.map((t) => {
									return (
										<div className="row lf_wallet">
											<div className="col-3 text-center pt-3 ps-5">
												<i className="fas fa-wallet fa-2x pb-3"></i>
											</div>
											<div className="col-9">
												<div className="row ps-4">
													<div className="col-12 pt-2">
														{earned_amount?.text}
														<span className="text-warning"> {t.points}</span>
													</div>
												</div>

												<div className="row ps-4">
													<div className="col-12 text-secondary">
														{/* Date:  */}
														{moment(t.expiry_time).format('MMM DD,YYYY')}
													</div>
												</div>
											</div>
										</div>
									);
							  })
							: 'No transactions yet!'}
						<hr />
						<div className="row lf_wallet text-center">
							<div className="col-12">
								<div className="row ps-4">
									<div className="col-12 pt-2">{total_earned_amount?.text}</div>
								</div>

								<div className="row ps-4">
									<div className="col-12 text-secondary">
										<h5 className="text-warning"> ${data.points}</h5>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default Wallet;
