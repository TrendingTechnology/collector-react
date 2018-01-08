import * as React from "react";
import { Portal } from "./portal";

export interface Props {
  domain?: string;
  onDismiss: () => void;
  onSend: () => void;
  projectId: string;
}

let nextId = 0;

export class Collector extends React.Component<Props> {
  private id = nextId++;

  public componentDidMount() {
    window.addEventListener("message", this.receiveMessage, false);
  }

  public componentWillUnmount() {
    window.removeEventListener("message", this.receiveMessage);
  }

  public render() {
    const { domain = "dovetailapp.com", projectId } = this.props;

    return (
      <Portal>
        <iframe
          frameBorder={0}
          src={`//${domain}/embed/?pid=${projectId}&id=${this.id}`}
          style={{
            background: "rgba(114, 109, 130, 0.5)",
            bottom: 0,
            border: 0,
            height: "100vh",
            position: "fixed",
            right: 0,
            left: 0,
            top: 0,
            width: "100vw",
            zIndex: 2147483647
          }}
        />
      </Portal>
    );
  }

  private receiveMessage = (event: MessageEvent) => {
    if (typeof event.data === "object" && event.data.id === this.id && event.data.name === "dovetail-collector") {
      switch (event.data.type) {
        case "dismiss": {
          this.props.onDismiss();
          break;
        }
        case "send": {
          this.props.onSend();
          break;
        }
      }
    }
  };
}
