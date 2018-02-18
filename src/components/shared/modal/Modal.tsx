import autobind from "autobind-decorator";
import * as classNames from "classnames";
import * as React from "react";
import * as Portal from "react-portal";

import "./Modal.scss";

import Overlay from "../overlay/Overlay";

interface IModalProps {
  open: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
}

interface IModalState {
  open: boolean;
}

@autobind
class Modal extends React.Component<IModalProps, IModalState> {
  public static defaultProps: IModalProps = {
    onClose: null,
    onOpen: null,
    open: false
  };

  public state: IModalState = {
    open: this.props.open
  };

  public componentWillReceiveProps(nextProps: IModalProps) {
    if (nextProps.open !== this.props.open) {
      this.setState({ open: nextProps.open });
    }
  }

  public render() {
    return (
      <Portal
        isOpened={this.state.open}
        onClose={this.close}
        onOpen={this.open}
      >
        <React.Fragment>
          <Overlay open={this.state.open} onClick={this.close} />

          <div className={classNames("modal", this.props.className)}>
            {this.props.children}
          </div>
        </React.Fragment>
      </Portal>
    );
  }

  private open() {
    this.setState({ open: true });

    if (this.props.onOpen) {
      this.props.onOpen();
    }
  }

  private close() {
    this.setState({ open: false });

    if (this.props.onClose) {
      this.props.onClose();
    }
  }
}

export default Modal;