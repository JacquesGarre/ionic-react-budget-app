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
    IonSelect,
    IonSelectOption
} from '@ionic/react';
import { set, get } from "../../../../services/storage";
import { trendingDownOutline, add, close, pencilOutline, trashOutline } from 'ionicons/icons';
import { useState, useEffect } from "react";
import { getDays } from "../../../../services/utils";
import NewExpenseCategoryModal from './AddModal';

export const LOG_PREFIX = "[ExpensesCategories] ";

interface ExpensesCategoriesProps {
    setSummary: any;
}

const ExpensesCategories: React.FC<ExpensesCategoriesProps> = ({setSummary}) => {

    const [listItems, setListItems] = useState<JSX.Element[] | null>(null);
    const [expenseLabel, setExpenseLabel] = useState<any>();
    const [expenseAmount, setExpenseAmount] = useState<any>();
    const [expenseFrequency, setExpenseFrequency] = useState<any>();
    const [expenseID, setExpenseID] = useState<any>();
    const [showEditModal, setShowEditModal] = useState(false);

    useIonViewWillEnter(async () => {
        setIonListItems();
    });

    // Sets list items in the view
    const setIonListItems = async () => {
        const expensesCategories = await get('expensesCategories');
        const categories: JSX.Element[] = [];
        if (expensesCategories && expensesCategories.length > 0) {
            for await (let expenseCategory of expensesCategories) {
                categories.push(
                    <IonItemSliding key={expenseCategory.id} id={'expense-category-'+expenseCategory.id}>
                        <IonItemOptions side="start">
                            <IonItemOption color="primary" expandable onClick={
                                (e) => editCategory(expenseCategory)
                            }>
                                <IonIcon icon={pencilOutline} />
                            </IonItemOption>
                        </IonItemOptions>
                        <IonItem lines="full" data-id={expenseCategory.id}>
                            <IonLabel slot="start">{expenseCategory.name}</IonLabel>
                            <IonLabel slot="end">{expenseCategory.amount} €</IonLabel>
                        </IonItem>
                        <IonItemOptions side="end">
                            <IonItemOption color="danger" expandable onClick={() => onClickDelete(expenseCategory.id)}>
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
        const expensesCategories = await get('expensesCategories');
        const expenses = await get('expenses');
        const newExpensesCategories: any[] = [];
        const newExpenses: any[] = [];
        expensesCategories.map((expenseCategory: any) => {
            if(expenseCategory.id !== categoryID){
                newExpensesCategories.push(expenseCategory);
            }
        })
        expenses.map((expense: any) => {
            if(expense.category !== categoryID){
                newExpenses.push(expense);
            }
        })
        await set('expensesCategories', newExpensesCategories);
        await set('expenses', newExpenses);
        setSummary();
        setIonListItems();
    }; 

    // Edits a category
    const editCategory = async (category: any) => {
        let ionItem = document.getElementById('expense-category-'+category.id) as any;
        ionItem!.close();
        let item = null;
        setExpenseID(category.id)
        setExpenseLabel(category.name);
        setExpenseAmount(category.amount);
        setExpenseFrequency(category.frequency);
        setShowEditModal(true);
    } 

    // Saves a category
    const saveCategory = async () => {
        const expensesCategories = await get('expensesCategories');
        expensesCategories.map((expenseCategory: any) => {
            if (expenseCategory.id == expenseID){
                expenseCategory.name = expenseLabel;
                expenseCategory.amount = expenseAmount;
                expenseCategory.frequency = expenseFrequency;
            }
        });
        await set('expensesCategories', expensesCategories);
        setSummary();
        setIonListItems();
        setShowEditModal(false);
    } 

    return (
        <>
            <IonItemGroup className="expenses-list">
                <NewExpenseCategoryModal setIonListItems={setIonListItems} setSummary={setSummary}></NewExpenseCategoryModal>
                {listItems}
                <IonModal isOpen={showEditModal}>
                    <IonHeader>
                        <IonToolbar color="danger">
                            <IonIcon icon={trendingDownOutline} size="large"/><IonTitle slot="start">Edit expense category</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowEditModal(false)} slot="end"><IonIcon icon={close} /></IonButton>
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
                        <IonButton expand="block" onClick={() => { saveCategory(); }}><IonIcon icon={add} /> Save</IonButton>
                        <IonButton color="danger" expand="block" onClick={() => setShowEditModal(false)}>Cancel</IonButton>
                    </IonList>
                </IonModal>
            </IonItemGroup>
        </>
    );
};

export default ExpensesCategories;
