import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Nodata from '../../components/nodata';
import Layout from '../../components/layout';
import { GET_USER_WALLET } from '../../store/actions/actionType';
import moment from 'moment';
import getUserId, { getSiteLanguageData } from "../../commons";
import { GetUserWalletDetails } from '../../store/actions/Profile';

const userId = getUserId();



function Wallet() {
  const dispatch = useDispatch();
  const data = useSelector((state) => {
    return state?.profile?.[GET_USER_WALLET]?.result || [];
  });

  useEffect(() => {
    if (!data || data?.length <= 0) {
      dispatch(GetUserWalletDetails(userId));
    }
  }, []);
  // if (!data?.length && data?.length !== 0) {
  //   return <Loading />
  // }

  const { wallet, earned_amount, total_earned_amount,date:earnedDate } =
		getSiteLanguageData('components/wallet');

    const { dashboard } =
		getSiteLanguageData('commons');
  return (<Layout>
    {/* { data?.length == 0 ?
       <Nodata type="Files"/>
       : */}

    {/* <Loading /> */}
    {data?.length === 0 ? (
      <Nodata type={wallet?.text}>
        {/* <AddMaterial /> */}
      </Nodata>
    )
      :
      <div id="page-content-wrapper">
        <section className="lf-dashboard-toolbar">
          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                <div className="col-sm-12">
                  <h3>{wallet?.text}</h3>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="col-sm-12">
                  <nav aria-label="breadcrumb text-end">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item"><a href="/dashboard">{dashboard.text}</a></li>
                      <li className="breadcrumb-item active" aria-current="page">{wallet?.text}</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container">
          {data?.transactions?.length > 0 ?
            data?.transactions?.map((t) => {
              return <div className="row w-50 offset-3 lf_wallet mt-5">
                <div className="col-3 text-end p-0 align-self-center">
                  <i className="fas fa-wallet fa-2x "></i>
                </div>
                <div className="col-9">

                  <div className="row">
                    <div className="col-12  text-start align-self-center">
                      {earned_amount.text}<span className="text-warning"> {t.points}</span>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 position-relative text-secondary text-start align-self-center">
                    {earnedDate.text}
                      {moment(t.expiry_time).format('MMM DD,YYYY')}
                    </div>
                  </div>
                </div>
              </div>
            }) : ' No transactions yet!'
          }
          <hr className='w-50' />
          <div className="row w-50 lf_wallet offset-3 text-center">
            <div className="col-12">
              <div className="row ">
                <div className="col-12">
                  {total_earned_amount.text}
                </div>
              </div>
              <div className="row">
                <div className="col-12 text-secondary">
                  <h5 className="text-warning"> ${data.points}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    }
  </Layout >);
}

export default Wallet;