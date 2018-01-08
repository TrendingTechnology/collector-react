# collector-react

The feedback collector is a simple form that helps you quickly gather user feedback from your own website or web app. When people fill out the form, their entries are saved as notes in [Dovetail](https://dovetailapp.com). You’ll need a project on Dovetail, along with its project ID (found in the URL or in [collector settings](https://dovetailapp.com/help/collector-customize)).

![Collector demo](img/demo.gif?raw=true "Collector demo")

## Example implementation

```jsx
interface State {
  feedback: boolean;
}

return class Example extends React.Component<{}, State> {
  public state: State = { feedback: false };

  public render() {
    return (
      <div>
        <button onClick={() => { this.setState({ feedback: true }); }}>Send feedback</button>

        {this.state.feedback ? (
          <Collector
            onDismiss={() => {
              this.setState({ feedback: false });
            }}
            onSend={() => {}}
            projectId="yourProjectId"
          />
        ) : null}
      </div>
    );
  }
}
```

`onDismiss` is triggered instantly when the user clicks close. `onSend` will be triggered after a 10 second delay. 

## Props

```jsx
interface Props {
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
```

## Configuration

Configure the look & feel in your Dovetail project. You can customize the color, text, where entries are saved, and more. Read the [customization documentation](https://dovetailapp.com/help/collector-customize) for more information.

## Build status

[![CircleCI](https://circleci.com/gh/heydovetail/collector-react.svg?style=svg)](https://circleci.com/gh/heydovetail/collector-react)
