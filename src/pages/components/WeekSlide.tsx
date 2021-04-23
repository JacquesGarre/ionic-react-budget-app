import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    useIonViewWillEnter,
    IonModal,
    IonIcon,
    IonButtons,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonFab,
    IonFabButton,
    IonDatetime,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonSlides,
    IonSlide
} from '@ionic/react';
import React, { useState } from "react";
import {
    add,
    close,
    trendingDownOutline,
    pencilOutline,
    trashOutline
} from 'ionicons/icons';
import { get, set } from "../../services/storage";
import { getAmountInCategory, getCategoryColor, getCategoryAmount, getDateForInput} from "../../services/utils";
import { HorizontalBar, Doughnut} from 'react-chartjs-2';
import moment from "moment";

interface WeekSlideProps {
    week: any;
    expensesCategories: any;
    weeks: any;
    refreshHome: any;
}


const WeekSlide: React.FC<WeekSlideProps> = ({week, expensesCategories, weeks, refreshHome}) => {

    const [expenseID, setExpenseID] = useState<string>('');
    const [expenseLabel, setExpenseLabel] = useState<string>('');
    const [expenseAmount, setExpenseAmount] = useState<string>('');
    const [expenseDate, setExpenseDate] = useState<string>('');
    const [expenseCategory, setExpenseCategory] = useState<string>('');
    const [showEditModal, setShowEditModal] = useState(false);


    const getBarOptions = (categoryAmount: any) => {
        return {
            maintainAspectRatio: true,
            legend: {
                display: false
            },
            tooltips:{
                callbacks:{
                   title: ()=>{}
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: categoryAmount / weeks.length,
                        display: false
                    },
                    gridLines: {
                        display:false
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display:false
                    },
                    ticks: {
                        display: false
                    }
                }]
            }
        }
    }

    const getBarData = (category: any, key: any, expenses: any[]) => {
        let spent = getAmountInCategory(category.id, expenses);
        return {
            datasets: [
                {   
                    backgroundColor: [ getCategoryColor(key) ],
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 0,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: [spent, category.amount - spent],
                }
            ]
        }
    }

    // Deletes an expense
    const onClickDelete = async (expenseID: any) => {
        const expenses = await get('expenses');
        const newExpenses: any[] = [];
        expenses.map((expense: any) => {
            if(expense.id !== expenseID){
                newExpenses.push(expense);
            }
        })
        await set('expenses', newExpenses);
        refreshHome();
    }; 

    // Edits an expense
    const editExpense = async (expense: any, key: any) => {
        let ionItem = document.getElementById('expense-'+expense.id) as any;
        ionItem!.close();
        let item = null;
        setExpenseID(expense.id)
        setExpenseLabel(expense.name);
        setExpenseAmount(expense.amount);
        setExpenseCategory(expense.category);
        setExpenseDate(getDateForInput(expense.date));
        setShowEditModal(true);
    } 

    // Saves an expense
    const saveExpense = async () => {
        const expenses = await get('expenses');
        expenses.map((expense: any) => {
            if (expense.id == expenseID){
                expense.name = expenseLabel;
                expense.amount = expenseAmount;
                expense.category = expenseCategory;
                expense.date = moment(expenseDate).format('DD/MM/yyyy');
                expense.time = moment(expenseDate).format('x');
            }
        });
        await set('expenses', expenses);
        refreshHome();
        setShowEditModal(false);
    }

    return (
        <IonSlide className="home-page">
            <IonContent fullscreen>
                <IonCard className="this-week">
                    <IonCardHeader>
                        <IonCardTitle>From {week.start} to {week.end}</IonCardTitle>
                        <table className="dates">
                            <tbody>
                                <tr>
                                    <td>Week {week.id}/{weeks.length}</td>
                                </tr>
                            </tbody>
                        </table>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonList>
                            <IonItem className="weekly-doughnut" lines="full">
                            <Doughnut data={week.doughnutChartData} options={{ maintainAspectRatio: true}}   />
                            </IonItem>
                        </IonList>
                        <table className="weekly-budget">
                            <tbody>
                                <tr>
                                    <td>Budget</td>
                                    <td>{ week.expensesAmountAllowed } €</td>
                                </tr>
                                <tr>
                                    <td>Spent</td>
                                    <td>{ week.totalSpent } €</td>
                                </tr>
                                <tr className={ week.expensesAmountAllowed - week.totalSpent > 0 ? "remaining-total" : "remaining-total-danger"}>
                                    <td>Remaining</td>
                                    <td>{ week.expensesAmountAllowed - week.totalSpent } €</td>
                                </tr>
                            </tbody>
                        </table> 
                    </IonCardContent>
                </IonCard>

                <IonModal isOpen={showEditModal}>
                    <IonHeader>
                        <IonToolbar color="danger">
                            <IonIcon icon={trendingDownOutline} size="large" /><IonTitle slot="start">Add an expense</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowEditModal(false)} slot="end"><IonIcon icon={close} /></IonButton>
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

                        <IonButton expand="block" onClick={() => { saveExpense(); }}><IonIcon icon={add} /> Save</IonButton>
                        <IonButton color="danger" expand="block" onClick={() => setShowEditModal(false)}>Cancel</IonButton>
                    </IonList>
                </IonModal>
                

                {expensesCategories.filter((category: any) => category.frequency == "weekly").map((category: any, key: any) => (
                    <IonCard key={key} className="category-details">
                        <IonCardHeader>
                            <IonCardTitle>{category.name} ( <span className={ getAmountInCategory(category.id, week.expenses) >= (getCategoryAmount(category.id, expensesCategories)/weeks.length) ? "danger" : "success" }> { getAmountInCategory(category.id, week.expenses) } </span> / {Math.round(getCategoryAmount(category.id, expensesCategories)/weeks.length)} € )</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonItem lines="none">
                                <HorizontalBar height={10}  width={100} data={ getBarData(category, key, week.expenses) } options={ getBarOptions(category.amount) }/>
                            </IonItem>
                            <IonList>
                                { week.expenses.filter((expense: any) => { return expense.category == category.id}).map((expense: any, key: any) => ( 
                                    <IonItemSliding key={key} id={'expense-' + expense.id} className="expense-item">
                                        <IonItemOptions side="start">
                                            <IonItemOption color="primary" expandable onClick={
                                                (e) => editExpense(expense, key)
                                            }>
                                                <IonIcon icon={pencilOutline} />
                                            </IonItemOption>
                                        </IonItemOptions>
                                        <IonItem lines="full">
                                            <IonLabel>{ expense.date } - { expense.name }  <span className="expense-amount">{ expense.amount } €</span></IonLabel>
                                        </IonItem>
                                        <IonItemOptions side="end">
                                            <IonItemOption color="danger" expandable onClick={(e) => onClickDelete(expense.id)}>
                                                <IonIcon icon={trashOutline} />
                                            </IonItemOption>
                                        </IonItemOptions>
                                    </IonItemSliding>
                                ))}
                            </IonList>
                        </IonCardContent>
                    </IonCard>
                ))}


            </IonContent>
        </IonSlide>
    );
};

export default WeekSlide;
