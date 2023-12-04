import PropTypes from 'prop-types';
import 'moment/min/locales';
import * as momentTz from 'moment-timezone';
import timezone from '../commons/Timezone.json';
import { useSelector } from 'react-redux';
import { GET_PROJECT_DETAILS } from '../store/actions/actionType';

function CustomDate(props) {
    const projetDetails = useSelector(state => state?.project?.[GET_PROJECT_DETAILS])
    momentTz.tz.setDefault("Asia/Kolkata");
    if(projetDetails?.result?.timezone){
        const pt = timezone.timezones.filter(t => t.value === projetDetails?.result?.timezone)
        if(pt[0]){
            momentTz.tz.setDefault(pt[0]?.utc[0]);
            momentTz.locale('en-in')
        }
    }

    return (<>
        {projetDetails?.result?.date_formate ? momentTz(props?.date).format(projetDetails?.result?.date_formate) : momentTz(props?.date).format('L')}
    </>);
}

CustomDate.propTypes = {
  date : PropTypes.node,
}

export default CustomDate;