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

  // Called when the user clicks the X icon to close the dialog.
  onDismiss: () => void;

  // Optional handler for send.
  // Called 10 seconds after the user clicks the send button.
  onSend?: () => void;
}

let nextId = 0;

export class Collector extends React.Component<Props> {
  private readonly id = nextId++;

  public componentDidMount() {
    window.addEventListener("message", this.receiveMessage, false);
  }

  public componentWillUnmount() {
    window.removeEventListener("message", this.receiveMessage);
  }

  public render() {
    const { collectorId, domain = "dovetailapp.com", defaultEntries, metadata } = this.props;
    // Preserving http: is useful for local development.
    const protocol = location.protocol === "http:" ? "http:" : "https:";

    // https: explicitly used here (as opposed to //) to allow the collector to
    // be used in chrome-extension: pages.
    let url = `${protocol}//${domain}/embed/?collectorId=${collectorId}&id=${this.id}`;

    // There's a bug in the TypeScript typing for JSON.stringify (they claim it
    // only returns string, but this case exists):
    //
    //     JSON.stringify(undefined) -> undefined
    //
    // See: https://github.com/Microsoft/TypeScript/issues/18879
    //
    // As such we need to be careful here to omit argments when they weren't
    // provided through props.
    if (defaultEntries !== undefined) {
      url += `&defaultEntries=${encodeURIComponent(JSON.stringify(defaultEntries))}`;
    }

    if (metadata !== undefined) {
      url += `&metadata=${encodeURIComponent(JSON.stringify(metadata))}`;
    }

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

  private readonly receiveMessage = (event: MessageEvent) => {
    if (typeof event.data === "object" && event.data.id === this.id && event.data.name === "dovetail-collector") {
      switch (event.data.type) {
        case "dismiss": {
          this.props.onDismiss();
          break;
        }
        case "send": {
          this.props.onSend !== undefined ? this.props.onSend() : null;
          break;
        }
      }
    }
  };
}
