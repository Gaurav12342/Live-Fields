import { useSelector } from 'react-redux';
import Nodata from '../../components/nodata';
import Layout from '../../components/layout';
import { GET_STORE_ROOM } from '../../store/actions/actionType';
import CreatSurveyReport from './createsurveyreport';
import { getSiteLanguageData } from '../../commons';


function SurveyReport() {
  const data = useSelector(state => {
    return state?.storeroom?.[GET_STORE_ROOM]?.result || []
  })
	const { survey_report,question } = getSiteLanguageData('reports/toolbar');
	const { dashboard } = getSiteLanguageData('commons');


  return (<Layout>
    {/* { data?.length == 0 ?
       <Nodata type="Files"/>
       : */}

    {/* <Loading /> */}
    {data?.length === 0 ? (
      <Nodata type={survey_report.text}>
                 <CreatSurveyReport/>

      </Nodata>
    )
      :
      <div id="page-content-wrapper">
        <section className="lf-dashboard-toolbar">
          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                <div className="col-sm-12">
                  <h3>{survey_report.text}</h3>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="col-sm-12">
                  <nav aria-label="breadcrumb text-end">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item"><a href="/dashboard">{dashboard.text}</a></li>
                      <li className="breadcrumb-item active" aria-current="page">{survey_report.text}</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>
          <div className="container-fluid">
          <div className="col-sm-12 pt-4">
            <div className="row">
              <div className="col-sm-12 text-end">
              </div>
            </div>
          </div>
        </div>


      </div>

    }
  </Layout >);
}

export default SurveyReport;