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
    IonSelectOption
 } from '@ionic/react';
 import { set, get } from "../../../../services/storage";
import { trendingDownOutline, add, close } from 'ionicons/icons';
import { useState, useEffect } from "react";


interface NewExpenseCategoryModalProps {
    setIonListItems: any;
    setSummary: any;
}

const NewExpenseCategoryModal: React.FC<NewExpenseCategoryModalProps> = ({setIonListItems, setSummary}) => {

    const [showAddModal, setShowAddModal] = useState(false);
    const [expenseLabel, setExpenseLabel] = useState<any>();
    const [expenseAmount, setExpenseAmount] = useState<any>();
    const [expenseFrequency, setExpenseFrequency] = useState<any>();

    // Opens modal and resets form
    const openModal = () => {
        setExpenseLabel("");
        setExpenseAmount("");
        setExpenseFrequency("");
        setShowAddModal(true);
    }

    // Saves a category
    const saveCategory = async () => {
        const expensesCategories = await get('expensesCategories');
        expensesCategories.push({
            id: Date.now(),
            name: expenseLabel,
            amount: expenseAmount,
            frequency: expenseFrequency
        });
        await set('expensesCategories', expensesCategories);
        setIonListItems();
        setSummary();
        setShowAddModal(false);
    } 

    return (
        <>
            <IonItemDivider color="danger">
                <IonIcon icon={trendingDownOutline} size="large" /> <IonLabel className="category-title">Expenses</IonLabel>
                <IonFab horizontal="end">
                    <IonFabButton onClick={() => openModal()}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
                <IonModal isOpen={showAddModal}>
                    <IonHeader>
                        <IonToolbar color="danger">
                            <IonIcon icon={trendingDownOutline} size="large" /><IonTitle slot="start">New expense category</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowAddModal(false)} slot="end"><IonIcon icon={close} /></IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonList className="new-expense-form">
                        <IonItem>
                            <IonLabel position="floating">Category name</IonLabel>
                            <IonInput value={expenseLabel} onIonChange={e => setExpenseLabel(e.detail.value!)}></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">Monthly budget</IonLabel>
                            <IonInput value={expenseAmount} onIonChange={e => setExpenseAmount(e.detail.value!)}></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Frequency</IonLabel>
                            <IonSelect value={expenseFrequency} onIonChange={e => setExpenseFrequency(e.detail.value!)}>
                                <IonSelectOption value="weekly">Several times a month</IonSelectOption>
                                <IonSelectOption value="monthly">Once a month</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonButton expand="block" onClick={() => { saveCategory(); }}><IonIcon icon={add} /> Add</IonButton>
                        <IonButton color="danger" expand="block" onClick={() => setShowAddModal(false)}>Cancel</IonButton>
                    </IonList>
                </IonModal>
            </IonItemDivider>
        </>
    );
};

export default NewExpenseCategoryModal;





