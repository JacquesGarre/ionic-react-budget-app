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
    IonList
 } from '@ionic/react';
 import { set, get } from "../../../../services/storage";
import { trendingUpOutline, add, close } from 'ionicons/icons';
import { useState, useEffect } from "react";


interface NewIncomeCategoryModalProps {
    setIonListItems: any;
    setSummary: any;
}

const NewIncomeCategoryModal: React.FC<NewIncomeCategoryModalProps> = ({setIonListItems, setSummary}) => {

    const [showAddModal, setShowAddModal] = useState(false);
    const [incomeLabel, setIncomeLabel] = useState<any>();
    const [incomeAmount, setIncomeAmount] = useState<any>();

    // Opens modal and resets form
    const openModal = () => {
        setIncomeLabel("");
        setIncomeAmount("");
        setShowAddModal(true);
    }

    // Saves a category
    const saveCategory = async () => {
        const incomesCategories = await get('incomesCategories');
        incomesCategories.push({
            id: Date.now(),
            name: incomeLabel,
            amount: incomeAmount
        });
        await set('incomesCategories', incomesCategories);
        setIonListItems();
        setSummary();
        setShowAddModal(false);
    } 

    return (
        <>
            <IonItemDivider color="primary">
                <IonIcon icon={trendingUpOutline} size="large" /> <IonLabel className="category-title">Incomes</IonLabel>
                <IonFab horizontal="end">
                    <IonFabButton onClick={() => openModal()}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
                <IonModal isOpen={showAddModal}>
                    <IonHeader>
                        <IonToolbar color="primary">
                            <IonIcon icon={trendingUpOutline} size="large" /><IonTitle slot="start">New income category</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowAddModal(false)} slot="end"><IonIcon icon={close} /></IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonList className="new-income-form">
                        <IonItem>
                            <IonLabel position="floating">Category name</IonLabel>
                            <IonInput value={incomeLabel} onIonChange={e => setIncomeLabel(e.detail.value!)}></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">Monthly amount</IonLabel>
                            <IonInput value={incomeAmount} onIonChange={e => setIncomeAmount(e.detail.value!)}></IonInput>
                        </IonItem>
                        <IonButton expand="block" onClick={() => { saveCategory(); }}><IonIcon icon={add} /> Add</IonButton>
                        <IonButton color="danger" expand="block" onClick={() => setShowAddModal(false)}>Cancel</IonButton>
                    </IonList>
                </IonModal>
            </IonItemDivider>
        </>
    );
};

export default NewIncomeCategoryModal;





