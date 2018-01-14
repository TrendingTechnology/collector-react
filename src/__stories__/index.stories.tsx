import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Collector } from "../";

storiesOf("Collector", module).add("Example", () => {
  interface State {
    feedback: boolean;
  }

  class Example extends React.Component<{}, State> {
    public state: State = { feedback: false };

    public render() {
      return (
        <div>
          <div
            style={{
              backgroundImage: "url(https://images.unsplash.com/photo-1498598457418-36ef20772bb9",
              backgroundSize: "100%",
              height: "100vh",
              margin: "-8px",
              padding: "24px",
              width: "100vw"
            }}
          >
            <button
              onClick={() => {
                this.setState({ feedback: true });
              }}
            >
              Send feedback
            </button>
          </div>

          {this.state.feedback ? (
            <Collector
              collectorId="3d03f1a0-f698-11e7-8348-25337274b7c3"
              domain="stg.dovetailapp.com"
              defaultEntries={{ email: "jane@example.com", name: "Jane Doe" }}
              onDismiss={() => {
                this.setState({ feedback: false });
              }}
            />
          ) : null}
        </div>
      );
    }
  }

  return <Example />;
});
