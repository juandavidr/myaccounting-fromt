import React from 'react';
import { render } from 'react-dom';

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { App } from './App/App';
// setup fake backend
import { configureFakeBackend } from './_helpers/fake-backend';

configureFakeBackend();

render(<App />, document.getElementById('app'));


