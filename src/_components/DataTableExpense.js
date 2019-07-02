import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Panel } from 'primereact/panel';
import { ExpenseService } from '../_services/expeneses';
import { ExpenseTypeService } from '../_services/expenseType';
import { PaymentTypeService } from '../_services/paymentType';
import { authenticationService } from '../_services/authentication.service';
// TODO: pensar en llevar esto a una clase de utilidades
import { Messages } from 'primereact/messages';
import { Growl } from 'primereact/growl';


export default class DataTableExpense extends Component {
    constructor() {
        super()
        this.state = {
            currentUser: authenticationService.currentUserValue,
            expenses: [],
            displayDialog: false,
            expenseTypes: [],
            paymentTypes: []
        }
        this.expenseService = new ExpenseService()
        this.expenseTypeService = new ExpenseTypeService()
        this.paymentTypeService = new PaymentTypeService()


        // Set the predefined functions to be used by html components
        this.addNew = this.addNew.bind(this)
        this.onEdit = this.onEdit.bind(this)
        this.view = this.view.bind(this)
        this.save = this.save.bind(this)
        this.delete = this.delete.bind(this)
        this.cancel = this.cancel.bind(this)
        this.onExpenseTypeChange = this.onExpenseTypeChange.bind(this)
        this.onPaymentTypeChange = this.onPaymentTypeChange.bind(this)
        this.moneyTemplate = this.moneyTemplate.bind(this)
    }

    componentDidMount() {
        this.expenseService.getExpenses().then(data => this.setState({ expenses: data }))
        this.expenseTypeService.getExpenseTypes().then(data => this.setState({ expenseTypes: data }))
        this.paymentTypeService.getPaymentTypes().then(data1 => this.setState({ paymentTypes: data1 }))
    }

    addNew() {
        this.newObj = true;
        this.edit = false;
        this.setState({
            expense: { description: '', expenseTypeId: '', paymentTypeId: '', amount: 0.0 },
            displayDialog: true
        });
    }

    cancel() {
        this.newObj = false;
        this.edit = false;
        this.setState({
            displayDialog: false
        });
    }

    onEdit() {
        this.newObj = false
        this.edit = true
        this.setState({
            expense: this.rowData,
            displayDialog: true
        })
    }

    view() {
        this.newObj = false
        this.edit = false;
        this.setState({
            expense: this.rowData,
            displayDialog: true
        })
    }

    save() {
        this.growl.show({ severity: 'error', summary: 'Not implemented', detail: 'Method not implemented' });
    }

    delete() {
        this.growl.show({ severity: 'error', summary: 'Not implemented', detail: 'Method not implemented' });
    }

    onExpenseTypeChange(e) {
        this.updateProperty('expenseTypeId', e.value)
    }

    onPaymentTypeChange(e) {
        this.updateProperty('paymentTypeId', e.value)
    }

    updateProperty(property, value) {
        let obj = this.state.expense;
        obj[property] = value;
        this.setState({ expense: obj });
    }

    moneyTemplate(rowData, column) {
        let money = this.formatMoney(rowData['amount'], 2, ',')
        return <span>{money} </span>;
    }

    actionTemplate(rowData, column) {
        this.rowData = rowData
        return <div>
            <Button type="button" icon="pi pi-search" style={{ marginRight: '.5em', marginTop: '.5em' }} onClick={this.view} ></Button>
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" style={{ marginRight: '.5em', marginTop: '.5em' }} onClick={this.onEdit} ></Button>
            <Button type="button" icon="pi pi-times" className="p-button-danger" style={{ marginRight: '.5em', marginTop: '.5em' }} onClick={this.delete} ></Button>
        </div>;
    }

