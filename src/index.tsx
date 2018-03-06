import * as React from "react";
import { BodyOverflow } from "./bodyOverflow";
import { Portal } from "./portal";

export interface Props {
  // Collector ID from Dovetail.
  // Find this in your project’s collector settings.
  collectorId: string;

  // Optional key:value pairs for setting default data.
  // e.g. prefill user’s name and email if they’re logged in.
  defaultEntries?: { [key: string]: string };

  // Optional domain for where to fetch the dialog.
  // Defaults to dovetailapp.com.
  domain?: string;

  // Optional key:value pairs for passing extra information.
  // e.g. store browser version, local time, etc.
  metadata?: { [key: string]: string };

  // Called when the user clicks the ‘X’ icon to close the dialog
  // or the ‘Done’ button after successfully sending the form.
  //
  // Returns true or false depending on whether feedback was sucessfully sent
  // or false if the user just closed the dialog without sending feedback.
  onDismiss: (sent: boolean) => void;
}

let nextId = 0;

export class Collector extends React.PureComponent<Props> {
  private id = nextId++;

  public componentDidMount() {
    window.addEventListener("message", this.receiveMessage, false);
  }

  public componentWillUnmount() {
    window.removeEventListener("message", this.receiveMessage);
  }

  public render() {
    const { collectorId, domain = "dovetailapp.com", defaultEntries, metadata } = this.props;
    const url = `//${domain}/embed/?collectorId=${collectorId}&id=${this.id}&defaultEntries=${encodeURIComponent(
      JSON.stringify(defaultEntries)
    )}&metadata=${encodeURIComponent(JSON.stringify(metadata))}`;

    return (
      <BodyOverflow>
        <Portal>
          <iframe
            frameBorder={0}
            src={url}
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
      this.props.onDismiss(event.data.sent);
    }
  };
}
