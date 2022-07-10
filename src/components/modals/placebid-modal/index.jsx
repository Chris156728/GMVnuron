import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "@ui/button";

const PlaceBidModal = ({ show, handleModal, tkuri, pid, gomint, price }) => (
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
            <h3 className="modal-title">Mint your NFT</h3>
        </Modal.Header>
        <Modal.Body>
            <p>You are about to purchase This NFT Form GameVerse</p>
            <div className="placebid-form-box">
                
                <div className="bid-content">
                    
                    <div className="bid-content-mid">
                        <div className="bid-content-left">
                            <span>This NFT Price : {price.amount} USDT</span>
                            
                        </div>
                        
                    </div>
                </div>
                <div className="bit-continue-button">
                    
                    <Button size="medium" fullwidth
                        onClick={gomint}
                    >
                        Mint Your NFT
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
    gomint: PropTypes.func.isRequired,
    
};
export default PlaceBidModal;
