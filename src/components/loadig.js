import { Spinner } from 'react-bootstrap';
// import LoadingImg from '../images/logo-with-text.png'

// const Loading = ()  => <div className="lf-loading-contaier"><img className="lf-loading" src={LoadingImg} /></div>
const Loading = () => <div className="lf-loading-contaier">
    {/* <img className="lf-loading" src={LoadingImg} /> */}
    <div>
        <Spinner animation="border" variant="warning" />
    </div>
    
</div>

export default Loading;