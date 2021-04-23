import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    useIonViewWillEnter,
    IonSlides,
    IonLoading,
    IonIcon
} from '@ionic/react';
import { get } from "../services/storage";
import { getWeeks } from "../services/utils";
import { useState } from "react";
import './HomeTab.css';
import AddModalExpense from './components/AddModal';
import WeekSlide from './components/WeekSlide';
import { arrowDownOutline } from 'ionicons/icons';
import moment from "moment";

import { Plugins } from '@capacitor/core';
const { App } = Plugins;

const HomeTab: React.FC = () => {

    document.addEventListener('ionBackButton', (ev: any) => {
        ev.detail.register(-1, () => {
            App.exitApp();
        });
    });

    const SLIDE_SPEED = 400;
    const [slideOpts, setSlideOpts] = useState({
        initialSlide: 2, 
        speed: SLIDE_SPEED
    });

    const [startDay, setStartDay] = useState<string>("1");
    const [expensesCategories, setExpensesCategories] = useState<any[]>([]);
    const [weeks, setWeeks] = useState<any[]>([]);
    const [displayLoader, setDisplayLoader] = useState(true);

    useIonViewWillEnter(async () => {
        getData();
    });

    const getData = async () => {

        // Month start
        const monthStartDay = await get('monthStartDay');
        if (monthStartDay.length) {
            setStartDay(monthStartDay);
        }

        // Expenses categories
        const expensesCategories = await get('expensesCategories');
        setExpensesCategories(expensesCategories);

        // Weeks
        const weeks = await getWeeks(monthStartDay)
        setWeeks(weeks);   

        // setCurrentSlide
        let today = parseInt(moment().format('x'));
        let currentWeek = weeks.filter((week: any) => { return week.startTime <= today && week.endTime > today })[0];
        if(currentWeek){
            setSlideOpts({
                initialSlide: currentWeek.id - 1, 
                speed: SLIDE_SPEED
            });
        }

        setDisplayLoader(false);

    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Home</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                { !displayLoader && weeks.length > 0 &&
                    <>
                    <AddModalExpense refreshHome={getData} expensesCategories={expensesCategories}></AddModalExpense>
                    <IonSlides pager={true} options={slideOpts} key={weeks.map(week => week.id).join('_')}>
                        { weeks.map((week: any) => (
                            <WeekSlide key={week.id} week={week} expensesCategories={expensesCategories} weeks={weeks} refreshHome={getData}></WeekSlide>
                        )) }
                    </IonSlides>
                    </>
                }
                { displayLoader &&
                    <IonLoading isOpen={displayLoader} message={'Preparing your budget...'}/>
                }
                { !displayLoader && weeks.length < 1  &&
                    <div id="welcome" className={weeks.length > 0  ? 'hide' : ''}>
                        <h1>Welcome to MoneySaver!</h1>
                        <p>Start by setting up your budget</p>
                        <IonIcon icon={arrowDownOutline} size="large" />
                    </div>
                }
            </IonContent>
        </IonPage>
    );
};

export default HomeTab;
