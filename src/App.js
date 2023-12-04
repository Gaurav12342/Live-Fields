import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Component, Fragment } from 'react';
import AppRouter from './Router';
import getUserId from './commons';
import { GetUserProfileDetails } from './store/actions/Profile';
import { getUserLicence } from './store/actions/License';
import ImageLightBox from './components/ImageLightBox'
class App extends Component {
  constructor(props) {
    super(props);
    this.userId = getUserId()
  }
  componentDidMount() {
    if (this.userId) {
      // this.props.dispatch(getUserLicence(this.userId));
      this.props.dispatch(GetUserProfileDetails(this.userId));
    }
  }
  render() {
    return (
      <Fragment>
        <AppRouter />
        <ToastContainer />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userProfileData: state?.profile?.user_profile_details
  }
}

export default connect(mapStateToProps)(App);

