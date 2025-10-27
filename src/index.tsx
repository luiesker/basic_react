import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider, ErrorBoundary, LEVEL_WARN, RollbarContext, useRollbar } from '@rollbar/react' // <-- Provider imports 'rollbar' for us
import Rollbar from "rollbar/replay";

var transformer = function(payload: any) {
    payload['environment'] =
      true ? 'prod' : 'development';
    };

const rollbarConfig = {
  accessToken: '4c6a61bd889a4bb3a8443d3c10eb11f09be997bb44d3c81d0d8ae0a7fa78fb6cf1d4256b05648b2bed51a9831632f3cc',
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: 'qa',
  replay: {
    enabled: true,
    blockClass: 'mask',
    maskAllInputs: true,
  },
  source_map_enabled: true,
  transform: transformer,
  tracing: {
    endpoint: 'api.rollbar.com/api/1/session/',
    transformSpan: ({span}: { span: any }) => {
      span.resource.attributes['rollbar.environment'] = true ? 'prod' : 'development';
  	}
  },
  
}

const rollbar = new Rollbar(rollbarConfig);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider instance={rollbar} >
    <ErrorBoundary level={LEVEL_WARN}>

      <App />
    </ErrorBoundary>
</Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
