import { PickerColumn } from "@ionic/core";
import moment from "moment";
import { get } from "./storage";

export const TODAY_DATE = moment().format('MM-DD-YYYY');

// Returns days for payday date picker
export const getDays = () => {
    var days = [];
    for (var i = 1; i <= 31; i++) {
        days.push({ text: i.toString(), value: i.toString() });
    }
    return {
        name: "day",
        options: days
    } as PickerColumn;
};

// Returns this month's budget dates
export const getThisMonthBudgetDates = (startDay: any) => {
    // Start day of the month
    startDay = parseInt(startDay);
    // Today 
    let today = moment().format('DD');
    let start, end, endDay;
    if(today >= startDay){
        start = moment();
        end = moment().add(1, 'months');
    } else {
        start = moment().subtract(1, 'months');
        end = moment();
    }
    if(startDay > start.daysInMonth()){
        startDay = start.daysInMonth();
    }
    startDay = ("0" + startDay).slice(-2);
    endDay = (startDay-1) > 0 ? startDay-1 : 1;
    if(endDay > end.daysInMonth()){
        endDay = end.daysInMonth();
    }
    if(endDay == startDay){
        end = moment();
        endDay = end.daysInMonth();
    }
    endDay = ("0" + endDay).slice(-2);
    start = start.format('MM-'+startDay+'-YYYY');
    end = end.format('MM-'+endDay+'-YYYY');
    return {
        start: start,
        end: end
    }

};


// Returns next monday of timestamp given
export const getNextMonday = (timestamp: any) => {
    let date = new Date(timestamp);
    console.log(date.getDay());
    if(date.getDay() == 1){
        return date.setDate(date.getDate() + 7);
    } 
    return date.setDate(date.getDate() + (1 + 7 - date.getDay()) % 7);
}

// Returns weeks dates
export const getWeeksBetween = (startDay: any) => {
    let dates = getThisMonthBudgetDates(startDay);
    let weeks = [];
    let firstWeekDay = parseInt(moment(dates.start).format('x'));
    let sunday = getNextMonday(firstWeekDay) - 1;
    let i = 1;
    while(firstWeekDay < parseInt(moment(dates.end).add(1 ,'days').format('x'))){
        weeks.push({
            id: i,
            start: firstWeekDay,
            end: sunday > parseInt(moment(dates.end).format('x')) ? parseInt(moment(dates.end).add(1 ,'days').format('x'))-1 : sunday
        });
        firstWeekDay = sunday + 1;
        sunday = getNextMonday(firstWeekDay) - 1;
        i++;
    }
    return weeks;
}

export const getWeekExpenses = async (startTime: any, endTime: any) => {
    let expenses = await get('expenses');
    if(!expenses.length){
        return [];
    }
    let expensesArray: any[] = [];
    expenses.filter((expense: any, key: any) => expense.time >= startTime && expense.time < endTime).map((expense: any, key: any) => {
        expensesArray.push(expense);
    })
    return expensesArray;
}

export const getAmountSpent = (expenses: any[]) => {
    if(!expenses.length){
        return 0;
    }
    let amount = 0;
    expenses.map((expense, key) => {
        amount += parseInt(expense.amount);
    })
    return amount;
}

export const getWeeks = async (startDay: any) => {
    let weeksDates = getWeeksBetween(startDay);
    let weeks = [];
    let expenses = await get('expensesCategories');
    let allowedPerMonth = getAmountSpent(expenses.filter((category: any) => { return category.frequency == 'weekly'}));
    let expensesAllowedAmountPerWeek = Math.round(allowedPerMonth/weeksDates.length);
    for(let weekDates of weeksDates){
        let weekExpenses = await getWeekExpenses(weekDates.start, weekDates.end);
        let spent = getAmountSpent(weekExpenses);
        weeks.push({
            start: moment(weekDates.start).format('DD/MM/yyyy'),
            end: moment(weekDates.end).format('DD/MM/yyyy'),
            startTime: weekDates.start,
            endTime: weekDates.end,
            id: weekDates.id, 
            doughnutChartData: {
                labels: ['Spent', 'Not spent'],
                datasets: [
                    {
                        label: 'Expenses',
                        backgroundColor: ['#eb445a', '#2dd36f'],
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 0,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: [spent, (expensesAllowedAmountPerWeek-spent > 0 ? expensesAllowedAmountPerWeek-spent : 0)],
                    }
                ]
            },
            expensesAmountAllowed: expensesAllowedAmountPerWeek,
            totalSpent: spent,
            expenses: weekExpenses
        })
    }
    return weeks;
}

export const getCategoryColor = (key: any) => {
    const colors = [
        '#FF7F50', // Coral
        '#6495ED', // CornflowerBlue
        '#7FFF00', // Chartreuse
        '#5F9EA0', // CadetBlue
        '#8FBC8F', // DarkSeaGreen
        '#2F4F4F', // DarkSlateGrey
        '#00BFFF', // DeepSkyBlue
        '#ADFF2F', // GreenYellow
        '#FFA07A', // LightSalmon
        '#20B2AA', // LightSeaGreen
        '#7B68EE' // MediumSlateBlue
    ];
    return colors[ key % colors.length ];
}

export const getAmountInCategory = (categoryID: any, expenses:any) => {
    return getAmountSpent(expenses.filter((expense: any) => { return expense.category == categoryID}));
}

export const getCategoryAmount = (categoryID: any, expensesCategories:any) => {
    return getAmountSpent(expensesCategories.filter((expense: any) => { return expense.id == categoryID}));
}

export const getDateForInput = (date: any) => {
    let parts = date.split('/');
    return parts[1] + '-' + parts[0] + '-' + parts[2];
}