import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    useIonViewWillEnter
} from '@ionic/react';
import React, { useState } from "react";
import { set, get } from "../services/storage";

import PaydayPicker from './components/PaydayPicker';
import IncomesCategories from './components/Categories/Incomes/List';
import ExpensesCategories from './components/Categories/Expenses/List';
import Summary from './components/Summary';

import './SettingsTab.css';

import { Plugins } from '@capacitor/core';
const { App } = Plugins;

const SettingsTab: React.FC = () => {

    document.addEventListener('ionBackButton', (ev: any) => {
        ev.detail.register(-1, () => {
            App.exitApp();
        });
    });

    const [savings, setSavings] = useState<any>(0);
    const [budgetPerWeek, setBudgetPerWeek] = useState<any>(0);

    useIonViewWillEnter(async () => {
        setSummary();
    });

    // Sets summary data
    const setSummary = async () => {
        const incomesCategories = await get('incomesCategories');
        const expensesCategories = await get('expensesCategories');
        const incomesTotal = incomesCategories.reduce((accumulator: number, currentValue: any) => accumulator + parseInt(currentValue.amount), 0);
        const expensesTotal = expensesCategories.reduce((accumulator: number, currentValue: any) => accumulator + parseInt(currentValue.amount), 0);
        setSavings(incomesTotal-expensesTotal);
    }

    return (
        <IonPage className="settings-page">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Settings</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <PaydayPicker></PaydayPicker>
                <IncomesCategories setSummary={setSummary}></IncomesCategories>
                <ExpensesCategories setSummary={setSummary}></ExpensesCategories>
                <Summary savings={savings}></Summary>
            </IonContent>
        </IonPage>
    );
};

export default SettingsTab;
