import { 
    IonItemGroup, 
    IonIcon, 
    IonItemDivider,
    IonLabel,
    IonItem
} from '@ionic/react';
import { thumbsUpOutline } from 'ionicons/icons';

interface SummaryProps {
    savings: any;
}

const Summary: React.FC<SummaryProps> = ({savings}) => {
    return (
        <>
            <IonItemGroup className="summary-list">
                <IonItemDivider color="success">
                    <IonIcon icon={thumbsUpOutline} size="large" color="light"/><IonLabel className="category-title" color="light">Provisional</IonLabel>
                </IonItemDivider>
                <IonItem lines="full">
                    <IonLabel>Savings per month : {savings} €</IonLabel>
                </IonItem>
            </IonItemGroup>
        </>
    );
};

export default Summary;
