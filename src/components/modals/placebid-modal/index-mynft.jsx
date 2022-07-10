import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "@ui/button";

const PlaceBidModal = ({ show, handleModal, getgp, gp }) => (
    <Modal
        className="rn-popup-modal placebid-modal-wrapper"
        show={show}
        onHide={handleModal}
        centered
    >
        {show && (
            <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleModal}
            >
                <i className="feather-x" />
            </button>
        )}
        <Modal.Header>
            <h3 className="modal-title">Collecting!!</h3>
        </Modal.Header>
        <Modal.Body>
            <p>You are about to collect your GameFi Points~~ </p>
            
            <div className="placebid-form-box">
                
                <div className="bid-content">
                    

                    <div className="bid-content-mid">
                        <div className="align-items-center">
                            <span>Your Balance Points : {gp} </span>
                            
                        </div>
                       
                    </div>
                </div>
                <div className="bit-continue-button">
                    
                    <Button size="medium" fullwidth
                        onClick={getgp}
                    >
                        Collect Your Points
                    </Button>
                    <Button
                        color="primary-alta"
                        size="medium"
                        className="mt--10"
                        onClick={handleModal}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal.Body>
    </Modal>
);

PlaceBidModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleModal: PropTypes.func.isRequired,
    getgp: PropTypes.func.isRequired,
    
};
export default PlaceBidModal;
