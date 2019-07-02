import React from 'react';
import DataTableExpense from '../_components/DataTableExpense'

import { authenticationService } from '../_services/authentication.service';

export class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue
        };
    }

    componentDidMount() {
    }

    render() {
        const { currentUser} = this.state;
        return (
            <div style={{width: '100%'}}>
                <h1>Welcome {currentUser.firstName}!</h1>
                {
                    currentUser && <DataTableExpense />
                }
            </div>
        );
    }
}
