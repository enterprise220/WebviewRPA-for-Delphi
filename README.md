# WebView4Delphi RPA Integration Interface

A modern React-based interface designed to integrate with WebView4Delphi and RPA (Robotic Process Automation) systems. This project provides a robust communication layer between Delphi applications and web-based automation controls.

## Features

- 🎮 **Interactive Control Panel**
  - Start/Stop automation tasks
  - Real-time status monitoring
  - Dynamic parameter management
  - Input data handling

- 📝 **Advanced Logging System**
  - Real-time log updates
  - Timestamp tracking
  - JSON data visualization
  - Log entry filtering
  - Export capabilities

- 🔄 **Bi-directional Communication**
  - Seamless integration with Delphi backend
  - Structured message format
  - Real-time data synchronization
  - Error handling

- 🛠 **Developer Tools**
  - JSON response viewer
  - Parameter management
  - Clipboard integration
  - Debug utilities

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- WebView4Delphi integration in your Delphi application

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### Basic Communication

The interface communicates with Delphi using the `postMessage` API. Messages follow this format:

```javascript
{
  type: 'toDelphi',
  action: 'start|stop|status',
  timestamp: '2024-01-01T00:00:00.000Z',
  data: {
    input: 'string',
    parameters: {}
  }
}
```

### Adding Parameters

1. Click "Add Parameter" in the Control Panel
2. Enter parameter name and value
3. Parameters are automatically included in all communications with Delphi

### Monitoring Automation

1. Use the "Start Automation" button to begin tasks
2. Monitor progress in the Logs tab
3. View responses in the Response Panel
4. Use "Check Status" to get current state

## Integration with Delphi

### Message Handling

In your Delphi application, handle messages using:

```delphi
procedure TMainForm.WebView1WebMessageReceived(Sender: TObject; const args: 
  TWVWebMessageReceivedEventArgs);
var
  message: string;
begin
  message := args.WebMessageAsString;
  // Process message
end;
```

### Sending Responses

Send responses back to the interface using:

```delphi
WebView1.PostWebMessageAsJson('{"type":"fromDelphi","status":"success"}');
```

## Development

### Project Structure

```
src/
  ├── App.jsx        # Main application component
  ├── App.css        # Styles
  ├── main.jsx       # Entry point
  └── index.css      # Global styles
```

### Building for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [WebView4Delphi](https://github.com/salvadordf/WebView4Delphi) - For the Delphi WebView integration
- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool and development server
