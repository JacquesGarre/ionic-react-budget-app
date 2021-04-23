import { IonButton, IonIcon, IonPicker } from '@ionic/react';
import { set, get } from "../../services/storage";
import { walletOutline } from 'ionicons/icons';
import { useState, useEffect } from "react";
import { getDays } from "../../services/utils";

const PaydayPicker: React.FC = () => {

    const DEFAULT_VALUE = "1";

    const [startDay, setStartDay] = useState<string>(DEFAULT_VALUE);
    const [pickerIsOpen, setPickerIsOpen] = useState(false);

    // Loading data
    useEffect(() => {
        const loadSaved = async () => {
            const monthStartDay = await get('monthStartDay');
            if(monthStartDay.length){
                setStartDay(monthStartDay);
            } else {
                saveStartDay(DEFAULT_VALUE);
            }
        };
        loadSaved();
    }, [get]);

    // Saves Payday
    const saveStartDay = (day: string) => {
        set('monthStartDay', day);
        setStartDay(day);
    }

    return (
        <>
            <IonButton className="month-btn" color="dark" expand="block" onClick={() => { setPickerIsOpen(true); }} >
                <IonIcon icon={walletOutline} size="large" /> Payday on {startDay}
            </IonButton>
            <IonPicker
                isOpen={pickerIsOpen}
                columns={[getDays()]}
                buttons={[
                    {
                        text: "Cancel",
                        role: "cancel",
                        handler: value => {
                            setPickerIsOpen(false);
                        }
                    },
                    {
                        text: "Confirm",
                        handler: value => {
                            setPickerIsOpen(false);
                            saveStartDay(value.day.text);
                        }
                    }
                ]}
            ></IonPicker>
        </>
    );
};

export default PaydayPicker;
