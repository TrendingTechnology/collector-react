import * as React from "react";
import { BodyOverflow } from "./bodyOverflow";
import { Portal } from "./portal";

export interface Props {
  // Collector ID from Dovetail.
  // Find this in your project’s collector settings.
  collectorId: string;

  // Optional key:value pairs for setting default data.
  // e.g. prefill user’s information if they’re logged in.
  defaultEntries?: {[key: string]: string};

  // Optional domain for where to fetch the dialog.
  // Defaults to dovetailapp.com.
  domain?: string;

  // Called when the user clicks the X icon to close the dialog.
  onDismiss: () => void;

  // Optional handler for send.
  // Called 10 seconds after the user clicks the send button.
  onSend?: () => void;
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
    const { collectorId, domain = "dovetailapp.com", defaultEntries } = this.props;

    return (
      <BodyOverflow>
        <Portal>
          <iframe
            frameBorder={0}
            src={`//${domain}/embed/?collectorId=${collectorId}&id=${this.id}&defaultEntries=${encodeURIComponent(JSON.stringify(defaultEntries))}`}
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
      </BodyOverflow>
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
