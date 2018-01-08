# collector-react
The feedback collector is a simple form that helps you quickly gather user feedback from your own website or web app. When people fill out the form, their entries are saved as notes in [Dovetail](https://dovetailapp.com). You’ll need a project on Dovetail, along with its project ID (found in the URL or in [collector settings](https://dovetailapp.com/help/collector-customize)).

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

## Configuration

Configure the look & feel in your Dovetail project. You can customize the color, text, where entries are saved, and more. Read the [customization documentation](https://dovetailapp.com/help/collector-customize) for more information.