    /**
     * Utility to format a number as currency
     * @param {Double} number 
     * @param {*} decPlaces 
     * @param {*} decSep 
     * @param {*} thouSep 
     */
    formatMoney(number, decPlaces, decSep, thouSep) {
        decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces;
        decSep = typeof decSep === "undefined" ? "." : decSep;
        thouSep = typeof thouSep === "undefined" ? "," : thouSep;
        var sign = number < 0 ? "-" : "";
        var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
        var j
        j = (j = i.length) > 3 ? j % 3 : 0;

        return "$ " + sign +
            (j ? i.substr(0, j) + thouSep : "") +
            i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
            (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
    }

    render() {

        let header = <div className="p-clearfix" style={{ lineHeight: '1.87em' }}>Expenses List </div>;

        let footer = <div className="p-clearfix" style={{ width: '100%' }}>
            <Button style={{ float: 'left' }} label="Add" icon="pi pi-plus" onClick={this.addNew} />
        </div>;
        let panelFooter = <div>

            {this.newObj || this.edit ? <Button label="Save" icon="pi pi-check" onClick={this.save} style={{ margin: '0.5em' }} /> : null}
            {!this.newObj && this.edit ? <Button label="Delete" icon="pi pi-times" onClick={this.delete} style={{ margin: '0.5em' }} /> : null}
            <Button label="Cancel" icon="pi pi-check" onClick={this.cancel} style={{ margin: '0.5em' }} />
        </div>;


        return (

            <div>
                <div>
                    <Growl ref={(el) => this.growl = el} />
                    <Messages ref={(el) => this.messages = el}></Messages>
                </div>
                <div>
                    <DataTable value={this.state.expenses}
                        responsive={true}
                        scrollable={true}
                        header={header}
                        footer={footer}
                        paginator={true} rows={15}
                        selectionMode="single"
                        scrollHeight="200px"
                        style={{ display: !this.state.displayDialog ? '' : 'none' }}>
                        <Column field="id" header="ID" />
                        <Column field="description" header="Description" />
                        <Column body={this.moneyTemplate} header="Amount" />
                        <Column field="expenseTypeId.name" header="Type" />
                        <Column field="paymentTypeId.name" header="Payment" />
                        <Column body={this.actionTemplate.bind(this)} header="Actions" />
                    </DataTable>

                </div>
                <div className="content-section implementation">
                    <Panel style={{ display: this.state.displayDialog ? '' : 'none' }}
                        header="Details"
                    >
                        {
                            this.state.expense &&

                            <div className="p-grid p-fluid ">
                                <div className="p-col-4" style={{ padding: '.75em' }}>
                                    <label htmlFor="description" class="required">Description</label>
                                </div>
                                <div className="p-col-8" style={{ padding: '.5em' }}>
                                    <InputText id="description"
                                        onChange={(e) => { this.updateProperty('description', e.target.value) }}
                                        value={this.state.expense.description}
                                        disabled={!this.edit && !this.newObj}
                                    />
                                </div>

                                <div className="p-col-4" style={{ padding: '.75em' }}>
                                    <label htmlFor="amount" class="required">Amount</label>
                                </div>
                                <div className="p-col-8" style={{ padding: '.5em' }}>
                                    <InputText id="amount"
                                        onChange={(e) => { this.updateProperty('amount', e.target.value) }}
                                        value={this.state.expense.amount}
                                        disabled={!this.edit && !this.newObj} />
                                </div>

                                <div className="p-col-4" style={{ padding: '.75em' }}>
                                    <label htmlFor="expenseType">Expense Type</label>
                                </div>
                                <div className="p-col-8" style={{ padding: '.5em' }}>
                                    <Dropdown id="expenseType"
                                        value={this.state.expense.expenseTypeId}
                                        optionLabel="name"
                                        dataKey="id"
                                        options={this.state.expenseTypes}
                                        onChange={this.onExpenseTypeChange}
                                        placeholder="Select an expense type"
                                        disabled={!this.edit && !this.newObj} />
                                </div>

                                <div className="p-col-4" style={{ padding: '.75em' }}>
                                    <label htmlFor="paymentType">Payment Method</label>
                                </div>
                                <div className="p-col-8" style={{ padding: '.5em' }}>
                                    <Dropdown id="paymentType"
                                        value={this.state.expense.paymentTypeId}
                                        optionLabel="name"
                                        dataKey="id"
                                        options={this.state.paymentTypes}
                                        onChange={this.onPaymentTypeChange}
                                        placeholder="Select an Payment type"
                                        disabled={!this.edit && !this.newObj} />
                                </div>


                            </div>

                        }
                        <div id="panelFooterCentered">
                            {panelFooter}
                        </div>

                    </Panel>
                </div>
            </div>
        );
    }
}