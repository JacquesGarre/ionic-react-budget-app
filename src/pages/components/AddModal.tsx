import {
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonItemDivider,
    IonLabel,
    IonItem,
    IonIcon,
    IonFab,
    IonFabButton,
    IonModal,
    IonButtons,
    IonInput,
    IonList,
    IonSelect,
    IonSelectOption,
    useIonViewWillEnter,
    IonDatetime
} from '@ionic/react';
import { set, get } from "../../services/storage";
import { trendingDownOutline, add, close } from 'ionicons/icons';
import { useState } from "react";
import { TODAY_DATE } from "../../services/utils";
import moment from "moment";

interface AddExpenseModalProps {
    refreshHome: any;
    expensesCategories: any;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({refreshHome, expensesCategories}) => {

    const [showAddModal, setShowAddModal] = useState(false);
    const [expenseLabel, setExpenseLabel] = useState<any>();
    const [expenseAmount, setExpenseAmount] = useState<any>();
    const [expenseCategory, setExpenseCategory] = useState<any>();
    const [expenseDate, setExpenseDate] = useState<any>(TODAY_DATE);

    // Saves an expense
    const saveExpense = async () => {
        const expenses = await get('expenses');
        expenses.push({
            id: Date.now(),
            name: expenseLabel,
            amount: parseInt(expenseAmount),
            category: expenseCategory,
            date: moment(expenseDate).format('DD/MM/yyyy'),
            time: moment(expenseDate).format('x')
        });
        await set('expenses', expenses);
        refreshHome();
        setExpenseLabel('');
        setExpenseAmount('');
        setExpenseCategory('');
        setExpenseDate(TODAY_DATE);
        setShowAddModal(false);
    }

    return (
        <>
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
                <IonFabButton  color="danger" onClick={() => setShowAddModal(true)}>
                    <IonIcon icon={add} />
                </IonFabButton>
            </IonFab>
            <IonModal isOpen={showAddModal}>
                <IonHeader>
                    <IonToolbar color="danger">
                        <IonIcon icon={trendingDownOutline} size="large" /><IonTitle slot="start">New expense</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setShowAddModal(false)} slot="end"><IonIcon icon={close} /></IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonList className="new-expense-form">
                    <IonItem>
                        <IonLabel position="floating">Label</IonLabel>
                        <IonInput value={expenseLabel} onIonChange={e => setExpenseLabel(e.detail.value!)} required></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Amount</IonLabel>
                        <IonInput value={expenseAmount} onIonChange={e => setExpenseAmount(e.detail.value!)} required></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Category</IonLabel>
                        <IonSelect value={expenseCategory} onIonChange={e => setExpenseCategory(e.detail.value!)}>
                            {expensesCategories.filter((category: any) => { return category.frequency == "weekly" }).map((category: any, key: any) => (
                                <IonSelectOption key={key} value={category.id}>{category.name}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Date</IonLabel>
                        <IonDatetime displayFormat="DD-MM-YYYY" value={expenseDate} onIonChange={e => setExpenseDate(e.detail.value!)}></IonDatetime>
                    </IonItem>
                    <IonButton expand="block" onClick={() => { saveExpense(); }}><IonIcon icon={add} /> Add</IonButton>
                    <IonButton color="danger" expand="block" onClick={() => setShowAddModal(false)}>Cancel</IonButton>
                </IonList>
            </IonModal>
        </>
    );
};

export default AddExpenseModal;

