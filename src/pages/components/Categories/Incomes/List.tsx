import {
    IonButton,
    IonIcon,
    IonItemGroup,
    IonList,
    IonLabel,
    IonModal,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    useIonViewWillEnter,
    IonInput,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonItem,
} from '@ionic/react';
import { set, get } from "../../../../services/storage";
import { trendingUpOutline, add, close, pencilOutline, trashOutline } from 'ionicons/icons';
import { useState, useEffect } from "react";
import { getDays } from "../../../../services/utils";
import NewIncomeCategoryModal from './AddModal';

export const LOG_PREFIX = "[IncomesCategories] ";

interface IncomesCategoriesProps {
    setSummary: any;
}

const IncomesCategories: React.FC<IncomesCategoriesProps> = ({setSummary}) => {

    const [listItems, setListItems] = useState<JSX.Element[] | null>(null);
    const [incomeLabel, setIncomeLabel] = useState<any>();
    const [incomeAmount, setIncomeAmount] = useState<any>();
    const [incomeID, setIncomeID] = useState<any>();
    const [showEditModal, setShowEditModal] = useState(false);

    useIonViewWillEnter(async () => {
        setIonListItems();
    });

    // Sets list items in the view
    const setIonListItems = async () => {
        const incomesCategories = await get('incomesCategories');
        const categories: JSX.Element[] = [];
        if (incomesCategories && incomesCategories.length > 0) {
            for await (let incomeCategory of incomesCategories) {
                categories.push(
                    <IonItemSliding key={incomeCategory.id} id={'income-category-'+incomeCategory.id}>
                        <IonItemOptions side="start">
                            <IonItemOption color="primary" expandable onClick={
                                (e) => editCategory(incomeCategory)
                            }>
                                <IonIcon icon={pencilOutline} />
                            </IonItemOption>
                        </IonItemOptions>
                        <IonItem lines="full" data-id={incomeCategory.id}>
                            <IonLabel slot="start">{incomeCategory.name}</IonLabel>
                            <IonLabel slot="end">{incomeCategory.amount} €</IonLabel>
                        </IonItem>
                        <IonItemOptions side="end">
                            <IonItemOption color="danger" expandable onClick={() => onClickDelete(incomeCategory.id)}>
                                <IonIcon icon={trashOutline} />
                            </IonItemOption>
                        </IonItemOptions>
                    </IonItemSliding>
                );
            }
        }
        setListItems(categories);
    };

    // Deletes a category
    const onClickDelete = async (categoryID: any) => {
        const incomesCategories = await get('incomesCategories');
        const newIncomesCategories: any[] = [];
        incomesCategories.map((incomeCategory: any) => {
            if(incomeCategory.id !== categoryID){
                newIncomesCategories.push(incomeCategory);
            }
        })
        await set('incomesCategories', newIncomesCategories);
        setIonListItems();
        setSummary();
    }; 

    // Edits a category
    const editCategory = async (category: any) => {
        let ionItem = document.getElementById('income-category-'+category.id) as any;
        ionItem!.close();
        let item = null;
        setIncomeID(category.id)
        setIncomeLabel(category.name);
        setIncomeAmount(category.amount);
        setShowEditModal(true);
    } 

    // Saves a category
    const saveCategory = async () => {
        const incomesCategories = await get('incomesCategories');
        incomesCategories.map((incomeCategory: any) => {
            if (incomeCategory.id == incomeID){
                incomeCategory.name = incomeLabel;
                incomeCategory.amount = incomeAmount;
            }
        });
        await set('incomesCategories', incomesCategories);
        setIonListItems();
        setSummary();
        setShowEditModal(false);
    } 

    return (
        <>
            <IonItemGroup className="incomes-list">
                <NewIncomeCategoryModal setIonListItems={setIonListItems} setSummary={setSummary}></NewIncomeCategoryModal>
                {listItems}
                <IonModal isOpen={showEditModal}>
                    <IonHeader>
                        <IonToolbar color="primary">
                            <IonIcon icon={trendingUpOutline} size="large"/><IonTitle slot="start">Edit income category</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowEditModal(false)} slot="end"><IonIcon icon={close} /></IonButton>
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
                        <IonButton expand="block" onClick={() => { saveCategory(); }}><IonIcon icon={add} /> Save</IonButton>
                        <IonButton color="danger" expand="block" onClick={() => setShowEditModal(false)}>Cancel</IonButton>
                    </IonList>
                </IonModal>
            </IonItemGroup>
        </>
    );
};

export default IncomesCategories;
