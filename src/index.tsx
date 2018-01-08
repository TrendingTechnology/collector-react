import * as React from "react";
import { Portal } from "./portal";

export interface Props {
  // Optional domain for where to fetch the dialog.
  // Defaults to dovetailapp.com.
  domain?: string;

  // Optional key:value pairs for setting default data.
  // e.g. prefill user’s information if they’re logged in.
  metadata?: {[key: string]: string};

  // Called when the user clicks the X icon to close the dialog.
  onDismiss: () => void;

  // Optional handler for send.
  // Called 10 seconds after the user clicks the send button.
  onSend?: () => void;

  // Project ID from Dovetail.
  // Find this from the project URL in Dovetail or collector settings.
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
    const { domain = "dovetailapp.com", metadata, projectId } = this.props;

    return (
      <Portal>
        <iframe
          frameBorder={0}
          src={`//${domain}/embed/?pid=${projectId}&id=${this.id}&metadata=${JSON.stringify(metadata)}`}
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
          this.props.onSend != undefined ? this.props.onSend() : null;
          break;
        }
      }
    }
  };
}
